from pydantic import BaseModel, EmailStr
from datetime import datetime



class InvestmentBase(BaseModel):
	title: str
	amount: float
	

class InvestmentAdd(InvestmentBase):
	created_at: datetime


class InvestmentRemove(BaseModel):
	id: int


class InvestmentResponse(BaseModel):
	id: int
	amount: float
	value: float
	created_at: datetime

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