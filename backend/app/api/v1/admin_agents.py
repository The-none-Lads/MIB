import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.agent import (
    AdminAgentCreate,
    AdminAgentDetail,
    AdminAgentUpdate,
)
from app.services.agent_service import agent_service

router = APIRouter(prefix="/admin/agents")


@router.post(
    "",
    response_model=AdminAgentDetail,
    status_code=status.HTTP_201_CREATED,
    summary="Create agent record (Admin)",
    description="Register a new agent with full operational and confidential metadata.",
)
async def create_agent(
    agent_in: AdminAgentCreate,
    db: AsyncSession = Depends(get_db),
) -> AdminAgentDetail:
    agent = await agent_service.create_agent(db=db, agent_in=agent_in)
    return AdminAgentDetail.model_validate(agent)


@router.get(
    "",
    response_model=List[AdminAgentDetail],
    summary="List all agents (Admin)",
    description="Retrieve all agent records regardless of publication or archive status.",
)
async def list_admin_agents(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
) -> List[AdminAgentDetail]:
    agents = await agent_service.list_admin_agents(db=db, skip=skip, limit=limit)
    return [AdminAgentDetail.model_validate(agent) for agent in agents]


@router.get(
    "/{agent_id}",
    response_model=AdminAgentDetail,
    summary="Get agent details (Admin)",
    description="Retrieve full record for an agent by internal UUID, including confidential real identity.",
)
async def get_admin_agent(
    agent_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> AdminAgentDetail:
    agent = await agent_service.get_admin_agent_by_id(db=db, agent_id=agent_id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with ID '{agent_id}' not found.",
        )
    return AdminAgentDetail.model_validate(agent)


@router.patch(
    "/{agent_id}",
    response_model=AdminAgentDetail,
    summary="Update agent record (Admin)",
    description="Partially update an agent's attributes.",
)
async def update_admin_agent(
    agent_id: uuid.UUID,
    agent_in: AdminAgentUpdate,
    db: AsyncSession = Depends(get_db),
) -> AdminAgentDetail:
    agent = await agent_service.get_admin_agent_by_id(db=db, agent_id=agent_id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with ID '{agent_id}' not found.",
        )
    updated_agent = await agent_service.update_agent(db=db, agent=agent, agent_in=agent_in)
    return AdminAgentDetail.model_validate(updated_agent)


@router.post(
    "/{agent_id}/archive",
    response_model=AdminAgentDetail,
    summary="Archive agent record (Admin)",
    description="Soft-archive an agent and immediately remove them from the public directory.",
)
async def archive_admin_agent(
    agent_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> AdminAgentDetail:
    agent = await agent_service.get_admin_agent_by_id(db=db, agent_id=agent_id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with ID '{agent_id}' not found.",
        )
    archived_agent = await agent_service.archive_agent(db=db, agent=agent)
    return AdminAgentDetail.model_validate(archived_agent)
