# ==========================================
# STAGE 1: Dependency Builder
# ==========================================
FROM python:3.12-slim AS builder

WORKDIR /build

# Install system compilation dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install dependencies into user site-packages
RUN pip install --no-cache-dir --user -r requirements.txt


# ==========================================
# STAGE 2: Lightweight Runtime Container
# ==========================================
FROM python:3.12-slim AS runner

WORKDIR /app

# Install minimal runtime shared libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root system user and group
RUN groupadd -g 1000 mibgroup && \
    useradd -u 1000 -g mibgroup -s /bin/sh -m mibuser

# Copy installed Python packages from builder stage
COPY --from=builder /root/.local /home/mibuser/.local

# Ensure user binaries are on PATH and configure Python runtime
ENV PATH=/home/mibuser/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app

# Create upload directory and grant permissions
RUN mkdir -p /app/uploads && \
    chown -R mibuser:mibgroup /app

# Copy application source code
COPY --chown=mibuser:mibgroup . /app

# Switch to non-root user
USER mibuser

EXPOSE 8000

# Docker healthcheck querying the public health endpoint
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/v1/health')"

# Run FastAPI via Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
