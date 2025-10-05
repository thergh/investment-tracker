from fastapi import Body, FastAPI, Response, status, HTTPException, Depends, APIRouter
from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from .. import models, schemas, oauth2
from ..database import get_db_session


router = APIRouter(
	prefix="/investments",
	tags=['Investments']
)


@router.get("/user/{user_id}", response_model=List[schemas.InvestmentResponse])
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
	

@router.get("/{id}", response_model=schemas.InvestmentResponse)
def get_investment(
		id: int,
		db_session: Session = Depends(get_db_session),
		current_user_id: int = Depends(oauth2.get_current_user)
	):
	  
	investment = db_session.query(models.Investment).filter(models.Investment.id == id).first()

	if not investment:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail=f"investment with id {id} was not found"
		)

	return investment


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.InvestmentResponse)
# def add_investment(
# 		investment: schemas.InvestmentAdd,
# 		db_session: Session = Depends(get_db_session),
# 		current_user_id: int = Depends(oauth2.get_current_user)
# 	):
def add_investment(
		investment: schemas.InvestmentAdd,
		db_session: Session = Depends(get_db_session),
		current_user_id: int = 1
	):

	asset_symbol = investment.asset_symbol
	asset_type = investment.asset_type

	if asset_type == 'STOCK':
		asset = (
			db_session.query(models.Asset)
			.filter(models.Asset.asset_type == asset_type)
			.filter(models.Asset.symbol == investment.asset_symbol)
			.first()
		)

		if not asset:
			raise HTTPException(
				status_code=status.HTTP_400_BAD_REQUEST,
				detail=f"Asset with symbol {investment.asset_symbol} was not recognised."
			)

		new_investment = models.Investment(
			user_id = current_user_id,
			asset_id = asset.id,
			quantity = investment.quantity,
			purchase_price = investment.purchase_price,
			purchase_date = investment.purchase_date
		)

		db_session.add(new_investment)
		db_session.commit()

		return new_investment
		

	elif asset_type == 'BOND':
		pass

	else:
		raise HTTPException(
			status_code=status.HTTP_400_BAD_REQUEST,
			detail=f"Asset type {asset_type} not is not recognised."
		)