# // app/api/routes/memory.py
from typing import List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from app.api.deps import get_current_user
from app.services.memory_api_client import MemoryAPIClient
from app.services.memory_router_client import MemoryRouterClient
from app.core.safety import check_safety

router = APIRouter()

def container_tag_for_user(user_id: int) -> str:
    # Keep consistent with router user id; using the same value ties the pools together. :contentReference[oaicite:7]{index=7}
    return f"user:{user_id}"

class AddMemoryRequest(BaseModel):
    content: str = Field(..., description="Text or URL")
    metadata: Optional[Dict[str, str]] = None
    custom_id: Optional[str] = None
    raw: Optional[str] = None

@router.post("/memory/add")
async def add_memory(payload: AddMemoryRequest, current=Depends(get_current_user)):
    client = MemoryAPIClient()
    tag = container_tag_for_user(current["user_id"])
    try:
        result = await client.add_text_or_url(
            content=payload.content,
            container_tag=tag,
            metadata=payload.metadata,
            custom_id=payload.custom_id,
            raw=payload.raw,
        )
        return result  # { id: "...", status: "queued" }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = None
    conversation_id: Optional[str] = None

@router.post("/chat/complete")
async def chat_complete(payload: ChatRequest, current=Depends(get_current_user)):
    # Safety guardrail (block before hitting LLM)
    last_user_text = next((m.content for m in reversed(payload.messages) if m.role == "user"), "")
    ok, msg = check_safety(last_user_text or "")
    if not ok:
        # Fail-closed: do NOT call the LLM
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)

    user_id_str = container_tag_for_user(current["user_id"])
    router_client = MemoryRouterClient(user_id=user_id_str)
    try:
        result = router_client.chat(
            messages=[m.model_dump() for m in payload.messages],
            model=payload.model,
            conversation_id=payload.conversation_id,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))
