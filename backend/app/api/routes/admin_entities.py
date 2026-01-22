"""Admin Entity Endpoints for Operator Publishing.

This module provides operator-only (admin) endpoints for creating and updating
entities in the catalog. These endpoints are protected by bearer token authentication
and are used for publishing workflows.

Admin Surface (operator token required):
- POST /api/admin/entities/upsert - Create or update an entity
- POST /api/admin/entities/sync-to-hub - Trigger Matrix-Hub ingestion

Author:
    Ruslan Magana (ruslanmv.com)

License:
    Apache 2.0
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_db
from app.models.entity import Entity
from app.security.operator_token import require_operator_token

router = APIRouter(prefix="/admin/entities", tags=["admin-entities"])


@router.post(
    "/upsert",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_operator_token)],
)
def upsert_entity(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """Operator-only: create or update an entity and its manifest payload.

    This endpoint allows operators to publish or update agent/tool/server records
    in the catalog. The entity is identified by its ID; if it exists, it will be
    updated; otherwise, a new entity will be created.

    Args:
        payload: Entity data including at least: id, type, name, version.
        db: Database session dependency.

    Returns:
        dict: Confirmation with entity ID and update status.

    Raises:
        HTTPException: 400 if required fields are missing.
        HTTPException: 401 if operator token is invalid.

    Example:
        >>> # POST /api/admin/entities/upsert
        >>> # Headers: Authorization: Bearer <OPERATOR_TOKEN>
        >>> # Body:
        >>> {
        ...     "id": "agent-123",
        ...     "type": "agent",
        ...     "name": "Data Analyst Agent",
        ...     "version": "1.0.0",
        ...     "summary": "An AI agent for data analysis",
        ...     "capabilities": ["data-analysis", "visualization"],
        ...     "protocols": ["a2a@1.0"]
        ... }
    """
    eid = payload.get("id")
    etype = payload.get("type")
    name = payload.get("name")
    version = payload.get("version")

    if not all([eid, etype, name, version]):
        raise HTTPException(
            status_code=400,
            detail="missing required fields: id, type, name, version",
        )

    row = db.get(Entity, eid)
    now = datetime.now(timezone.utc)

    if not row:
        row = Entity(
            uid=eid,
            type=etype,
            name=name,
            version=version,
            created_at=now,
            updated_at=now,
        )
        db.add(row)
    else:
        row.type = etype
        row.name = name
        row.version = version
        row.updated_at = now

    # Update optional fields (non-destructive: only set what is provided)
    if "summary" in payload:
        row.summary = payload.get("summary")
    if "description" in payload:
        row.description = payload.get("description")
    if "license" in payload:
        row.license = payload.get("license")
    if "homepage" in payload:
        row.homepage = payload.get("homepage")
    if "source_url" in payload:
        row.source_url = payload.get("source_url")
    if "capabilities" in payload:
        row.capabilities = payload.get("capabilities") or []
    if "frameworks" in payload:
        row.frameworks = payload.get("frameworks") or []
    if "providers" in payload:
        row.providers = payload.get("providers") or []
    if "protocols" in payload:
        row.protocols = payload.get("protocols") or []
    if "artifacts" in payload or "manifests" in payload:
        row.manifests = payload.get("artifacts") or payload.get("manifests") or {}

    db.commit()

    return {"ok": True, "id": eid, "updated": True}


@router.post(
    "/sync-to-hub",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_operator_token)],
)
async def sync_to_matrix_hub(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Operator-only: trigger Matrix-Hub to ingest this portal's catalog index.

    This endpoint triggers the Matrix-Hub ingestion endpoint to fetch and process
    the catalog index from this portal. Requires MATRIX_HUB_BASE and MATRIX_HUB_TOKEN
    to be configured.

    Args:
        db: Database session dependency (unused but kept for consistency).

    Returns:
        dict: Status of the ingestion trigger.

    Example:
        >>> # POST /api/admin/entities/sync-to-hub
        >>> # Headers: Authorization: Bearer <OPERATOR_TOKEN>
        >>> # Response (success):
        >>> {"ok": True, "status": 200, "body": "..."}
        >>> # Response (not configured):
        >>> {"ok": False, "skipped": True, "reason": "MATRIX_HUB_BASE not set"}
    """
    settings = get_settings()

    if not settings.MATRIX_HUB_BASE:
        return {"ok": False, "skipped": True, "reason": "MATRIX_HUB_BASE not set"}
    if not settings.MATRIX_HUB_TOKEN:
        return {"ok": False, "skipped": True, "reason": "MATRIX_HUB_TOKEN not set"}

    index_url = f"{settings.PUBLIC_BASE_URL.rstrip('/')}/catalog/index.json"
    hub = settings.MATRIX_HUB_BASE.rstrip("/")

    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(
            f"{hub}/catalog/ingest",
            json={"url": index_url},
            headers={"Authorization": f"Bearer {settings.MATRIX_HUB_TOKEN}"},
        )
        return {"ok": r.status_code < 400, "status": r.status_code, "body": r.text}
