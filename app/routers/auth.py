from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, status, HTTPException, Response
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from .. import database, schemas, models, utils

router = APIRouter(
    tags=['Authentication']
)


@router.post('/login')
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db:Session = Depends(database.get_db)):

    user = db.query(models.User).filter(models.User.email == user_credentials.username).first()

    # user of this email doesn't exist
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invalid Credentials")
    
    # wrong password
    if not utils.verify_password(user_credentials.password, user.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invalid Credentials")
    
    return {"token": "example token"}