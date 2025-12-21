# Deployment Guide - Network MatrixHub

This guide explains how to deploy the Network MatrixHub project to Vercel for production use.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Git repository with your code
- **Backend API deployed** (REQUIRED - see [Backend Deployment](#backend-deployment) section below)

## Local Testing Before Deployment

Before deploying to Vercel, test the production build locally:

```bash
# Build the production version (simulates Vercel build process)
make build

# Serve the production build locally at http://localhost:3000
make serve
```

This ensures your application builds successfully and works as expected before deploying to Vercel.

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub/GitLab/Bitbucket repository
   - Select the repository containing this project

2. **Configure Project**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` (important!)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

3. **Environment Variables**
   Add the following environment variable in the Vercel dashboard:

   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
   ```

   Or use the default (localhost:8000) for testing.

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a production URL like `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project root
cd /path/to/network.matrixhub

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy: Yes
# - Which scope: Your account
# - Link to existing project: No
# - Project name: network-matrixhub (or your choice)
# - In which directory is your code located: frontend
# - Override settings: No

# For production deployment
vercel --prod
```

## Configuration Files

The project includes pre-configured Vercel deployment files:

### Root Level
- **`.vercelignore`**: Files to exclude from deployment

### Frontend Level
- **`frontend/vercel.json`**: Vercel configuration (framework, build commands, regions)
- **`frontend/.vercelignore`**: Frontend exclusions
- **`frontend/next.config.mjs`**: Next.js production configuration

**Important**: The Root Directory must be set to `frontend` in the Vercel dashboard project settings, as `vercel.json` does not support the `rootDirectory` property.

## Environment Variables

Set these in the Vercel dashboard under Settings → Environment Variables:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `https://api.matrixhub.com` | **Yes** |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Network MatrixHub` | No |

**IMPORTANT**: You MUST set `NEXT_PUBLIC_API_BASE_URL` to your deployed backend URL. The frontend uses Next.js rewrites to proxy all `/api/*` requests to your backend. If this environment variable is not set, API calls will fail with 404 errors.

## Backend Deployment

**CRITICAL**: The frontend requires a separately deployed FastAPI backend. The backend cannot be deployed to Vercel alongside the frontend.

### Recommended Backend Hosting Options

Choose one of these platforms to deploy your backend:

1. **Render** (Recommended)
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository
   - Set **Root Directory** to `backend`
   - Set **Build Command**: `pip install -r requirements.txt`
   - Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables (see `backend/.env.example`)
   - Deploy

2. **Railway**
   - Go to [railway.app](https://railway.app)
   - Create a new project from your GitHub repository
   - Set root directory to `backend`
   - Railway will auto-detect the Python app
   - Configure environment variables
   - Deploy

3. **Fly.io**
   - Install flyctl CLI
   - Navigate to `backend/` directory
   - Run `fly launch`
   - Configure as needed
   - Run `fly deploy`

4. **DigitalOcean App Platform**
   - Create a new app from your GitHub repository
   - Select the `backend` directory
   - Choose Python as the runtime
   - Configure environment variables
   - Deploy

### Backend Environment Variables

Your backend deployment needs these environment variables (see `infra/.env.backend.example`):

```bash
APP_NAME="Network MatrixHub IO Backend"
APP_ENV="production"
APP_DEBUG=false
DATABASE_URL="postgresql+psycopg2://user:password@host:5432/matrixhub"
BACKEND_CORS_ORIGINS='["https://your-vercel-app.vercel.app"]'
```

**Important**: Update `BACKEND_CORS_ORIGINS` to include your Vercel deployment URL(s).

### After Backend Deployment

Once your backend is deployed:

1. Copy the backend URL (e.g., `https://your-backend.onrender.com`)
2. Go to your Vercel project → Settings → Environment Variables
3. Set `NEXT_PUBLIC_API_BASE_URL` to your backend URL
4. Redeploy your Vercel frontend

## Post-Deployment

After deployment:

1. **Test the Application**
   - Visit your Vercel URL
   - Open browser DevTools → Network tab
   - Test all routes: `/`, `/directory`, `/agents/[uid]`
   - Verify API calls in Network tab show:
     - Request URL: `/api/entities` (stays on same domain)
     - Status: 200 OK
     - Response: JSON data from backend

2. **Set up Custom Domain** (Optional)
   - Go to your project settings in Vercel
   - Add your custom domain
   - Update DNS records as instructed
   - **Important**: Update backend `BACKEND_CORS_ORIGINS` to include your custom domain

3. **Configure Production API**
   - Ensure `NEXT_PUBLIC_API_BASE_URL` points to your production backend
   - Ensure backend CORS allows your Vercel domain(s)

## Troubleshooting

### ⚠️ "No Next.js version detected" Error

**This is the most common deployment error!**

If you see this error:
```
Error: No Next.js version detected. Make sure your package.json has "next"
in either "dependencies" or "devDependencies".
```

**Solution**: Set the **Root Directory** to `frontend` in your Vercel project settings:

1. Go to your project in the Vercel dashboard
2. Click **Settings** → **General**
3. Find **Root Directory** section
4. Enter: `frontend`
5. Click **Save**
6. Redeploy your project

This tells Vercel where to find the `package.json` file with Next.js dependencies.

### 404 Errors on API Calls

If you see 404 errors like `404: NOT_FOUND` from Vercel when calling `/api/entities`:

**Root Cause**: The backend is not deployed or `NEXT_PUBLIC_API_BASE_URL` is not set correctly.

**Solution**:
1. Deploy your backend to a hosting platform (see [Backend Deployment](#backend-deployment))
2. Set `NEXT_PUBLIC_API_BASE_URL` in Vercel → Settings → Environment Variables
3. Redeploy your Vercel frontend
4. Verify in DevTools that API calls are being proxied to your backend

**How it works**: The frontend uses Next.js rewrites (configured in `frontend/next.config.mjs`) to proxy all `/api/*` requests to your backend URL. This keeps the frontend and API on the same domain, avoiding CORS issues.

### 404 Errors on Pages
If you see 404 errors on pages:
- Ensure the root directory is set to `frontend`
- Check that `src/app` directory exists (not duplicate `app` folders)
- Verify build completed successfully

### Build Failures
If build fails:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors
- Test locally first with `make build` command

### API Connection Issues
If API calls fail:
- Check `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Verify backend CORS allows your Vercel domain
- Check network requests in browser DevTools

## Architecture

```
network.matrixhub/
├── frontend/              # Next.js application (deployed to Vercel)
│   ├── src/
│   │   └── app/          # App router pages
│   ├── .env.local        # Local environment (not committed)
│   ├── .env.example      # Example environment variables
│   ├── .vercelignore     # Files excluded from deployment
│   └── vercel.json       # Vercel configuration
├── backend/              # Backend API (deploy separately)
└── .vercelignore         # Files excluded from deployment
```

## CI/CD

Vercel automatically:
- Builds on every push to your main branch
- Creates preview deployments for pull requests
- Rolls back on build failures
- Optimizes assets and caching

## Performance Optimization

The project is configured with:
- ✅ Next.js SWC minification
- ✅ Static page generation where possible
- ✅ Image optimization
- ✅ Security headers
- ✅ Optimized for Vercel deployment

## Support

For issues:
- Check Vercel build logs
- Review Next.js documentation: https://nextjs.org/docs
- File issues at: https://github.com/ruslanmv/network.matrixhub/issues

---

**Built with ❤️ by Ruslan Magana** | Licensed under Apache 2.0
