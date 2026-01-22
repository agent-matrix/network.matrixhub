"""Catalog Export Endpoints for Matrix-Hub Integration.

This module provides public, read-only endpoints that expose the entity catalog
in a format compatible with Matrix-Hub ingestion. These endpoints allow Matrix-Hub
to ingest network.matrixhub as a remote catalog.

Public Surface (safe, no authentication required):
- GET /catalog/index.json - List of manifest URLs (Matrix-Hub ingestable)
- GET /catalog/entities/{uid}/manifest.json - Per-entity manifest

Author:
    Ruslan Magana (ruslanmv.com)

License:
    Apache 2.0
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_db
from app.models.entity import Entity

router = APIRouter(prefix="/catalog", tags=["catalog-export"])


@router.get("/index.json", status_code=status.HTTP_200_OK)
def catalog_index(db: Session = Depends(get_db)) -> JSONResponse:
    """Public catalog index compatible with Matrix-Hub ingest.

    Matrix-Hub supports shapes like:
        {"items": [{"manifest_url": "https://.../manifest.json"}, ...]}

    This endpoint provides a list of all entity manifest URLs that Matrix-Hub
    can use to ingest the catalog.

    Args:
        db: Database session dependency.

    Returns:
        JSONResponse: List of manifest URLs in Matrix-Hub compatible format.

    Example:
        >>> # GET /catalog/index.json
        >>> # Response:
        >>> {
        ...     "items": [
        ...         {"manifest_url": "https://network.matrixhub.io/catalog/entities/agent-123/manifest.json"},
        ...         {"manifest_url": "https://network.matrixhub.io/catalog/entities/tool-456/manifest.json"}
        ...     ]
        ... }
    """
    settings = get_settings()
    base = settings.PUBLIC_BASE_URL.rstrip("/")

    rows = db.execute(select(Entity.uid)).scalars().all()
    items = [
        {"manifest_url": f"{base}/catalog/entities/{uid}/manifest.json"}
        for uid in rows
    ]
    return JSONResponse({"items": items})


@router.get("/entities/{uid}/manifest.json", status_code=status.HTTP_200_OK)
def entity_manifest(uid: str, db: Session = Depends(get_db)) -> JSONResponse:
    """Public manifest endpoint per entity.

    JSON is valid YAML, so Matrix-Hub can parse it. This endpoint returns
    a normalized manifest shape that Matrix-Hub ingestion expects.

    Args:
        uid: Unique identifier of the entity.
        db: Database session dependency.

    Returns:
        JSONResponse: Entity manifest in Matrix-Hub compatible format.

    Raises:
        HTTPException: 404 if entity not found.

    Example:
        >>> # GET /catalog/entities/agent-123/manifest.json
        >>> # Response:
        >>> {
        ...     "type": "agent",
        ...     "id": "agent-123",
        ...     "version": "1.0.0",
        ...     "name": "Data Analyst Agent",
        ...     "summary": "An AI agent for data analysis",
        ...     ...
        ... }
    """
    row = db.get(Entity, uid)
    if not row:
        raise HTTPException(status_code=404, detail="entity not found")

    # Normalize to the manifest shape Matrix-Hub ingestion expects
    manifest = {
        "type": row.type,
        "id": row.uid,
        "version": row.version,
        "name": row.name,
        "summary": row.summary,
        "description": row.description,
        "license": row.license,
        "homepage": row.homepage,
        "source_url": row.source_url,
        "capabilities": row.capabilities,
        "frameworks": row.frameworks,
        "providers": row.providers,
        "protocols": row.protocols,
        # Preserve protocol-specific payload
        "artifacts": row.manifests or {},
    }
    return JSONResponse(manifest)
