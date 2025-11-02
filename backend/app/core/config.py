# app/core/config.py
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class _Settings(BaseModel):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./medesense.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    BCRYPT_WORK_FACTOR: int = int(os.getenv("BCRYPT_WORK_FACTOR", "12"))
    PHI_STRIPPER_LAMBDA_API_URL: str = os.getenv("PHI_STRIPPER_LAMBDA_API_URL", "")

settings = _Settings()
