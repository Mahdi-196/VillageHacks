from fastapi import FastAPI
from app.api.router import api_router

app = FastAPI(title="MedeSense API", version="0.1.0")

# Include all API routes from router.py
app.include_router(api_router)

@app.get("/health")
async def health():
    return {"status": "ok"}
