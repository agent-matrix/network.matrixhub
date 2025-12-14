#!/bin/bash

# Vercel Deployment Script for Network MatrixHub
# This script helps you deploy the project to Vercel

set -e

echo "🚀 Network MatrixHub - Vercel Deployment Script"
echo "================================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is installed"
echo ""

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Are you in the project root?"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo ""

# Ask user for deployment type
echo "Select deployment type:"
echo "  1) Preview deployment (for testing)"
echo "  2) Production deployment"
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🔄 Starting preview deployment..."
        vercel
        ;;
    2)
        echo ""
        echo "⚠️  WARNING: This will deploy to production!"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo ""
            echo "🚀 Starting production deployment..."
            vercel --prod
        else
            echo "❌ Deployment cancelled."
            exit 0
        fi
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Next steps:"
echo "  - Check your deployment in the Vercel dashboard"
echo "  - Verify all environment variables are set"
echo "  - Test your deployed application"
echo "  - Monitor logs for any issues"
echo ""
