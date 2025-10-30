"""Projects endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.db.session import get_db
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectList
from app.services.project_service import ProjectService
from app.core.security import get_current_active_user

router = APIRouter()


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
