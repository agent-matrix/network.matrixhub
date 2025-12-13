# Tests Directory

This directory contains comprehensive tests for the Network MatrixHub backend API.

## Structure

```
tests/
├── __init__.py           # Test package initialization
├── conftest.py           # Pytest configuration and shared fixtures
├── unit/                 # Unit tests for individual components
│   └── test_health.py    # Health check endpoint tests
├── integration/          # Integration tests for API endpoints
└── fixtures/             # Test data and fixtures
```

## Running Tests

```bash
# Run all tests
make test-backend

# Run tests with coverage
make coverage-backend

# Run specific test file
cd backend && uv run pytest tests/unit/test_health.py -v

# Run tests matching a pattern
cd backend && uv run pytest tests/ -k "health" -v
```

## Writing Tests

Tests use:
- **pytest** for test framework
- **FastAPI TestClient** for API testing
- **SQLAlchemy** in-memory database for isolation

Example test:

```python
def test_example(client, db_session):
    """Test description."""
    response = client.get("/api/endpoint")
    assert response.status_code == 200
```

## Author

Ruslan Magana (ruslanmv.com)

## License

Apache 2.0
