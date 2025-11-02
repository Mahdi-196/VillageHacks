# // app/api/deps.py
from collections.abc import AsyncGenerator
from typing import Annotated
import logging

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import ExpiredSignatureError, InvalidTokenError

from app.db.session import async_session
from app.core.security import decode_access_token

logger = logging.getLogger(__name__)
bearer = HTTPBearer(auto_error=False)

async def get_session() -> AsyncGenerator:
    async with async_session() as session:
        yield session

async def get_current_user(
    creds: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]
):
    if not creds:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")
    if creds.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization scheme must be Bearer")

    token = creds.credentials
    try:
        payload = decode_access_token(token)  # verifies signature + exp
    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    sub = payload.get("sub")
    if sub is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload (sub missing)")

    try:
        user_id = int(sub)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload (sub not int)")

    return {"user_id": user_id}
