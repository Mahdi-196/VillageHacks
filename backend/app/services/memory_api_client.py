# // app/services/memory_api_client.py
from typing import Optional, Dict, Any
import httpx
from app.core.config import settings



class MemoryAPIClient:
    def __init__(self):
        if not settings.SUPERMEMORY_API_KEY:
            raise RuntimeError("Missing SUPERMEMORY_API_KEY")
        self.base = settings.SUPERMEMORY_BASE_URL.rstrip("/")
        self.headers = {
            "Authorization": f"Bearer {settings.SUPERMEMORY_API_KEY}",
            "Content-Type": "application/json",
        }

    async def add_text_or_url(
        self,
        content: str,
        container_tag: str,
        metadata: Optional[Dict[str, Any]] = None,
        custom_id: Optional[str] = None,
        raw: Optional[str] = None,
    ) -> Dict[str, Any]:
        payload: Dict[str, Any] = {"content": content, "containerTag": container_tag}
        if metadata:
            payload["metadata"] = metadata
        if custom_id:
            payload["customId"] = custom_id
        if raw:
            payload["raw"] = raw

        url = f"{self.base}/v3/documents"
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post(url, headers=self.headers, json=payload)
            r.raise_for_status()
            return r.json()
