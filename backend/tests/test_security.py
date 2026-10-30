import pytest
from httpx import AsyncClient
from pydantic import ValidationError

from app.schemas.agent import PublicAgentDetail, PublicAgentSummary


def test_schema_level_real_name_exclusion():
    """Verify that PublicAgentDetail and PublicAgentSummary schemas NEVER define real_name."""
    assert "real_name" not in PublicAgentDetail.model_fields, (
        "CRITICAL SECURITY FAILURE: 'real_name' found in PublicAgentDetail schema fields!"
    )
    assert "real_name" not in PublicAgentSummary.model_fields, (
        "CRITICAL SECURITY FAILURE: 'real_name' found in PublicAgentSummary schema fields!"
    )


def test_schema_extra_forbid_on_real_name():
    """Verify that PublicAgentDetail rejects extra fields including real_name."""
    with pytest.raises(ValidationError):
        PublicAgentDetail(
            slug="classified-op",
            codename="Agent X",
            agent_number="MIB-7777",
            rank="Field Operative",
            division="Surveillance",
            clearance_level="Level 6",
            status="active",
            real_name="Top Secret Civilian Name",  # Should trigger ValidationError
            created_at="2026-10-30T16:00:00Z",
        )


@pytest.mark.asyncio
async def test_api_boundary_never_leaks_real_name(client: AsyncClient):
    """Verify that the public API endpoints strictly omit real_name from JSON output."""
    secret_real_name = "SuperConfidentialCivilianIdentity12345"

    create_res = await client.post(
        "/api/v1/admin/agents",
        json={
            "real_name": secret_real_name,
            "slug": "secure-agent",
            "codename": "Agent Secure",
            "agent_number": "MIB-9999",
            "rank": "Covert Agent",
            "division": "Counter-Intelligence",
            "clearance_level": "Level 8",
            "status": "active",
            "is_published": True,
            "show_in_directory": True,
        },
    )
    assert create_res.status_code == 201

    # 1. Check Public Slug Endpoint
    public_detail_res = await client.get("/api/v1/agents/secure-agent")
    assert public_detail_res.status_code == 200
    assert secret_real_name not in public_detail_res.text
    detail_data = public_detail_res.json()
    assert "real_name" not in detail_data
    assert "id" not in detail_data  # internal database UUID omitted

    # 2. Check Public Directory Endpoint
    public_dir_res = await client.get("/api/v1/agents")
    assert public_dir_res.status_code == 200
    assert secret_real_name not in public_dir_res.text
    dir_data = public_dir_res.json()
    for agent_summary in dir_data:
        assert "real_name" not in agent_summary
        assert "id" not in agent_summary


@pytest.mark.asyncio
async def test_identity_enumeration_prevention(client: AsyncClient):
    """Unpublished agent must return 404, identical to a non-existent agent slug."""
    await client.post(
        "/api/v1/admin/agents",
        json={
            "real_name": "Ghost Operative",
            "slug": "ghost-op",
            "codename": "Agent Ghost",
            "agent_number": "MIB-0000",
            "rank": "Phantom",
            "division": "Deep Cover",
            "clearance_level": "Level 10",
            "status": "active",
            "is_published": False,
            "show_in_directory": False,
        },
    )

    # Both requests should return 404 with identical status code and payload structure
    unpublished_res = await client.get("/api/v1/agents/ghost-op")
    nonexistent_res = await client.get("/api/v1/agents/totally-fake-slug")

    assert unpublished_res.status_code == 404
    assert nonexistent_res.status_code == 404
    assert unpublished_res.json() == nonexistent_res.json()


@pytest.mark.asyncio
async def test_directory_search_does_not_leak_via_real_name(client: AsyncClient):
    """Searching the public directory with an agent's real_name returns NO results."""
    secret_real_name = "Montgomery Scott"

    await client.post(
        "/api/v1/admin/agents",
        json={
            "real_name": secret_real_name,
            "slug": "scotty",
            "codename": "Agent Miracle Worker",
            "agent_number": "MIB-1701",
            "rank": "Chief Engineer",
            "division": "Propulsion",
            "clearance_level": "Level 8",
            "status": "active",
            "is_published": True,
            "show_in_directory": True,
        },
    )

    # Searching with codename works
    res_codename = await client.get("/api/v1/agents?query=Miracle")
    assert res_codename.status_code == 200
    assert len(res_codename.json()) == 1
    assert res_codename.json()[0]["slug"] == "scotty"

    # Searching with confidential real_name returns zero results
    res_secret = await client.get(f"/api/v1/agents?query={secret_real_name}")
    assert res_secret.status_code == 200
    assert len(res_secret.json()) == 0
