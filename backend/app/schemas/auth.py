"""Authentication Schemas.

This module defines Pydantic schemas for authentication-related requests and responses.

Author: Ruslan Magana
License: Apache 2.0
"""

from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserLogin(BaseModel):
    """User login request schema.

    Attributes:
        username: Agent ID or email address
        password: User password
    """

    username: str = Field(..., min_length=3, max_length=100, description="Agent ID or email")
    password: str = Field(..., min_length=6, description="Password")


class UserRegister(BaseModel):
    """User registration request schema.

    Attributes:
        agent_id: Unique agent identifier
        email: Contact email address
        password: Account password
    """

    agent_id: str = Field(..., min_length=3, max_length=100, description="MatrixHub Agent ID")
    email: EmailStr = Field(..., description="Contact email address")
    password: str = Field(..., min_length=6, description="Password (6+ characters)")


class GuestSession(BaseModel):
    """Guest session request schema.

    Attributes:
        session_id: Optional session identifier for tracking
    """

    session_id: Optional[str] = Field(None, description="Optional session ID")


class AuthResponse(BaseModel):
    """Authentication response schema.

    Attributes:
        access_token: JWT access token
        token_type: Token type (always "bearer")
        user_id: Authenticated user ID
        name: User display name
        role: User role/type
        is_guest: Whether this is a guest session
    """

    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    user_id: str = Field(..., description="User unique identifier")
    name: str = Field(..., description="User display name")
    role: str = Field(..., description="User role or agent type")
    is_guest: bool = Field(default=False, description="Guest session flag")
    avatar_url: Optional[str] = Field(None, description="Avatar image URL")


class UserProfile(BaseModel):
    """User profile schema.

    Attributes:
        id: User unique identifier
        name: User display name
        role: User role/type
        email: User email address
        avatar_url: Avatar image URL
        created_at: Account creation timestamp
    """

    id: str = Field(..., description="User unique identifier")
    name: str = Field(..., description="User display name")
    role: str = Field(..., description="User role or agent type")
    email: Optional[EmailStr] = Field(None, description="User email address")
    avatar_url: Optional[str] = Field(None, description="Avatar image URL")
    created_at: Optional[str] = Field(None, description="Account creation timestamp")
