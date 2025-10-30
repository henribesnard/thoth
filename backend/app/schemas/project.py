"""Project schemas"""
from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID

from app.models.project import ProjectStatus, Genre


class ProjectBase(BaseModel):
    """Base project schema"""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    genre: Optional[Genre] = None
    target_word_count: Optional[int] = Field(None, gt=0)
    structure_template: Optional[str] = None


class ProjectCreate(ProjectBase):
    """Schema for creating a new project"""
    pass


class ProjectUpdate(BaseModel):
    """Schema for updating project"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    genre: Optional[Genre] = None
    status: Optional[ProjectStatus] = None
    target_word_count: Optional[int] = Field(None, gt=0)
    current_word_count: Optional[int] = Field(None, ge=0)
    structure_template: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class ProjectResponse(ProjectBase):
    """Schema for project response"""
    id: UUID
    status: ProjectStatus
    current_word_count: int
    metadata: Dict[str, Any]
    owner_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectList(BaseModel):
    """Schema for project list response"""
    projects: list[ProjectResponse]
    total: int
