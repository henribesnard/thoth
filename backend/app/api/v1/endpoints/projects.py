"""Projects endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID, uuid4
from datetime import datetime
import unicodedata

from app.db.session import get_db
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectList,
    ProjectDeleteRequest,
)
from app.schemas.instruction import (
    InstructionCreate,
    InstructionUpdate,
    InstructionResponse,
    InstructionList,
)
from app.services.project_service import ProjectService
from app.core.security import get_current_active_user

router = APIRouter()


def normalize_project_title(value: str) -> str:
    normalized = unicodedata.normalize("NFKC", value or "")
    return " ".join(normalized.split()).casefold()


def _load_instructions(project) -> list[dict]:
    metadata = project.project_metadata or {}
    instructions = metadata.get("instructions") if isinstance(metadata, dict) else None
    return instructions if isinstance(instructions, list) else []


def _save_instructions(project, instructions: list[dict]) -> None:
    metadata = project.project_metadata or {}
    if not isinstance(metadata, dict):
        metadata = {}
    metadata["instructions"] = instructions
    project.project_metadata = metadata


def _serialize_instruction(raw: dict) -> InstructionResponse:
    created_at_value = raw.get("created_at")
    try:
        created_at = datetime.fromisoformat(created_at_value) if created_at_value else datetime.utcnow()
    except ValueError:
        created_at = datetime.utcnow()
    return InstructionResponse(
        id=UUID(str(raw.get("id"))),
        title=str(raw.get("title")),
        detail=str(raw.get("detail")),
        created_at=created_at,
    )


@router.get("/", response_model=ProjectList)
async def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get all projects for the current user.

    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return (max 100)
    """
    project_service = ProjectService(db)
    projects, total = await project_service.get_all_by_user(
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )

    return ProjectList(projects=projects, total=total)


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a new project.

    - **title**: Project title (required)
    - **description**: Project description
    - **genre**: Project genre
    - **target_word_count**: Target word count
    - **structure_template**: Structure template (e.g., "3-act", "hero-journey")
    """
    project_service = ProjectService(db)
    project = await project_service.create(project_data, current_user.id)
    return project


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get a specific project by ID.

    Returns 404 if project not found or user doesn't have access.
    """
    project_service = ProjectService(db)
    project = await project_service.get_by_id(project_id, current_user.id)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    project_data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update a project.

    All fields are optional. Only provided fields will be updated.
    """
    project_service = ProjectService(db)
    project = await project_service.update(project_id, project_data, current_user.id)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete a project.

    This will also delete all associated documents and characters.
    """
    project_service = ProjectService(db)
    deleted = await project_service.delete(project_id, current_user.id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return None


@router.post("/{project_id}/delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project_with_confirmation(
    project_id: UUID,
    payload: ProjectDeleteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Delete a project with title confirmation.

    The provided title must exactly match the project title.
    """
    project_service = ProjectService(db)
    project = await project_service.get_by_id(project_id, current_user.id)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    if normalize_project_title(project.title) != normalize_project_title(payload.confirm_title):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project title confirmation does not match",
        )

    await project_service.delete(project_id, current_user.id)
    return None


@router.get("/{project_id}/instructions", response_model=InstructionList)
async def list_instructions(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    project_service = ProjectService(db)
    project = await project_service.get_by_id(project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    instructions = _load_instructions(project)
    serialized = []
    for item in instructions:
        if not isinstance(item, dict):
            continue
        try:
            serialized.append(_serialize_instruction(item))
        except Exception:
            continue

    return InstructionList(instructions=serialized, total=len(serialized))


@router.post("/{project_id}/instructions", response_model=InstructionResponse, status_code=status.HTTP_201_CREATED)
async def create_instruction(
    project_id: UUID,
    payload: InstructionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    project_service = ProjectService(db)
    project = await project_service.get_by_id(project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    instruction_id = uuid4()
    created_at = datetime.utcnow().isoformat()
    instruction = {
        "id": str(instruction_id),
        "title": payload.title,
        "detail": payload.detail,
        "created_at": created_at,
    }
    instructions = _load_instructions(project)
    instructions.append(instruction)
    _save_instructions(project, instructions)
    await db.commit()
    await db.refresh(project)

    return _serialize_instruction(instruction)


@router.put("/{project_id}/instructions/{instruction_id}", response_model=InstructionResponse)
async def update_instruction(
    project_id: UUID,
    instruction_id: UUID,
    payload: InstructionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    project_service = ProjectService(db)
    project = await project_service.get_by_id(project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    instructions = _load_instructions(project)
    updated = None
    for item in instructions:
        if not isinstance(item, dict):
            continue
        if str(item.get("id")) != str(instruction_id):
            continue
        if payload.title is not None:
            item["title"] = payload.title
        if payload.detail is not None:
            item["detail"] = payload.detail
        updated = item
        break

    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Instruction not found")

    _save_instructions(project, instructions)
    await db.commit()
    await db.refresh(project)
    return _serialize_instruction(updated)


@router.delete("/{project_id}/instructions/{instruction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_instruction(
    project_id: UUID,
    instruction_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    project_service = ProjectService(db)
    project = await project_service.get_by_id(project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    instructions = _load_instructions(project)
    filtered = [
        item
        for item in instructions
        if isinstance(item, dict) and str(item.get("id")) != str(instruction_id)
    ]

    if len(filtered) == len(instructions):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Instruction not found")

    _save_instructions(project, filtered)
    await db.commit()
    await db.refresh(project)
    return None
