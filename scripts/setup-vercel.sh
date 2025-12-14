#!/bin/bash

# Vercel Setup Script for Network MatrixHub
# This script helps you set up your project for Vercel deployment

set -e

echo "🔧 Network MatrixHub - Vercel Setup Script"
echo "==========================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI is already installed"
fi

echo ""

# Login to Vercel
echo "🔐 Please login to Vercel..."
vercel login

echo ""

# Link project
echo "🔗 Linking project to Vercel..."
vercel link

echo ""

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "⚠️  Warning: .env.example not found"
else
    echo "📋 Environment variables template found"
    echo ""
    echo "📝 Required environment variables (set these in Vercel dashboard):"
    echo ""
    cat .env.example | grep -E "^[A-Z_]+=" | grep -v "^#" || true
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "📊 Next steps:"
echo "  1. Go to your Vercel dashboard: https://vercel.com/dashboard"
echo "  2. Select your project"
echo "  3. Go to Settings → Environment Variables"
echo "  4. Add the required environment variables from .env.example"
echo "  5. Run './scripts/deploy-vercel.sh' to deploy"
echo ""
echo "📘 For detailed instructions, see VERCEL_DEPLOYMENT.md"
echo ""
