from .. import models, schemas, utils
from ..database import get_db_session
from fastapi import Body, FastAPI, Response, status, HTTPException, Depends, APIRouter, UploadFile, File
from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from io import BytesIO
import pandas as pd
import yfinance as yf

router = APIRouter(
	 prefix="/users",
	tags=['Users']
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db_session: Session = Depends(get_db_session)):

	hashed_password =  utils.hash(user.password)
	user.password = hashed_password
	new_user = models.User(**user.model_dump())
	  
	db_session.add(new_user)
	db_session.commit()
	db_session.refresh(new_user)
	  
	return new_user


@router.get("/", response_model=List[schemas.UserResponse])
def get_users(db_session: Session = Depends(get_db_session)):
	
	users = db_session.query(models.User).all()
	print(users)

	return users


@router.get("/{id}", response_model=schemas.UserResponse)
def get_user(id: int, db_session: Session = Depends(get_db_session)):
	
	user = db_session.query(models.User).filter(models.User.id == id).first()
	
	if not user:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail=f"user with id = {id} not found"
		)

	return user


@router.delete("/{id}", response_model=schemas.UserResponse)
def delete_user(id: int, db_session: Session = Depends(get_db_session)):
	
	user = db_session.query(models.User).filter(models.User.id == id).first()

	if not user:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail=f"user with id {id} was not found"
		)
	
	db_session.delete(user)  
	db_session.commit()
	
	return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{user_id}/investments", status_code=status.HTTP_201_CREATED, response_model=schemas.InvestmentResponse)
def add_investment(
		user_id: int,
		investment: schemas.InvestmentAdd,
		db_session: Session = Depends(get_db_session)
	):

	if investment.asset_type == 'STOCK':
		asset = (
			db_session.query(models.Asset)
			.filter(models.Asset.asset_type == investment.asset_type)
			.filter(models.Asset.symbol == investment.asset_symbol)
			.first()
		)

		if not asset:
			raise HTTPException(
				status_code=status.HTTP_400_BAD_REQUEST,
				detail=(
					f"Asset type {investment.asset_type}"
					+ f" with symbol {investment.asset_symbol} not is not recognised."
				)
			)

		new_investment = models.Investment(
			user_id = user_id,
			asset_id = asset.id,
			quantity = investment.quantity,
			purchase_price = investment.purchase_price,
			purchase_date = investment.purchase_date
		)

		db_session.add(new_investment)
		db_session.commit()

		return new_investment
	
	elif investment.asset_type == 'BOND':
		pass

	else:
		raise HTTPException(
			status_code=status.HTTP_400_BAD_REQUEST,
			detail=(
				f"Asset type {investment.asset_type}"
				+ f" with symbol {investment.asset_symbol} not is not recognised."
			)
		)


@router.get("/{user_id}/investments", response_model=List[schemas.InvestmentResponse])
def get_investments(
		user_id: int,
		db_session: Session = Depends(get_db_session)
	):
	  
	investments = (
		db_session.query(models.Investment)
		.options(
			joinedload(models.Investment.asset).joinedload(models.Asset.stock),
			joinedload(models.Investment.asset).joinedload(models.Asset.bond)
		)
		.filter(models.Investment.user_id == user_id)
		.all()
	)

	return investments


# may optimize later. repeated checks on the same stock are unnecessary
@router.post("/{user_id}/update", status_code=status.HTTP_200_OK)
def update_investments(
		user_id: int,
		db_session: Session = Depends(get_db_session)
	):

	investments = (
		db_session.query(models.Investment)
		.filter(models.Investment.user_id == user_id)
		.all()
	)

	price_cache = {}

	for inv in investments:
		asset: models.Asset = inv.asset

		if asset.asset_type == 'STOCK':
			stock: models.Stock = asset.stock
			symbol = stock.symbol

			if symbol not in price_cache:
				price_cache[symbol] = read_stock_price(symbol)

			new_price = price_cache[symbol]
			stock.price = new_price			

		elif asset.asset_type == 'BOND':
			pass
		else:
			raise HTTPException(
				status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
				detail=f"Asset has wrong type of {asset.asset_type}"	
			)

	db_session.commit()
	return {"message": f"Updated investment data for user {user_id}"}
	

@router.get("/{user_id}/portfolio_value", response_model=schemas.PortfolioValueResponse)
def get_portfolio_value(user_id: int, db_session: Session = Depends(get_db_session)):
	value, stocks_value, bonds_value = calculate_portfolio_value(user_id, db_session)

	value_response = schemas.PortfolioValueResponse(value=value, stocks_value=stocks_value, bonds_value=bonds_value)

	return value_response


@router.post("/{user_id}/import/xtb", status_code=status.HTTP_200_OK)
async def import_xtb(
		user_id: int,
		file: UploadFile = File(...),
		db_session: Session = Depends(get_db_session)
	):
	try:
		content = await file.read()
		excel_data = BytesIO(content)

		data_sheet = pd.read_excel(
			excel_data,
			sheet_name=1,
			usecols=list(range(2,8+1)),
			skiprows=10,
			skipfooter=1
		)

		data_dicts = data_sheet.to_dict(orient="records")

		return {"status": "success", "count": len(data_dicts), "investments": data_dicts}

	except Exception as e:
		raise HTTPException(
			status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
			detail=f"Failed to parse the import file.")







def calculate_portfolio_value(user_id: int, db_session: Session) -> float:
	value: float = 0.0
	stocks_value: float = 0.0
	bonds_value: float = 0.0

	investments: models.Investment = (
		db_session.query(models.Investment)
		.filter(models.Investment.user_id == user_id)
		.all()
	)

	for inv in investments:
		asset: models.Asset =  inv.asset
		quantity = inv.quantity

		if(asset.asset_type == 'STOCK'):
			stock: models.Stock = asset.stock
			price = stock.price
			stocks_value += float(quantity) * float(price)
			
		elif(asset.asset_type == 'BOND'):
			bond: models.Bond = asset.bond
			price = bond.price
			bonds_value += float(quantity) * float(price)

		value += float(quantity) * float(price)
		
	return [value, stocks_value, bonds_value]



def read_stock_price(symbol: str):
	try: 
		yf_stock = yf.Ticker(symbol)
		stock_info = yf_stock.info

		if not stock_info.get("longName"):
			raise HTTPException(
				status_code=status.HTTP_400_BAD_REQUEST,
				detail=f"Stock with symbol {symbol} was not recognised."
			)
		
		stock_price = stock_info.get("regularMarketPrice") or stock_info.get("ask")
	
		if stock_price is None:
			raise HTTPException(
				status_code=status.HTTP_400_BAD_REQUEST,
				detail=f"Price for stock with symbol {symbol} is not available."
			)
		
		return float(stock_price)
		
	except HTTPException:
		raise

	except Exception as e:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail=f"Failed to fetch price for symbol '{symbol}': {str(e)}"
		)
	

# def add_investment():
