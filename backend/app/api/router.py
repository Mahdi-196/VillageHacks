# app/api/router.py
from fastapi import APIRouter
from app.api.routes.auth import router as auth_router
from app.api.routes.documents import router as documents_router
from app.api.routes.debug import router as debug_router
from app.api.routes.memory import router as memory_router
from app.api.routes.chat import router as chat_router

api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(documents_router, prefix="/documents", tags=["documents"])
api_router.include_router(debug_router, prefix="/debug", tags=["debug"])
api_router.include_router(memory_router, tags=["memory"])
api_router.include_router(chat_router, tags=["chat"])