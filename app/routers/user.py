from .. import models, schemas, utils
from ..database import get_db
from fastapi import Body, FastAPI, Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from typing import Optional, List



router = APIRouter(
     prefix="/users",
    tags=['Users']
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):

	hashed_password =  utils.hash(user.password)
	user.password = hashed_password
	new_user = models.User(**user.model_dump())
      
	db.add(new_user)
	db.commit()
	db.refresh(new_user)
      
	return new_user


@router.get("/", response_model=List[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
	
    users = db.query(models.User).all()
    print(users)

    return users


@router.get("/{id}", response_model=schemas.UserResponse)
def get_user(id: int, db: Session = Depends(get_db)):
	
    user = db.query(models.User).filter(models.User.id == id).first()
	
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"user with id = {id} not found"
        )

    return user


@router.delete("/{id}", response_model=schemas.UserResponse)
def delete_user(id: int, db: Session = Depends(get_db)):
	
    user = db.query(models.User).filter(models.User.id == id).first()

    if not user:
        raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail=f"user with id {id} was not found"
		)
	
    db.delete(user)  
    db.commit()
	
    return Response(status_code=status.HTTP_204_NO_CONTENT)