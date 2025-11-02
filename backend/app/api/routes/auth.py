# app/api/routes/auth.py
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import logging
import uuid

from app.api.deps import get_session
from app.core.config import settings
from app.core.security import (
    create_access_token,
    get_password_hash,
    verify_password,
)
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    PublicUser,
)

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_session)):
    logger.info(f"Register request for email: {payload.email}")
    try:
        # Check if email already exists
        exists = await db.execute(select(User).where(User.email == payload.email.lower()))
        if exists.scalar_one_or_none():
            logger.warning(f"Email already registered: {payload.email}")
            raise HTTPException(status_code=400, detail="Email already registered")

        # Generate unique Supermemory user ID
        supermemory_user_id = f"medesense_user_{uuid.uuid4().hex[:16]}"

        # Create user
        user = User(
            email=payload.email.lower(),
            hashed_password=get_password_hash(payload.password),
            display_name=payload.display_name,
            supermemory_user_id=supermemory_user_id,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

        logger.info(f"User created successfully: {user.email}")

        # Issue token
        token = create_access_token(
            {"sub": str(user.id)},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )
        return AuthResponse(
            user=PublicUser(
                id=user.id,
                email=user.email,
                display_name=user.display_name,
                created_at=user.created_at,
            ),
            access_token=token,
            token_type="Bearer",
            expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_session)):
    res = await db.execute(select(User).where(User.email == payload.email.lower()))
    user = res.scalar_one_or_none()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(
        {"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return AuthResponse(
        user=PublicUser(
            id=user.id,
            email=user.email,
            display_name=user.display_name,
            created_at=user.created_at,
        ),
        access_token=token,
        token_type="Bearer",
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
    )
