# Wwise Digital Task Management System

A centralized digital task management platform replacing Wwise's physical book-based system. Supports real-time collaboration across four branches: **Upington**, **Centurion**, **Cape Town**, and **Dubai**.

Built as an academic capstone project for the **Wwise 4IR Transformation Initiative**.

---

## Overview

This system digitizes branch-level task tracking with a modern web interface, role-based access control, and live Firestore sync. It is designed for multi-branch operations where admins need cross-branch visibility and employees need a simple way to create, assign, and complete work.

---

## Features

### Core Functionality

| Module | Description |
|--------|-------------|
| **Authentication** | Email/password login and registration via Firebase Auth |
| **Task Management** | Create, edit, assign, and track tasks with status workflow |
| **Kanban Board** | Drag-and-drop columns with confetti on task completion |
| **Projects** | Group related tasks by project and branch |
| **Reports** | Analytics dashboard with CSV export |
| **User Management** | Admin-only role and branch assignment |
| **Task History** | Full audit trail of task changes in Firestore |
| **Multi-Branch** | Branch-scoped views for employees; cross-branch access for admins |

### Real-Time & Collaboration

- **Live Firestore listeners** — tasks, projects, and activity update instantly
- **Live Activity Feed** — see who changed what, as it happens
- **Toast notifications** — welcome message + alerts when other users update tasks
- **Branch Pulse map** — visual network of all four branches with live task counts

### UI & UX Highlights

- **Command palette** — `Ctrl+K` / `⌘+K` to jump pages, search tasks, or create new items
- **Week day picker** — top bar M–S pills filter Dashboard and Tasks by due/created date
- **Animated dashboard** — CountUp stats, progress ring, page transitions (Framer Motion)
- **Responsive layout** — collapsible sidebar on mobile, sticky top bar with blur on scroll
- **Wwise design system** — pink primary (`#ec4899`), DM Sans, dotted-circle icons, sharp card corners

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite |
| Routing | React Router v7 |
| Backend / DB | Firebase Auth + Cloud Firestore |
| Animation | Framer Motion |
| Icons | React Icons (Feather) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with **Email/Password** authentication enabled

### Firebase Setup

1. Open [Firebase Console](https://console.firebase.google.com/) and select your project (`task-management-system-4a3d1`).
2. **Authentication** → Sign-in method → Enable **Email/Password**.
3. **Firestore Database** → Create database (test mode for development).
4. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
   Or paste the contents of `firestore.rules` into the Firestore Rules tab in the console.

### Install & Run

```bash
npm install
# Copy .env.example → .env and add your Firebase web app config
npm run dev
```

Copy `.env.example` to `.env` and add your Firebase web app config (Firebase Console → Project settings → Your apps). Vite exposes only variables prefixed with `VITE_`.

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
npm run preview
```

---

## User Roles

| Role | Key | Permissions |
|------|-----|-------------|
| **System Administrator** | `admin` | Full access to all branches, users, and reports |
| **Branch Administrator** | `branch_admin` | Manage tasks and users within their branch |
| **Employee** | `employee` | Create and update assigned tasks in their branch |

> After registering, promote the first user to **admin** via Firestore Console (`users/{uid}` → set `role: "admin"`) or use the User Management page once an admin account exists.

---

## Branches

| ID | Location |
|----|----------|
| `upington` | Northern Cape, South Africa |
| `centurion` | Gauteng, South Africa |
| `cape-town` | Western Cape, South Africa |
| `dubai` | UAE |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `⌘+K` | Open command palette |
| Top bar day pills | Filter Dashboard & Tasks by week day |

---

## Project Structure

```
src/
├── components/
│   ├── auth/           # Login, Register, ProtectedRoute
│   ├── common/         # Modal, Toast, CommandPalette, CountUp, WwiseLogo
│   ├── dashboard/      # Dashboard, BranchPulse, ActivityFeed, ProgressRing
│   ├── layout/         # Sidebar, TopBar, Layout, PageTransition
│   ├── projects/       # Project CRUD
│   ├── reports/        # Analytics & CSV export
│   ├── tasks/          # TaskList, KanbanBoard, TaskForm, TaskCard
│   └── users/          # User role management (admin)
├── context/            # AuthContext, ToastContext, TopBarContext
├── firebase/           # Firebase config
├── hooks/              # useFirestore (real-time listeners)
├── utils/              # dayFilter (shared week-day filtering)
└── constants/          # Branches, statuses, roles
```

---

## Firestore Collections

| Collection | Purpose |
|------------|---------|
| `users` | User profiles (role, branch, display name) |
| `tasks` | Task records with status, assignee, due date |
| `projects` | Project groupings per branch |
| `taskHistory` | Audit log for all task create/update/delete events |

---

## Capstone Context

**Problem:** Wwise branches relied on physical task books, causing delays, lost visibility, and no cross-branch reporting.

**Solution:** A cloud-hosted task management web app with real-time sync, role-based security, and a dashboard designed for operational oversight across all four locations.

**Phase 1 (MVP):** Auth, task CRUD, branch filtering, basic dashboard.

**Phase 2 (Enhancement):** Kanban board, command palette, live activity feed, Branch Pulse network map, animated UI, week-day filtering, toast notifications.

---

## License

Academic / Capstone Project — Wwise 4IR Transformation Initiative
