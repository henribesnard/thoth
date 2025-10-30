"""Characters endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.db.session import get_db
from app.models.user import User
from app.schemas.character import CharacterCreate, CharacterUpdate, CharacterResponse, CharacterList
from app.services.character_service import CharacterService
from app.core.security import get_current_active_user

router = APIRouter()


@router.get("/", response_model=CharacterList)
async def list_characters(
    project_id: UUID = Query(..., description="Project ID to filter characters"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get all characters for a project.

    - **project_id**: Project ID (required)
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return (max 100)
    """
    character_service = CharacterService(db)
    characters, total = await character_service.get_all_by_project(
        project_id=project_id,
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )

    return CharacterList(characters=characters, total=total)


@router.post("/", response_model=CharacterResponse, status_code=status.HTTP_201_CREATED)
async def create_character(
    character_data: CharacterCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a new character.

    - **name**: Character name (required)
    - **description**: Character description
    - **physical_description**: Physical appearance
    - **personality**: Personality traits
    - **backstory**: Character backstory
    - **project_id**: Project ID (required)
    """
    character_service = CharacterService(db)
    character = await character_service.create(character_data, current_user.id)
    return character


@router.get("/{character_id}", response_model=CharacterResponse)
async def get_character(
    character_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get a specific character by ID.

    Returns 404 if character not found or user doesn't have access.
    """
    character_service = CharacterService(db)
    character = await character_service.get_by_id(character_id, current_user.id)

    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found"
        )

    return character


@router.put("/{character_id}", response_model=CharacterResponse)
async def update_character(
    character_id: UUID,
    character_data: CharacterUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update a character.

    All fields are optional. Only provided fields will be updated.
    """
    character_service = CharacterService(db)
    character = await character_service.update(character_id, character_data, current_user.id)
    return character


@router.delete("/{character_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_character(
    character_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete a character.
    """
    character_service = CharacterService(db)
    deleted = await character_service.delete(character_id, current_user.id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found"
        )

    return None
