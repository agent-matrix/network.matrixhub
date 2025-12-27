#!/usr/bin/env python3
"""Database seeding script for development and testing.

This script populates the database with sample data for development.
Run this after database migrations to get a fully populated database.

Usage:
    python seed_db.py
"""

import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent))

from app.db.session import SessionLocal, engine
from app.models.entity import Base, Entity
from sqlalchemy import text

def seed_database():
    """Seed the database with sample data."""

    print("🌱 Starting database seeding...")

    # Create all tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Clear existing data (for development only!)
        print("  ⚠️  Clearing existing data...")
        db.execute(text("DELETE FROM entity"))
        db.commit()

        # Seed entities (AI agents, tools, MCP servers)
        print("  📦 Seeding entities...")

        entities = [
            Entity(
                uid="agent-autogpt-001",
                type="agent",
                name="AutoGPT Agent",
                version="4.5.0",
                summary="Autonomous AI agent for complex task automation",
                description="AutoGPT is a powerful autonomous agent that can break down complex tasks into smaller steps and execute them independently. It uses GPT-4 for reasoning and planning.",
                capabilities=["task_planning", "web_browsing", "code_execution", "memory_management"],
                frameworks=["langchain", "openai"],
                providers=["openai", "anthropic"],
                protocols=["a2a@1.0", "mcp@0.1"],
                quality_score=95.5,
                license="MIT",
                homepage="https://github.com/Significant-Gravitas/Auto-GPT",
                source_url="https://github.com/Significant-Gravitas/Auto-GPT",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            Entity(
                uid="agent-dataanalyzer-001",
                type="agent",
                name="DataAnalyzer Pro",
                version="2.1.0",
                summary="Advanced data processing and analytics agent",
                description="Specialized AI agent for real-time data analysis, predictive modeling, and business intelligence insights. Built with enterprise-grade performance.",
                capabilities=["data_analysis", "prediction", "visualization", "reporting"],
                frameworks=["pandas", "scikit-learn", "tensorflow"],
                providers=["openai", "anthropic"],
                protocols=["a2a@1.0"],
                quality_score=88.0,
                license="Apache-2.0",
                homepage="https://example.com/dataanalyzer",
                source_url="https://github.com/example/dataanalyzer",
                created_at=datetime.utcnow() - timedelta(days=30),
                updated_at=datetime.utcnow() - timedelta(days=5)
            ),
            Entity(
                uid="tool-webscraper-001",
                type="tool",
                name="WebScraper Plus",
                version="1.8.2",
                summary="Intelligent web scraping and data extraction tool",
                description="High-performance web scraping tool with AI-powered content extraction, automatic retry logic, and respect for robots.txt.",
                capabilities=["web_scraping", "data_extraction", "html_parsing"],
                frameworks=["beautifulsoup", "selenium", "scrapy"],
                providers=[],
                protocols=["mcp@0.1"],
                quality_score=82.3,
                license="GPL-3.0",
                homepage="https://example.com/webscraper",
                source_url="https://github.com/example/webscraper",
                created_at=datetime.utcnow() - timedelta(days=60),
                updated_at=datetime.utcnow() - timedelta(days=10)
            ),
            Entity(
                uid="mcp-database-001",
                type="mcp_server",
                name="PostgreSQL MCP Server",
                version="1.0.5",
                summary="MCP server for PostgreSQL database operations",
                description="Model Context Protocol server providing secure access to PostgreSQL databases with query optimization and connection pooling.",
                capabilities=["database_query", "schema_introspection", "transaction_management"],
                frameworks=["postgresql", "sqlalchemy"],
                providers=[],
                protocols=["mcp@0.1"],
                quality_score=90.0,
                license="PostgreSQL",
                homepage="https://example.com/pg-mcp",
                source_url="https://github.com/example/pg-mcp",
                created_at=datetime.utcnow() - timedelta(days=15),
                updated_at=datetime.utcnow() - timedelta(days=2)
            ),
            Entity(
                uid="agent-supportbot-001",
                type="agent",
                name="SupportBot 3000",
                version="3.2.1",
                summary="24/7 customer support automation agent",
                description="Advanced customer service AI with natural language processing, sentiment analysis, and multi-language support.",
                capabilities=["customer_support", "sentiment_analysis", "multi_language", "ticket_routing"],
                frameworks=["transformers", "spacy", "fastapi"],
                providers=["openai", "cohere"],
                protocols=["a2a@1.0", "mcp@0.1"],
                quality_score=87.5,
                license="MIT",
                homepage="https://example.com/supportbot",
                source_url="https://github.com/example/supportbot",
                created_at=datetime.utcnow() - timedelta(days=45),
                updated_at=datetime.utcnow() - timedelta(days=7)
            ),
            Entity(
                uid="agent-cyberguard-001",
                type="agent",
                name="CyberGuard AI",
                version="2.5.3",
                summary="Cybersecurity threat detection and response",
                description="Real-time security monitoring, threat detection, and automated incident response system powered by machine learning.",
                capabilities=["threat_detection", "log_analysis", "incident_response", "vulnerability_scanning"],
                frameworks=["tensorflow", "pytorch", "elasticsearch"],
                providers=["anthropic"],
                protocols=["a2a@1.0"],
                quality_score=93.2,
                license="Commercial",
                homepage="https://example.com/cyberguard",
                source_url="https://github.com/example/cyberguard",
                created_at=datetime.utcnow() - timedelta(days=90),
                updated_at=datetime.utcnow() - timedelta(days=3)
            ),
            Entity(
                uid="tool-code-analyzer-001",
                type="tool",
                name="CodeAnalyzer Pro",
                version="1.5.0",
                summary="Advanced code quality analysis and refactoring tool",
                description="Automated code review tool that identifies bugs, security vulnerabilities, and code smells across multiple programming languages.",
                capabilities=["static_analysis", "security_scan", "code_quality", "refactoring_suggestions"],
                frameworks=["ast", "tree-sitter", "sonarqube"],
                providers=[],
                protocols=["mcp@0.1"],
                quality_score=85.0,
                license="Apache-2.0",
                homepage="https://example.com/codeanalyzer",
                source_url="https://github.com/example/codeanalyzer",
                created_at=datetime.utcnow() - timedelta(days=20),
                updated_at=datetime.utcnow() - timedelta(days=1)
            )
        ]

        db.add_all(entities)
        db.commit()

        print(f"  ✅ Seeded {len(entities)} entities successfully!")

        # Display summary
        print("\n📊 Database Seeding Summary:")
        print(f"  - Agents: {len([e for e in entities if e.type == 'agent'])}")
        print(f"  - Tools: {len([e for e in entities if e.type == 'tool'])}")
        print(f"  - MCP Servers: {len([e for e in entities if e.type == 'mcp_server'])}")

        print("\n🎉 Database seeding completed successfully!")
        print("\n💡 Test users (username / password):")
        print("  - Unit-734 / password123")
        print("  - demo / demo123")
        print("  - DataAnalyzer / data123")
        print("  - SupportBot / support123")
        print("  - CyberGuard / cyber123")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
