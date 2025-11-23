from __future__ import annotations

from datetime import datetime
from typing import Any, List, Optional

from sqlalchemy import JSON, Column, DateTime, Float, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Entity(Base):
    __tablename__ = "entity"

    uid: Mapped[str] = mapped_column(String, primary_key=True)
    type: Mapped[str] = mapped_column(String, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    version: Mapped[str] = mapped_column(String, nullable=False)

    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    license: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    homepage: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    source_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    capabilities: Mapped[List[str]] = mapped_column(JSON, default=list)
    frameworks: Mapped[List[str]] = mapped_column(JSON, default=list)
    providers: Mapped[List[str]] = mapped_column(JSON, default=list)

    # A2A-ready metadata (mirrors MatrixHub core schema, but optional here)
    protocols: Mapped[List[str]] = mapped_column(JSON, default=list)
    manifests: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON, nullable=True)

    readme_blob_ref: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    quality_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    release_ts: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
