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

    # app/core/config.py  (add at bottom of _Settings)
    SUPERMEMORY_BASE_URL: str = os.getenv("SUPERMEMORY_BASE_URL", "https://api.supermemory.ai")
    SUPERMEMORY_API_KEY: str = os.getenv("SUPERMEMORY_API_KEY", "")
    SUPERMEMORY_REDIRECT_URL: str = os.getenv("SUPERMEMORY_REDIRECT_URL", "http://localhost:3000/supermemory/callback")


settings = _Settings()
