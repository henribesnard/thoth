"""Schemas for writing pipeline requests and responses."""
from typing import Optional, Dict, Any, List
from uuid import UUID
from pydantic import BaseModel, Field


class IndexProjectRequest(BaseModel):
    """Index all documents for a project into Qdrant."""
    project_id: UUID
    clear_existing: bool = True


class IndexProjectResponse(BaseModel):
    success: bool
    chunks_indexed: int


class ChapterGenerationRequest(BaseModel):
    """Request to generate a single chapter."""
    project_id: UUID
    chapter_title: Optional[str] = None
    chapter_prompt: str = Field(..., min_length=1)
    target_word_count: Optional[int] = Field(None, ge=100)
    constraints: Optional[Dict[str, Any]] = None
    use_rag: bool = True
    reindex_documents: bool = False
    create_document: bool = True
    order_index: Optional[int] = Field(None, ge=0)


class ChapterGenerationResponse(BaseModel):
    success: bool
    chapter_title: str
    chapter_plan: str
    content: str
    document_id: Optional[str] = None
    retrieved_chunks: List[str] = Field(default_factory=list)


class BookGenerationRequest(BaseModel):
    """Request to generate a full book."""
    project_id: UUID
    book_prompt: str = Field(..., min_length=1)
    chapter_count: int = Field(..., ge=1, le=50)
    per_chapter_word_count: Optional[int] = Field(None, ge=100)
    constraints: Optional[Dict[str, Any]] = None
    use_rag: bool = True
    reindex_documents: bool = False
    create_documents: bool = True


class BookGenerationResponse(BaseModel):
    success: bool
    outline: List[Dict[str, str]]
    chapters: List[Dict[str, Any]]
