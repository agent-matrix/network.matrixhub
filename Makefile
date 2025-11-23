.PHONY: help dev backend frontend lint fmt

help:
	@echo "Available targets:"
	@echo "  make dev        - show dev help"
	@echo "  make backend    - run backend dev server (FastAPI)"
	@echo "  make frontend   - run frontend dev server (Next.js)"
	@echo "  make lint       - run linters for backend and frontend"
	@echo "  make fmt        - run formatters (black, isort, prettier, etc.)"

backend:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

frontend:
	cd frontend && npm run dev -- --port 3000

lint:
	cd backend && if [ -f requirements.txt ]; then echo "[backend] lint TODO (flake8/ruff)"; fi
	cd frontend && if [ -f package.json ]; then npm run lint || echo "[frontend] lint failed or not configured"; fi

fmt:
	cd backend && if command -v black >/dev/null 2>&1; then black app || true; fi
	cd frontend && if [ -f package.json ]; then npm run lint -- --fix || true; fi

