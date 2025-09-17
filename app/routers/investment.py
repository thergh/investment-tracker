from fastapi import Body, FastAPI, Response, status, HTTPException, Depends, APIRouter
from typing import Optional, List
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db


router = APIRouter()


@router.get("/investments", response_model=List[schemas.InvestmentResponse])
def get_investments(db: Session = Depends(get_db)):
      
      investments = db.query(models.Investment).all()

      return investments


@router.get("/investments/{id}", response_model=List[schemas.InvestmentResponse])
def get_investment(id: int, db: Session = Depends(get_db)):
      
    investment = db.query(models.Investment).filter(models.Investment.id == id).first()

    if not investment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"investment with id {id} was not found"
        )

    return investment


@router.post("/investments", status_code=status.HTTP_201_CREATED, response_model=schemas.InvestmentResponse)
def add_investment(investment: schemas.InvestmentAdd, db: Session = Depends(get_db)):

    new_investment = models.Investment(**investment.model_dump())

    # print("\n\n\n\n", investment)

    db.add(new_investment)
    db.commit()
    db.refresh(new_investment)

    return new_investment