# Vercel Deployment Guide

This guide will help you deploy the Network MatrixHub project to Vercel for production use.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Environment Variables](#environment-variables)
- [Database Configuration](#database-configuration)
- [Custom Domain](#custom-domain)
- [CI/CD Setup](#cicd-setup)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying to Vercel, ensure you have:

1. A [Vercel account](https://vercel.com/signup) (free or paid)
2. A [GitHub](https://github.com) account
3. A PostgreSQL database (Vercel Postgres, Supabase, Railway, etc.)
4. Git installed locally
5. Node.js 20+ and npm installed

---

## Quick Start

### 1. Fork/Clone the Repository

```bash
git clone https://github.com/your-org/network.matrixhub.git
cd network.matrixhub
```

### 2. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 3. Deploy to Vercel

You have two options:

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Add environment variables (see below)
6. Click "Deploy"

#### Option B: Deploy via CLI

```bash
vercel
```

Follow the prompts to link your project and deploy.

---

## Detailed Setup

### Project Structure

This is a monorepo with:

- **Frontend**: Next.js 14 (App Router) in `frontend/`
- **Backend**: FastAPI in `backend/` (deployed as Vercel serverless functions via `api/`)

### Vercel Configuration

The project includes a `vercel.json` file that configures:

- Build settings for both frontend and backend
- Routing rules (API routes to backend, everything else to frontend)
- Security headers
- CORS policies
- Output directories

---

## Environment Variables

### Required Environment Variables

Set these in the Vercel dashboard (Settings → Environment Variables):

#### Production Environment

```bash
# Application
NEXT_PUBLIC_APP_NAME="Network MatrixHub"
NEXT_PUBLIC_API_BASE_URL="https://your-domain.com"

# Database (Use Vercel Postgres or external PostgreSQL)
DATABASE_URL="postgresql+psycopg://user:password@host:5432/matrixhub"
# OR use Vercel Postgres auto-generated variables:
POSTGRES_URL="postgres://..."

# Backend Configuration
APP_ENV="production"
APP_DEBUG=false
LOG_LEVEL="INFO"

# CORS (Your production domain)
CORS_ORIGINS="https://your-domain.com,https://www.your-domain.com"

# Security
SECRET_KEY="your-production-secret-key-change-this"
API_KEY="your-api-key-for-external-access"

# MCP Gateway (Optional)
MCP_GATEWAY_URL="https://your-gateway.example.com"
MCP_GATEWAY_TOKEN="your-gateway-token"
A2A_REGISTER_ENABLED=true
```

#### Analytics & Monitoring (Optional)

```bash
# Google Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Sentry
NEXT_PUBLIC_SENTRY_DSN="https://xxx@sentry.io/xxx"
SENTRY_DSN="https://xxx@sentry.io/xxx"

# Feature Flags
NEXT_PUBLIC_ENABLE_AUTH=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Environment Variable Scopes

- **Production**: Used for production deployments
- **Preview**: Used for PR preview deployments
- **Development**: Used for local development

Set different values for each scope as needed.

---

## Database Configuration

### Option 1: Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database
3. Select "Postgres"
4. Vercel will automatically add these environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

5. The backend will automatically use `POSTGRES_URL` as `DATABASE_URL`

### Option 2: External PostgreSQL

Use any PostgreSQL provider:

- [Supabase](https://supabase.com) (Free tier available)
- [Railway](https://railway.app)
- [Neon](https://neon.tech)
- [Render](https://render.com)
- AWS RDS, Google Cloud SQL, etc.

Set the connection string:

```bash
DATABASE_URL="postgresql+psycopg://user:password@host:port/database"
```

### Database Migrations

Run migrations before deploying:

```bash
cd backend
uv run alembic upgrade head
```

---

## Custom Domain

### Adding a Custom Domain

1. Go to your Vercel project
2. Navigate to Settings → Domains
3. Add your domain (e.g., `network.matrixhub.io`)
4. Configure DNS:
   - **A Record**: Point to `76.76.21.21`
   - **CNAME**: Point to `cname.vercel-dns.com`

5. Vercel will automatically provision SSL certificates

### Update Environment Variables

After adding a custom domain, update:

```bash
NEXT_PUBLIC_API_BASE_URL="https://your-custom-domain.com"
CORS_ORIGINS="https://your-custom-domain.com"
```

---

## CI/CD Setup

### GitHub Actions

The project includes GitHub Actions workflows in `.github/workflows/`:

1. **`ci.yml`**: Runs linting, testing, and deployment
2. **`dependency-review.yml`**: Reviews dependencies for security

### Required GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```
VERCEL_TOKEN          # Get from Vercel → Settings → Tokens
VERCEL_ORG_ID         # Get from Vercel project settings
VERCEL_PROJECT_ID     # Get from Vercel project settings
```

### How to Get Vercel Credentials

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Get project details
cat .vercel/project.json
```

### Deployment Flow

- **Pull Requests**: Automatic preview deployments
- **Main Branch**: Automatic production deployments
- **Manual**: Deploy via Vercel dashboard or CLI

---

## Monitoring & Analytics

### Frontend Monitoring

The project includes monitoring utilities in `frontend/src/lib/monitoring.ts`.

#### Google Analytics

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Add to Vercel environment variables:
   ```bash
   NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
   ```

#### Sentry (Error Tracking)

1. Create a project at [sentry.io](https://sentry.io)
2. Get your DSN
3. Add to environment variables:
   ```bash
   NEXT_PUBLIC_SENTRY_DSN="https://xxx@sentry.io/xxx"
   ```

### Backend Monitoring

#### Sentry for Backend

```bash
SENTRY_DSN="https://xxx@sentry.io/xxx"
```

#### Vercel Analytics

Enable in Vercel dashboard:
- Settings → Analytics → Enable

#### Custom Logging

The backend includes structured logging. View logs in:
- Vercel dashboard → Logs
- Or integrate with external services (DataDog, LogDNA, etc.)

---

## Production Optimizations

### Frontend

- ✅ React Strict Mode enabled
- ✅ SWC minification
- ✅ Image optimization (AVIF, WebP)
- ✅ Security headers (CSP, HSTS, etc.)
- ✅ Console logs removed in production
- ✅ Gzip compression
- ✅ Standalone output mode

### Backend

- ✅ CORS configured
- ✅ Gzip compression middleware
- ✅ Security headers
- ✅ Error handling & logging
- ✅ Database connection pooling
- ✅ Request/response validation

### Performance

- **CDN**: Vercel Edge Network (global)
- **Caching**: Automatic for static assets
- **Serverless Functions**: Auto-scaling
- **Cold Starts**: Optimized via standalone mode

---

## Troubleshooting

### Build Failures

**Issue**: `npm install` fails in frontend

```bash
# Solution: Clear npm cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Python dependencies fail

```bash
# Solution: Ensure requirements.txt is in api/
# Vercel looks for api/requirements.txt for Python functions
```

### Runtime Errors

**Issue**: Database connection fails

- Verify `DATABASE_URL` is set correctly
- Check database is accessible from Vercel's IP ranges
- Ensure connection string format: `postgresql+psycopg://...`

**Issue**: CORS errors

- Add your domain to `CORS_ORIGINS`
- Format: `https://domain1.com,https://domain2.com`

**Issue**: 504 Gateway Timeout

- Serverless functions have a 10-second timeout on Hobby plan
- Optimize database queries
- Consider upgrading to Pro plan (60-second timeout)

### Environment Variables

**Issue**: Environment variables not updating

- Redeploy after changing environment variables
- Check the correct scope (Production/Preview/Development)
- Verify variable names match exactly

---

## Deployment Checklist

Before deploying to production:

- [ ] Database is set up and accessible
- [ ] All environment variables are configured
- [ ] Custom domain is configured (if applicable)
- [ ] SSL certificate is provisioned
- [ ] CORS origins include production domain
- [ ] `SECRET_KEY` is set to a secure random value
- [ ] `APP_DEBUG` is set to `false`
- [ ] Analytics/monitoring is configured
- [ ] GitHub Actions secrets are set (if using CI/CD)
- [ ] Test preview deployment first
- [ ] Run database migrations
- [ ] Update `NEXT_PUBLIC_API_BASE_URL` to production URL

---

## Security Best Practices

1. **Never commit secrets** to git (use `.env.local`, `.env`)
2. **Rotate secrets** regularly
3. **Use strong passwords** for database and API keys
4. **Enable 2FA** on Vercel and GitHub accounts
5. **Review dependencies** for vulnerabilities (GitHub Dependabot)
6. **Monitor logs** for suspicious activity
7. **Keep dependencies updated**

---

## Scaling Considerations

### Vercel Limits (Hobby Plan)

- **Bandwidth**: 100GB/month
- **Serverless Function Execution**: 100GB-hours/month
- **Build Execution**: 6000 minutes/month
- **Function Duration**: 10 seconds max

### When to Upgrade to Pro

- High traffic (>100GB bandwidth)
- Long-running functions (>10 seconds)
- Need more team members
- Require advanced analytics

### Alternative Scaling Options

If you outgrow Vercel:

- **Frontend**: Deploy Next.js to Cloudflare Pages, AWS Amplify, Netlify
- **Backend**: Deploy FastAPI to:
  - AWS ECS/EKS (Docker)
  - Google Cloud Run
  - Railway
  - Render
  - Fly.io

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **FastAPI Documentation**: https://fastapi.tiangolo.com
- **Project Issues**: https://github.com/your-org/network.matrixhub/issues

---

## License

See LICENSE file in the repository.

---

**Congratulations!** 🎉 Your Network MatrixHub is now deployed to Vercel and ready for production use.
