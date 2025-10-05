from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class StockCreate(BaseModel):
	symbol: str


class StockResponse(BaseModel):
	id: int
	symbol: str
	name: str
	exchange: str
	currency: str
	price: float
	last_updated: datetime


class AssetResponse(BaseModel):
	id: int
	asset_type: str
	symbol: str
	stock: Optional[StockResponse]


class InvestmentResponse(BaseModel):
	id: int
	user_id: int
	asset_id: int
	quantity: float
	purchase_price: float
	purchase_date: datetime
	

class InvestmentBase(BaseModel):
	name: str
	amount: float
	

class InvestmentAdd(BaseModel):
	name: str
	amount: float
	user_id: int
	

class InvestmentRemove(BaseModel):
	id: int



	# asset: AssetResponse

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