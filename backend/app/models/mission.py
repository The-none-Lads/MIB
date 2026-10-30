import uuid
from datetime import date
from typing import TYPE_CHECKING, Optional
from sqlalchemy import Date, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import GUID
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.agent import Agent


class MissionRecord(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Field mission records associated with an agent."""

    __tablename__ = "mission_records"

    agent_id: Mapped[uuid.UUID] = mapped_column(
        GUID,
        ForeignKey("agents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    mission_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    outcome: Mapped[str] = mapped_column(
        String(64), default="SUCCESS", nullable=False
    )  # SUCCESS, COMPROMISED, PENDING, CLASSIFIED
    classification: Mapped[str] = mapped_column(
        String(32), default="CONFIDENTIAL", nullable=False
    )
    visibility: Mapped[str] = mapped_column(
        String(32), default="ADMIN_ONLY", nullable=False
    )

    # Relationship
    agent: Mapped["Agent"] = relationship("Agent", back_populates="missions")
