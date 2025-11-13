from .. import models, schemas, utils
from ..database import get_db_session
from fastapi import Body, FastAPI, Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session, joinedload
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




	

# def add_investment():
