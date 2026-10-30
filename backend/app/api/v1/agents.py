from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.agent import PublicAgentDetail, PublicAgentSummary
from app.services.agent_service import agent_service

router = APIRouter()


@router.get(
    "/agents",
    response_model=List[PublicAgentSummary],
    summary="List public agents directory",
    description="Retrieve agents published in the public directory. Confidential civilian details are never returned.",
)
async def list_public_agents(
    query: Optional[str] = Query(default=None, description="Search codename or agent number"),
    rank: Optional[str] = Query(default=None, description="Filter by agent rank"),
    division: Optional[str] = Query(default=None, description="Filter by operational division"),
    status: Optional[str] = Query(default="active", description="Filter by status (default: active)"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> List[PublicAgentSummary]:
    agents = await agent_service.get_public_agents_directory(
        db=db,
        query=query,
        rank=rank,
        division=division,
        agent_status=status,
        skip=skip,
        limit=limit,
    )
    return [PublicAgentSummary.model_validate(agent) for agent in agents]


@router.get(
    "/agents/{slug}",
    response_model=PublicAgentDetail,
    summary="Retrieve public agent profile",
    description="Retrieve public profile for a published agent by slug. If agent is unpublished or missing, returns 404.",
)
async def get_public_agent(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> PublicAgentDetail:
    agent = await agent_service.get_public_agent_by_slug(db=db, slug=slug)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent profile not found",
        )
    return PublicAgentDetail.model_validate(agent)
