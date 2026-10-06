---
name: postgres-supabase-expert
description: Specialized workflows for schema design, migration management, and strict Row Level Security (RLS) policies with Supabase and PostgreSQL.
---

# Postgres & Supabase Expert Skill

## Database Architecture Rules
1. **Row Level Security (RLS)**:
   - Always enable RLS on every user-facing table: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`.
   - Never bypass RLS with service roles on client connections.
   - Enforce tenant and user boundary policies via `auth.uid() = employee_id` or similar foreign keys.
2. **Schema Integrity**:
   - Use standard UUID identifiers (`uuid-ossp` or `gen_random_uuid()`).
   - Use explicit foreign key constraints with sensible `ON DELETE` actions (`CASCADE` or `SET NULL`).
   - Standardize timestamps: `created_at TIMESTAMPTZ DEFAULT NOW()`.
3. **Auditability & Triggers**:
   - Automatically initialize user profile rows via PostgreSQL triggers on `auth.users`.
