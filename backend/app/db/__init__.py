"""Database Module for SQLAlchemy ORM.

This module provides database connectivity, session management, and ORM
base classes for the Network MatrixHub backend.

Author:
    Ruslan Magana (ruslanmv.com)

License:
    Apache 2.0
"""

from app.db.session import engine, get_db, SessionLocal

__all__ = ["engine", "get_db", "SessionLocal"]
