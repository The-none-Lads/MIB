# API Specification — MIB Digital Identity System

Base URL: `/api/v1`

## Public Endpoints (Unauthenticated)

### 1. Health Check
- **GET** `/health`
- **Response (200 OK)**:
  ```json
  {
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2026-10-30T16:30:00Z"
  }
  ```

### 2. Retrieve Public Agents List (Directory)
- **GET** `/agents`
- **Query Parameters**:
  - `query` (optional string): Search codename or agent number
  - `rank` (optional string): Filter by rank
  - `division` (optional string): Filter by division
  - `status` (optional string): Filter by status (default: active)
- **Rules**: Only returns agents where `is_published = true` AND `show_in_directory = true`.
- **Response (200 OK)**: Array of `PublicAgentSummary`.

### 3. Retrieve Public Agent Profile
- **GET** `/agents/{slug}`
- **Rules**: Returns agent with matching `slug` where `is_published = true`. If agent exists but `is_published = false`, returns 404 Not Found to prevent identity enumeration.
- **Privacy Note**: `real_name`, internal IDs, card references, and administrative timestamps are strictly omitted.
- **Response (200 OK)**: `PublicAgentDetail`:
  ```json
  {
    "slug": "k",
    "codename": "Agent K",
    "agent_number": "MIB-0012",
    "rank": "Senior Special Agent",
    "division": "Interstellar Infiltration",
    "clearance_level": "Level 9",
    "status": "active",
    "photograph_url": "/uploads/agents/k.webp",
    "specialization": "Sub-orbital containment",
    "biography": "Senior field supervisor. Operates under extreme discretion.",
    "signature_quote": "A person is smart. People are dumb, panicky dangerous animals and you know it.",
    "recruitment_date": "1969-07-20",
    "created_at": "2026-01-01T00:00:00Z"
  }
  ```

### 4. Retrieve Public Agent Dossiers
- **GET** `/agents/{slug}/dossiers`
- **Rules**: Only dossiers where `visibility = 'PUBLIC'` are returned.

### 5. Retrieve Public Agent Missions
- **GET** `/agents/{slug}/missions`
- **Rules**: Only mission records where `visibility = 'PUBLIC'` are returned.

---

## Administrative Endpoints (Authenticated)

- **GET** `/admin/agents`: List all agents (including unpublished & archived)
- **POST** `/admin/agents`: Create agent
- **GET** `/admin/agents/{id}`: Detailed admin view (includes `real_name`, full metadata)
- **PATCH** `/admin/agents/{id}`: Update agent fields
- **POST** `/admin/agents/{id}/archive`: Soft archive agent
- **GET** `/admin/cards`: List all physical NFC cards
- **POST** `/admin/cards`: Register new physical NFC card
- **PATCH** `/admin/cards/{id}`: Update card notes/label
- **POST** `/admin/cards/{id}/assign`: Assign card to an agent
- **POST** `/admin/cards/{id}/revoke`: Revoke card assignment
- **GET** `/admin/statistics`: Overview scan analytics
