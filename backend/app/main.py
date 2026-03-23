from . import models
from .database import engine
from .routers import auth, investments, users, assets
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
import psycopg2
from psycopg2.extras import RealDictCursor
import time
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# source myvenv/bin/activate
# uvicorn app.main:app --reload

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
	CORSMiddleware,
	allow_origins=settings.origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

while True:
	try:
		connection = psycopg2.connect(
			host=settings.database_hostname, database=settings.database_name, user=settings.database_username,
			password=settings.database_password, cursor_factory=RealDictCursor,
			sslmode='require'
		)
		cursor = connection.cursor()
		print(f"Database connection successful to: {settings.database_hostname}")
		break
	except Exception as error:
		print(f"Connection unsuccessful: {error}")
		time.sleep(2)
		

app.include_router(assets.router)
app.include_router(investments.router)
app.include_router(users.router)
app.include_router(auth.router)

@app.get("/")
async def root():
	return {"message": "Welcome to my investment tracker app!"}

