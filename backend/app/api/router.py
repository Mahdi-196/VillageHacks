# app/api/router.py
from fastapi import APIRouter
from app.api.routes.auth import router as auth_router

# Prefix all backend routes with /api
api_router = APIRouter(prefix="/api")

# Mount sub-routers
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
