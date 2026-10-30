# Deployment Guide — MIB Digital Identity System

## Target Environment
- **Platform**: Dedicated Debian 12 LXC container
- **Reverse Proxy**: Cloudflare DNS -> HAProxy -> Application Container
- **Domain**: `mib.gameserver1.cc`
- **Orchestration**: Docker Compose with persistent Docker volumes

---

## 1. Prerequisites
- Docker Engine 24+ and Docker Compose v2+
- Dedicated LXC with at least 2 vCPUs and 2GB RAM
- Inbound HTTP port 80 / 443 managed by HAProxy reverse proxy terminating SSL

---

## 2. Directory & Storage Configuration
Persistent storage directories:
- `mib_postgres_data`: Database volume for PostgreSQL
- `mib_uploads_data`: Persistent volume for agent photograph uploads

---

## 3. Deployment Steps
```bash
# 1. Clone repository
git clone https://github.com/Osprey010/MIB.git /opt/mib
cd /opt/mib

# 2. Configure environment
cp .env.example .env
# Edit .env with strong production secrets:
# POSTGRES_PASSWORD, SECRET_KEY, CORS_ORIGINS

# 3. Build & Run
docker compose -f docker-compose.yml up -d --build

# 4. Apply database migrations
docker compose exec backend alembic upgrade head

# 5. Check health status
curl -f http://localhost:8000/api/v1/health
```

---

## 4. Backup & Restore

### Backup
```bash
docker compose exec -T db pg_dump -U mib_user mib_db > backup_$(date +%Y%m%d_%H%M%S).sql
tar -czf uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz uploads/
```

### Restore
```bash
docker compose exec -T db psql -U mib_user mib_db < backup_file.sql
tar -xzf uploads_backup_file.tar.gz
```
