from . import models, schemas, utils
from .database import engine, get_db
from .routers import investment, user, auth
from fastapi import Body, FastAPI, Response, status, HTTPException, Depends
from typing import Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor
import time
from sqlalchemy.orm import Session


# uvicorn app.main:app --reload

app = FastAPI()

models.Base.metadata.create_all(bind=engine)


while True:
	try:
		conn = psycopg2.connect(
			host='localhost', database='investment', user='postgres',
			password='password', cursor_factory=RealDictCursor
		)
		cursor = conn.cursor()
		print("Databse connection successful")
		break
	except Exception as error:
		print("Connection unsuccessful")
		time.sleep(2)
		

app.include_router(investment.router)
app.include_router(user.router)
app.include_router(auth.router)


@app.get("/")
async def root():
	return {"message": "Welcome to my investment tracker app!"}




