import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import GUID
from app.models.base import Base, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.agent import Agent
    from app.models.card import AgentCard


class ScanEvent(Base, UUIDPrimaryKeyMixin):
    """Analytics record logged when an agent's card or public profile is accessed."""

    __tablename__ = "scan_events"

    agent_id: Mapped[uuid.UUID] = mapped_column(
        GUID,
        ForeignKey("agents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    card_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID,
        ForeignKey("agent_cards.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    source: Mapped[str] = mapped_column(
        String(32), default="unknown", nullable=False
    )  # nfc, qr, direct, unknown
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    agent: Mapped["Agent"] = relationship("Agent", back_populates="scans")
    card: Mapped[Optional["AgentCard"]] = relationship("AgentCard", back_populates="scans")
