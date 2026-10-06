# EMPERIO EMS - Employee Management System

A web-based Employee Management System (EMS) designed for daily work activities, attendance tracking, task management, company announcements, and leave requests. Built based on the **Employee User Manual v1.0** (Prepared by Abastillas, Charles R.) and Figma Prototype.

## Features & Screens
- **Authentication & Validation (4.1 & 4.2)**: Secure company sign-in, login validation, and account activation.
- **First Login & Credentials (4.3)**: Mandatory password update with live security requirement validation.
- **Personal Profile (4.4)**: View personal details and toggle into Edit mode to update permitted contact info.
- **Attendance Records (4.5)**: Monthly calendar view with status indicators (Present, Late, Absent, Leave, Holiday) and a live shift clock-in/out tracker.
- **Assigned Tasks (4.6)**: Ongoing, pending, and finished tasks with status counter badges and an interactive "Update Task" pop-up.
- **Company Announcements (4.7)**: Priority notices with unread/urgent indicators, full reading modal, and supporting PDF preview/download.
- **Leave Management (4.8)**: Available leave credits, a 5-step leave application builder, and filterable leave history.
- **Print-Friendly Format**: Structured, minimal reference layout ready for clean print export.

---

## Architecture & Tech Stack
- **Frontend**: HTML5, Modern Vanilla CSS, ES6+ Modular JavaScript, Vite.
- **Database & Backend**: [Supabase](https://supabase.com/) integration ready (`@supabase/supabase-js`, PostgreSQL schema with Row Level Security policies).
- **Google Antigravity Customizations**:
  - `.agents/skills/frontend-design/`
  - `.agents/skills/postgres-supabase-expert/`
  - `.agents/skills/server-action-builder/`

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase (Optional)
Copy `.env.example` to `.env` and fill in your Supabase project credentials:
```bash
cp .env.example .env
```
Apply the database migrations in `supabase/migrations/20261006_ems_schema.sql` to your Supabase SQL Editor.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 4. Build for Production
```bash
npm run build
```
