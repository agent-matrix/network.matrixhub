# network.matrixhub.io

> "LinkedIn for AI agents" – a portal on top of MatrixHub catalog where
> multi-agent systems and humans can discover, evaluate, and recruit agents,
> tools, and MCP servers.

This repository is a production-ready **monorepo** with:

- `backend/`  – FastAPI service connected to MatrixHub DB
- `frontend/` – Next.js/React portal (LinkedIn-style UI for AI agents)
- `infra/`    – Docker Compose + environment templates
- `Makefile`  – Common dev & ops commands

---

## 1. Architecture Overview

### High-level

- **MatrixHub** (existing system) remains the **source of truth** for:
  - Entities (agents, tools, mcp_servers)
  - Protocol metadata (e.g., `protocols`, `manifests.a2a`)
- **network.matrixhub.io** provides:
  - A **read-only discovery portal** (for now)
  - A REST/JSON API layer tailored for the LinkedIn-like UI
  - Optional **write flows** to manually register new agents into MatrixHub

### Components

- **backend/**
  - FastAPI + SQLAlchemy (sync engine by default)
  - Talks to MatrixHub DB (Postgres recommended; SQLite supported for dev)
  - Exposes REST APIs for:
    - Listing/searching agents & MCP servers
    - Fetching detailed “profile” views for each entity
    - (Extensible) write endpoints for new registrations

- **frontend/**
  - Next.js (App Router) + React + TypeScript
  - TailwindCSS
  - Pages:
    - `Home`: search & feed of “featured” agents
    - `Directory`: advanced search + filters
    - `Agent profile`: detail view with CV-like layout

- **infra/**
  - `docker-compose.yml` for local full-stack dev
  - `.env*` templates for backend & frontend configuration

---

## 2. Quickstart (Local Dev)

### Prereqs

- Docker + Docker Compose
- Node.js >= 20.x
- Python >= 3.11

### 2.1. Using Docker Compose (recommended)

```bash
# from repo root
cp infra/.env.backend.example backend/.env
cp infra/.env.frontend.example frontend/.env.local

# adjust DB connection and API URLs in those env files if needed

docker compose -f infra/docker-compose.yml up --build
```

Backend will be available at `http://localhost:8000` and frontend at
`http://localhost:3000` by default.

### 2.2. Running services manually

#### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend
npm install
npm run dev -- --port 3000
```

---

## 3. Backend Overview (`backend/`)

### Stack

- FastAPI
- SQLAlchemy 2.x ORM (sync engine)
- Pydantic v2

### Key modules

- `app/core/config.py` – settings (env-driven) for DB, CORS
- `app/db/session.py` – engine + session factory
- `app/models/entity.py` – lightweight mirror of MatrixHub Entity table
- `app/schemas/entity.py` – API DTOs (e.g., EntityRead, EntitySearchItem)
- `app/api/routes/entities.py` – endpoints:
  - `GET /api/entities` – search & filters
  - `GET /api/entities/{uid}` – profile view

---

## 4. Frontend Overview (`frontend/`)

### Stack

- Next.js (App Router)
- React + TypeScript
- TailwindCSS

### Key pages

- `/` – Landing + “Featured agents” feed
- `/directory` – Search + filters
- `/agents/[uid]` – Detailed LinkedIn-style profile

All data is fetched from the backend (`NEXT_PUBLIC_API_BASE_URL`).

---

## 5. Makefile

Convenience for common flows:

```bash
make dev          # backend + frontend (requires two terminals today)
make backend      # run backend dev server
make frontend     # run frontend dev server
make lint         # run basic linters (backend & frontend)
```

