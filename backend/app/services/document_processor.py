# app/services/document_processor.py
import logging
import httpx
import json
from typing import Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

class DocumentProcessorService:
    """Service to handle document processing via AWS Lambda"""

    def __init__(self):
        self.lambda_api_url = settings.PHI_STRIPPER_LAMBDA_API_URL

    async def process_document(self, raw_text: str = None, image_base64: str = None, user_id: str = None) -> Dict[str, Any]:
        """Send document to Lambda for OCR, PHI removal, and Supermemory upload."""
        if not self.lambda_api_url:
            logger.error("PHI_STRIPPER_LAMBDA_API_URL not configured")
            raise ValueError("Lambda API URL is not configured. Please set PHI_STRIPPER_LAMBDA_API_URL in environment.")

        if not raw_text and not image_base64:
            raise ValueError("Either raw_text or image_base64 must be provided")

        logger.info(f"Sending document to Lambda for processing (type: {'text' if raw_text else 'image'}, user_id: {user_id})")

        # Prepare payload for Lambda (via API Gateway)
        payload = {}
        if raw_text:
            payload["text_to_process"] = raw_text
        if image_base64:
            payload["image_base64"] = image_base64
        if user_id:
            payload["user_id"] = user_id  # Pass user ID to Lambda for tagging

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.lambda_api_url,
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )

                logger.info(f"Lambda API response status: {response.status_code}")

                # Raise exception for 4xx/5xx status codes
                response.raise_for_status()

                # Parse the response from API Gateway
                api_gateway_response = response.json()
                logger.debug(f"API Gateway response: {api_gateway_response}")

                # API Gateway wraps Lambda response in a 'body' field as a JSON string
                if "body" in api_gateway_response:
                    lambda_response = json.loads(api_gateway_response["body"])
                else:
                    # If no 'body' field, assume direct Lambda response
                    lambda_response = api_gateway_response

                logger.info("Document processed successfully by Lambda")
                return lambda_response

        except httpx.TimeoutException as e:
            logger.error(f"Timeout calling Lambda API: {str(e)}")
            raise
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error from Lambda API: {e.response.status_code} - {e.response.text}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Lambda response as JSON: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error processing document: {str(e)}", exc_info=True)
            raise


# Singleton instance
document_processor = DocumentProcessorService()
