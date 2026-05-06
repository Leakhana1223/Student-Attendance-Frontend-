## Plan: Add Student Attendance Dashboard and Login User Flow

TL;DR: Create a dedicated admin dashboard plus Student, Attendance, Class, Blacklist, Report, and User pages in `src/app`, wire them into the existing sidebar navigation, and implement a simple login user flow that redirects to `/dashboard` with styled cards and tables.

**Steps**
1. Update sidebar navigation data
   - Modify `src/components/Layouts/sidebar/data/index.ts` so the MAIN MENU includes routes for `/dashboard`, `/student`, `/attendance`, `/class`, `/blacklist`, `/user`, and `/report`.
   - Keep the OTHERS section unchanged.

2. Add simple client-side login behavior
   - Update `src/components/Auth/SigninWithPassword.tsx` to save a login user object into `localStorage` and navigate to `/dashboard` after successful submit.
   - Update `src/components/Layouts/header/user-info/index.tsx` to read the logged-in user from `localStorage` and display their name/email in the profile dropdown.
   - Optionally add a small `AuthGuard` component if needed to protect the new dashboard pages (client-side redirect to `/auth/sign-in` when no user exists).

3. Create the new dashboard page
   - Add `src/app/dashboard/page.tsx` with a welcome card, logged-in user greeting, summary statistic cards, and quick links to Student, Attendance, Class, Blacklist, Report, and User.
   - Use `Breadcrumb` and existing dashboard style patterns for consistency.

4. Create feature pages
   - Add `src/app/student/page.tsx` with a styled student table or card list.
   - Add `src/app/attendance/page.tsx` using the provided AttendancePage code, with student load/save from `localStorage`, date/session selectors, and an attendance status table.
   - Add `src/app/class/page.tsx` with class summaries and a list.
   - Add `src/app/blacklist/page.tsx` with a blacklist table.
   - Add `src/app/report/page.tsx` with report metric cards and a summary section.
   - Add `src/app/user/page.tsx` with current user profile details and account information.

5. Standardize styling
   - Use `rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card` on all new sections.
   - Use consistent spacing, responsive grid layouts, and existing utility classes from `src/components/Layouts/showcase-section.tsx`.
   - Add visual polish for buttons, cards, and tables to make the feature set look cohesive.

**Verification**
1. Confirm `/dashboard`, `/student`, `/attendance`, `/class`, `/blacklist`, `/report`, and `/user` pages open and render with the new layout.
2. Confirm sidebar links highlight and navigate correctly.
3. Confirm login via `/auth/sign-in` redirects to `/dashboard` and the user appears in the header dropdown.
4. Confirm attendance page loads saved students from `localStorage` and allows updating attendance.
5. Confirm style consistency across the new pages.

**Decisions**
- Use a dedicated `/dashboard` route rather than replacing the current root `/` page.
- Implement login as a client-side localStorage flow because the current app has no backend auth.
- Keep the new pages in the app router under `src/app` to match the existing Next.js layout.

**Further Considerations**
1. If you want the app root `/` to become the new dashboard instead of creating `/dashboard`, I can update the home route instead.
2. If you want real backend auth later, the localStorage login can be replaced with real session handling.
