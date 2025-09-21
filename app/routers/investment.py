from fastapi import Body, FastAPI, Response, status, HTTPException, Depends, APIRouter
from typing import Optional, List
from sqlalchemy.orm import Session
from .. import models, schemas, oauth2
from ..database import get_db_session


router = APIRouter(
    prefix="/investments",
    tags=['Posts']
)


@router.get("/", response_model=List[schemas.InvestmentResponse])
def get_investments(
        db_session: Session = Depends(get_db_session),
        user_id: int = Depends(oauth2.get_current_user)
    ):
      
      investments = db_session.query(models.Investment).all()

      return investments


@router.get("/{id}", response_model=schemas.InvestmentResponse)
def get_investment(
        id: int,
        db_session: Session = Depends(get_db_session),
        user_id: int = Depends(oauth2.get_current_user)
    ):
      
    investment = db_session.query(models.Investment).filter(models.Investment.id == id).first()

    if not investment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"investment with id {id} was not found"
        )

    return investment


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.InvestmentResponse)
def add_investment(
        investment: schemas.InvestmentAdd,
        db_session: Session = Depends(get_db_session),
        user_id: int = Depends(oauth2.get_current_user)
    ):

    new_investment = models.Investment(**investment.model_dump())

    # print("\n\n\n\n", investment)

    db_session.add(new_investment)
    db_session.commit()
    db_session.refresh(new_investment)

    return new_investment