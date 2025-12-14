"""
Monitoring and logging utilities for production backend.
Integrate with services like Sentry, DataDog, CloudWatch, etc.
"""

from __future__ import annotations

import logging
import time
from contextvars import ContextVar
from typing import Any, Callable
from functools import wraps

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)

# Context variable for request ID
request_id_var: ContextVar[str] = ContextVar("request_id", default="")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log all requests with timing and status.
    Useful for production monitoring and debugging.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Any:
        # Generate request ID
        request_id = request.headers.get("x-request-id", f"{time.time()}")
        request_id_var.set(request_id)

        # Log request start
        start_time = time.time()
        logger.info(
            f"Request started",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "client": request.client.host if request.client else None,
            },
        )

        # Process request
        try:
            response = await call_next(request)
            duration = time.time() - start_time

            # Log request completion
            logger.info(
                f"Request completed",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "status_code": response.status_code,
                    "duration_ms": round(duration * 1000, 2),
                },
            )

            # Add request ID to response headers
            response.headers["X-Request-ID"] = request_id

            return response

        except Exception as exc:
            duration = time.time() - start_time
            logger.error(
                f"Request failed",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "error": str(exc),
                    "duration_ms": round(duration * 1000, 2),
                },
                exc_info=True,
            )
            raise


def track_performance(metric_name: str):
    """
    Decorator to track function performance.

    Usage:
        @track_performance("database_query")
        async def get_entities():
            ...
    """

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                duration = time.time() - start_time
                logger.info(
                    f"Performance metric: {metric_name}",
                    extra={
                        "metric": metric_name,
                        "duration_ms": round(duration * 1000, 2),
                        "request_id": request_id_var.get(),
                    },
                )
                return result
            except Exception as exc:
                duration = time.time() - start_time
                logger.error(
                    f"Performance metric failed: {metric_name}",
                    extra={
                        "metric": metric_name,
                        "duration_ms": round(duration * 1000, 2),
                        "error": str(exc),
                        "request_id": request_id_var.get(),
                    },
                    exc_info=True,
                )
                raise

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                logger.info(
                    f"Performance metric: {metric_name}",
                    extra={
                        "metric": metric_name,
                        "duration_ms": round(duration * 1000, 2),
                        "request_id": request_id_var.get(),
                    },
                )
                return result
            except Exception as exc:
                duration = time.time() - start_time
                logger.error(
                    f"Performance metric failed: {metric_name}",
                    extra={
                        "metric": metric_name,
                        "duration_ms": round(duration * 1000, 2),
                        "error": str(exc),
                        "request_id": request_id_var.get(),
                    },
                    exc_info=True,
                )
                raise

        # Return appropriate wrapper based on function type
        import asyncio

        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator


def init_sentry(dsn: str | None = None):
    """
    Initialize Sentry for error tracking.

    Usage:
        init_sentry(os.getenv("SENTRY_DSN"))
    """
    if not dsn:
        logger.info("Sentry DSN not provided, skipping Sentry initialization")
        return

    try:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

        sentry_sdk.init(
            dsn=dsn,
            environment=os.getenv("ENVIRONMENT", "production"),
            traces_sample_rate=0.1,  # 10% of transactions
            profiles_sample_rate=0.1,  # 10% of transactions
            integrations=[
                FastApiIntegration(),
                SqlalchemyIntegration(),
            ],
        )
        logger.info("Sentry initialized successfully")
    except ImportError:
        logger.warning("Sentry SDK not installed, skipping Sentry initialization")
    except Exception as exc:
        logger.error(f"Failed to initialize Sentry: {exc}", exc_info=True)


# Example usage in your app startup:
# from app.core.monitoring import init_sentry, RequestLoggingMiddleware
# init_sentry(os.getenv("SENTRY_DSN"))
# app.add_middleware(RequestLoggingMiddleware)
