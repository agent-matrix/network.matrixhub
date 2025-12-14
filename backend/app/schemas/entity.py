from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class EntityBase(BaseModel):
    id: str
    type: str
    name: str
    version: str

    summary: Optional[str] = None
    description: Optional[str] = None

    capabilities: List[str] = Field(default_factory=list)
    frameworks: List[str] = Field(default_factory=list)
    providers: List[str] = Field(default_factory=list)

    license: Optional[str] = None
    homepage: Optional[str] = None
    source_url: Optional[str] = None

    quality_score: float = 0.0
    release_ts: Optional[datetime] = None

    readme_blob_ref: Optional[str] = None

    created_at: datetime
    updated_at: datetime


class EntityRead(EntityBase):
    """Rich DTO for LinkedIn-style profile.

    Exposes protocol markers and protocol-native manifests.
    """

    protocols: List[str] = Field(default_factory=list)
    manifests: Optional[Dict[str, Any]] = None


class EntitySearchItem(BaseModel):
    id: str
    type: str
    name: str
    version: str
    summary: str = ""

    capabilities: List[str] = Field(default_factory=list)
    frameworks: List[str] = Field(default_factory=list)
    providers: List[str] = Field(default_factory=list)

    score: float = 0.0  # placeholder; you can wire semantic ranking later
