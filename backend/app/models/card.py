import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import GUID
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.agent import Agent
    from app.models.scan import ScanEvent


class AgentCard(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Physical NFC card inventory tracked independently from agent personnel."""

    __tablename__ = "agent_cards"

    card_uid: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    label: Mapped[str] = mapped_column(String(128), nullable=False)
    agent_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID,
        ForeignKey("agents.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    card_type: Mapped[str] = mapped_column(String(32), default="NTAG215", nullable=False)
    status: Mapped[str] = mapped_column(
        String(32), default="available", nullable=False
    )  # available, active, revoked, lost, retired
    assigned_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    agent: Mapped[Optional["Agent"]] = relationship("Agent", back_populates="cards")
    scans: Mapped[List["ScanEvent"]] = relationship(
        "ScanEvent", back_populates="card", cascade="all, delete-orphan"
    )
