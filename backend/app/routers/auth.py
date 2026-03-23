from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, status, HTTPException, Response, Request
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from .. import database, schemas, models, utils, oauth2
from ..limiter import limiter

router = APIRouter(
    tags=['Authentication']
)

@router.post('/login')
@limiter.limit("5/minute")
def login(request: Request, user_credentials: OAuth2PasswordRequestForm = Depends(), db_session:Session = Depends(database.get_db_session)):

    user = db_session.query(models.User).filter(models.User.email == user_credentials.username).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")
    
    if not utils.verify_password(user_credentials.password, user.password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")
    
    user_id = user.id
    access_token = oauth2.create_access_token(data = {"user_id": user_id})

    return {"access_token": access_token, "user_id": user_id, "token_type": "bearer"}