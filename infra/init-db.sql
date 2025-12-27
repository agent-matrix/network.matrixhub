-- =============================================================================
-- Network MatrixHub - Database Initialization Script
-- Author: Ruslan Magana
-- Description: PostgreSQL database initialization for Network MatrixHub
-- =============================================================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For full-text search optimization

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE network_matrixhub TO matrixhub;

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Set default permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO matrixhub;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO matrixhub;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO matrixhub;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Network MatrixHub database initialized successfully';
END $$;
