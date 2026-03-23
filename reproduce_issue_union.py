from pydantic_settings import BaseSettings
from pydantic import field_validator
import json
import os
from typing import Union

class Settings(BaseSettings):
    origins: Union[list[str], str] = ["http://localhost:5173"]

    @field_validator("origins", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        print(f"Validator received: {v} (type: {type(v)})")
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str) and v.startswith("["):
            return json.loads(v)
        return v

print("--- Testing with comma-separated string ---")
os.environ["ORIGINS"] = "http://localhost:5173,https://example.com"
try:
    s = Settings()
    print(f"Final origins: {s.origins}")
except Exception as e:
    print(f"Error: {e}")

print("\n--- Testing with JSON string ---")
os.environ["ORIGINS"] = '["http://localhost:5173", "https://example.com"]'
try:
    s = Settings()
    print(f"Final origins: {s.origins}")
except Exception as e:
    print(f"Error: {e}")
