# // app/api/routes/debug.py
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/whoami")
async def whoami(current=Depends(get_current_user)):
    return current
