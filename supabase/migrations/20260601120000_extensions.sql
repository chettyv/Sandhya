-- 20260601120000_extensions.sql
-- Enable Postgres extensions used across the Sandhya schema.
--
-- - uuid-ossp: uuid_generate_v4() for primary keys
-- - vector:   pgvector for RAG embeddings
-- - pg_trgm:  fuzzy text search for the Learn tab

create extension if not exists "uuid-ossp";
create extension if not exists "vector";
create extension if not exists "pg_trgm";

-- Down:
--   drop extension if exists "pg_trgm";
--   drop extension if exists "vector";
--   drop extension if exists "uuid-ossp";
