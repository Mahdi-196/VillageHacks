# app/api/router.py
from fastapi import APIRouter
#from app.api.routes.auth import router as auth_router
from app.api.routes.documents import router as documents_router
#from app.api.routes.memory import router as memory_router
from app.api.routes.debug import router as debug_router

# Prefix all backend routes with /api
api_router = APIRouter(prefix="/api")

# Mount sub-routers
#api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(documents_router, prefix="/documents", tags=["documents"])
#api_router.include_router(memory_router, tags=["memory"])
api_router.include_router(debug_router, prefix="/debug", tags=["debug"])