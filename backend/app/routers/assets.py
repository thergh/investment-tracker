from fastapi import Body, FastAPI, Response, status, HTTPException, Depends, APIRouter
from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from .. import models, schemas, oauth2
from ..database import get_db_session
import yfinance as yf


router = APIRouter(
	prefix="/assets",
	tags=['Assets']
)


@router.get("/", response_model=List[schemas.AssetResponse])
def get_assets(
		db_session: Session = Depends(get_db_session)
	):
	  
	assets = (
		db_session.query(models.Asset)
		.options(
			joinedload(models.Asset.stock),
			joinedload(models.Asset.bond)
		)
		.all()
	)

	return assets


@router.get("/stocks", response_model=List[schemas.AssetResponse])
def get_stocks(
		db_session: Session = Depends(get_db_session)
	):
	  
	assets = (
		db_session.query(models.Asset)
		.options(
			joinedload(models.Asset.stock)
		)
		.filter(models.Asset.asset_type == 'STOCK')
		.all()
	)

	return assets


@router.get("/stocks", response_model=List[schemas.AssetResponse])
def get_bonds(
		db_session: Session = Depends(get_db_session)
	):
	  
	assets = (
		db_session.query(models.Asset)
		.options(
			joinedload(models.Asset.bond)
		)
		.filter(models.Asset.asset_type == 'BOND')
		.all()
	)

	return assets


@router.post("/stocks", response_model=schemas.StockResponse, status_code=status.HTTP_201_CREATED)
def add_stock(stock_data: schemas.StockCreate, db_session: Session = Depends(get_db_session)):

	existing_stock = db_session.query(models.Stock).filter(models.Stock.symbol == stock_data.symbol).first()
	if existing_stock:
		raise HTTPException(
			status_code=status.HTTP_400_BAD_REQUEST,
			detail=f"Stock with symbol {stock_data.symbol} already exists."
		)
	
	asset = models.Asset(
		asset_type="STOCK",
		symbol=stock_data.symbol
	)
	db_session.add(asset)
	db_session.flush()

	try: 
		yf_stock = yf.Ticker(stock_data.symbol)
		yf_stock_info = yf_stock.info

		if not yf_stock_info.get("longName"):
			raise HTTPException(
				status_code=status.HTTP_400_BAD_REQUEST,
				detail=f"Stock with symbol {stock_data.symbol} was not recognised."
			)
		
	except HTTPException:
		raise

	except Exception as e:
		raise

	stock_price = yf_stock_info.get("regularMarketPrice")
	stock_name = yf_stock_info.get("longName")
	stock_exchange = yf_stock_info.get("exchange")
	stock_currency = yf_stock_info.get("currency")

	stock = models.Stock(
		id=asset.id,
		symbol=stock_data.symbol,
		name=stock_name,
		exchange=stock_exchange,
		currency=stock_currency,
		price=stock_price
	)

	db_session.add(stock)

	db_session.commit()
	db_session.refresh(asset)

	return stock


@router.delete("/stocks/{id}", response_model=schemas.StockResponse, status_code=status.HTTP_201_CREATED)
def delete_stock(id: int, db_session: Session = Depends(get_db_session)):

	stock = db_session.query(models.Stock).filter(models.Stock.id == id).first()
	asset = db_session.query(models.Asset).filter(models.Asset.id == id).first()

	if not stock:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail=f"Stock with id {id} was not found"
		)
	
	if not asset:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail=f"Asset with id {id} was not found"
		)
	
	db_session.delete(stock)
	db_session.delete(asset)
	db_session.commit()

	return Response(status_code=status.HTTP_204_NO_CONTENT)
