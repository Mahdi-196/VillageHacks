# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.api.router import api_router

# app = FastAPI(title="MedeSense API", version="1.0.0")

# # CORS configuration for frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Include all API routes from router.py
# app.include_router(api_router)

# @app.get("/health")
# async def health():
#     return {"status": "ok"}
# app/main.py
import logging
from fastapi import FastAPI
from app.api.router import api_router

app = FastAPI(title="MedeSense API")

# ✅ Put everything under /api/*
app.include_router(api_router, prefix="/api")

# 🔎 Log all routes on startup to confirm the exact paths
logger = logging.getLogger("routes")

@app.on_event("startup")
async def log_registered_routes():
    for r in app.routes:
        methods = getattr(r, "methods", None)
        path = getattr(r, "path", None)
        if methods and path:
            logger.info(f"Route: {sorted(methods)} {path}")
