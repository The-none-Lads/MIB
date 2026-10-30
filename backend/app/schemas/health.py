from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Schema for health status endpoint response."""

    status: str = Field(default="healthy", description="Application operational status")
    version: str = Field(default="1.0.0", description="Semantic service version")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Current UTC timestamp",
    )
    environment: Optional[str] = Field(default=None, description="Current deployment environment")
