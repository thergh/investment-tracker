from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:password@localhost/investment'

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autoflush=False, bind=engine)

def get_db_session():
	db_session = SessionLocal()
	try:
		yield db_session
	finally:
		db_session.close()


