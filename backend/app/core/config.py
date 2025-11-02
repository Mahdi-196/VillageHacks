# app/core/config.py
from pydantic import BaseModel
import os

class _Settings(BaseModel):
    # Database URL (SQLite by default for hackathon speed)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./medesense.db")

    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE_ME_IN_PROD")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

    # Bcrypt work factor (keep modest for speed)
    BCRYPT_WORK_FACTOR: int = int(os.getenv("BCRYPT_WORK_FACTOR", "12"))

settings = _Settings()
