from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import String, cast, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entity import Entity
from app.schemas.entity import EntityRead, EntitySearchItem

router = APIRouter(prefix="/entities", tags=["entities"])


@router.get("", response_model=List[EntitySearchItem])
def list_entities(
    db: Session = Depends(get_db),
    q: Optional[str] = Query(None, description="Free-text name/summary search (simple LIKE for now)."),
    type: Optional[str] = Query(None, description="Filter by entity type: agent | tool | mcp_server"),
    protocol: Optional[str] = Query(None, description="Filter by protocol tag, e.g. a2a@1.0"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> List[EntitySearchItem]:
    stmt = select(Entity)

    if type:
        stmt = stmt.where(Entity.type == type)
    if q:
        pattern = f"%{q}%"
        stmt = stmt.where((Entity.name.ilike(pattern)) | (Entity.summary.ilike(pattern)))
    if protocol:
        # naive JSON str match; production can switch to GIN index
        pattern = f"%{protocol}%"
        stmt = stmt.where(Entity.protocols.cast(String).ilike(pattern))

    stmt = stmt.order_by(Entity.quality_score.desc(), Entity.created_at.desc()).offset(offset).limit(limit)

    rows = db.execute(stmt).scalars().all()
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


@router.get("/{uid}", response_model=EntityRead)
def get_entity(uid: str, db: Session = Depends(get_db)) -> EntityRead:
    row = db.get(Entity, uid)
    if not row:
        raise HTTPException(status_code=404, detail="Entity not found")

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
