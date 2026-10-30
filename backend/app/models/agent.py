import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Boolean, Date, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.card import AgentCard
    from app.models.dossier import Dossier
    from app.models.mission import MissionRecord
    from app.models.scan import ScanEvent


class Agent(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Core personnel entity for MIB agents."""

    __tablename__ = "agents"

    # Identity & public handle
    slug: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    real_name: Mapped[str] = mapped_column(String(255), nullable=False)  # CONFIDENTIAL: Never expose publicly
    codename: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    agent_number: Mapped[str] = mapped_column(String(32), unique=True, index=True, nullable=False)

    # Organizational hierarchy
    rank: Mapped[str] = mapped_column(String(64), nullable=False)
    division: Mapped[str] = mapped_column(String(64), nullable=False)
    clearance_level: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)  # active, retired, missing, suspended

    # Profile & lore
    photograph_path: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    specialization: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    biography: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    signature_quote: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    recruitment_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    # Visibility & lifecycle flags
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    show_in_directory: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    archived_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    cards: Mapped[List["AgentCard"]] = relationship(
        "AgentCard",
        back_populates="agent",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    dossiers: Mapped[List["Dossier"]] = relationship(
        "Dossier",
        back_populates="agent",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    missions: Mapped[List["MissionRecord"]] = relationship(
        "MissionRecord",
        back_populates="agent",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    scans: Mapped[List["ScanEvent"]] = relationship(
        "ScanEvent",
        back_populates="agent",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
