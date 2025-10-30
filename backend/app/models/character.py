"""Character model"""
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.db.base import Base


class Character(Base):
    """Character model"""
    __tablename__ = "characters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Character details
    physical_description = Column(Text, nullable=True)
    personality = Column(Text, nullable=True)
    backstory = Column(Text, nullable=True)

    # Metadata
    character_metadata = Column(JSONB, default=dict)  # For relationships, goals, etc.

    # Project relationship
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="characters")

    def __repr__(self):
        return f"<Character {self.name}>"
