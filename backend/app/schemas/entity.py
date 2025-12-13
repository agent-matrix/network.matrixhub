"""Pydantic Schemas for Entity API Requests and Responses.

This module defines Pydantic models (schemas) for validating and serializing
entity data in API requests and responses. These schemas ensure type safety
and automatic validation of all entity-related API operations.

Author:
    Ruslan Magana (ruslanmv.com)

License:
    Apache 2.0
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, ConfigDict


class EntityBase(BaseModel):
    """Base schema for entity data with common fields.

    This schema contains fields that are shared across all entity-related
    schemas, providing a consistent structure for entity data.

    Attributes:
        id: Unique identifier for the entity.
        type: Entity type (agent, tool, mcp_server).
        name: Human-readable entity name.
        version: Semantic version string.
        summary: Brief one-line description.
        description: Detailed multi-line description.
        capabilities: List of entity capabilities.
        frameworks: List of frameworks used.
        providers: List of AI providers supported.
        license: Software license identifier.
        homepage: URL to entity homepage.
        source_url: URL to source code repository.
        quality_score: Computed quality score (0.0-100.0).
        release_ts: Timestamp of latest release.
        readme_blob_ref: Reference to README content.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    model_config = ConfigDict(from_attributes=True)

    id: str = Field(
        ...,
        description="Unique identifier for the entity",
        examples=["agent-12345", "tool-data-analyzer"],
    )
    type: str = Field(
        ...,
        description="Entity type: agent, tool, or mcp_server",
        examples=["agent", "tool", "mcp_server"],
    )
    name: str = Field(
        ...,
        description="Human-readable entity name",
        examples=["Data Analyst Agent", "Web Scraper Tool"],
    )
    version: str = Field(
        ...,
        description="Semantic version string",
        examples=["1.0.0", "2.1.3"],
    )

    summary: Optional[str] = Field(
        None,
        description="Brief one-line description for display",
        examples=["An AI agent specialized in data analysis"],
    )
    description: Optional[str] = Field(
        None,
        description="Detailed description in Markdown format",
    )

    capabilities: List[str] = Field(
        default_factory=list,
        description="List of capabilities the entity provides",
        examples=[["planning", "reasoning", "data-analysis"]],
    )
    frameworks: List[str] = Field(
        default_factory=list,
        description="List of frameworks used",
        examples=[["langchain", "transformers", "fastapi"]],
    )
    providers: List[str] = Field(
        default_factory=list,
        description="List of AI providers supported",
        examples=[["openai", "anthropic", "huggingface"]],
    )

    license: Optional[str] = Field(
        None,
        description="SPDX license identifier",
        examples=["Apache-2.0", "MIT", "GPL-3.0"],
    )
    homepage: Optional[str] = Field(
        None,
        description="URL to entity homepage or documentation",
        examples=["https://example.com/agent"],
    )
    source_url: Optional[str] = Field(
        None,
        description="URL to source code repository",
        examples=["https://github.com/user/repo"],
    )

    quality_score: float = Field(
        0.0,
        ge=0.0,
        le=100.0,
        description="Computed quality score for ranking (0.0-100.0)",
    )
    release_ts: Optional[datetime] = Field(
        None,
        description="Timestamp of the latest release",
    )

    readme_blob_ref: Optional[str] = Field(
        None,
        description="Reference to README content blob",
    )

    created_at: datetime = Field(
        ...,
        description="Timestamp when entity was first created",
    )
    updated_at: datetime = Field(
        ...,
        description="Timestamp of the last update",
    )


class EntityRead(EntityBase):
    """Rich schema for LinkedIn-style entity profile with protocol support.

    This schema extends EntityBase to include protocol-specific metadata,
    making it suitable for displaying full entity profiles with A2A/MCP
    integration details.

    Attributes:
        protocols: List of supported protocols (e.g., ["a2a@1.0", "mcp@0.1"]).
        manifests: Protocol-specific manifest data as a dictionary.

    Example:
        >>> entity = EntityRead(
        ...     id="agent-12345",
        ...     type="agent",
        ...     name="Data Agent",
        ...     version="1.0.0",
        ...     protocols=["a2a@1.0"],
        ...     manifests={"a2a": {"endpoints": [...]}},
        ...     created_at=datetime.now(),
        ...     updated_at=datetime.now()
        ... )
    """

    protocols: List[str] = Field(
        default_factory=list,
        description="List of supported communication protocols",
        examples=[["a2a@1.0", "mcp@0.1"]],
    )
    manifests: Optional[Dict[str, Any]] = Field(
        None,
        description="Protocol-specific manifest data",
        examples=[{"a2a": {"endpoints": ["/chat"]}, "mcp": {"tools": ["search"]}}],
    )


class EntitySearchItem(BaseModel):
    """Lightweight schema for entity search results.

    This schema contains only the essential fields needed for search result
    listings, optimizing API response size and performance for large result sets.

    Attributes:
        id: Unique identifier for the entity.
        type: Entity type.
        name: Entity name.
        version: Version string.
        summary: Brief description.
        capabilities: List of capabilities.
        frameworks: List of frameworks.
        providers: List of providers.
        score: Search relevance score or quality score.

    Example:
        >>> item = EntitySearchItem(
        ...     id="agent-12345",
        ...     type="agent",
        ...     name="Data Agent",
        ...     version="1.0.0",
        ...     summary="Data analysis agent",
        ...     score=85.5
        ... )
    """

    model_config = ConfigDict(from_attributes=True)

    id: str = Field(
        ...,
        description="Unique identifier",
    )
    type: str = Field(
        ...,
        description="Entity type",
    )
    name: str = Field(
        ...,
        description="Entity name",
    )
    version: str = Field(
        ...,
        description="Version string",
    )
    summary: str = Field(
        "",
        description="Brief description",
    )

    capabilities: List[str] = Field(
        default_factory=list,
        description="List of capabilities",
    )
    frameworks: List[str] = Field(
        default_factory=list,
        description="List of frameworks",
    )
    providers: List[str] = Field(
        default_factory=list,
        description="List of providers",
    )

    score: float = Field(
        0.0,
        description="Search relevance or quality score",
    )


class EntityCreate(BaseModel):
    """Schema for creating a new entity.

    This schema defines the required and optional fields for entity creation
    requests. It excludes system-managed fields like timestamps.

    Attributes:
        uid: Unique identifier for the entity.
        type: Entity type.
        name: Entity name.
        version: Version string.
        summary: Brief description.
        description: Detailed description.
        And all other entity fields...

    Example:
        >>> create_data = EntityCreate(
        ...     uid="agent-new",
        ...     type="agent",
        ...     name="New Agent",
        ...     version="1.0.0",
        ...     summary="A brand new agent"
        ... )
    """

    model_config = ConfigDict(from_attributes=True)

    uid: str = Field(..., description="Unique identifier")
    type: str = Field(..., description="Entity type")
    name: str = Field(..., description="Entity name")
    version: str = Field(..., description="Version string")
    summary: Optional[str] = None
    description: Optional[str] = None
    license: Optional[str] = None
    homepage: Optional[str] = None
    source_url: Optional[str] = None
    capabilities: List[str] = Field(default_factory=list)
    frameworks: List[str] = Field(default_factory=list)
    providers: List[str] = Field(default_factory=list)
    protocols: List[str] = Field(default_factory=list)
    manifests: Optional[Dict[str, Any]] = None
    quality_score: float = Field(default=0.0, ge=0.0, le=100.0)
