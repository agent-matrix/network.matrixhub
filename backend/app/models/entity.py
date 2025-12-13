"""Database Models for Entity Management.

This module defines SQLAlchemy ORM models for the entity table, which stores
information about AI agents, tools, and MCP servers in the MatrixHub catalog.

Author:
    Ruslan Magana (ruslanmv.com)

License:
    Apache 2.0
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, List, Optional

from sqlalchemy import JSON, DateTime, Float, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models.

    This class serves as the foundation for all database models in the application,
    providing common functionality and configuration.
    """

    pass


class Entity(Base):
    """Database model representing an AI agent, tool, or MCP server.

    This model stores comprehensive information about entities in the MatrixHub
    catalog, including metadata, capabilities, protocols, and quality metrics.

    The entity table is designed to support:
    - Multiple entity types (agents, tools, MCP servers)
    - Protocol-agnostic communication (A2A, MCP, etc.)
    - Searchable capabilities and frameworks
    - Quality scoring and version tracking

    Attributes:
        uid: Unique identifier for the entity (primary key).
        type: Entity type (e.g., "agent", "tool", "mcp_server").
        name: Human-readable name of the entity.
        version: Semantic version string (e.g., "1.0.0").
        summary: Brief one-line description.
        description: Detailed multi-line description in Markdown.
        license: Software license identifier (e.g., "Apache-2.0").
        homepage: URL to the entity's homepage or documentation.
        source_url: URL to the entity's source code repository.
        capabilities: List of capabilities/features the entity provides.
        frameworks: List of frameworks the entity is built with.
        providers: List of AI providers the entity supports.
        protocols: List of communication protocols (e.g., ["a2a@1.0", "mcp@0.1"]).
        manifests: Protocol-specific manifest data as JSON.
        readme_blob_ref: Reference to README content blob.
        quality_score: Computed quality score (0.0 to 100.0).
        release_ts: Timestamp of the latest release.
        created_at: Timestamp when the entity was first created.
        updated_at: Timestamp of the last update.

    Example:
        >>> entity = Entity(
        ...     uid="agent-12345",
        ...     type="agent",
        ...     name="Data Analyst Agent",
        ...     version="1.0.0",
        ...     summary="An AI agent specialized in data analysis",
        ...     quality_score=85.5
        ... )
    """

    __tablename__ = "entity"

    # Primary identifiers
    uid: Mapped[str] = mapped_column(
        String,
        primary_key=True,
        doc="Unique identifier for the entity",
    )
    type: Mapped[str] = mapped_column(
        String,
        nullable=False,
        index=True,
        doc="Entity type: agent, tool, or mcp_server",
    )
    name: Mapped[str] = mapped_column(
        String,
        nullable=False,
        index=True,
        doc="Human-readable entity name",
    )
    version: Mapped[str] = mapped_column(
        String,
        nullable=False,
        doc="Semantic version string (e.g., 1.0.0)",
    )

    # Descriptive content
    summary: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        doc="Brief one-line description for search and display",
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        doc="Detailed description in Markdown format",
    )

    # Metadata and links
    license: Mapped[Optional[str]] = mapped_column(
        String,
        nullable=True,
        doc="SPDX license identifier (e.g., Apache-2.0, MIT)",
    )
    homepage: Mapped[Optional[str]] = mapped_column(
        String,
        nullable=True,
        doc="URL to entity homepage or documentation",
    )
    source_url: Mapped[Optional[str]] = mapped_column(
        String,
        nullable=True,
        doc="URL to source code repository",
    )

    # Searchable arrays for filtering and discovery
    capabilities: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        doc="List of capabilities (e.g., ['planning', 'reasoning'])",
    )
    frameworks: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        doc="List of frameworks (e.g., ['langchain', 'transformers'])",
    )
    providers: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        doc="List of AI providers (e.g., ['openai', 'anthropic'])",
    )

    # Protocol and integration support (A2A-ready)
    protocols: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        doc="Supported protocols (e.g., ['a2a@1.0', 'mcp@0.1'])",
    )
    manifests: Mapped[Optional[dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
        doc="Protocol-specific manifest data as JSON",
    )

    # Content references
    readme_blob_ref: Mapped[Optional[str]] = mapped_column(
        String,
        nullable=True,
        doc="Reference to README content blob storage",
    )

    # Quality metrics
    quality_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
        index=True,
        doc="Computed quality score (0.0-100.0) for ranking",
    )

    # Timestamps
    release_ts: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        doc="Timestamp of the latest release",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
        doc="Timestamp when entity was first created",
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        doc="Timestamp of the last update",
    )

    def __repr__(self) -> str:
        """Return a string representation of the Entity.

        Returns:
            str: A developer-friendly string representation.
        """
        return f"<Entity uid={self.uid} type={self.type} name={self.name} v={self.version}>"
