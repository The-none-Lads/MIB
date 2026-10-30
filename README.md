# MIB — Men in Black Digital Identity System

[![License: MIT](https://img.shields.io/badge/License-MIT-silver.svg)](LICENSE)
[![Status: Phase 1](https://img.shields.io/badge/Status-Phase%201%20Foundation-blue.svg)](docs/PROJECT_STATUS.md)

A cinematic Men in Black-inspired digital agent identification system. Each registered agent receives a permanent URL (e.g., `https://mib.gameserver1.cc/agent/k`) written to an NFC card. When scanned with a smartphone, the profile displays an animated identity verification sequence and digital credentials with dossier records.

All agent information is resolved dynamically from the application database, allowing credentials, clearances, and records to be updated without reprogramming physical NFC hardware.

---

## Architecture Overview

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, TanStack Query, React Router
- **Backend:** Python 3.12+, FastAPI, SQLAlchemy 2.x, Pydantic v2, Alembic
- **Database:** PostgreSQL (with SQLite compatibility for fast isolated testing)
- **Deployment:** Dedicated Debian LXC using Docker Compose

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for full system topology and component interactions.

---

## Quick Start (Local Development)

### 1. Clone & Configure
```bash
git clone https://github.com/Osprey010/MIB.git
cd MIB
cp .env.example .env
```

### 2. Docker Compose
```bash
docker compose up --build
```
- Frontend: [http://localhost:5173](http://localhost:5173) (or port 80 via Nginx in prod)
- Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- API Health Check: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

## Documentation
- [Project Status & Roadmap](docs/PROJECT_STATUS.md)
- [Architecture & Design](docs/ARCHITECTURE.md)
- [API Specification](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Security Guidelines](docs/SECURITY.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
