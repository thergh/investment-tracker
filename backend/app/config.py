from pydantic_settings import BaseSettings
from pydantic import field_validator
import json

class Settings(BaseSettings):
	database_hostname: str
	database_port: str
	database_password: str
	database_name: str
	database_username: str
	secret_key: str
	algorithm: str
	access_token_expire_minutes: int
	origins: list[str] = ["http://localhost:5173"]

	@field_validator("origins", mode="before")
	@classmethod
	def assemble_cors_origins(cls, v: str | list[str]) -> list[str]:
		if isinstance(v, str) and not v.startswith("["):
			return [i.strip() for i in v.split(",")]
		elif isinstance(v, str) and v.startswith("["):
			return json.loads(v)
		return v

	class Config:
		env_file = ".env"

settings = Settings()