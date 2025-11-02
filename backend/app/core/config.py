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
    SUPERMEMORY_API_KEY: str = os.getenv("SUPERMEMORY_API_KEY", "")
    SUPERMEMORY_BASE_URL: str = os.getenv("SUPERMEMORY_BASE_URL", "https://api.supermemory.ai").rstrip("/")
    SUPERMEMORY_ROUTER_BASE: str = os.getenv("SUPERMEMORY_ROUTER_BASE", "https://api.supermemory.ai/v3/").rstrip("/")
    SUPERMEMORY_REDIRECT_URL: str = os.getenv("SUPERMEMORY_REDIRECT_URL", "http://localhost:3000/supermemory/callback")
    PROVIDER_BASE_URL: str = os.getenv("PROVIDER_BASE_URL", "https://api.openai.com/v1/").rstrip("/") + "/"
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    SM_DEFAULT_MODEL: str = os.getenv("SM_DEFAULT_MODEL", "gpt-4o-mini")

settings = _Settings()
