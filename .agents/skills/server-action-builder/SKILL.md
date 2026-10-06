---
name: server-action-builder
description: Standardized patterns for building mutations, data validations, secure server-side form handling, and Supabase database interactions.
---

# Server Action Builder Skill

## Core Principles
1. **Input Validation**:
   - Always validate inputs on the server boundary using strong schemas or strict conditionals.
   - Never trust client-provided payloads or authorization metadata.
2. **Atomic Mutations & Error Handling**:
   - Wrap interdependent mutations in safe transactional or sequenced statements.
   - Return normalized responses with typed `data` and user-friendly `error` feedback.
3. **Optimistic UI Updates**:
   - Immediately provide user feedback with status indicators or toast notifications while mutations process.
