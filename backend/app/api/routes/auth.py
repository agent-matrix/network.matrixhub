"""Authentication API Routes.

This module defines FastAPI route handlers for authentication operations,
including login, registration, and guest sessions.

Author: Ruslan Magana
License: Apache 2.0
"""

from __future__ import annotations

import logging
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

from app.schemas.auth import (
    AuthResponse,
    GuestSession,
    UserLogin,
    UserProfile,
    UserRegister,
)

# Configure module logger
logger = logging.getLogger(__name__)

# Create API router for authentication endpoints
router = APIRouter(prefix="/auth", tags=["authentication"])

# In-memory user storage (for demo purposes - replace with database in production)
USERS_DB: Dict[str, Dict[str, Any]] = {
    "Unit-734": {
        "id": "Unit-734",
        "password": "password123",  # In production, use hashed passwords
        "name": "Unit-734",
        "role": "Auto-GPT Agent",
        "email": "[email protected]",
        "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Unit734",
        "created_at": "2024-01-01T00:00:00Z",
    },
    "demo": {
        "id": "demo",
        "password": "demo123",
        "name": "Demo Agent",
        "role": "Demo AI Agent",
        "email": "[email protected]",
        "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Demo",
        "created_at": "2024-01-01T00:00:00Z",
    },
}


def generate_token() -> str:
    """Generate a random access token.

    Returns:
        str: Random token string
    """
    return secrets.token_urlsafe(32)


@router.post("/login", response_model=AuthResponse, status_code=status.HTTP_200_OK)
async def login(credentials: UserLogin) -> AuthResponse:
    """Authenticate user with username and password.

    This endpoint validates user credentials and returns an access token
    for authenticated sessions.

    Args:
        credentials: User login credentials (username and password)

    Returns:
        AuthResponse: Authentication response with access token

    Raises:
        HTTPException: If credentials are invalid (401)

    Example:
        POST /api/auth/login
        {
            "username": "Unit-734",
            "password": "password123"
        }
    """
    try:
        logger.info(f"Login attempt for user: {credentials.username}")

        # Check if user exists
        user = USERS_DB.get(credentials.username)

        if not user:
            logger.warning(f"User not found: {credentials.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
            )

        # Verify password (in production, use secure password hashing)
        if user["password"] != credentials.password:
            logger.warning(f"Invalid password for user: {credentials.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
            )

        # Generate access token
        access_token = generate_token()

        logger.info(f"User logged in successfully: {credentials.username}")

        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=user["id"],
            name=user["name"],
            role=user["role"],
            is_guest=False,
            avatar_url=user.get("avatar_url"),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again later.",
        ) from e


@router.post(
    "/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED
)
async def register(user_data: UserRegister) -> AuthResponse:
    """Register a new user account.

    This endpoint creates a new user account and returns an access token
    for immediate authentication.

    Args:
        user_data: User registration data

    Returns:
        AuthResponse: Authentication response with access token

    Raises:
        HTTPException: If username already exists (409)

    Example:
        POST /api/auth/register
        {
            "agent_id": "NewAgent-123",
            "email": "[email protected]",
            "password": "secure_password"
        }
    """
    try:
        logger.info(f"Registration attempt for agent: {user_data.agent_id}")

        # Check if user already exists
        if user_data.agent_id in USERS_DB:
            logger.warning(f"Agent ID already exists: {user_data.agent_id}")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Agent ID already registered. Please choose a different ID.",
            )

        # Create new user (in production, hash the password)
        new_user = {
            "id": user_data.agent_id,
            "password": user_data.password,  # Hash this in production!
            "name": user_data.agent_id,
            "role": "AI Agent",
            "email": user_data.email,
            "avatar_url": f"https://api.dicebear.com/7.x/bottts/svg?seed={user_data.agent_id}",
            "created_at": datetime.utcnow().isoformat() + "Z",
        }

        # Store user (in production, save to database)
        USERS_DB[user_data.agent_id] = new_user

        # Generate access token
        access_token = generate_token()

        logger.info(f"User registered successfully: {user_data.agent_id}")

        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=new_user["id"],
            name=new_user["name"],
            role=new_user["role"],
            is_guest=False,
            avatar_url=new_user["avatar_url"],
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed. Please try again later.",
        ) from e


@router.post("/guest", response_model=AuthResponse, status_code=status.HTTP_200_OK)
async def guest_login(session: GuestSession) -> AuthResponse:
    """Create a guest session for preview access.

    This endpoint creates a temporary guest session without requiring
    full registration, allowing users to explore the platform.

    Args:
        session: Optional guest session data

    Returns:
        AuthResponse: Authentication response with guest token

    Example:
        POST /api/auth/guest
        {}
    """
    try:
        logger.info("Guest login request")

        # Generate unique guest ID
        guest_id = f"guest-{secrets.token_hex(4)}"

        # Generate access token
        access_token = generate_token()

        logger.info(f"Guest session created: {guest_id}")

        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=guest_id,
            name="Guest User",
            role="Preview Mode",
            is_guest=True,
            avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=Guest",
        )

    except Exception as e:
        logger.error(f"Guest login error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create guest session. Please try again later.",
        ) from e


@router.get("/profile/{user_id}", response_model=UserProfile, status_code=status.HTTP_200_OK)
async def get_profile(user_id: str) -> UserProfile:
    """Get user profile information.

    Args:
        user_id: User unique identifier

    Returns:
        UserProfile: User profile data

    Raises:
        HTTPException: If user not found (404)
    """
    try:
        logger.info(f"Profile request for user: {user_id}")

        # Handle guest users
        if user_id.startswith("guest-"):
            return UserProfile(
                id=user_id,
                name="Guest User",
                role="Preview Mode",
                email=None,
                avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=Guest",
                created_at=None,
            )

        # Get user from database
        user = USERS_DB.get(user_id)

        if not user:
            logger.warning(f"User not found: {user_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return UserProfile(
            id=user["id"],
            name=user["name"],
            role=user["role"],
            email=user.get("email"),
            avatar_url=user.get("avatar_url"),
            created_at=user.get("created_at"),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Profile retrieval error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve profile. Please try again later.",
        ) from e


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout() -> JSONResponse:
    """Logout user session.

    This endpoint invalidates the current session token.
    In production, this would revoke the JWT token.

    Returns:
        JSONResponse: Success message
    """
    logger.info("Logout request")

    return JSONResponse(
        content={
            "message": "Logged out successfully",
            "status": "ok",
        }
    )
