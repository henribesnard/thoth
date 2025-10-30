"""Project service"""
from typing import List, Optional
from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectService:
    """Service for project operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, project_id: UUID, user_id: UUID) -> Optional[Project]:
        """
        Get project by ID (ensuring user owns it).

        Args:
            project_id: Project ID
            user_id: User ID

        Returns:
            Project if found and owned by user, None otherwise
        """
        result = await self.db.execute(
            select(Project).where(
                Project.id == project_id,
                Project.owner_id == user_id
            )
        )
        return result.scalar_one_or_none()

    async def get_all_by_user(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 100
    ) -> tuple[List[Project], int]:
        """
        Get all projects for a user.

        Args:
            user_id: User ID
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            Tuple of (projects list, total count)
        """
        # Get total count
        count_result = await self.db.execute(
            select(func.count(Project.id)).where(Project.owner_id == user_id)
        )
        total = count_result.scalar()

        # Get projects
        result = await self.db.execute(
            select(Project)
            .where(Project.owner_id == user_id)
            .order_by(Project.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        projects = result.scalars().all()

        return list(projects), total

    async def create(self, project_data: ProjectCreate, user_id: UUID) -> Project:
        """
        Create a new project.

        Args:
            project_data: Project creation data
            user_id: Owner user ID

        Returns:
            Created project
        """
        project = Project(
            title=project_data.title,
            description=project_data.description,
            genre=project_data.genre,
            target_word_count=project_data.target_word_count,
            structure_template=project_data.structure_template,
            owner_id=user_id
        )

        self.db.add(project)
        await self.db.commit()
        await self.db.refresh(project)

        return project

    async def update(
        self,
        project_id: UUID,
        project_data: ProjectUpdate,
        user_id: UUID
    ) -> Project:
        """
        Update project.

        Args:
            project_id: Project ID
            project_data: Update data
            user_id: User ID (for ownership check)

        Returns:
            Updated project

        Raises:
            HTTPException: If project not found or not owned by user
        """
        project = await self.get_by_id(project_id, user_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )

        # Update fields
        update_data = project_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(project, field, value)

        await self.db.commit()
        await self.db.refresh(project)

        return project

    async def delete(self, project_id: UUID, user_id: UUID) -> bool:
        """
        Delete project.

        Args:
            project_id: Project ID
            user_id: User ID (for ownership check)

        Returns:
            True if deleted, False if not found
        """
        project = await self.get_by_id(project_id, user_id)
        if not project:
            return False

        await self.db.delete(project)
        await self.db.commit()

        return True
