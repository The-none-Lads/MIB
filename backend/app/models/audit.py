import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import GUID
from app.models.base import Base, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.user import AdminUser


class AuditLog(Base, UUIDPrimaryKeyMixin):
    """Audit trail for all administrative actions and changes."""

    __tablename__ = "audit_logs"

    admin_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID,
        ForeignKey("admin_users.id", ondelete="SET NULL"),
        nullable=True,
    )
    action: Mapped[str] = mapped_column(String(64), nullable=False)
    target_type: Mapped[str] = mapped_column(String(64), nullable=False)
    target_id: Mapped[str] = mapped_column(String(64), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    metadata_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationship
    admin: Mapped[Optional["AdminUser"]] = relationship("AdminUser", back_populates="audit_logs")
