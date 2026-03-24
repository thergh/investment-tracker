from fastapi import status
from unittest.mock import MagicMock
from app import models
from datetime import datetime


def test_root(client):
	response = client.get("/")
	assert response.status_code == status.HTTP_200_OK
	assert response.json() == {"message": "Welcome to my investment tracker app!"}


def test_create_user(client_with_mock_db, mock_db_session):
	user_data = {
		"email": "test@example.com",
		"password": "password123",
		"is_admin": False
	}
	
	def mock_refresh(user):
		user.id = 1
		user.created_date = datetime.now()
		
	mock_db_session.refresh.side_effect = mock_refresh
	
	response = client_with_mock_db.post("/users/", json=user_data)
	
	assert response.status_code == status.HTTP_201_CREATED
	data = response.json()
	assert data["email"] == user_data["email"]
	assert "id" in data


def test_get_investment(client_with_user, mock_db_session, mock_user):

	investment = MagicMock()
	investment.id = 123
	investment.user_id = mock_user.id
	investment.asset_id = 1
	investment.quantity = 10.5
	investment.purchase_price = 100.0
	investment.purchase_date = datetime.now()
	
	asset = MagicMock()
	asset.id = 1
	asset.asset_type = "STOCK"
	asset.symbol = "AAPL"
	
	stock = MagicMock()
	stock.id = 1
	stock.symbol = "AAPL"
	stock.name = "Apple Inc."
	stock.exchange = "NASDAQ"
	stock.currency = "USD"
	stock.price = 150.0
	stock.last_updated = datetime.now()
	
	asset.stock = stock
	asset.bond = None
	investment.asset = asset

	mock_db_session.query.return_value.filter.return_value.filter.return_value.first.return_value = investment
	
	response = client_with_user.get("/investments/123")
	
	assert response.status_code == status.HTTP_200_OK
	data = response.json()
	assert data["id"] == 123
	assert data["asset"]["symbol"] == "AAPL"
	assert data["asset"]["stock"]["name"] == "Apple Inc."
