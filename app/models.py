from .database import Base
from sqlalchemy import Column, Integer, String, Boolean, Float
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text


class Investment(Base):
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    unit_value = Column(Float, nullable=False, server_default=text('0'))
    bought_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    sold_at = Column(TIMESTAMP(timezone=True), nullable=True, server_default=text('null'))


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    balance = Column(Float, nullable=True, server_default=text('0.0'))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))