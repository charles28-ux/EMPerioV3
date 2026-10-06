---
name: grill-me
description: Interactive requirement interrogation, architectural alignment, design trade-off challenge, and technical specification interview skill.
---

# Grill-Me Skill

Use this skill when aligning on complex architecture, feature requirements, data modeling decisions, or resolving edge-case design trade-offs with the user before committing code.

## Workflow & Guidelines

1. **Active Interrogation Mode**:
   - Do not jump straight to assumptions.
   - Challenge requirements with constructive, targeted questions.
   - Identify gaps in requirements: authentication boundaries, edge cases, error states, performance bottlenecks, and UX friction points.

2. **Structured Interview Technique**:
   - Focus on one logical area at a time:
     - **Data Modeling & Schema**: Primary keys, relationships, indexing, cascading rules.
     - **Security & Authorization**: Row Level Security (RLS) rules, role permissions, rate limits.
     - **User Experience (UX)**: Loading states, optimistic updates, offline handling, error feedback.
     - **Integrations & Third-Party APIs**: Fallbacks, timeout handling, payload contracts.

3. **Recommendation Formulation**:
   - Provide concrete trade-offs (e.g., Option A vs Option B) with pros, cons, and a recommended default.
   - Summarize confirmed decisions into an actionable specification document before implementation begins.
