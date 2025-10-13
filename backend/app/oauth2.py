from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from . import schemas, database, models
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session


oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')


SECRET_KEY = '50ee1fb2740be04e05f14b3c6947f80218ce9ed8930e8487d82c7eb6895a9868'
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600


def create_access_token(data: dict):
    to_encode = data.copy()
    expire_time = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire_time})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt


def verify_access_token(token: str, credentials_exception):

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id: str = payload.get("user_id")

        if id is None:
            raise credentials_exception
        
        token_data = schemas.TokenData(id=id)

    except JWTError:
        raise credentials_exception
    
    return token_data
    

def get_current_user(
        token: str = Depends(oauth2_scheme),
        db_session: Session = Depends(database.get_db_session)
    ):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=f"Credentials not valid",
        headers={"WWW-Authenticate": "Bearer"}
    )

    token =  verify_access_token(token, credentials_exception)
    user = db_session.query(models.User).filter(models.User.id == token.id).first()

    return user