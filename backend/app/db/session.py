# app/db/session.py
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.core.config import settings

# Create the async engine from env (SQLite by default; can be Postgres)
engine = create_async_engine(settings.DATABASE_URL, echo=False, future=True)

# Factory that yields AsyncSession objects (used by get_session dependency)
async_session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
