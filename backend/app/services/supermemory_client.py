# # app/services/supermemory_client.py

# import requests

# class SupermemoryClient:
#     def __init__(self, api_key: str):
#         self.api_key = api_key
#         self.base_url = "https://api.supermemory.ai/v1"

#     def start_google_drive_connector(self, user_id: str) -> dict:
#         url = f"{self.base_url}/connectors/google-drive/start"
#         headers = {"Authorization": f"Bearer {self.api_key}"}
#         response = requests.post(url, headers=headers, json={"user_id": user_id})
#         return response.json()

# app/services/supermemory_client.py
import httpx
from app.core.config import settings

class SupermemoryClient:
    def __init__(self):
        self.base = "https://api.supermemory.ai"
        self.headers = {"Authorization": f"Bearer {settings.SUPERMEMORY_API_KEY}",
                        "Content-Type": "application/json"}

    async def create_connection(self, provider: str, container_tags: list[str], metadata: dict, document_limit: int):
        url = f"{self.base}/v3/connections/{provider}"
        payload = {
            "redirectUrl": settings.SUPERMEMORY_REDIRECT_URL,
            "containerTags": container_tags,
            "metadata": metadata,
            "documentLimit": document_limit,
        }
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post(url, headers=self.headers, json=payload)
            r.raise_for_status()
            return r.json()

