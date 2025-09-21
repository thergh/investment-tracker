from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class InvestmentBase(BaseModel):
	name: str
	amount: float
	

class InvestmentAdd(BaseModel):
	name: str
	amount: float
	user_id: int
	

class InvestmentRemove(BaseModel):
	id: int


class InvestmentResponse(BaseModel):
	id: int
	user_id: int
	name: str
	amount: float
	unit_value: float
	bought_at: datetime
	sold_at: Optional[datetime] = None 

	class Config:
		from_attributes = True  


class UserCreate(BaseModel):
	email: EmailStr
	password: str


class UserResponse(BaseModel):
	id: int
	email: EmailStr
	created_at: datetime

	class Config:
		from_attributes = True


class UserLogin(BaseModel):
	email: EmailStr
	password: str


class Token(BaseModel):
	access_token: str
	token_type: str


class TokenData(BaseModel):
	id: Optional[int] = None