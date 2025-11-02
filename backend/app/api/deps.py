# app/api/deps.py
from collections.abc import AsyncGenerator
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.db.session import async_session
from app.core.security import decode_access_token

bearer = HTTPBearer(auto_error=False)

async def get_session() -> AsyncGenerator:
    async with async_session() as session:
        yield session

async def get_current_user(creds: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]):
    if not creds:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")
    try:
        payload = decode_access_token(creds.credentials)
        return {"user_id": int(payload["sub"])}
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
