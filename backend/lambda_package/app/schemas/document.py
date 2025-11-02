# app/schemas/document.py
from pydantic import BaseModel, Field, model_validator
from typing import Optional

class DocumentUploadRequest(BaseModel):
    text: Optional[str] = Field(None, description="Raw document text to process")
    image_base64: Optional[str] = Field(None, description="Base64 encoded image for OCR processing")

    @model_validator(mode='after')
    def check_text_or_image(self):
        if not self.text and not self.image_base64:
            raise ValueError("Either 'text' or 'image_base64' must be provided")
        if self.text and self.image_base64:
            raise ValueError("Provide either 'text' or 'image_base64', not both")
        return self

class DocumentUploadResponse(BaseModel):
    message: str
    de_identified_text_uploaded: bool
    supermemory_document_id: str | None = None
    details: dict | None = None
