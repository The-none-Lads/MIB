import uuid
from datetime import date, datetime
from typing import Any, Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator


class PublicAgentSummary(BaseModel):
    """Publicly visible directory summary for an agent.
    
    SECURITY INVARIANT:
    real_name, internal database IDs, and administrative state are strictly forbidden.
    """

    model_config = ConfigDict(from_attributes=True, extra="forbid")

    slug: str = Field(..., description="Canonical URL identifier")
    codename: str = Field(..., description="Public operative codename")
    agent_number: str = Field(..., description="Formatted MIB personnel identifier")
    rank: str = Field(..., description="Agent rank within MIB")
    division: str = Field(..., description="Operational division")
    clearance_level: str = Field(..., description="Assigned clearance rating")
    status: str = Field(..., description="Current operational status")
    photograph_url: Optional[str] = Field(default=None, description="Public profile photo URL")
    specialization: Optional[str] = Field(default=None, description="Field specialization")
    recruitment_date: Optional[date] = Field(default=None, description="Date of recruitment")

    @model_validator(mode="before")
    @classmethod
    def populate_photograph_url(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "photograph_url" not in data or data["photograph_url"] is None:
                data["photograph_url"] = data.get("photograph_path")
            return data
        # Handle ORM instances
        if hasattr(data, "photograph_path") and (not hasattr(data, "photograph_url") or getattr(data, "photograph_url", None) is None):
            setattr(data, "photograph_url", getattr(data, "photograph_path", None))
        return data


class PublicAgentDetail(BaseModel):
    """Detailed public profile for an agent.

    SECURITY INVARIANT:
    real_name is strictly classified and MUST NEVER be exposed in this schema.
    """

    model_config = ConfigDict(from_attributes=True, extra="forbid")

    slug: str = Field(..., description="Canonical URL identifier")
    codename: str = Field(..., description="Public operative codename")
    agent_number: str = Field(..., description="Formatted MIB personnel identifier")
    rank: str = Field(..., description="Agent rank within MIB")
    division: str = Field(..., description="Operational division")
    clearance_level: str = Field(..., description="Assigned clearance rating")
    status: str = Field(..., description="Current operational status")
    photograph_url: Optional[str] = Field(default=None, description="Public profile photo URL")
    specialization: Optional[str] = Field(default=None, description="Field specialization")
    biography: Optional[str] = Field(default=None, description="Redacted public dossier biography")
    signature_quote: Optional[str] = Field(default=None, description="Notable quote from record")
    recruitment_date: Optional[date] = Field(default=None, description="Date of recruitment")
    created_at: datetime = Field(..., description="Record creation timestamp")

    @model_validator(mode="before")
    @classmethod
    def populate_photograph_url(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "photograph_url" not in data or data["photograph_url"] is None:
                data["photograph_url"] = data.get("photograph_path")
            return data
        # Handle ORM instances
        if hasattr(data, "photograph_path") and (not hasattr(data, "photograph_url") or getattr(data, "photograph_url", None) is None):
            setattr(data, "photograph_url", getattr(data, "photograph_path", None))
        return data


class AdminAgentCreate(BaseModel):
    """Schema for administrative agent registration."""

    real_name: str = Field(..., min_length=1, max_length=255, description="Confidential civilian identity")
    slug: str = Field(..., min_length=1, max_length=64, pattern=r"^[a-z0-9-]+$", description="URL slug")
    codename: str = Field(..., min_length=1, max_length=64, description="Operative codename")
    agent_number: str = Field(..., min_length=1, max_length=32, description="MIB personnel ID")
    rank: str = Field(..., min_length=1, max_length=64)
    division: str = Field(..., min_length=1, max_length=64)
    clearance_level: str = Field(..., min_length=1, max_length=32)
    status: str = Field(default="active", max_length=32)
    photograph_path: Optional[str] = Field(default=None, max_length=512)
    specialization: Optional[str] = Field(default=None, max_length=128)
    biography: Optional[str] = None
    signature_quote: Optional[str] = None
    recruitment_date: Optional[date] = None
    is_published: bool = Field(default=False)
    show_in_directory: bool = Field(default=False)


class AdminAgentUpdate(BaseModel):
    """Schema for updating agent record by an administrator."""

    real_name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    slug: Optional[str] = Field(default=None, min_length=1, max_length=64, pattern=r"^[a-z0-9-]+$")
    codename: Optional[str] = Field(default=None, min_length=1, max_length=64)
    agent_number: Optional[str] = Field(default=None, min_length=1, max_length=32)
    rank: Optional[str] = Field(default=None, min_length=1, max_length=64)
    division: Optional[str] = Field(default=None, min_length=1, max_length=64)
    clearance_level: Optional[str] = Field(default=None, min_length=1, max_length=32)
    status: Optional[str] = Field(default=None, max_length=32)
    photograph_path: Optional[str] = Field(default=None, max_length=512)
    specialization: Optional[str] = Field(default=None, max_length=128)
    biography: Optional[str] = None
    signature_quote: Optional[str] = None
    recruitment_date: Optional[date] = None
    is_published: Optional[bool] = None
    show_in_directory: Optional[bool] = None


class AdminAgentDetail(BaseModel):
    """Full administrative view of an agent including confidential civilian identity."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    real_name: str
    slug: str
    codename: str
    agent_number: str
    rank: str
    division: str
    clearance_level: str
    status: str
    photograph_path: Optional[str] = None
    photograph_url: Optional[str] = None
    specialization: Optional[str] = None
    biography: Optional[str] = None
    signature_quote: Optional[str] = None
    recruitment_date: Optional[date] = None
    is_published: bool
    show_in_directory: bool
    created_at: datetime
    updated_at: datetime
    archived_at: Optional[datetime] = None

    @model_validator(mode="before")
    @classmethod
    def populate_photograph_url(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "photograph_url" not in data or data["photograph_url"] is None:
                data["photograph_url"] = data.get("photograph_path")
            return data
        if hasattr(data, "photograph_path") and (not hasattr(data, "photograph_url") or getattr(data, "photograph_url", None) is None):
            setattr(data, "photograph_url", getattr(data, "photograph_path", None))
        return data
