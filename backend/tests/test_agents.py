import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_admin_create_and_public_get_agent(client: AsyncClient):
    """Test creating an agent via admin endpoint and retrieving via public slug endpoint."""
    payload = {
        "real_name": "Kevin Brown",
        "slug": "k",
        "codename": "Agent K",
        "agent_number": "MIB-0012",
        "rank": "Senior Special Agent",
        "division": "Interstellar Infiltration",
        "clearance_level": "Level 9",
        "status": "active",
        "photograph_path": "/uploads/agents/k.webp",
        "specialization": "Sub-orbital containment",
        "biography": "Senior field supervisor. Operates under extreme discretion.",
        "signature_quote": "A person is smart. People are dumb, panicky dangerous animals and you know it.",
        "recruitment_date": "1969-07-20",
        "is_published": True,
        "show_in_directory": True,
    }

    # 1. Create via admin endpoint
    create_res = await client.post("/api/v1/admin/agents", json=payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["slug"] == "k"
    assert created_data["real_name"] == "Kevin Brown"
    assert "id" in created_data
    agent_id = created_data["id"]

    # 2. Retrieve via public endpoint
    public_res = await client.get("/api/v1/agents/k")
    assert public_res.status_code == 200
    public_data = public_res.json()
    assert public_data["slug"] == "k"
    assert public_data["codename"] == "Agent K"
    assert public_data["agent_number"] == "MIB-0012"
    assert public_data["photograph_url"] == "/uploads/agents/k.webp"


@pytest.mark.asyncio
async def test_unpublished_agent_returns_404(client: AsyncClient):
    """An unpublished agent must return 404 on the public slug endpoint to prevent enumeration."""
    payload = {
        "real_name": "James Darrell Edwards III",
        "slug": "j",
        "codename": "Agent J",
        "agent_number": "MIB-0099",
        "rank": "Junior Agent",
        "division": "Urban Engagement",
        "clearance_level": "Level 5",
        "status": "active",
        "is_published": False,  # Not published
        "show_in_directory": False,
    }

    create_res = await client.post("/api/v1/admin/agents", json=payload)
    assert create_res.status_code == 201

    # Public endpoint must return 404
    public_res = await client.get("/api/v1/agents/j")
    assert public_res.status_code == 404
    assert public_res.json()["detail"] == "Agent profile not found"


@pytest.mark.asyncio
async def test_non_existent_agent_returns_404(client: AsyncClient):
    """Querying an unknown slug returns 404."""
    response = await client.get("/api/v1/agents/non-existent-agent-slug")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_public_directory_visibility_filters(client: AsyncClient):
    """Only published and directory-visible agents should be listed in the public directory."""
    # Agent 1: Published and in directory
    await client.post(
        "/api/v1/admin/agents",
        json={
            "real_name": "Agent Visible",
            "slug": "visible",
            "codename": "Agent Visible",
            "agent_number": "MIB-1001",
            "rank": "Special Agent",
            "division": "Sector 4",
            "clearance_level": "Level 7",
            "status": "active",
            "is_published": True,
            "show_in_directory": True,
        },
    )

    # Agent 2: Published but hidden from directory (e.g. secret direct NFC link only)
    await client.post(
        "/api/v1/admin/agents",
        json={
            "real_name": "Agent DirectOnly",
            "slug": "direct-only",
            "codename": "Agent DirectOnly",
            "agent_number": "MIB-1002",
            "rank": "Special Agent",
            "division": "Black Ops",
            "clearance_level": "Level 10",
            "status": "active",
            "is_published": True,
            "show_in_directory": False,
        },
    )

    # Agent 3: Unpublished
    await client.post(
        "/api/v1/admin/agents",
        json={
            "real_name": "Agent Draft",
            "slug": "draft",
            "codename": "Agent Draft",
            "agent_number": "MIB-1003",
            "rank": "Probationary",
            "division": "Training",
            "clearance_level": "Level 1",
            "status": "active",
            "is_published": False,
            "show_in_directory": False,
        },
    )

    # Check directory
    dir_res = await client.get("/api/v1/agents")
    assert dir_res.status_code == 200
    dir_agents = dir_res.json()
    slugs = [a["slug"] for a in dir_agents]

    assert "visible" in slugs
    assert "direct-only" not in slugs
    assert "draft" not in slugs

    # But direct-only agent CAN be accessed directly via their slug
    direct_res = await client.get("/api/v1/agents/direct-only")
    assert direct_res.status_code == 200
    assert direct_res.json()["slug"] == "direct-only"


@pytest.mark.asyncio
async def test_admin_update_and_archive(client: AsyncClient):
    """Test administrative update and soft-archive lifecycle."""
    create_res = await client.post(
        "/api/v1/admin/agents",
        json={
            "real_name": "Zed Chief",
            "slug": "zed",
            "codename": "Chief Zed",
            "agent_number": "MIB-0001",
            "rank": "Director",
            "division": "Command",
            "clearance_level": "Level 10",
            "status": "active",
            "is_published": True,
            "show_in_directory": True,
        },
    )
    agent_id = create_res.json()["id"]

    # Update rank
    patch_res = await client.patch(
        f"/api/v1/admin/agents/{agent_id}",
        json={"rank": "Executive Director"},
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["rank"] == "Executive Director"

    # Soft archive
    archive_res = await client.post(f"/api/v1/admin/agents/{agent_id}/archive")
    assert archive_res.status_code == 200
    assert archive_res.json()["archived_at"] is not None
    assert archive_res.json()["is_published"] is False

    # Once archived, public slug access returns 404
    public_res = await client.get("/api/v1/agents/zed")
    assert public_res.status_code == 404
