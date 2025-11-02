# app/api/routes/chat.py
"""
Smart chat endpoint with document awareness via Supermemory search
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from openai import OpenAI
from app.api.deps import get_current_user
from app.core.config import settings
from app.core.safety import check_safety
from app.services.memory_api_client import MemoryAPIClient

router = APIRouter()


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = None
    max_tokens: Optional[int] = 500


class ChatResponse(BaseModel):
    content: str
    model: str
    usage: dict
    memory_enabled: bool


@router.post("/chat", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    current=Depends(get_current_user)
):
    """
    Smart chat endpoint with document awareness:
    1. Searches Supermemory for relevant user documents
    2. Injects document context into chat
    3. Uses OpenAI to answer with document awareness
    """
    # Safety check
    last_user_text = next(
        (m.content for m in reversed(payload.messages) if m.role == "user"),
        ""
    )
    ok, msg = check_safety(last_user_text or "")
    if not ok:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)

    # Check if OpenAI API key exists
    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OpenAI API key not configured"
        )

    # Build message list for OpenAI
    messages = [{"role": m.role, "content": m.content} for m in payload.messages]
    memory_enabled = False

    # Try to retrieve relevant documents from Supermemory
    if settings.SUPERMEMORY_API_KEY and settings.SUPERMEMORY_API_KEY != "your_supermemory_api_key_here":
        try:
            memory_client = MemoryAPIClient()

            # Search for relevant documents using the user's question
            search_result = await memory_client.search_documents(
                query=last_user_text,
                container_tag=current["supermemory_user_id"],
                limit=3
            )

            # Extract document content (v4 API uses 'results' not 'documents')
            documents = search_result.get("results", [])
            if documents:
                # Build context from retrieved documents
                doc_context = "**Relevant medical information from your uploaded documents:**\n\n"
                for doc in documents:
                    # v4 API returns 'memory' field, not 'content'!
                    memory_text = doc.get("memory", "")
                    if memory_text:
                        doc_context += f"- {memory_text}\n"

                # Inject document context into the conversation
                # Add it before the last user message
                context_message = {
                    "role": "system",
                    "content": f"{doc_context}\n\nUse the above information to answer the user's question accurately."
                }

                # Insert context before the last user message
                messages.insert(-1, context_message)
                memory_enabled = True
                print(f"✅ Found {len(documents)} relevant documents for query")
            else:
                print("ℹ️  No relevant documents found in Supermemory")

        except Exception as e:
            # Log but don't fail - continue without document context
            print(f"Supermemory search failed, continuing without document context: {e}")

    # Call OpenAI with or without document context
    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)

        response = client.chat.completions.create(
            model=payload.model or settings.SM_DEFAULT_MODEL,
            messages=messages,
            max_tokens=payload.max_tokens
        )

        content = response.choices[0].message.content if response.choices else ""

        return ChatResponse(
            content=content,
            model=response.model,
            usage={
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            } if response.usage else {},
            memory_enabled=memory_enabled
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Chat error: {str(e)}"
        )
