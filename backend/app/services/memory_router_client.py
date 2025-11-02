# // app/services/memory_router_client.py
from typing import List, Dict, Optional, Any
from openai import OpenAI
from app.core.config import settings




def _router_base_url() -> str:
    # e.g. https://api.supermemory.ai/v3/ + https://api.openai.com/v1/
    return f"{settings.SUPERMEMORY_ROUTER_BASE}{settings.PROVIDER_BASE_URL}"

class MemoryRouterClient:
    def __init__(self, user_id: str):
        if not settings.OPENAI_API_KEY:
            raise RuntimeError("Missing OPENAI_API_KEY")
        if not settings.SUPERMEMORY_API_KEY:
            raise RuntimeError("Missing SUPERMEMORY_API_KEY")

        self.client = OpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=_router_base_url(),
            default_headers={
                "x-supermemory-api-key": settings.SUPERMEMORY_API_KEY,
                "x-sm-user-id": user_id,   # critical for isolating memory per user
            },
        )

    def chat(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        conversation_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        extra_headers = {}
        if conversation_id:
            # Persist conversation state via router header
            extra_headers["x-sm-conversation-id"] = conversation_id  # :contentReference[oaicite:6]{index=6}

            resp = self.client.chat.completions.create(
            model=(model or settings.SM_DEFAULT_MODEL),
            messages=messages,
            extra_headers=extra_headers or None,
        )
        # Normalize a small JSON
        content = resp.choices[0].message.content if resp.choices else ""
        return {
            "content": content,
            "conversation_id": conversation_id,  # echo if provided
            "usage": getattr(resp, "usage", None)
        }
