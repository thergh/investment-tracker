from .. import models, schemas, utils
from ..database import get_db_session
from fastapi import Body, FastAPI, Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from typing import Optional, List
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
				price_cache[symbol] = get_stock_price(symbol)

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


def get_stock_price(symbol: str):
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