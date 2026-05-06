# Student Attendance Frontend - Project Instructions

This project is a React-based frontend for a Student Attendance Management System, built with Next.js (App Router) and Tailwind CSS. It is a client-side prototype that uses browser `localStorage` for data persistence.

## Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** ApexCharts / react-apexcharts
- **State Management:** React Context (Auth, Sidebar)
- **Theming:** next-themes (Dark mode by default)
- **Data Persistence:** `localStorage` (via `src/lib/storage.ts`)

## Architecture & Directory Structure
- `src/app`: Feature-based routing.
    - Use private folders `_components` within route segments for page-specific components.
    - Key features: `dashboard`, `attendance`, `student`, `class`, `subject`, `report`, `blacklist`, `user`.
- `src/components`: Global shared components.
    - `src/components/ui`: Base UI primitives (Dropdown, Skeleton, Table).
    - `src/components/DataTable.tsx`: Generic, reusable table component with filtering and sorting.
    - `src/components/Modal.tsx`: Reusable dialog for forms and confirmations.
    - `src/components/Auth-Guard.tsx`: Component to protect routes from unauthenticated access.
- `src/context`: Global React contexts.
    - `auth-context.tsx`: Manages user authentication state and session persistence.
- `src/lib/storage.ts`: The data access layer. Contains CRUD operations for all entities using `localStorage`.
- `src/services`: API services for charts and other async data needs.
- `src/hooks`: Custom React hooks (e.g., `use-click-outside`, `use-mobile`).
- `src/utils`: Helper functions (e.g., `timeframe-extractor`).
- `src/types`: TypeScript definitions.

## Coding Conventions
- **Components:**
    - Prefer functional components with Arrow functions.
    - Use `"use client"` directive for interactive elements and when using client-side hooks/storage.
- **Styling:**
    - Use Tailwind CSS utility classes.
    - Use theme colors from `tailwind.config.ts`: `primary` (#5750F1), `stroke`, `dark-2`, etc.
- **Data Layer:**
    - Always use `src/lib/storage.ts` for managing application data (Students, Classes, Attendance, etc.).
    - For charts or external data simulation, use the `services` layer.
- **Authentication:**
    - Access auth state via the `useAuth` hook.
    - Protect client-side pages using the `AuthGuard` component or checking `isAuthenticated` in the layout.
- **Naming:**
    - Files: Kebab-case (e.g., `attendance-content.tsx`).
    - Components: PascalCase (e.g., `AttendanceContent`).

## Workflows
- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Linting:** `npm run lint`

## Project Specific Notes
- **Persistence:** All data is stored in `localStorage` keys: `students`, `classes`, `attendance`, `subjects`, `users`, `blacklist`, `user`.
- **Demo Mode:** The system is currently a standalone demo. Production use would require replacing the `storage.ts` layer with actual API calls.
- **UI:** Based on the NextAdmin template, using the `Satoshi` font family.
