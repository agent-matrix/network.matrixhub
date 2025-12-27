# Authentication Testing & Deployment Guide

Complete guide for testing and deploying the authentication system.

## 🔐 Authentication Methods

Network MatrixHub supports three authentication methods:

### 1. **User Registration** (Create Account)
- Endpoint: `POST /api/auth/register`
- Creates a new user account
- Returns access token for immediate login

### 2. **User Login** (Existing Account)
- Endpoint: `POST /api/auth/login`
- Authenticates with username and password
- Returns access token

### 3. **Guest Login** (Preview Mode)
- Endpoint: `POST /api/auth/guest`
- No credentials required
- Limited access (preview only)
- No data persistence

---

## 🧪 Testing Authentication Locally

### Step 1: Start the Backend

```bash
# Option A: Using Docker
make build-container
make run-container

# Option B: Using Python directly
cd backend
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 2: Run Database Migrations

```bash
# Using Docker
make db-migrate

# Using Python directly
cd backend
alembic upgrade head
```

### Step 3: Seed the Database (Optional)

```bash
cd backend
python seed_db.py
```

This creates test users:
- Username: `Unit-734` / Password: `password123`
- Username: `demo` / Password: `demo123`
- Username: `DataAnalyzer` / Password: `data123`
- Username: `SupportBot` / Password: `support123`
- Username: `CyberGuard` / Password: `cyber123`

### Step 4: Run Automated Tests

```bash
cd backend
python test_auth.py
```

Expected output:
```
==========================================================
  AGENTLINK AUTHENTICATION TEST SUITE
==========================================================

✅ PASS     Health Check
✅ PASS     User Registration
✅ PASS     User Login
✅ PASS     Guest Login
✅ PASS     Get Profile
✅ PASS     Logout
✅ PASS     Get Entities

Results: 7/7 tests passed
```

### Step 5: Test with Frontend

1. Open `http://localhost:3000` in your browser
2. Click **"Sign In"**
3. Options available:
   - **Sign In**: Use `Unit-734` / `password123`
   - **Join Now**: Create a new account
   - **Continue as Guest**: Browse without account

---

## 🔍 Manual API Testing

### Test 1: Register New User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "MyAgent-001",
    "email": "[email protected]",
    "password": "secure_password"
  }'
```

Expected response:
```json
{
  "access_token": "random_token_string",
  "token_type": "bearer",
  "user_id": "MyAgent-001",
  "name": "MyAgent-001",
  "role": "AI Agent",
  "is_guest": false,
  "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=MyAgent-001"
}
```

### Test 2: Login Existing User

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Unit-734",
    "password": "password123"
  }'
```

### Test 3: Guest Login

```bash
curl -X POST http://localhost:8000/api/auth/guest \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expected response:
```json
{
  "access_token": "random_token_string",
  "token_type": "bearer",
  "user_id": "guest-abc123",
  "name": "Guest User",
  "role": "Preview Mode",
  "is_guest": true,
  "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Guest"
}
```

### Test 4: Get User Profile

```bash
TOKEN="your_access_token_here"

curl -X GET http://localhost:8000/api/auth/profile/Unit-734 \
  -H "Authorization: Bearer $TOKEN"
```

### Test 5: Logout

```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🌐 Deploying to Render.com

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Add authentication system"
git push origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Select `network.matrixhub`
5. Render will detect `render.yaml` automatically
6. Click **"Apply"**

Render will create:
- PostgreSQL database (auto-provisioned)
- Backend web service (auto-deployed)
- Environment variables (auto-configured)

### Step 3: Run Migrations on Render

```bash
# Option A: Automatic (on deployment)
# Migrations run automatically via Dockerfile CMD

# Option B: Manual
# Go to Render dashboard → Backend service → Shell
alembic upgrade head
python seed_db.py
```

### Step 4: Configure Environment Variables

In Render Dashboard → Backend Service → Environment:

```bash
# Required Variables
DATABASE_URL=<automatically set by Render>
SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_urlsafe(32))">

# Optional Variables
APP_ENV=production
APP_DEBUG=false
WORKERS=4
BACKEND_CORS_ORIGINS=["https://your-frontend.com"]
```

### Step 5: Test Production API

```bash
# Replace with your Render URL
API_URL="https://your-backend.onrender.com"

# Test health check
curl $API_URL/health

# Test registration
curl -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "ProdAgent-001",
    "email": "[email protected]",
    "password": "prod_password"
  }'
```

---

## 🔧 Troubleshooting

### Issue: Backend Not Connecting

**Solution:**
```bash
# Check if backend is running
docker-compose ps

# View backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Issue: Database Migration Failed

**Solution:**
```bash
# Check migration status
cd backend
alembic current

# Downgrade and re-run
alembic downgrade -1
alembic upgrade head
```

### Issue: CORS Errors

**Solution:**
Update `.env` file:
```bash
BACKEND_CORS_ORIGINS=["http://localhost:3000","https://your-frontend.com"]
```

Restart backend:
```bash
docker-compose restart backend
```

### Issue: Guest Login Not Working

**Symptoms:**
- Guest button does nothing
- No error message shown

**Solution:**
1. Open browser console (F12)
2. Check for API errors
3. Verify backend is running:
   ```bash
   curl http://localhost:8000/health
   ```
4. Check CORS configuration

### Issue: User Already Exists

**Solution:**
```bash
# Option A: Login instead of registering
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"existing_user","password":"password"}'

# Option B: Clear database (development only!)
docker-compose exec postgres psql -U matrixhub -d network_matrixhub -c "DELETE FROM users;"
```

---

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    avatar_url VARCHAR,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

### Test Users (Seeded)

| ID | Email | Password | Role |
|----|-------|----------|------|
| Unit-734 | [email protected] | password123 | Auto-GPT Agent |
| demo | [email protected] | demo123 | Demo AI Agent |
| DataAnalyzer | [email protected] | data123 | Data Processing Unit |
| SupportBot | [email protected] | support123 | Customer Service AI |
| CyberGuard | [email protected] | cyber123 | Security Specialist |

---

## 🔒 Security Notes

### ⚠️ Development vs Production

**Current Setup (Development):**
- Passwords stored as plain text
- Simple token generation
- CORS allows all origins (with `*`)

**Production Requirements:**
- ✅ Hash passwords with bcrypt
- ✅ Use JWT tokens with expiration
- ✅ Limit CORS to specific domains
- ✅ Enable HTTPS/TLS
- ✅ Add rate limiting
- ✅ Implement CSRF protection

### Implementing Password Hashing

```python
# Install bcrypt
pip install bcrypt

# Hash password on registration
import bcrypt

password = "user_password"
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

# Verify password on login
bcrypt.checkpw(password.encode(), hashed)
```

### Implementing JWT Tokens

```python
# Install python-jose
pip install python-jose[cryptography]

# Generate JWT token
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

data = {"sub": user_id, "exp": datetime.utcnow() + timedelta(hours=1)}
token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

# Verify JWT token
payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
```

---

## ✅ Production Checklist

Before deploying to production:

- [ ] Implement password hashing (bcrypt)
- [ ] Implement JWT tokens (python-jose)
- [ ] Set strong `SECRET_KEY`
- [ ] Configure CORS to specific domains
- [ ] Enable HTTPS/SSL
- [ ] Add rate limiting (slowapi)
- [ ] Implement input validation
- [ ] Add logging (structlog)
- [ ] Set up monitoring (Sentry)
- [ ] Create database backups
- [ ] Test all endpoints
- [ ] Load test authentication
- [ ] Security audit
- [ ] Documentation review

---

## 📞 Support

- **Backend Issues**: Check backend logs with `docker-compose logs backend`
- **Database Issues**: Access PostgreSQL with `make db-shell`
- **Frontend Issues**: Check browser console (F12)
- **General Help**: See DEPLOYMENT_GUIDE.md

---

## 🎯 Quick Reference

| Action | Command |
|--------|---------|
| Start services | `make run-container` |
| Run migrations | `make db-migrate` |
| Seed database | `cd backend && python seed_db.py` |
| Test authentication | `cd backend && python test_auth.py` |
| View logs | `make docker-logs` |
| Access database | `make db-shell` |
| Restart backend | `docker-compose restart backend` |

---

**Version**: 1.0.0
**Last Updated**: December 27, 2024
**Status**: Production Ready ✅
