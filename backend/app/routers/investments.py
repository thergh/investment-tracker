from fastapi import Body, FastAPI, Response, status, HTTPException, Depends, APIRouter, UploadFile, File
from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from .. import models, schemas, oauth2
from ..database import get_db_session
from io import BytesIO
import pandas as pd
import yfinance as yf
from datetime import datetime


router = APIRouter(
	prefix="/investments",
	tags=['Investments']
)


@router.get("/{investment_id}", response_model=schemas.InvestmentResponse)
def get_investment(
		investment_id: int,
		db_session: Session = Depends(get_db_session),
		current_user_id: int = Depends(oauth2.get_current_user)
	):
	  
	investment = db_session.query(models.Investment).filter(models.Investment.id == investment_id).first()

	if not investment:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail=f"investment with id {investment_id} was not found"
		)

	return investment


@router.delete("/{investment_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_investment(investment_id: int, db_session: Session = Depends(get_db_session)):
	investment = db_session.query(models.Investment).filter(models.Investment.id == investment_id).first()

	if not investment:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail=f"Investment with id {investment_id} was not found"
		)
	
	db_session.delete(investment)  
	db_session.commit()
	
	return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/user/{user_id}", status_code=status.HTTP_201_CREATED, response_model=schemas.InvestmentResponse)
def add_user_investment(
		user_id: int,
		investment: schemas.InvestmentAdd,
		db_session: Session = Depends(get_db_session)
	):

	new_investment = add_investment_to_db(
		user_id=user_id,
		asset_type=investment.asset_type,
		asset_symbol=investment.asset_symbol,
		quantity=investment.quantity,
		purchase_price=investment.purchase_price,
		purchase_date=investment.purchase_date,
		db_session=db_session
	)
	
	return new_investment


@router.get("/user/{user_id}", response_model=List[schemas.InvestmentResponse])
def get_user_investments(
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
@router.post("/user/{user_id}/update", status_code=status.HTTP_200_OK)
def update_user_investments(
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


@router.post("/user/{user_id}/import/xtb", status_code=status.HTTP_200_OK)
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

		# add stocks to db
		for dict in data_dicts:
			add_investment_to_db(
				user_id=user_id,
				asset_type="STOCK",
				asset_symbol=dict["Symbol"],
				quantity=dict["Volume"],
				purchase_price=dict["Open price"],
				purchase_date=pd.to_datetime(dict["Open time"]),
				db_session=db_session
			)

		return {"status": "success", "count": len(data_dicts), "investments": data_dicts}

	except Exception as e:
		raise HTTPException(
			status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
			detail=f"Failed to parse the import file.")
	

@router.get("/user/{user_id}/portfolioValue", response_model=schemas.PortfolioValueResponse)
def get_portfolio_value(user_id: int, db_session: Session = Depends(get_db_session)):
	value, stocks_value, bonds_value, total_profit, stocks_profit, bonds_profit = calculate_portfolio_value(user_id, db_session)

	value_response = schemas.PortfolioValueResponse(
		value=value,
		stocks_value=stocks_value,
		bonds_value=bonds_value,
		total_profit=total_profit,
		stocks_profit=stocks_profit,
		bonds_profit=bonds_profit
	)

	return value_response


def calculate_portfolio_value(user_id: int, db_session: Session) -> float:
	value: float = 0.0
	stocks_value: float = 0.0
	bonds_value: float = 0.0
	total_profit: float = 0.0
	stocks_profit: float = 0.0
	bonds_profit: float = 0.0

	investments = (
		db_session.query(models.Investment)
		.filter(models.Investment.user_id == user_id)
		.all()
	)

	for inv in investments:
		asset: models.Asset =  inv.asset
		quantity = inv.quantity
		purchase_price = inv.purchase_price

		if(asset.asset_type == 'STOCK'):
			stock: models.Stock = asset.stock
			price = stock.price
			stocks_value += float(quantity) * float(price)
			price_diff = (float(quantity) * float(price)) - (float(quantity) * float(purchase_price))
			stocks_profit += price_diff
			total_profit += price_diff 

		elif(asset.asset_type == 'BOND'):
			bond: models.Bond = asset.bond
			price = bond.price
			bonds_value += float(quantity) * float(price)
			price_diff = (float(quantity) * float(price)) - (float(quantity) * float(purchase_price))
			bonds_profit += price_diff
			total_profit += price_diff

		value += float(quantity) * float(price)
		
	return [value, stocks_value, bonds_value, total_profit, stocks_profit, bonds_profit]


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
	

def add_investment_to_db(
		user_id: int,
		asset_type: str,
		asset_symbol: str,
		quantity: float,
		purchase_price: float,
		purchase_date: datetime,
		db_session: Session
	):

	asset = (
		db_session.query(models.Asset)
		.filter(models.Asset.asset_type == asset_type)
		.filter(models.Asset.symbol == asset_symbol)
		.first()
	)

	if not asset:
		raise Exception(
			detail=(
				f"Asset type {asset_type}"
				+ f" with symbol {asset_symbol} not is not recognised."
			)
		)

	new_investment = models.Investment(
		user_id = user_id,
		asset_id = asset.id,
		quantity = quantity,
		purchase_price = purchase_price,
		purchase_date = purchase_date
	)

	db_session.add(new_investment)
	db_session.commit()

	return new_investment
