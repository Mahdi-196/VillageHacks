# // app/services/supermemory_client.py
from __future__ import annotations

from typing import Any, Dict, List, Optional

import httpx

from app.core.config import settings

# If you created app/core/logger.py, use it; otherwise this falls back to std logging.
try:
    from app.core.logger import get_logger  # optional helper we set up earlier
    logger = get_logger(__name__)
except Exception:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)


class SupermemoryClient:
    """
    Minimal async client for Supermemory connectors & documents.

    Expects envs:
      - SUPERMEMORY_BASE_URL (default: https://api.supermemory.ai)
      - SUPERMEMORY_API_KEY
      - SUPERMEMORY_REDIRECT_URL (used when creating connections)
    """

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        base = (base_url or getattr(settings, "SUPERMEMORY_BASE_URL", "https://api.supermemory.ai")).rstrip("/")
        token = api_key or getattr(settings, "SUPERMEMORY_API_KEY", "")
        if not token:
            raise RuntimeError("Missing SUPERMEMORY_API_KEY")

        self.base_url = base
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

    # ---------- Connections ----------

    async def create_connection(
        self,
        provider: str,
        container_tags: List[str],
        metadata: Optional[Dict[str, Any]] = None,
        document_limit: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Start OAuth for a provider (e.g., 'google-drive') and return JSON containing `authLink`.
        """
        url = f"{self.base_url}/v3/connections/{provider}"
        payload: Dict[str, Any] = {
            "redirectUrl": getattr(settings, "SUPERMEMORY_REDIRECT_URL", "http://localhost:3000/supermemory/callback"),
            "containerTags": container_tags,
        }
        if metadata:
            payload["metadata"] = metadata
        if document_limit:
            payload["documentLimit"] = document_limit

        logger.info(f"POST {url} tags={container_tags}")
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post(url, headers=self.headers, json=payload)
            logger.info(f"status={r.status_code}")
            r.raise_for_status()
            logger.debug(f"resp={r.text[:800]}")
            return r.json()

    async def trigger_sync(
        self,
        provider: str,
        container_tags: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Manually trigger import/sync for a connection.
        """
        url = f"{self.base_url}/v3/connections/{provider}/import"
        payload: Dict[str, Any] = {}
        if container_tags:
            payload["containerTags"] = container_tags

        logger.info(f"POST {url} tags={container_tags}")
        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(url, headers=self.headers, json=payload or None)
            logger.info(f"status={r.status_code}")
            r.raise_for_status()
            return r.json() if r.content else {"status": "accepted"}

    async def list_connections(self, provider: str, container_tags: List[str]) -> Dict[str, Any]:
        """
        List connections for a provider; filter client-side by containerTags.
        """
        url = f"{self.base_url}/v3/connections"
        params = {"provider": provider}

        logger.info(f"GET  {url} params={params}")
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get(url, headers=self.headers, params=params)
            logger.info(f"status={r.status_code}")
            r.raise_for_status()
            data = r.json()
            if isinstance(data, list) and container_tags:
                data = [c for c in data if set(container_tags).issubset(set(c.get("containerTags", [])))]
            return {"connections": data}

    # ---------- Documents ----------

    async def list_documents(self, provider: str, container_tags: List[str]) -> Dict[str, Any]:
        """
        List/search documents (wildcard) for the given tags & provider.
        """
        url = f"{self.base_url}/v3/documents/search"
        payload = {
            "q": "*",
            "provider": provider,
            "containerTags": container_tags,
        }

        logger.info(f"POST {url} tags={container_tags}")
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(url, headers=self.headers, json=payload)
            logger.info(f"status={r.status_code}")
            r.raise_for_status()
            logger.debug(f"resp={r.text[:800]}")
            return r.json()

    # ---------- Deletion ----------

    async def delete_connection_by_tags(self, provider: str, container_tags: List[str]) -> Dict[str, Any]:
        """
        Delete connection by provider + tags.
        """
        url = f"{self.base_url}/v3/connections/{provider}"
        payload = {"containerTags": container_tags}

        logger.info(f"DELETE {url} tags={container_tags}")
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.request("DELETE", url, headers=self.headers, json=payload)
            logger.info(f"status={r.status_code}")
            r.raise_for_status()
            return r.json()

    async def delete_connection_by_id(self, connection_id: str) -> Dict[str, Any]:
        """
        Delete connection by its ID.
        """
        url = f"{self.base_url}/v3/connections/{connection_id}"

        logger.info(f"DELETE {url}")
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.request("DELETE", url, headers=self.headers)
            logger.info(f"status={r.status_code}")
            r.raise_for_status()
            return r.json()
