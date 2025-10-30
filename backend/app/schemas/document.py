"""Document schemas"""
from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID

from app.models.document import DocumentType


class DocumentBase(BaseModel):
    """Base document schema"""
    title: str = Field(..., min_length=1, max_length=255)
    content: Optional[str] = None
    document_type: DocumentType = DocumentType.CHAPTER


class DocumentCreate(DocumentBase):
    """Schema for creating a new document"""
    project_id: UUID
    order_index: int = 0


class DocumentUpdate(BaseModel):
    """Schema for updating document"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = None
    document_type: Optional[DocumentType] = None
    order_index: Optional[int] = Field(None, ge=0)
    metadata: Optional[Dict[str, Any]] = None


class DocumentResponse(DocumentBase):
    """Schema for document response"""
    id: UUID
    order_index: int
    word_count: int
    metadata: Dict[str, Any]
    project_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DocumentList(BaseModel):
    """Schema for document list response"""
    documents: list[DocumentResponse]
    total: int
