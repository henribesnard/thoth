"""Token schemas"""
from typing import Optional
from pydantic import BaseModel
from uuid import UUID


class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """Schema for JWT token payload"""
    sub: Optional[UUID] = None  # User ID
    exp: Optional[int] = None  # Expiration timestamp
