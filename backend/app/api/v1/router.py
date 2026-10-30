from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.agents import router as agents_router
from app.api.v1.admin_agents import router as admin_agents_router

api_v1_router = APIRouter()

api_v1_router.include_router(health_router, tags=["Health"])
api_v1_router.include_router(agents_router, tags=["Agents"])
api_v1_router.include_router(admin_agents_router, tags=["Admin Agents"])
