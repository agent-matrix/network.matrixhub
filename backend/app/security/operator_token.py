"""Operator Token Authentication for Admin Endpoints.

This module provides a simple bearer token authentication dependency for
operator-only (admin) endpoints. It enforces fail-closed behavior in
production/staging environments.

Author:
    Ruslan Magana (ruslanmv.com)

License:
    Apache 2.0
"""

from __future__ import annotations

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import get_settings

_bearer = HTTPBearer(auto_error=False)


def require_operator_token(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> None:
    """Validate operator token for admin endpoints.

    This dependency enforces bearer token authentication for mutation endpoints.
    In production/staging environments, it fails closed if OPERATOR_TOKEN is not
    configured.

    Args:
        creds: HTTP Authorization credentials from the request header.

    Raises:
        HTTPException: 401 if token is missing or invalid.
        HTTPException: 500 if OPERATOR_TOKEN is not configured in production.

    Example:
        >>> @router.post("/admin/action", dependencies=[Depends(require_operator_token)])
        >>> def admin_action():
        ...     return {"ok": True}
    """
    settings = get_settings()
    expected = settings.OPERATOR_TOKEN

    # Fail-closed in production: require token to be configured
    if settings.APP_ENV in ("production", "staging", "prod") and not expected:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server misconfigured: OPERATOR_TOKEN/NETWORK_OPERATOR_TOKEN missing",
        )

    # In dev, allow if not configured (non-destructive for local development)
    if not expected:
        return

    provided = (creds.credentials if creds else "").strip()
    if not provided or provided != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: operator token required",
        )
