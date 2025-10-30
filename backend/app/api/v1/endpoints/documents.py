"""Documents endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.db.session import get_db
from app.models.user import User
from app.schemas.document import DocumentCreate, DocumentUpdate, DocumentResponse, DocumentList
from app.services.document_service import DocumentService
from app.core.security import get_current_active_user

router = APIRouter()


@router.get("/", response_model=DocumentList)
async def list_documents(
    project_id: UUID = Query(..., description="Project ID to filter documents"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get all documents for a project.

    - **project_id**: Project ID (required)
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return (max 100)
    """
    document_service = DocumentService(db)
    documents, total = await document_service.get_all_by_project(
        project_id=project_id,
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )

    return DocumentList(documents=documents, total=total)


@router.post("/", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_document(
    document_data: DocumentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a new document.

    - **title**: Document title (required)
    - **content**: Document content
    - **document_type**: Type (chapter, scene, note, outline)
    - **project_id**: Project ID (required)
    - **order_index**: Order index for sorting
    """
    document_service = DocumentService(db)
    document = await document_service.create(document_data, current_user.id)
    return document


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get a specific document by ID.

    Returns 404 if document not found or user doesn't have access.
    """
    document_service = DocumentService(db)
    document = await document_service.get_by_id(document_id, current_user.id)

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    return document


@router.put("/{document_id}", response_model=DocumentResponse)
async def update_document(
    document_id: UUID,
    document_data: DocumentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update a document.

    All fields are optional. Only provided fields will be updated.
    Word count is automatically recalculated if content is updated.
    """
    document_service = DocumentService(db)
    document = await document_service.update(document_id, document_data, current_user.id)
    return document


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete a document.

    Project word count is automatically updated after deletion.
    """
    document_service = DocumentService(db)
    deleted = await document_service.delete(document_id, current_user.id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    return None
