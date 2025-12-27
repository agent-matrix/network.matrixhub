# Network MatrixHub - Production Deployment Guide

Complete guide for deploying Network MatrixHub to production on Render.com and Docker.

## 🚀 Quick Start (Docker)

### Prerequisites

- Docker Desktop installed
- Docker Compose included
- Git

### 1. Build and Run

```bash
# Build containers
make build-container

# Start all services
make run-container
```

### 2. Access Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: localhost:5432

### 3. Test Authentication

Test the new authentication endpoints:

```bash
# Register new user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"agent_id":"test-agent","email":"[email protected]","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Unit-734","password":"password123"}'

# Guest session
curl -X POST http://localhost:8000/api/auth/guest \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 🌐 Render.com Deployment

### 1. Connect Repository

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Click "New +" → "Blueprint"
4. Select your repository

### 2. Configure Environment

Render will automatically create:
- PostgreSQL database
- Backend web service
- Frontend static site

Set these environment variables in Render dashboard:

```bash
SECRET_KEY=<generate-with-python>
APP_DEBUG=false
WORKERS=4
```

Generate SECRET_KEY:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. Deploy

Render will auto-deploy on push to main branch.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/guest` - Guest session
- `GET /api/auth/profile/{user_id}` - Get user profile
- `POST /api/auth/logout` - Logout

### Entities
- `GET /api/entities` - List agents/tools/servers
- `GET /api/entities/{uid}` - Get entity details

### Health
- `GET /health` - Health check
- `GET /` - API information

## 🐳 Docker Commands

```bash
make build-container      # Build containers
make run-container        # Start services
make stop-container       # Stop services
make docker-logs          # View logs
make docker-ps            # List containers
make db-migrate           # Run migrations
make db-shell             # PostgreSQL shell
make clean-container      # Remove everything
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```bash
# Database
POSTGRES_USER=matrixhub
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=network_matrixhub

# Backend
APP_ENV=production
APP_DEBUG=false
SECRET_KEY=your-secret-key
BACKEND_CORS_ORIGINS=["https://your-frontend.com"]

# Server
BACKEND_PORT=8000
WORKERS=4
```

## 📝 Database Migrations

Migrations run automatically on startup. Manual control:

```bash
# Run migrations
make db-migrate

# Create new migration
cd backend
alembic revision --autogenerate -m "Description"

# Upgrade database
alembic upgrade head

# Downgrade
alembic downgrade -1
```

## 🔍 Troubleshooting

### Database Connection Failed

```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
docker-compose ps postgres

# View logs
docker-compose logs postgres
```

### CORS Errors

Add frontend URL to CORS origins:

```bash
BACKEND_CORS_ORIGINS=["https://your-frontend.com"]
```

### Port Already in Use

```bash
# Find process
lsof -i :8000

# Kill process
kill -9 <PID>

# Or change port
BACKEND_PORT=8001
```

## ✅ Production Checklist

- [ ] Set strong `SECRET_KEY`
- [ ] Set strong `POSTGRES_PASSWORD`
- [ ] Configure `CORS_ORIGINS`
- [ ] Set `APP_DEBUG=false`
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups
- [ ] Test all endpoints
- [ ] Test authentication flow
- [ ] Configure monitoring
- [ ] Set up error logging

## 📞 Support

- GitHub Issues: https://github.com/yourusername/network.matrixhub/issues
- Email: [email protected]
- Website: https://ruslanmv.com

## 📄 License

Apache 2.0
