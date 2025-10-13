from . import models
from .database import engine
from .routers import auth, investments, users, assets
from fastapi import FastAPI
import psycopg2
from psycopg2.extras import RealDictCursor
import time


# uvicorn app.main:app --reload
# source /home/thergh/dev/investment-tracker/myvenv/bin/activate

app = FastAPI()

models.Base.metadata.create_all(bind=engine)


# currently unused, may be delete later
while True:
	try:
		connection = psycopg2.connect(
			host='localhost', database='investment', user='postgres',
			password='password', cursor_factory=RealDictCursor
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




