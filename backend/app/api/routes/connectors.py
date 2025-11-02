# // app/api/routes/connectors.py
from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List
from app.api.deps import get_current_user
from app.services.supermemory_client import SupermemoryClient

router = APIRouter()

def tags_for_user(user_id: int) -> List[str]:
    return [f"user:{user_id}"]

@router.get("/__ping")
async def connectors_ping():
    return {"ok": True}

@router.post("/google-drive/start")
async def google_drive_start(current=Depends(get_current_user)):
    client = SupermemoryClient()
    resp = await client.create_connection(
        provider="google-drive",
        container_tags=tags_for_user(current["user_id"]),
        metadata={"app": "MedeSense"},
        document_limit=2000,
    )
    auth_link = resp.get("authLink")
    if not auth_link:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Failed to get authLink: {resp}")
    return {"authLink": auth_link}

@router.get("/google-drive/callback")
async def google_drive_callback(code: str | None = Query(default=None), state: str | None = Query(default=None)):
    return {"status": "ok", "code": code, "state": state}

@router.post("/google-drive/sync")
async def google_drive_sync(current=Depends(get_current_user)):
    client = SupermemoryClient()
    resp = await client.trigger_sync("google-drive", container_tags=tags_for_user(current["user_id"]))
    return {"status": "sync_triggered", "result": resp}

@router.get("/google-drive/connections")
async def google_drive_connections(current=Depends(get_current_user)):
    client = SupermemoryClient()
    resp = await client.list_connections("google-drive", container_tags=tags_for_user(current["user_id"]))
    return resp

@router.get("/google-drive/documents")
async def google_drive_documents(current=Depends(get_current_user)):
    client = SupermemoryClient()
    resp = await client.list_documents("google-drive", container_tags=tags_for_user(current["user_id"]))
    return resp
