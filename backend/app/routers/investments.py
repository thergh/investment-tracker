from fastapi import Body, FastAPI, Response, status, HTTPException, Depends, APIRouter
from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from .. import models, schemas, oauth2
from ..database import get_db_session
import yfinance as yf


router = APIRouter(
	prefix="/investments",
	tags=['Investments']
)


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



