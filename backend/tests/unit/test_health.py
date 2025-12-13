"""Unit Tests for Health Check Endpoint.

Author:
    Ruslan Magana (ruslanmv.com)

License:
    Apache 2.0
"""

import pytest
from fastapi import status


def test_health_endpoint(client):
    """Test that health endpoint returns ok status."""
    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "ok"
    assert "app" in data


def test_root_endpoint(client):
    """Test that root endpoint returns API information."""
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "name" in data
    assert "version" in data
    assert data["author"] == "Ruslan Magana"
    assert data["website"] == "https://ruslanmv.com"
