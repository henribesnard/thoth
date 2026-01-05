"""File upload endpoints"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.db.session import get_db
from app.models.user import User
from app.models.project import Project
from app.models.document import Document
from app.core.security import get_current_active_user
from app.services.file_processor import FileProcessor
from app.schemas.upload import UploadResponse
from sqlalchemy import select

router = APIRouter()


@router.post("/", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    project_id: str = Form(...),
    document_title: str = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Upload and process a document file.

    Supported formats: TXT, DOCX, PDF, MD
    Maximum file size: 10 MB

    Args:
        file: The file to upload
        project_id: ID of the project to attach the document to
        document_title: Optional custom title (defaults to filename)
    """
    try:
        # Verify project exists and belongs to user
        project_uuid = UUID(project_id)
        result = await db.execute(
            select(Project).where(
                Project.id == project_uuid,
                Project.owner_id == current_user.id
            )
        )
        project = result.scalar_one_or_none()

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found or access denied"
            )

        # Read file content
        file_content = await file.read()

        # Process file
        content, word_count = await FileProcessor.process_file(
            file.filename,
            file_content
        )

        # Create document
        title = document_title or file.filename
        document = Document(
            title=title,
            content=content,
            type='chapter',  # Default type
            order=0,  # Will be updated based on existing documents
            word_count=word_count,
            project_id=project_uuid,
            metadata={
                'original_filename': file.filename,
                'file_type': file.content_type,
            }
        )

        db.add(document)

        # Update project word count
        project.current_word_count += word_count

        await db.commit()
        await db.refresh(document)

        return UploadResponse(
            success=True,
            message=f"File '{file.filename}' uploaded successfully",
            document_id=document.id,
            word_count=word_count,
            file_type=file.content_type,
        )

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing file: {str(e)}"
        )
