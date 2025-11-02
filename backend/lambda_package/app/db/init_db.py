# app/db/init_db.py
import asyncio

from app.db.session import engine
from app.db.base import Base

# Import models so they register with Base.metadata
import app.models.user  # noqa: F401


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def run() -> None:
    await init_db()


if __name__ == "__main__":
    asyncio.run(run())
