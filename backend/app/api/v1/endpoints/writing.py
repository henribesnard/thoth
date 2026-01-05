"""Writing pipeline endpoints."""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.user import User
from app.models.project import Project
from app.models.document import Document
from app.core.security import get_current_active_user
from app.schemas.writing import (
    IndexProjectRequest,
    IndexProjectResponse,
    ChapterGenerationRequest,
    ChapterGenerationResponse,
    BookGenerationRequest,
    BookGenerationResponse,
)
from app.services.rag_service import RagService
from app.services.writing_pipeline import WritingPipeline

router = APIRouter()


async def _verify_project_access(db: AsyncSession, project_id: UUID, user_id: UUID) -> None:
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.owner_id == user_id)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or access denied",
        )


@router.post("/index", response_model=IndexProjectResponse)
async def index_project_documents(
    request: IndexProjectRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Index all documents for a project into Qdrant."""
    await _verify_project_access(db, request.project_id, current_user.id)

    documents_result = await db.execute(
        select(Document).where(Document.project_id == request.project_id)
    )
    documents = list(documents_result.scalars().all())

    rag_service = RagService()
    chunks_indexed = await rag_service.aindex_documents(
        project_id=request.project_id,
        documents=documents,
        clear_existing=request.clear_existing,
    )

    return IndexProjectResponse(success=True, chunks_indexed=chunks_indexed)


@router.post("/generate-chapter", response_model=ChapterGenerationResponse)
async def generate_chapter(
    request: ChapterGenerationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Generate a chapter with autonomous context collection."""
    await _verify_project_access(db, request.project_id, current_user.id)

    pipeline = WritingPipeline(db)
    result = await pipeline.generate_chapter(
        {
            "project_id": request.project_id,
            "user_id": current_user.id,
            "chapter_title": request.chapter_title or "",
            "chapter_prompt": request.chapter_prompt,
            "target_word_count": request.target_word_count,
            "constraints": request.constraints or {},
            "use_rag": request.use_rag,
            "reindex_documents": request.reindex_documents,
            "order_index": request.order_index,
            "create_document": request.create_document,
        }
    )

    return ChapterGenerationResponse(
        success=True,
        chapter_title=result.get("chapter_title", ""),
        chapter_plan=result.get("chapter_plan", ""),
        content=result.get("chapter_text", ""),
        document_id=result.get("document_id"),
        retrieved_chunks=result.get("retrieved_chunks", []),
    )


@router.post("/generate-book", response_model=BookGenerationResponse)
async def generate_book(
    request: BookGenerationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Generate a full book by chaining chapter generations."""
    await _verify_project_access(db, request.project_id, current_user.id)

    pipeline = WritingPipeline(db)
    result = await pipeline.generate_book(
        project_id=request.project_id,
        user_id=current_user.id,
        book_prompt=request.book_prompt,
        chapter_count=request.chapter_count,
        per_chapter_word_count=request.per_chapter_word_count,
        constraints=request.constraints or {},
        use_rag=request.use_rag,
        reindex_documents=request.reindex_documents,
        create_documents=request.create_documents,
    )

    return BookGenerationResponse(
        success=True,
        outline=result.get("outline", []),
        chapters=result.get("chapters", []),
    )
