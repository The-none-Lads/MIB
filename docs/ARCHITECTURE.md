# System Architecture — MIB Digital Identity System

## 1. High-Level Topology

```text
                       INTERNET
                           |
                    Cloudflare DNS
                           |
                        HAProxy
                           |
                  HTTPS / Reverse Proxy
                           |
                 mib.gameserver1.cc
                           |
                   MIB APPLICATION LXC
                           |
             +-------------+-------------+
             |                           |
        React Frontend               FastAPI
        (Vite / Nginx)              (Uvicorn)
             |                           |
             +-------------+-------------+
                           |
                       PostgreSQL
                           |
                  Persistent Storage
```

## 2. Key Design Principles

1. **Modular Monolith**: Clean separation between frontend (React 19 SPA) and backend (FastAPI async service). No premature microservices.
2. **Stateless Identity URLs**: NFC cards carry only an unauthenticated canonical URL (`/agent/{slug}`). No credentials or secret keys are stored on NFC cards.
3. **Backend-Enforced Privacy**: Private attributes (such as `real_name`, administrative notes, unpublished dossiers, or internal IDs) are filtered at the Pydantic serialization layer and never returned to public visitors.
4. **Resilient Offline/Fail-Safe Frontend**: Dynamic profiles degrade gracefully if animations fail or `prefers-reduced-motion` is enabled.
5. **Database Portability**: SQLAlchemy 2.0 with PostgreSQL dialect types and clean fallback mechanisms for lightweight in-memory testing.

## 3. Directory Structure

```text
MIB/
├── frontend/             # React 19 + TypeScript + Tailwind CSS SPA
├── backend/              # FastAPI + SQLAlchemy 2.x + Alembic
├── docs/                 # Authoritative documentation suite
├── docker-compose.yml    # Container orchestration
└── .env.example          # Environment template
```
