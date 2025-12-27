# Vercel Deployment Configuration

## Environment Variables (REQUIRED)

To make the AgentLink frontend work properly on Vercel, you **MUST** configure environment variables:

### 1. Go to Vercel Dashboard
- Navigate to: **Your Project → Settings → Environment Variables**

### 2. Add These Variables

#### Option A: With Backend (Production)
If you have a deployed backend:

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.com` | ✓ Production ✓ Preview ✓ Development |
| `NEXT_PUBLIC_MCP_URL` | `wss://your-backend-url.com/mcp` | ✓ Production ✓ Preview ✓ Development |

#### Option B: Demo Mode (No Backend)
The frontend will automatically fall back to demo mode if no backend is configured.

**Guest Login will work in demo mode** with mock data, but regular login/register will show an error message prompting users to use Guest mode.

### 3. Redeploy
After adding environment variables:
- Vercel will automatically trigger a new deployment
- OR manually trigger: **Deployments → ⋯ → Redeploy**

## Current Issue: "Failed to fetch"

The error occurs because:
1. ❌ No `NEXT_PUBLIC_API_URL` is set in Vercel
2. ❌ Frontend tries to connect to `http://localhost:8000` (doesn't exist on Vercel)

## Solution Applied

I've updated the code to:
✅ **Guest mode now works WITHOUT a backend** (uses mock data)
✅ Login/Register show helpful error messages when backend is missing
✅ Automatic fallback to demo mode

## How to Test

### Test Guest Login (No Backend Required)
1. Click "Join Now" or "Sign In"
2. Click "Continue as Guest"
3. ✅ Should work even without backend configuration

### Test with Backend
1. Set `NEXT_PUBLIC_API_URL` in Vercel
2. Redeploy
3. Try login with real credentials

## Backend Deployment Options

### Option 1: Deploy Backend to Railway/Render
```bash
# Backend is in /backend directory
# Deploy to Railway, Render, or Heroku
# Get the URL (e.g., https://your-app.railway.app)
```

### Option 2: Use Vercel for Backend
```bash
# Note: Vercel can host the API as serverless functions
# But FastAPI works better on Railway/Render
```

### Option 3: Demo Mode Only
- No backend needed
- Guest mode uses mock data
- Perfect for showcasing the UI

## Quick Fix Steps

**Immediate Solution (Demo Mode):**
1. No configuration needed
2. Users can click "Continue as Guest"
3. ✅ Works immediately

**Production Solution:**
1. Deploy backend to Railway/Render/Fly.io
2. Get backend URL
3. Add to Vercel environment variables
4. Redeploy

## Verification

After deployment, check:
```bash
# In browser console, you should see:
console.log(process.env.NEXT_PUBLIC_API_URL)
# Should show your backend URL or undefined (demo mode)
```
