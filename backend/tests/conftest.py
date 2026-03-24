import pytest
from unittest.mock import MagicMock
import sys
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db_session
from app.oauth2 import get_current_user
import sqlalchemy


mock_psycopg2 = MagicMock()
mock_psycopg2_extras = MagicMock()
sys.modules["psycopg2"] = mock_psycopg2
sys.modules["psycopg2.extras"] = mock_psycopg2_extras
original_create_engine = sqlalchemy.create_engine

def mock_create_engine(*args, **kwargs):
	return MagicMock()

sqlalchemy.create_engine = mock_create_engine


@pytest.fixture
def client():
	return TestClient(app)


@pytest.fixture
def mock_db_session():
	session = MagicMock()
	yield session


@pytest.fixture
def mock_user():
	user = MagicMock()
	user.id = 1
	user.email = "test@example.com"
	user.is_admin = False
	return user


@pytest.fixture
def client_with_mock_db(mock_db_session):
	app.dependency_overrides[get_db_session] = lambda: mock_db_session
	yield TestClient(app)
	app.dependency_overrides.clear()


@pytest.fixture
def client_with_user(mock_db_session, mock_user):
	app.dependency_overrides[get_db_session] = lambda: mock_db_session
	app.dependency_overrides[get_current_user] = lambda: mock_user
	yield TestClient(app)
	app.dependency_overrides.clear()
