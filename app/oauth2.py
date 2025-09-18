from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone


SECRET_KEY = '50ee1fb2740be04e05f14b3c6947f80218ce9ed8930e8487d82c7eb6895a9868'
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600


def create_access_token(data: dict):
    to_encode = data.copy()
    expire_time = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire_time})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt