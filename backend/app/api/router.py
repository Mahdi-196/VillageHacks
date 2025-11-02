# # app/api/router.py
# from fastapi import APIRouter
# from app.api.routes.auth import router as auth_router
# from app.api.routes.connectors import router as connectors_router  # <-- add

# api_router = APIRouter(prefix="/api")
# api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
# api_router.include_router(connectors_router, prefix="/connectors", tags=["connectors"])  # <-- add

# # Prefix all backend routes with /api
# api_router = APIRouter(prefix="/api")

# # Mount sub-routers
# api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
# app/api/router.py
from fastapi import APIRouter
from app.api.routes.auth import router as auth_router
from app.api.routes.connectors import router as connectors_router  # ✅ include

api_router = APIRouter()

# Mount sub-routers under /api/*
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(connectors_router, prefix="/connectors", tags=["connectors"])  # ✅ /api/connectors/*
