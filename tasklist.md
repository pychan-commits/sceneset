# SceneSet — Execution Tasklist (Phase 1 Core MVP)

**Role:** AI Coding Agent Execution Plan  
**Source:** PRD.md  
**Strict Scope:** Phase 1 only. Phase 2 items live in Deferred section.

---

## Module 1: Environment & Secret Key Setup

- [ ] Initialise Next.js App Router project with TypeScript and Tailwind CSS (`npx create-next-app@latest`)
- [ ] Install core dependencies: `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit`, `@clerk/nextjs`, `stripe`, `zod`, `lucide-react` (or preferred icon set)
- [ ] Create `.env.local` with all required keys (Clerk, DATABASE_URL, Stripe test keys, ImageKit)
- [ ] Add `.env.local` to `.gitignore` and confirm it is never committed
- [ ] Create `.env.example` documenting every required variable (no real secrets)
- [ ] Configure `next.config.ts` / `tsconfig.json` for strict TypeScript
- [ ] Set up basic project folder structure (`/app`, `/components`, `/db`, `/lib`, `/types`)

**Verification Gate:**  
- [ ] Run `npm run build` and confirm zero TypeScript errors  
- [ ] Confirm `.env.local` is present and `.env.example` is committed  

---

## Module 2: Database Schema & ORM Provisioning

- [ ] Configure Drizzle with Neon (`drizzle.config.ts` pointing to `DATABASE_URL`)
- [ ] Define all core tables in `db/schema.ts`:
  - users
  - workspaces
  - workspace_members
  - events
  - tasks
  - budget_items
  - suppliers
  - guests
  - run_of_show_items
  - venue_elements
  - notes
  - subscriptions
- [ ] Ensure every table uses `uuid` primary keys (`gen_random_uuid()`)
- [ ] Add all foreign keys with `ON DELETE CASCADE` (or `SET NULL` where specified)
- [ ] Generate and run initial migration (`drizzle-kit generate` + `drizzle-kit migrate` / push)
- [ ] Create seed script for demo workspace (“Afterglow / Midnight Garden Gala”) with realistic sample data
- [ ] Export typed Drizzle client from `db/index.ts`

**Verification Gate:**  
- [ ] Run migration successfully against Neon  
- [ ] Confirm all tables exist and relationships are correct  
- [ ] Seed script runs without error and populates demo data  

---

## Module 3: Authentication & Protected Route Middleware

- [ ] Install and configure Clerk (`@clerk/nextjs`)
- [ ] Add Clerk provider in root layout
- [ ] Create `middleware.ts` protecting `/app/*` routes
- [ ] Implement sign-in and sign-up pages under `/sign-in` and `/sign-up`
- [ ] Sync Clerk user → `users` table on first login (webhook or afterAuth callback)
- [ ] Create helper `getCurrentUser()` and `requireWorkspaceMembership(workspaceId)`
- [ ] Build basic workspace creation flow after first sign-in
- [ ] Implement workspace switcher and event switcher in sidebar shell

**Verification Gate:**  
- [ ] Unauthenticated users are redirected from `/app/*`  
- [ ] Authenticated users can create a workspace and an event  
- [ ] `npm run build` passes with zero TypeScript errors  

---

## Module 4: Cloud Storage & Third-Party API Integrations

- [ ] Configure ImageKit client (public key + private key)
- [ ] Create utility for uploading images (avatar, event cover if needed)
- [ ] Set up Stripe server client with test secret key
- [ ] Create `POST /api/checkout` route that creates a Stripe Checkout Session (test mode)
- [ ] Create `POST /api/webhooks/stripe` route with signature verification
- [ ] Handle `checkout.session.completed` and subscription lifecycle events → update `subscriptions` + `workspaces.plan`
- [ ] Add success / cancel query-param handling on `/app/plans`

**Verification Gate:**  
- [ ] Test Checkout Session creation returns a valid Stripe test URL  
- [ ] Webhook endpoint rejects requests without valid signature  
- [ ] `npm run build` passes  

---

## Module 5: Core UI Workspace & Canvas Components

### 5.1 Marketing & Shell
- [x] Build landing page (`/`) with hero, product mock, value props, and CTAs matching existing design language
- [ ] Build pricing page (`/pricing`) with Free / Per-event / Monthly cards
- [x] Create authenticated app shell with collapsible sidebar
- [x] Implement top bar (search placeholder, Share, Day-of pack, user menu)

### 5.2 Event Overview
- [x] Event Overview page: readiness score circle, Next Moves list, metric cards (Committed spend, Guest RSVPs, Supplier pulse, Tasks shipped)
- [x] Up Next timeline snippet + Activity feed
- [x] “Edit event” and “Open live run of show” actions

### 5.3 Task Board
- [x] Task board page with columns or list view (Todo / In Progress / Done / Blocked)
- [x] Create, edit, assign, set due date, change status
- [ ] Drag-and-drop sort order (optional but preferred)

### 5.4 Budget
- [x] Budget page showing planned vs committed totals
- [x] CRUD for budget line items
- [ ] Link budget item to supplier (optional)

### 5.5 Suppliers
- [x] Suppliers list with status badges (inquiry → quoted → confirmed → paid)
- [x] CRUD for suppliers (name, contact, quote amount, notes)

### 5.6 Guests
- [x] Guests / RSVP list with status (pending / confirmed / declined / waitlist)
- [x] Basic CRUD + plus-ones count

### 5.7 Run of Show
- [ ] Timeline / ordered list of run-of-show items (time, title, owner, location)
- [ ] Reorder and edit items

### 5.8 Venue Layout
- [x] Simple venue layout view (structured cards or basic positioned elements)
- [x] CRUD for venue elements (label, type, notes, optional x/y)

### 5.9 Notes & Activity
- [x] Notes list + activity feed
- [x] Add note form

### 5.10 Day-of Pack & Sharing
- [x] Generate shareable Day-of pack view / simple PDF export
- [x] Share button (copy link or invite collaborator)

### 5.11 Plans & Settings
- [ ] Plans & pricing page inside app with Stripe Checkout buttons (test mode)
- [x] Settings page (profile, workspace name, basic billing status)
- [ ] Optional Vendor Referral section (clearly labelled, non-functional placeholder)

**Verification Gate:**  
- [x] All core pages render without runtime errors  
- [x] Demo data loads correctly in Overview, Tasks, Budget, Suppliers, Guests, Run of show  
- [x] `npm run build` passes with zero TypeScript errors  
- [x] Keyboard navigation and basic focus rings present on interactive elements  

---

## Module 6: Billing Integration, Webhooks & Pre-Launch Audits

- [ ] End-to-end test of Stripe Checkout (test card) → webhook → plan update
- [ ] Confirm Free plan users see upgrade CTAs
- [ ] Confirm Per-event and Monthly plan buttons create correct Checkout Sessions
- [ ] Add Privacy Policy / PICS link in footer and sign-up flow
- [ ] Audit text contrast (≥ 4.5:1) and focus indicators
- [ ] Confirm no secret keys are present in client bundles
- [x] Run full production build and fix any remaining TypeScript or lint errors
- [x] Seed production-ready demo workspace for “Open demo workspace” CTA
- [ ] Final manual walkthrough of primary user journey (sign-up → create event → add tasks/budget/suppliers → view day-of pack → upgrade)

**Verification Gate:**  
- [ ] `npm run build` succeeds with zero errors  
- [ ] Stripe test payment flow completes and updates workspace plan  
- [ ] All Phase 1 pages accessible and functional  
- [ ] Accessibility quick check passes (contrast + focus)  

---

## Deferred (Phase 2 — Do Not Implement Now)

- Usage credit analytics & hard/soft limits
- Multi-tenant advanced team seats & fine-grained permissions
- Live real-time run-of-show collaboration
- Advanced drag-and-drop venue floor-plan canvas
- Templates marketplace
- Vendor referral marketplace with commission tracking
- Gemini API integrations (AI run-of-show, budget suggestions)
- Full subscription management portal (customer portal, invoices)
- Mobile PWA optimisations beyond responsive layout
- Advanced reporting & client-facing portals

---

*End of tasklist.md — Phase 1 only*

---

## Session audit notes — 2026-10-19

- **Pending Module 1 / Task 1.1:** The repository is an existing React/Vite Manus project, not a newly initialized Next.js App Router project. This task remains pending until the architecture is explicitly migrated or the checklist is revised.
- **Pending Module 1 / Tasks 1.2–1.5:** The implementation uses the existing Manus/MySQL setup and does not provide the PRD’s Neon/Clerk/Stripe/ImageKit environment contract; no secrets were added or inferred during this audit.
- **Pending Module 2 / Tasks 2.1–2.6:** Drizzle schema/migrations exist, but they are MySQL-oriented and do not yet match the complete PostgreSQL/Neon schema and seed requirements in the PRD, including every listed core table.
- **Pending Module 3:** Authentication uses the starter Manus OAuth/session flow rather than Clerk, so Clerk installation, middleware, Clerk-user sync and the exact Clerk verification gate remain incomplete.
- **Pending Module 4:** Stripe Checkout/webhooks and ImageKit are not verified in this repository; those integration tasks remain pending.
- **Pending Module 5 / Task 5.7:** Run-of-show editing is verified, but full reorder behavior is not independently verified against the checklist’s reorder requirement.
- **Pending Module 5 / Task 5.11 Plans:** The plans view exists, but live Stripe test-mode checkout is not verified; the billing portion remains pending.
- **Pending Module 6:** Stripe end-to-end testing, privacy/PICS link audit, secret-bundle audit, and a complete manual primary-journey walkthrough remain pending.

**Next clean-thread starting point:** Module 1, Task 1.1 — “Initialise Next.js App Router project with TypeScript and Tailwind CSS.”
