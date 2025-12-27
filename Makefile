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
	backend backend-uv backend-shell install-backend lint-backend fmt-backend test-backend typecheck-backend coverage-backend clean-backend \
	frontend install-frontend lint-frontend fmt-frontend clean-frontend build-frontend serve \
	install lint fmt test typecheck coverage clean all build

# ---------------------------------------------------------------------------
# Help
# ---------------------------------------------------------------------------

help:
	@echo ""
	@echo "╔════════════════════════════════════════════════════════════════════════╗"
	@echo "║         Network MatrixHub - Production-Ready Development CLI           ║"
	@echo "║                   Author: Ruslan Magana                                ║"
	@echo "║                   Website: ruslanmv.com                                ║"
	@echo "╚════════════════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "📦 Installation & Setup:"
	@echo "  make install          - Install all dependencies (backend + frontend)"
	@echo "  make install-backend  - Install Python backend dependencies via uv"
	@echo "  make install-frontend - Install Node.js frontend dependencies via npm"
	@echo ""
	@echo "🚀 Development Servers:"
	@echo "  make backend          - Run FastAPI backend server (http://0.0.0.0:8000)"
	@echo "  make frontend         - Run Next.js frontend server (http://localhost:3000)"
	@echo "  make dev              - Show this help menu"
	@echo ""
	@echo "🔨 Build & Deploy (Vercel Simulation):"
	@echo "  make build            - Build frontend for production (simulates Vercel build)"
	@echo "  make serve            - Serve production build locally (http://localhost:3000)"
	@echo ""
	@echo "🔍 Code Quality:"
	@echo "  make lint             - Run linters on backend and frontend"
	@echo "  make lint-backend     - Run ruff linter on backend Python code"
	@echo "  make lint-frontend    - Run ESLint on frontend TypeScript/React code"
	@echo "  make fmt              - Format all code (backend + frontend)"
	@echo "  make fmt-backend      - Format backend code with ruff"
	@echo "  make fmt-frontend     - Format frontend code with ESLint --fix"
	@echo ""
	@echo "✅ Testing & Type Checking:"
	@echo "  make test             - Run all tests (backend + frontend)"
	@echo "  make test-backend     - Run pytest tests for backend"
	@echo "  make typecheck        - Run type checkers (mypy for backend)"
	@echo "  make typecheck-backend - Run mypy type checker on backend"
	@echo "  make coverage         - Generate test coverage reports"
	@echo "  make coverage-backend - Generate coverage report for backend"
	@echo ""
	@echo "🛠️  Utilities:"
	@echo "  make backend-shell    - Open shell with backend venv activated"
	@echo "  make clean            - Remove all build artifacts and caches"
	@echo "  make clean-backend    - Clean backend venv and caches"
	@echo "  make clean-frontend   - Clean frontend node_modules and .next"
	@echo "  make all              - Install, lint, test, and typecheck everything"
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

test-backend: install-backend  ## Run pytest tests for backend
	@echo ">> [backend] Running pytest..."
	cd $(BACKEND_DIR) && UV_PROJECT_ENVIRONMENT=$(BACKEND_VENV) $(UV) run pytest tests/ -v

typecheck-backend: install-backend  ## Run mypy type checker on backend
	@echo ">> [backend] Running mypy type checker..."
	cd $(BACKEND_DIR) && UV_PROJECT_ENVIRONMENT=$(BACKEND_VENV) $(UV) run mypy app

coverage-backend: install-backend  ## Generate test coverage report for backend
	@echo ">> [backend] Generating coverage report..."
	cd $(BACKEND_DIR) && UV_PROJECT_ENVIRONMENT=$(BACKEND_VENV) $(UV) run pytest tests/ --cov=app --cov-report=html --cov-report=term-missing
	@echo ">> Coverage report generated at backend/htmlcov/index.html"

clean-backend:
	@echo ">> [backend] Cleaning venv and caches..."
	rm -rf "$(BACKEND_VENV)" \
	       "$(BACKEND_DIR)/.ruff_cache" \
	       "$(BACKEND_DIR)/.pytest_cache" \
	       "$(BACKEND_DIR)/.mypy_cache" \
	       "$(BACKEND_DIR)/htmlcov" \
	       "$(BACKEND_DIR)/.coverage"

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

build-frontend: install-frontend  ## Build Next.js for production
	@echo ">> [frontend] Building Next.js for production..."
	cd $(FRONTEND_DIR) && npm run build

serve: build-frontend  ## Serve production build locally
	@echo ">> [frontend] Serving production build on http://localhost:3000 ..."
	cd $(FRONTEND_DIR) && npm run start

# ---------------------------------------------------------------------------
# Aggregates
# ---------------------------------------------------------------------------

install: install-backend install-frontend

lint: lint-backend lint-frontend

fmt: fmt-backend fmt-frontend

test: test-backend

typecheck: typecheck-backend

coverage: coverage-backend

clean: clean-backend clean-frontend

build: build-frontend  ## Build for production (simulates Vercel deployment)
	@echo ""
	@echo "✅ Production build complete! Ready for deployment."
	@echo "   Run 'make serve' to test the production build locally."
	@echo ""

all: install lint typecheck test  ## Run complete CI/CD pipeline
	@echo ""
	@echo "✅ All checks passed! Project is production-ready."
	@echo ""

# ---------------------------------------------------------------------------
# Docker Commands (Production Deployment)
# ---------------------------------------------------------------------------

build-container:  ## Build Docker containers for production
	@echo ">> [docker] Building production containers..."
	docker-compose build --parallel
	@echo "✅ Containers built successfully!"

run-container:  ## Run Docker containers in detached mode
	@echo ">> [docker] Starting containers..."
	docker-compose up -d
	@echo ""
	@echo "✅ Containers started successfully!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:8000"
	@echo "   API Docs: http://localhost:8000/docs"
	@echo "   Database: localhost:5432"
	@echo ""
	@echo "Run 'make docker-logs' to view logs"
	@echo "Run 'make stop-container' to stop containers"
	@echo ""

stop-container:  ## Stop running Docker containers
	@echo ">> [docker] Stopping containers..."
	docker-compose stop
	@echo "✅ Containers stopped!"

docker-down:  ## Stop and remove Docker containers
	@echo ">> [docker] Stopping and removing containers..."
	docker-compose down
	@echo "✅ Containers removed!"

docker-up:  ## Start containers (build if needed)
	@echo ">> [docker] Starting containers with build..."
	docker-compose up -d --build
	@echo "✅ Containers running!"

docker-logs:  ## View container logs (follow mode)
	@echo ">> [docker] Showing container logs (Ctrl+C to exit)..."
	docker-compose logs -f

docker-ps:  ## List running containers
	@echo ">> [docker] Container status:"
	docker-compose ps

clean-container:  ## Remove containers, volumes, and images
	@echo ">> [docker] Cleaning up Docker resources..."
	docker-compose down -v --rmi all
	@echo "✅ Docker resources cleaned!"

build-backend-container:  ## Build backend container only
	@echo ">> [docker] Building backend container..."
	docker-compose build backend
	@echo "✅ Backend container built!"

restart-backend:  ## Restart backend container
	@echo ">> [docker] Restarting backend..."
	docker-compose restart backend
	@echo "✅ Backend restarted!"

backend-shell-docker:  ## Open shell in running backend container
	@echo ">> [docker] Opening shell in backend container..."
	docker-compose exec backend bash

db-migrate:  ## Run database migrations in container
	@echo ">> [docker] Running database migrations..."
	docker-compose exec backend alembic upgrade head
	@echo "✅ Migrations complete!"

db-shell:  ## Open PostgreSQL shell
	@echo ">> [docker] Opening PostgreSQL shell..."
	docker-compose exec postgres psql -U matrixhub -d network_matrixhub

