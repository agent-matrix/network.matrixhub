# Makefile for network.matrixhub.io
# - Backend: FastAPI (Python, managed via uv)
# - Frontend: Next.js (Node.js / npm)
#
# Requirements:
#   - uv  (https://docs.astral.sh/uv/)
#   - Node.js + npm for the frontend

.DEFAULT_GOAL := help

BACKEND_DIR    := backend
FRONTEND_DIR   := frontend
BACKEND_VENV   := $(BACKEND_DIR)/.venv
UV             := uv

.PHONY: \
	help dev \
	backend backend-uv backend-shell install-backend lint-backend fmt-backend clean-backend \
	frontend install-frontend lint-frontend fmt-frontend clean-frontend \
	install lint fmt clean

# ---------------------------------------------------------------------------
# Help
# ---------------------------------------------------------------------------

help:
	@echo ""
	@echo "network.matrixhub.io – top-level Makefile"
	@echo ""
	@echo "Common targets:"
	@echo "  make dev              - show this help (dev entrypoint)"
	@echo "  make backend          - run backend dev server (FastAPI via uv)"
	@echo "  make frontend         - run frontend dev server (Next.js)"
	@echo "  make install          - install backend (uv) and frontend (npm) deps"
	@echo "  make lint             - run linters for backend and frontend"
	@echo "  make fmt              - run formatters for backend and frontend"
	@echo "  make backend-shell    - open a shell with backend venv via uv"
	@echo "  make clean            - remove backend venv and frontend build artifacts"
	@echo ""

dev: help

# ---------------------------------------------------------------------------
# Backend (Python / uv)
# ---------------------------------------------------------------------------

install-backend:  ## Install backend deps into backend/.venv using uv
	@echo ">> [backend] Syncing Python dependencies with uv into $(BACKEND_VENV)..."
	cd $(BACKEND_DIR) && UV_PROJECT_ENVIRONMENT=$(BACKEND_VENV) $(UV) sync

# Alias for compatibility / clarity
backend-uv: install-backend
	@true

backend: install-backend  ## Run FastAPI dev server
	@echo ">> [backend] Starting FastAPI dev server on http://0.0.0.0:8000 ..."
	cd $(BACKEND_DIR) && UV_PROJECT_ENVIRONMENT=$(BACKEND_VENV) $(UV) run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

backend-shell: install-backend  ## Drop into shell with backend environment active via uv
	@echo ">> [backend] Opening shell in backend/.venv (uv run bash)..."
	cd $(BACKEND_DIR) && UV_PROJECT_ENVIRONMENT=$(BACKEND_VENV) $(UV) run bash

lint-backend: install-backend  ## Lint backend with ruff
	@echo ">> [backend] Ruff lint..."
	cd $(BACKEND_DIR) && UV_PROJECT_ENVIRONMENT=$(BACKEND_VENV) $(UV) run ruff check app

fmt-backend: install-backend  ## Format backend with ruff format
	@echo ">> [backend] Ruff format..."
	cd $(BACKEND_DIR) && UV_PROJECT_ENVIRONMENT=$(BACKEND_VENV) $(UV) run ruff format app

clean-backend:
	@echo ">> [backend] Cleaning venv and caches..."
	rm -rf "$(BACKEND_VENV)" \
	       "$(BACKEND_DIR)/.ruff_cache" \
	       "$(BACKEND_DIR)/.pytest_cache"

# ---------------------------------------------------------------------------
# Frontend (Next.js / npm)
# ---------------------------------------------------------------------------

install-frontend:
	@echo ">> [frontend] Installing npm dependencies (if package.json exists)..."
	cd $(FRONTEND_DIR) && if [ -f package.json ]; then npm install; else echo 'No package.json in $(FRONTEND_DIR); skipping npm install.'; fi

frontend:
	@echo ">> [frontend] Starting Next.js dev server on http://localhost:3000 ..."
	cd $(FRONTEND_DIR) && npm run dev -- --port 3000

lint-frontend:
	@echo ">> [frontend] Running npm lint (if configured)..."
	cd $(FRONTEND_DIR) && \
		if [ -f package.json ]; then \
			npm run lint || echo '[frontend] lint failed or not configured'; \
		else \
			echo '[frontend] no package.json, skipping lint'; \
		fi

fmt-frontend:
	@echo ">> [frontend] Running npm lint --fix (if configured)..."
	cd $(FRONTEND_DIR) && \
		if [ -f package.json ]; then \
			npm run lint -- --fix || true; \
		else \
			echo '[frontend] no package.json, skipping fmt'; \
		fi

clean-frontend:
	@echo ">> [frontend] Cleaning node_modules and .next..."
	cd $(FRONTEND_DIR) && rm -rf node_modules .next

# ---------------------------------------------------------------------------
# Aggregates
# ---------------------------------------------------------------------------

install: install-backend install-frontend

lint: lint-backend lint-frontend

fmt: fmt-backend fmt-frontend

clean: clean-backend clean-frontend
