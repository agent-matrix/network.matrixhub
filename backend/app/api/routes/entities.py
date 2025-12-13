"""API Routes for Entity Management.

This module defines FastAPI route handlers for entity-related operations,
including listing, searching, and retrieving individual entity profiles.

Author:
    Ruslan Magana (ruslanmv.com)

License:
    Apache 2.0
"""

from __future__ import annotations

import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import String, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entity import Entity
from app.schemas.entity import EntityRead, EntitySearchItem

# Configure module logger
logger = logging.getLogger(__name__)

# Create API router for entity endpoints
router = APIRouter(prefix="/entities", tags=["entities"])


@router.get("", response_model=List[EntitySearchItem], status_code=status.HTTP_200_OK)
def list_entities(
    db: Session = Depends(get_db),
    q: Optional[str] = Query(
        None,
        description="Free-text search query for name/summary (case-insensitive)",
        min_length=1,
        max_length=200,
    ),
    type: Optional[str] = Query(
        None,
        description="Filter by entity type: agent | tool | mcp_server",
    ),
    protocol: Optional[str] = Query(
        None,
        description="Filter by protocol tag (e.g., a2a@1.0, mcp@0.1)",
        max_length=50,
    ),
    limit: int = Query(
        20,
        ge=1,
        le=100,
        description="Maximum number of results to return",
    ),
    offset: int = Query(
        0,
        ge=0,
        description="Number of results to skip (for pagination)",
    ),
) -> List[EntitySearchItem]:
    """List and search entities with optional filtering.

    This endpoint provides a searchable, filterable list of entities (agents,
    tools, MCP servers) from the MatrixHub catalog. Results are ranked by
    quality score and creation date.

    Args:
        db: Database session (injected by FastAPI).
        q: Optional search query string for name/summary.
        type: Optional filter for entity type.
        protocol: Optional filter for protocol support.
        limit: Maximum number of results (1-100).
        offset: Pagination offset.

    Returns:
        List[EntitySearchItem]: List of matching entities with basic info.

    Raises:
        HTTPException: If database query fails or parameters are invalid.

    Example:
        GET /api/entities?q=data&type=agent&limit=10
        Returns up to 10 agents matching "data" in name or summary.
    """
    try:
        logger.info(
            f"Listing entities: q={q}, type={type}, protocol={protocol}, "
            f"limit={limit}, offset={offset}"
        )

        # Build base query
        stmt = select(Entity)

        # Apply filters
        if type:
            stmt = stmt.where(Entity.type == type)
            logger.debug(f"Filtered by type: {type}")

        if q:
            pattern = f"%{q}%"
            stmt = stmt.where(
                (Entity.name.ilike(pattern)) | (Entity.summary.ilike(pattern))
            )
            logger.debug(f"Filtered by search query: {q}")

        if protocol:
            # Naive JSON string match; production can use GIN index
            pattern = f"%{protocol}%"
            stmt = stmt.where(Entity.protocols.cast(String).ilike(pattern))
            logger.debug(f"Filtered by protocol: {protocol}")

        # Order by quality score (desc) and creation date (desc)
        stmt = (
            stmt.order_by(Entity.quality_score.desc(), Entity.created_at.desc())
            .offset(offset)
            .limit(limit)
        )

        # Execute query
        rows = db.execute(stmt).scalars().all()
        logger.info(f"Found {len(rows)} entities")

        # Convert to response schema
        return [
            EntitySearchItem(
                id=row.uid,
                type=row.type,
                name=row.name,
                version=row.version,
                summary=row.summary or "",
                capabilities=row.capabilities or [],
                frameworks=row.frameworks or [],
                providers=row.providers or [],
                score=float(row.quality_score or 0.0),
            )
            for row in rows
        ]

    except Exception as e:
        logger.error(f"Error listing entities: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve entities. Please try again later.",
        ) from e


@router.get(
    "/{uid}",
    response_model=EntityRead,
    status_code=status.HTTP_200_OK,
    responses={
        404: {"description": "Entity not found"},
        500: {"description": "Internal server error"},
    },
)
def get_entity(
    uid: str,
    db: Session = Depends(get_db),
) -> EntityRead:
    """Get detailed information for a specific entity.

    This endpoint retrieves the full profile of an entity, including all metadata,
    protocols, manifests, and capability information. It's designed for the
    LinkedIn-style entity detail page.

    Args:
        uid: Unique identifier of the entity to retrieve.
        db: Database session (injected by FastAPI).

    Returns:
        EntityRead: Complete entity profile with all fields.

    Raises:
        HTTPException:
            - 404: Entity not found
            - 500: Database or internal error

    Example:
        GET /api/entities/agent-12345
        Returns the full profile for agent with uid "agent-12345".
    """
    try:
        logger.info(f"Retrieving entity: {uid}")

        # Query database for entity
        row = db.get(Entity, uid)

        if not row:
            logger.warning(f"Entity not found: {uid}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Entity with uid '{uid}' not found",
            )

        logger.info(f"Entity found: {uid} (type={row.type}, name={row.name})")

        # Convert to response schema
        return EntityRead(
            id=row.uid,
            type=row.type,
            name=row.name,
            version=row.version,
            summary=row.summary,
            description=row.description,
            capabilities=row.capabilities or [],
            frameworks=row.frameworks or [],
            providers=row.providers or [],
            license=row.license,
            homepage=row.homepage,
            source_url=row.source_url,
            quality_score=float(row.quality_score or 0.0),
            release_ts=row.release_ts,
            readme_blob_ref=row.readme_blob_ref,
            created_at=row.created_at,
            updated_at=row.updated_at,
            protocols=row.protocols or [],
            manifests=row.manifests or None,
        )

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error retrieving entity {uid}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve entity. Please try again later.",
        ) from e
