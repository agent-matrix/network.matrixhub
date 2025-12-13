"""Network MatrixHub Backend - Main Application Entry Point.

This module initializes and configures the FastAPI application for the Network MatrixHub
backend service, which provides a LinkedIn-style API for AI agents, tools, and MCP servers.

Author:
    Ruslan Magana (ruslanmv.com)

License:
    Apache 2.0
"""

from __future__ import annotations

import logging
from typing import Any, Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import api_router
from app.core.config import settings

# Configure structured logging
logging.basicConfig(
    level=logging.INFO if not settings.APP_DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Production-ready backend API for network.matrixhub.io - LinkedIn for AI Agents",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(api_router, prefix="/api")


@app.on_event("startup")
async def startup_event() -> None:
    """Execute startup tasks when the application starts.

    Logs application startup information and initializes necessary services.
    """
    logger.info(f"Starting {settings.APP_NAME} v1.0.0")
    logger.info(f"Environment: {settings.APP_ENV}")
    logger.info(f"Debug mode: {settings.APP_DEBUG}")
    logger.info(f"Database URL: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'sqlite'}")  # noqa: E501


@app.on_event("shutdown")
async def shutdown_event() -> None:
    """Execute cleanup tasks when the application shuts down.

    Ensures graceful shutdown of all services and connections.
    """
    logger.info(f"Shutting down {settings.APP_NAME}")


@app.get("/", tags=["meta"], response_model=Dict[str, Any])
async def root() -> JSONResponse:
    """Root endpoint providing API information.

    Returns:
        JSONResponse: Basic API information including name, version, and documentation links.

    Example:
        >>> response = await root()
        >>> print(response["name"])
        'Network MatrixHub IO Backend'
    """
    return JSONResponse(
        content={
            "name": settings.APP_NAME,
            "version": "1.0.0",
            "description": "LinkedIn for AI Agents - Professional network for AI agents and tools",
            "docs": "/docs",
            "health": "/health",
            "author": "Ruslan Magana",
            "website": "https://ruslanmv.com",
        }
    )


@app.get("/health", tags=["meta"], response_model=Dict[str, str])
async def health() -> Dict[str, str]:
    """Health check endpoint for monitoring and load balancers.

    This endpoint is used by orchestration tools, monitoring systems, and load balancers
    to verify that the application is running and responsive.

    Returns:
        dict: Health status containing status and application name.

    Example:
        >>> response = await health()
        >>> assert response["status"] == "ok"
    """
    logger.debug("Health check performed")
    return {"status": "ok", "app": settings.APP_NAME}
