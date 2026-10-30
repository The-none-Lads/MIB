import uuid
from datetime import datetime, timezone
from typing import Optional, Sequence
from fastapi import HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.agent import Agent
from app.schemas.agent import AdminAgentCreate, AdminAgentUpdate


class AgentService:
    """Service layer encapsulating business logic for Agent entities."""

    @staticmethod
    async def get_public_agent_by_slug(
        db: AsyncSession, slug: str
    ) -> Optional[Agent]:
        """Retrieve an agent for public viewing.
        
        ENFORCES SECURITY RULE:
        Returns Agent ONLY if `is_published` is True and `archived_at` is None.
        If an agent exists but is unpublished/archived, returns None so that
        callers receive a 404 Not Found to prevent identity enumeration.
        """
        stmt = select(Agent).where(
            func.lower(Agent.slug) == slug.lower(),
            Agent.is_published.is_(True),
            Agent.archived_at.is_(None),
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_public_agents_directory(
        db: AsyncSession,
        query: Optional[str] = None,
        rank: Optional[str] = None,
        division: Optional[str] = None,
        agent_status: Optional[str] = "active",
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[Agent]:
        """Retrieve directory of public agents.
        
        ENFORCES SECURITY RULE:
        Only published, directory-enabled, non-archived agents are returned.
        Searching against confidential fields (e.g. real_name) is strictly rejected.
        """
        stmt = select(Agent).where(
            Agent.is_published.is_(True),
            Agent.show_in_directory.is_(True),
            Agent.archived_at.is_(None),
        )

        if agent_status:
            stmt = stmt.where(Agent.status == agent_status)

        if rank:
            stmt = stmt.where(Agent.rank == rank)

        if division:
            stmt = stmt.where(Agent.division == division)

        if query:
            search_pattern = f"%{query.strip()}%"
            stmt = stmt.where(
                or_(
                    Agent.codename.ilike(search_pattern),
                    Agent.agent_number.ilike(search_pattern),
                )
            )

        stmt = stmt.order_by(Agent.codename.asc()).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def create_agent(
        db: AsyncSession, agent_in: AdminAgentCreate
    ) -> Agent:
        """Create a new agent record with conflict detection."""
        # Check slug collision
        slug_check = await db.execute(
            select(Agent).where(func.lower(Agent.slug) == agent_in.slug.lower())
        )
        if slug_check.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Agent slug '{agent_in.slug}' is already registered.",
            )

        # Check agent number collision
        number_check = await db.execute(
            select(Agent).where(Agent.agent_number == agent_in.agent_number)
        )
        if number_check.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Agent number '{agent_in.agent_number}' is already registered.",
            )

        agent = Agent(**agent_in.model_dump())
        db.add(agent)
        await db.commit()
        await db.refresh(agent)
        return agent

    @staticmethod
    async def get_admin_agent_by_id(
        db: AsyncSession, agent_id: uuid.UUID
    ) -> Optional[Agent]:
        """Admin lookup by UUID, returning full record regardless of published status."""
        stmt = select(Agent).where(Agent.id == agent_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def list_admin_agents(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[Agent]:
        """Admin listing of all agent records, ordered chronologically."""
        stmt = select(Agent).order_by(Agent.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def update_agent(
        db: AsyncSession,
        agent: Agent,
        agent_in: AdminAgentUpdate,
    ) -> Agent:
        """Update fields on an existing agent."""
        update_data = agent_in.model_dump(exclude_unset=True)

        # Check slug conflict if being updated
        if "slug" in update_data and update_data["slug"].lower() != agent.slug.lower():
            slug_check = await db.execute(
                select(Agent).where(
                    func.lower(Agent.slug) == update_data["slug"].lower(),
                    Agent.id != agent.id,
                )
            )
            if slug_check.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Agent slug '{update_data['slug']}' is already in use.",
                )

        # Check agent_number conflict if being updated
        if "agent_number" in update_data and update_data["agent_number"] != agent.agent_number:
            number_check = await db.execute(
                select(Agent).where(
                    Agent.agent_number == update_data["agent_number"],
                    Agent.id != agent.id,
                )
            )
            if number_check.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Agent number '{update_data['agent_number']}' is already in use.",
                )

        for field, value in update_data.items():
            setattr(agent, field, value)

        await db.commit()
        await db.refresh(agent)
        return agent

    @staticmethod
    async def archive_agent(db: AsyncSession, agent: Agent) -> Agent:
        """Soft-archive an agent, unpublishing them from public view immediately."""
        agent.archived_at = datetime.now(timezone.utc)
        agent.is_published = False
        agent.show_in_directory = False
        agent.status = "retired"

        await db.commit()
        await db.refresh(agent)
        return agent


agent_service = AgentService()
