# app/api/routes/documents.py
import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.document import DocumentUploadRequest, DocumentUploadResponse
from app.services.document_processor import document_processor

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/upload-document", response_model=DocumentUploadResponse, status_code=status.HTTP_200_OK)
async def upload_document(payload: DocumentUploadRequest):
    """
    Process medical documents and remove PHI before storage.
    Accepts text or base64-encoded images (JPEG, PNG, PDF, TIFF).
    """
    upload_type = "image" if payload.image_base64 else "text"
    logger.info(f"Received {upload_type} document upload request")

    try:
        # Call Lambda via the document processor service
        lambda_response = await document_processor.process_document(
            raw_text=payload.text,
            image_base64=payload.image_base64
        )

        # Extract response fields from Lambda
        message = lambda_response.get("message", "Document processed")
        de_identified = lambda_response.get("de_identified_text_uploaded", False)
        doc_id = lambda_response.get("supermemory_document_id")

        logger.info(f"Document processed successfully. Supermemory ID: {doc_id}")

        return DocumentUploadResponse(
            message=message,
            de_identified_text_uploaded=de_identified,
            supermemory_document_id=doc_id,
            details=lambda_response
        )

    except ValueError as e:
        logger.error(f"Configuration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process document. Please try again later."
        )
