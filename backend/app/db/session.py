"""Database Session Management.

This module provides database connection and session management using SQLAlchemy.
It configures the database engine, session factory, and provides a dependency
injection function for FastAPI route handlers.

Author:
    Ruslan Magana (ruslanmv.com)

License:
    Apache 2.0
"""

from __future__ import annotations

import logging
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings

# Configure module logger
logger = logging.getLogger(__name__)

# Database engine configuration
# pool_pre_ping=True ensures connections are validated before use
# This prevents "MySQL server has gone away" and similar errors
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    # Use StaticPool for SQLite to avoid threading issues
    poolclass=StaticPool if "sqlite" in settings.DATABASE_URL else None,
    echo=settings.APP_DEBUG,  # Log SQL queries in debug mode
)

# Session factory for creating database sessions
# autocommit=False: Transactions must be explicitly committed
# autoflush=False: Changes are not automatically flushed to the database
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
)


def get_db() -> Generator[Session, None, None]:
    """Provide a database session for dependency injection.

    This function creates a new database session and ensures it is properly
    closed after use, even if an exception occurs. It's designed to be used
    as a FastAPI dependency.

    Yields:
        Session: An active SQLAlchemy database session.

    Raises:
        SQLAlchemyError: If there's an error creating or using the session.

    Example:
        >>> from fastapi import Depends
        >>> @app.get("/items")
        >>> def get_items(db: Session = Depends(get_db)):
        ...     return db.query(Item).all()
    """
    db = SessionLocal()
    try:
        logger.debug("Database session created")
        yield db
    except SQLAlchemyError as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()
        logger.debug("Database session closed")
