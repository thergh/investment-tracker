from sqlalchemy import (
	Column, Integer, String, Text, Date, DateTime, ForeignKey,
	Numeric, CheckConstraint, UniqueConstraint, func
)
from sqlalchemy.orm import relationship, DeclarativeBase


class Base(DeclarativeBase):
	pass


class User(Base):
	__tablename__ = "users" 

	id = Column(Integer, primary_key=True)
	email = Column(String(255), unique=True, nullable=False)
	password = Column(Text, nullable=False)
	created_date = Column(DateTime, server_default=func.now())
	currency = Column(String(10))
	portfolio_value = Column(Numeric(18, 2), server_default="0")

	investments = relationship("Investment", back_populates="user", cascade="all, delete-orphan")


class Investment(Base):
	__tablename__ = "investments"

	id = Column(Integer, primary_key=True)
	user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
	asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
	quantity = Column(Numeric(18, 6), nullable=False)
	purchase_price = Column(Numeric(18, 4), nullable=False)
	purchase_date = Column(DateTime, server_default=func.now())

	user = relationship("User", back_populates="investments")
	asset = relationship("Asset", back_populates="investments")



class Asset(Base):
	__tablename__ = "assets"

	id = Column(Integer, primary_key=True)
	asset_type = Column(String(20), nullable=False)
	symbol = Column(String(10))
	
	__table_args__ = (
		CheckConstraint("asset_type IN ('STOCK','BOND')", name="check_asset_type"),
	)

	stock = relationship("Stock", uselist=False, back_populates="asset", cascade="all, delete-orphan")
	bond = relationship("Bond", uselist=False, back_populates="asset", cascade="all, delete-orphan")
	investments = relationship("Investment", back_populates="asset")
 

class Stock(Base):
	__tablename__ = "stocks"

	id = Column(Integer, ForeignKey("assets.id", ondelete="CASCADE"), primary_key=True)
	symbol = Column(String(10), unique=True)
	name = Column(String(50), unique=True)
	exchange = Column(String(50))
	currency = Column(String(10))
	price = Column(Numeric(18, 4), nullable=False)
	last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())

	asset = relationship("Asset", back_populates="stock")


class Bond(Base):
	__tablename__ = "bonds"

	id = Column(Integer, ForeignKey("assets.id", ondelete="CASCADE"), primary_key=True)
	symbol = Column(String(10), unique=True)
	name = Column(String(50), unique=True)
	issuer = Column(String(100))
	emission_date = Column(Date)
	maturity_date = Column(Date)
	coupon_rate = Column(Numeric(5, 2)) # in %
	early_fee = Column(Numeric(10, 2))
	currency = Column(String(10))
	last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())

	asset = relationship("Asset", back_populates="bond")