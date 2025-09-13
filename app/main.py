from fastapi import Body, FastAPI, Response, status, HTTPException, Depends
from typing import Optional, List


# uvicorn app.main:app --reload

app = FastAPI()

