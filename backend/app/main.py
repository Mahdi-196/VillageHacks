from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router

app = FastAPI(title="MedeSense API", version="0.1.0")

# CORS configuration for frontend temp for dev deploy 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include all API routes from router.py
app.include_router(api_router)

@app.get("/health")
async def health():
    return {"status": "ok"}


