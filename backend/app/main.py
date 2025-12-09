from . import models
from .database import engine
from .routers import auth, investments, users, assets
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
import psycopg2
from psycopg2.extras import RealDictCursor
import time


# source myvenv/bin/activate
# uvicorn app.main:app --reload


app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


models.Base.metadata.create_all(bind=engine)


# currently unused, may delete later
while True:
	try:
		connection = psycopg2.connect(
			host=settings.database_hostname, database=settings.database_name, user=settings.database_username,
			password=settings.database_password, cursor_factory=RealDictCursor
		)
		cursor = connection.cursor()
		print("Databse connection successful")
		break
	except Exception as error:
		print("Connection unsuccessful")
		time.sleep(1)
		

app.include_router(assets.router)
app.include_router(investments.router)
app.include_router(users.router)
app.include_router(auth.router)


@app.get("/")
async def root():
	return {"message": "Welcome to my investment tracker app!"}




