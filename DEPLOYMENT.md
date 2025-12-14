# Deployment Guide - Network MatrixHub

This guide explains how to deploy the Network MatrixHub project to Vercel for production use.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Git repository with your code
- Backend API deployed (optional, can use environment variables to configure)

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
- **`vercel.json`**: Main Vercel configuration
- **`.vercelignore`**: Files to exclude from deployment

### Frontend Level
- **`frontend/vercel.json`**: Frontend-specific configuration
- **`frontend/.vercelignore`**: Frontend exclusions
- **`frontend/next.config.mjs`**: Next.js production configuration

## Environment Variables

Set these in the Vercel dashboard under Settings → Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `https://api.matrixhub.com` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Network MatrixHub` |

## Post-Deployment

After deployment:

1. **Test the Application**
   - Visit your Vercel URL
   - Test all routes: `/`, `/directory`, `/agents/[uid]`
   - Verify API connections work

2. **Set up Custom Domain** (Optional)
   - Go to your project settings in Vercel
   - Add your custom domain
   - Update DNS records as instructed

3. **Configure Production API**
   - Update `NEXT_PUBLIC_API_BASE_URL` to point to your production backend
   - Ensure CORS is configured on the backend to allow your Vercel domain

## Troubleshooting

### 404 Errors
If you see 404 errors:
- Ensure the root directory is set to `frontend`
- Check that `src/app` directory exists (not duplicate `app` folders)
- Verify build completed successfully

### Build Failures
If build fails:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors

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
│   └── vercel.json       # Vercel configuration
├── backend/              # Backend API (deploy separately)
├── vercel.json           # Root Vercel configuration
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
- ✅ Standalone output for optimal bundle size

## Support

For issues:
- Check Vercel build logs
- Review Next.js documentation: https://nextjs.org/docs
- File issues at: https://github.com/ruslanmv/network.matrixhub/issues

---

**Built with ❤️ by Ruslan Magana** | Licensed under Apache 2.0
