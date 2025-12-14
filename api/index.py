"""
Vercel serverless function entry point for FastAPI backend.
This file bridges Vercel's serverless infrastructure with the FastAPI app.
"""
from mangum import Mangum
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.main import app

# Mangum handler for AWS Lambda/Vercel serverless
handler = Mangum(app, lifespan="off")
