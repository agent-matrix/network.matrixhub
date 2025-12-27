"""Initial schema - Create entity table

Revision ID: 20241227_0001
Revises:
Create Date: 2024-12-27 12:00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20241227_0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create initial entity table and indexes."""

    # Create entity table
    op.create_table(
        'entity',
        sa.Column('uid', sa.String(), nullable=False),
        sa.Column('type', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('version', sa.String(), nullable=False),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('license', sa.String(), nullable=True),
        sa.Column('homepage', sa.String(), nullable=True),
        sa.Column('source_url', sa.String(), nullable=True),
        sa.Column('capabilities', sa.JSON(), nullable=True),
        sa.Column('frameworks', sa.JSON(), nullable=True),
        sa.Column('providers', sa.JSON(), nullable=True),
        sa.Column('protocols', sa.JSON(), nullable=True),
        sa.Column('manifests', sa.JSON(), nullable=True),
        sa.Column('readme_blob_ref', sa.String(), nullable=True),
        sa.Column('quality_score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('release_ts', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('uid')
    )

    # Create indexes for better query performance
    op.create_index('ix_entity_type', 'entity', ['type'])
    op.create_index('ix_entity_name', 'entity', ['name'])
    op.create_index('ix_entity_quality_score', 'entity', ['quality_score'])
    op.create_index('ix_entity_created_at', 'entity', ['created_at'])

    # Create trigger to automatically update updated_at
    op.execute("""
        CREATE TRIGGER update_entity_updated_at
        BEFORE UPDATE ON entity
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    """)

    # Insert sample data for development/testing
    op.execute("""
        INSERT INTO entity (uid, type, name, version, summary, description, capabilities, frameworks, providers, protocols, quality_score, created_at, updated_at)
        VALUES
        ('agent-autogpt-001', 'agent', 'AutoGPT Agent', '4.5.0',
         'Autonomous AI agent for complex task automation',
         'AutoGPT is a powerful autonomous agent that can break down complex tasks into smaller steps and execute them independently. It uses GPT-4 for reasoning and planning.',
         '["task_planning", "web_browsing", "code_execution", "memory_management"]'::json,
         '["langchain", "openai"]'::json,
         '["openai", "anthropic"]'::json,
         '["a2a@1.0", "mcp@0.1"]'::json,
         95.5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('agent-dataanalyzer-001', 'agent', 'DataAnalyzer Pro', '2.1.0',
         'Advanced data processing and analytics agent',
         'Specialized AI agent for real-time data analysis, predictive modeling, and business intelligence insights. Built with enterprise-grade performance.',
         '["data_analysis", "prediction", "visualization", "reporting"]'::json,
         '["pandas", "scikit-learn", "tensorflow"]'::json,
         '["openai", "anthropic"]'::json,
         '["a2a@1.0"]'::json,
         88.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('tool-webscraper-001', 'tool', 'WebScraper Plus', '1.8.2',
         'Intelligent web scraping and data extraction tool',
         'High-performance web scraping tool with AI-powered content extraction, automatic retry logic, and respect for robots.txt.',
         '["web_scraping", "data_extraction", "html_parsing"]'::json,
         '["beautifulsoup", "selenium", "scrapy"]'::json,
         '[]'::json,
         '["mcp@0.1"]'::json,
         82.3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('mcp-database-001', 'mcp_server', 'PostgreSQL MCP Server', '1.0.5',
         'MCP server for PostgreSQL database operations',
         'Model Context Protocol server providing secure access to PostgreSQL databases with query optimization and connection pooling.',
         '["database_query", "schema_introspection", "transaction_management"]'::json,
         '["postgresql", "sqlalchemy"]'::json,
         '[]'::json,
         '["mcp@0.1"]'::json,
         90.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    """)


def downgrade() -> None:
    """Drop entity table and related objects."""

    # Drop trigger
    op.execute("DROP TRIGGER IF EXISTS update_entity_updated_at ON entity")

    # Drop indexes
    op.drop_index('ix_entity_created_at', table_name='entity')
    op.drop_index('ix_entity_quality_score', table_name='entity')
    op.drop_index('ix_entity_name', table_name='entity')
    op.drop_index('ix_entity_type', table_name='entity')

    # Drop table
    op.drop_table('entity')
