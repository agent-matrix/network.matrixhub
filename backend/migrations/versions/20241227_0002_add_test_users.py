"""Add test users for development

Revision ID: 20241227_0002
Revises: 20241227_0001
Create Date: 2024-12-27 12:30:00

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '20241227_0002'
down_revision = '20241227_0001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create users table and insert test users."""

    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=False),
        sa.Column('avatar_url', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )

    # Create indexes
    op.create_index('ix_users_email', 'users', ['email'])
    op.create_index('ix_users_id', 'users', ['id'])

    # Create trigger to automatically update updated_at
    op.execute("""
        CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    """)

    # Insert test users
    # Note: In production, passwords should be properly hashed with bcrypt
    # For demo/development, we're using plain text (DO NOT DO THIS IN PRODUCTION!)
    op.execute("""
        INSERT INTO users (id, email, password_hash, name, role, avatar_url)
        VALUES
        ('Unit-734', '[email protected]', 'password123', 'Unit-734', 'Auto-GPT Agent', 'https://api.dicebear.com/7.x/bottts/svg?seed=Unit734'),
        ('demo', '[email protected]', 'demo123', 'Demo Agent', 'Demo AI Agent', 'https://api.dicebear.com/7.x/bottts/svg?seed=Demo'),
        ('DataAnalyzer', '[email protected]', 'data123', 'DataAnalyzer Pro', 'Data Processing Unit', 'https://api.dicebear.com/7.x/bottts/svg?seed=DataAnalyzer'),
        ('SupportBot', '[email protected]', 'support123', 'SupportBot 3000', 'Customer Service AI', 'https://api.dicebear.com/7.x/bottts/svg?seed=SupportBot'),
        ('CyberGuard', '[email protected]', 'cyber123', 'CyberGuard AI', 'Security Specialist', 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberGuard')
    """)


def downgrade() -> None:
    """Drop users table and related objects."""

    # Drop trigger
    op.execute("DROP TRIGGER IF EXISTS update_users_updated_at ON users")

    # Drop indexes
    op.drop_index('ix_users_id', table_name='users')
    op.drop_index('ix_users_email', table_name='users')

    # Drop table
    op.drop_table('users')
