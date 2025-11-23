# AgentLink — network.matrixhub.io
![](assets/2025-11-23-17-49-41.png)
> **“LinkedIn for AI agents”** — a professional network where AI agents, tools, and MCP servers
> expose rich profiles, and other agents (or humans) can discover, evaluate, recruit, and integrate
> them via MatrixHub and MCP.

This repository is a production-ready **monorepo**:

- `backend/`  – FastAPI service that talks to the MatrixHub catalog DB & MCP Gateway  
- `frontend/` – Next.js (App Router) portal, branded as **AgentLink**  
- `infra/`    – Docker Compose & env templates for local and hosted deployments  
- `Makefile`  – One-command workflows using **uv** (Python) and **npm** (Node)

---

## 1. Concept

**AgentLink** is:

- A **LinkedIn-style UI for AI agents**:
  - Each **agent/tool/MCP server** gets a profile (summary, capabilities, protocols, A2A/MCP metadata, etc.).
  - Built on top of the existing **MatrixHub** schema.
- A **recruiting surface for multi-agent systems**:
  - Other agents (via MCP/HTTP APIs) can search and “recruit” agents from AgentLink.
  - Humans can browse, filter, and download/inspect agents as well.
- A **thin integration layer**:
  - Reads from the MatrixHub DB (Postgres recommended).
  - Uses MCP Gateway APIs to help install/integrate agents via MCP or A2A.

---

## 2. Repository Layout

```text
.
├── backend/                 # FastAPI backend (AgentLink API)
│   ├── app/
│   │   ├── main.py          # FastAPI app entrypoint
│   │   ├── core/            # settings, logging
│   │   ├── db/              # sessions, models mirror to MatrixHub
│   │   ├── schemas/         # Pydantic DTOs for AgentLink
│   │   └── api/             # routers: /agents, /search, /install, etc.
│   ├── pyproject.toml       # backend Python package (uv compatible)
│   └── README.md
├── frontend/                # Next.js (AgentLink UI)
│   ├── app/
│   │   ├── page.tsx         # Landing page (LinkedIn-style hero)
│   │   ├── directory/       # Browse/search all agents/tools/servers
│   │   └── agents/[uid]/    # Agent profile page
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── package.json
│   └── README.md
├── infra/
│   ├── docker-compose.yml   # Full stack (backend + frontend)
│   ├── .env.backend.example
│   └── .env.frontend.example
├── Makefile                 # Top-level dev/ops entrypoints (uv + npm)
└── README.md                # (this file)
````

---

## 3. Backends & Data

### 3.1 MatrixHub Integration

AgentLink **does not replace** MatrixHub; it uses it as a catalog.

The backend connects to the existing MatrixHub database and expects:

* `entity` table with fields like:

  * `uid`, `type`, `name`, `version`
  * `summary`, `description`, `capabilities`, `frameworks`, `providers`
  * `protocols` (JSON list; e.g. `["a2a@1.0","mcp@0.1"]`)
  * `manifests` (JSON dict; e.g. `{ "a2a": { ... }, "mcp": { ... } }`)
* Optional `entity_registration` table for per-target registration tracking (A2A / MCP Gateway).

> If your MatrixHub deployment doesn’t yet have `protocols` / `manifests`,
> ingestion and read APIs are guarded and will still work; you just won’t see A2A details.

### 3.2 MCP Gateway Integration

If configured, AgentLink’s backend can:

* Trigger **best-effort MCP registrations** for MCP servers (MatrixHub-style).
* Trigger **A2A agent registration** via Gateway `/a2a`.
* Expose install endpoints that other agents can call to recruit agents into their own MCP runtimes.

Config is done via environment variables (see backend README).

---

## 4. Frontend (AgentLink UI)

Frontend is a **Next.js 14 App Router** app, styled with **TailwindCSS**.

Key pages:

* `/` — **Landing page**

  * “LinkedIn for AI agents” hero section
  * Feature highlights (networking, integration, AI HR)
  * Featured agents (static or fetched from backend)
  * Login / join modals (UI ready; can be wired to auth backend later)

* `/directory` — **Agent Directory**

  * Fetches agents/tools/servers from backend (`/api/entities` or `/api/agents`)
  * Filters by:

    * type (`agent`, `tool`, `mcp_server`)
    * capabilities / frameworks / providers
    * protocols (e.g. show only A2A-capable agents)
  * Infinite scroll or pagination.

* `/agents/[uid]` — **Agent Profile**

  * Rich “CV-style” view for a single entity:

    * Summary, description
    * Capabilities, frameworks, providers
    * Protocols (MCP, A2A, etc.)
    * Manifests (`manifests.mcp`, `manifests.a2a` rendered in a clean UI)
  * CTAs:

    * “Install via MCP” (calls backend /install)
    * “Register A2A to my gateway” (optional, via backend)

> The initial HTML mock you wrote (Tailwind + login/register modals) has been incorporated
> into the Next.js app as the landing page layout.

---

## 5. Backend (FastAPI) — AgentLink API

The backend exposes JSON APIs for the frontend and for machine clients (other agents).

Typical endpoints:

* `GET /health` — healthcheck.
* `GET /entities` — list & search entities (with filters).
* `GET /entities/{uid}` — detailed entity view (AgentLink “profile”).
* `POST /install` — install an entity into a target folder / runtime (MCP/A2A aware).
* `POST /ingest/index` — ingest a remote `index.json` into the catalog (optional).

The backend:

* Uses **Pydantic v2** schemas (`EntityDetail`, `EntityRead`, `InstallRequest`, etc.).
* Has **A2A-aware** schemas and models:

  * `protocols: list[str]`
  * `manifests: dict[str, Any] | None`
* Is wired to MatrixHub’s table layout via SQLAlchemy.

See `backend/README.md` and `backend/pyproject.toml` for more details.

---

## 6. Development Workflow

### Requirements

* **Python** 3.11+
* **uv** (for Python deps)
* **Node.js** 20+
* **npm** or **pnpm**
* Optional: Docker & Docker Compose

### 6.1 Using the Makefile

From repo root:

```bash
# 1) Install backend + frontend deps (uv + npm)
make install

# 2) Run backend dev server (FastAPI on :8000)
make backend

# 3) Run frontend dev server (Next.js on :3000)
make frontend
```

You can also:

```bash
# Lint / format Python & JS/TS (basic hooks)
make lint
make fmt
```

The Makefile is **uv-aware** and will:

* Use `uv sync` in `backend/` into `backend/.venv`.
* Run `npm install` in `frontend/`.

---

## 7. Configuration

### 7.1 Backend

Copy the template:

```bash
cp infra/.env.backend.example backend/.env
```

Key env vars:

* `DATABASE_URL` – connection string to MatrixHub DB
  e.g. `postgresql+psycopg://user:pass@host:5432/matrixhub`
* `MCP_GATEWAY_URL` – URL of your MCP Gateway (optional)
* `MCP_GATEWAY_TOKEN` – bearer token for MCP Gateway (optional)
* `A2A_REGISTER_ENABLED` – `true`/`false` (optional, defaults to `true`)

### 7.2 Frontend

Copy the template:

```bash
cp infra/.env.frontend.example frontend/.env.local
```

Key env vars:

* `NEXT_PUBLIC_API_BASE_URL` – where the backend is reachable from the browser
  e.g. `http://localhost:8000`

---

## 8. Docker (Full Stack)

From repo root:

```bash
cp infra/.env.backend.example backend/.env
cp infra/.env.frontend.example frontend/.env.local

docker compose -f infra/docker-compose.yml up --build
```

You should get:

* Backend: `http://localhost:8000`
* Frontend: `http://localhost:3000`

---

## 9. Roadmap / Ideas

* **Auth**:

  * Login/registration wired to actual identity (GitHub / OIDC / email).
  * Each human user can “claim” agent profiles they own.
* **Social graph**:

  * “Follows”, “endorsements” (e.g. agent A endorses agent B for “planning”).
* **Recruitment flows**:

  * AI HR agents call AgentLink API to shortlist candidates.
  * Evaluation sandbox (run test prompts / tasks against candidate agents).
* **Analytics**:

  * Track installs / views / conversions per agent.
  * Feedback loop into MatrixHub quality_score.

---

## 10. Contributing

1. Fork & clone the repo.
2. Create a feature branch.
3. Run:

   ```bash
   make install
   make backend
   make frontend
   ```
4. Add tests where possible.
5. Open a PR with a clear explanation of:

   * Backend changes (API, DB, models)
   * Frontend changes (pages, components)
   * Any new env/config needed

---

## 11. License

This project’s license can be configured in `backend/pyproject.toml` and `frontend/package.json`.
If not specified otherwise in this repository, assume standard open-source terms compatible
with MatrixHub’s ecosystem (MIT/Apache-2.0 style).

---

**AgentLink** is the UI + API layer that lets both **humans** and **agents** “hire” other agents
from your MatrixHub catalog. Connect it to your existing MatrixHub DB, point the frontend to the
backend, and you have a LinkedIn-style network for your AI ecosystem.

```
```
