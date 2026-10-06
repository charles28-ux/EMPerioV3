---
name: frontend-design
description: Guidelines and best practices for creating responsive, accessible, pixel-perfect UI components and layouts adhering to modern corporate standards.
---

# Frontend Design Skill

## Visual Excellence & Aesthetics
1. **Design System & Palette**:
   - Curated corporate palette: Deep navy primary (`#0f213f`, `#162f59`), teal/cyan accents (`#0d9488`, `#0284c7`), semantic status colors (Emerald `#10b981`, Amber `#f59e0b`, Rose `#f43f5e`).
   - Clean slate backgrounds (`#f8fafc` to `#f1f5f9`), avoiding harsh pure blacks or generic primary colors.
   - Smooth gradients, subtle frosted glass cards, and balanced multi-layered box shadows (`box-shadow: 0 10px 15px -3px rgba(15, 33, 63, 0.08)`).

2. **Typography Hierarchy**:
   - Modern typography: `Plus Jakarta Sans` or `Inter` for body and headings.
   - Monospaced typography: `JetBrains Mono` for ID badges (`EMP-2024-089`, `TSK-101`), timestamps, and financial/duration figures.

3. **Dynamic Micro-Interactions**:
   - Responsive transitions (`all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`) on interactive hover states.
   - Status indicators, progress bars, contextual dropdown menus, and animated slide-in toast notifications.

4. **Structured & Print-Friendly Layouts**:
   - Mobile-first responsive layouts across desktop (sidebar + sticky header), tablet, and mobile views.
   - Clean `@media print` styles for structured, minimal, printable reports without UI artifacts.

5. **Accessibility Standards (WCAG 2.1 AA)**:
   - High color contrast ratios for text readability.
   - Keyboard accessible navigation with clear focus rings.
   - Semantic HTML5 structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`) with ARIA roles and live regions.
