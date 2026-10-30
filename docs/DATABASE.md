# Database Design & Schemas — MIB

## Engine & Migrations
- **Engine**: PostgreSQL 16+
- **ORM**: SQLAlchemy 2.0 (Declarative Base, Mapped type annotations)
- **Migration Manager**: Alembic

---

## Entity Relationship Overview

### 1. `agents`
Core personnel entity holding both public MIB fiction and private real-world metadata.
- `id`: `UUID` (Primary Key, default uuid4)
- `slug`: `VARCHAR(64)` (UNIQUE, Indexed) — Canonical path segment (`/agent/{slug}`)
- `real_name`: `VARCHAR(255)` (NOT NULL) — Confidential real-world identity
- `codename`: `VARCHAR(64)` (NOT NULL, Indexed) — e.g. "Agent K", "Agent J"
- `agent_number`: `VARCHAR(32)` (UNIQUE, Indexed) — Formatted MIB personnel ID
- `rank`: `VARCHAR(64)` (NOT NULL)
- `division`: `VARCHAR(64)` (NOT NULL)
- `clearance_level`: `VARCHAR(32)` (NOT NULL)
- `status`: `VARCHAR(32)` (NOT NULL, default 'active') — active, retired, missing, suspended
- `photograph_path`: `VARCHAR(512)` (Nullable)
- `specialization`: `VARCHAR(128)` (Nullable)
- `biography`: `TEXT` (Nullable)
- `signature_quote`: `TEXT` (Nullable)
- `recruitment_date`: `DATE` (Nullable)
- `is_published`: `BOOLEAN` (NOT NULL, default false)
- `show_in_directory`: `BOOLEAN` (NOT NULL, default false)
- `created_at`: `TIMESTAMP WITH TIME ZONE` (default UTC now)
- `updated_at`: `TIMESTAMP WITH TIME ZONE` (default UTC now, onupdate)
- `archived_at`: `TIMESTAMP WITH TIME ZONE` (Nullable)

### 2. `agent_cards`
Physical NFC cards tracked independently from agent entities.
- `id`: `UUID` (Primary Key)
- `card_uid`: `VARCHAR(64)` (Nullable, Indexed) — Physical hardware UID if read
- `label`: `VARCHAR(128)` (NOT NULL) — Identifier / badge label
- `agent_id`: `UUID` (Foreign Key -> `agents.id`, Nullable, Indexed)
- `card_type`: `VARCHAR(32)` (default 'NTAG215')
- `status`: `VARCHAR(32)` (default 'available') — available, active, revoked, lost, retired
- `assigned_at`: `TIMESTAMP WITH TIME ZONE` (Nullable)
- `created_at`: `TIMESTAMP WITH TIME ZONE`
- `updated_at`: `TIMESTAMP WITH TIME ZONE`
- `notes`: `TEXT` (Nullable)

### 3. `dossiers`
- `id`: `UUID` (Primary Key)
- `agent_id`: `UUID` (Foreign Key -> `agents.id`, Indexed)
- `title`: `VARCHAR(255)` (NOT NULL)
- `content`: `TEXT` (NOT NULL)
- `classification`: `VARCHAR(32)` (PUBLIC, CONFIDENTIAL, SECRET, TOP SECRET)
- `visibility`: `VARCHAR(32)` (PUBLIC, ADMIN_ONLY)
- `created_at`: `TIMESTAMP WITH TIME ZONE`
- `updated_at`: `TIMESTAMP WITH TIME ZONE`

### 4. `mission_records`
- `id`: `UUID` (Primary Key)
- `agent_id`: `UUID` (Foreign Key -> `agents.id`, Indexed)
- `title`: `VARCHAR(255)` (NOT NULL)
- `description`: `TEXT` (NOT NULL)
- `mission_date`: `DATE` (Nullable)
- `outcome`: `VARCHAR(64)` (SUCCESS, COMPROMISED, PENDING, CLASSIFIED)
- `classification`: `VARCHAR(32)`
- `visibility`: `VARCHAR(32)`
- `created_at`: `TIMESTAMP WITH TIME ZONE`
- `updated_at`: `TIMESTAMP WITH TIME ZONE`

### 5. `admin_users`
- `id`: `UUID` (Primary Key)
- `username`: `VARCHAR(64)` (UNIQUE, Indexed)
- `email`: `VARCHAR(255)` (UNIQUE, Indexed)
- `password_hash`: `VARCHAR(255)` (Argon2id)
- `role`: `VARCHAR(32)` (default 'admin')
- `is_active`: `BOOLEAN` (default true)
- `created_at`: `TIMESTAMP WITH TIME ZONE`
- `updated_at`: `TIMESTAMP WITH TIME ZONE`

### 6. `scan_events`
- `id`: `UUID` (Primary Key)
- `agent_id`: `UUID` (Foreign Key -> `agents.id`, Indexed)
- `card_id`: `UUID` (Foreign Key -> `agent_cards.id`, Nullable, Indexed)
- `source`: `VARCHAR(32)` (nfc, qr, direct, unknown)
- `timestamp`: `TIMESTAMP WITH TIME ZONE` (default UTC now)

### 7. `audit_logs`
- `id`: `UUID` (Primary Key)
- `admin_id`: `UUID` (Foreign Key -> `admin_users.id`, Nullable)
- `action`: `VARCHAR(64)`
- `target_type`: `VARCHAR(64)`
- `target_id`: `VARCHAR(64)`
- `timestamp`: `TIMESTAMP WITH TIME ZONE`
- `metadata_json`: `TEXT` (JSON encoded)
