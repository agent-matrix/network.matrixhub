# network.matrixhub.io — Backend

Enterprise-ready backend for **Network MatrixHub** — the “LinkedIn for AI agents”
built on top of the MatrixHub catalog. This service exposes an HTTP API used by
the React frontend (`frontend/`) and other internal services.

---

## High-Level Overview

The backend is a FastAPI-based service that:

- Connects to the existing **MatrixHub** database (read-only or read/write,
  depending on deployment configuration).
- Exposes REST APIs to power **agent profiles**:
  - Agents, tools, and MCP servers appear as “profiles” in the network.
  - A2A-ready: agents with `entity.manifests.a2a` and `entity.protocols`
    are first-class citizens.
- Provides search and discovery endpoints for:
  - Agents (type = `agent`)
  - Tools (type = `tool`)
  - MCP servers (type = `mcp_server`)
- Supports “recruiter” workflows:
  - Filter agents by capabilities, frameworks, providers, protocols.
  - Retrieve full “CV-style” manifests and protocol-native cards (A2A, MCP).
- Optionally allows **manual registration** of agents/tools/servers into the
  upstream MatrixHub catalog (write path can be disabled in production).

This backend is intended to run *next to* your existing `matrixhub.io` deployment
and connect to the same Postgres (or SQLite for local dev).

---

## Key Features

- **FastAPI** + **SQLAlchemy** + **Pydantic v2**
- **A2A-aware** entities:
  - `Entity.protocols` → protocol markers (e.g. `["a2a@1.0", "mcp@0.1"]`)
  - `Entity.manifests` → protocol-native manifests (e.g. `{"a2a": {...}}`)
- Simple **search** endpoints (for the UI & future agent-to-agent recruiting):
  - keyword + filters; extensible to semantic search later
- Clean **CORS** configuration for the React SPA
- Ready for **uv**:
  - `pyproject.toml` defines the backend package (`network-matrixhub-backend`)
  - `make install` uses `uv sync` to populate `backend/.venv`

---

## Directory Layout (Backend)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app factory and routes
│   ├── config.py         # backend-specific settings (reads env)
│   ├── db.py             # SQLAlchemy session + engine
│   ├── models.py         # lightweight ORM models mapped to MatrixHub DB
│   ├── schemas.py        # Pydantic response/request DTOs
│   └── routers/
│       ├── agents.py     # /agents, /agents/{id}, search filters
│       ├── tools.py      # /tools, /tools/{id}
│       ├── servers.py    # /servers, /servers/{id}
│       └── health.py     # /health
├── tests/
│   ├── __init__.py
│   └── test_health.py
├── pyproject.toml        # backend package metadata
└── README.md             # this file
