import uuid
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import GUID
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.agent import Agent


class Dossier(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Classified and unclassified dossier files associated with an agent."""

    __tablename__ = "dossiers"

    agent_id: Mapped[uuid.UUID] = mapped_column(
        GUID,
        ForeignKey("agents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    classification: Mapped[str] = mapped_column(
        String(32), default="CONFIDENTIAL", nullable=False
    )  # PUBLIC, CONFIDENTIAL, SECRET, TOP SECRET
    visibility: Mapped[str] = mapped_column(
        String(32), default="ADMIN_ONLY", nullable=False
    )  # PUBLIC, ADMIN_ONLY

    # Relationship
    agent: Mapped["Agent"] = relationship("Agent", back_populates="dossiers")
