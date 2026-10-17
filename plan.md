# SceneSet implementation plan

## Product scope and implementation approach

SceneSet will be a desktop-first event operations workspace for small organisers. The MVP will ship as a managed React/Express/tRPC/Drizzle web app with server and managed MySQL database enabled, using the starter Manus OAuth flow for real sign-in and a shared workspace experience. The first release is demo-first: a fictional event is available immediately in the workspace so the planning flow can be tested without setup, while the data model and tRPC router are structured for persistence and future CRUD expansion.

The primary experience is a single operational shell with a compact sidebar, event switcher, global search, theme control and a clear page hierarchy. Core pages are represented as navigable workspace views: Overview, Tasks, Budget, Suppliers, Guests, Schedule, Layout, Notes & Activity, Templates, Settings and Pricing. A public `/shared` route provides a view-only day-of handoff. The dashboard computes a visible Readiness / Go-Live Score from weighted task completion, supplier confirmation, guest RSVP progress, run-of-show completeness, budget health and venue-layout lock. Key mutations in the demo are optimistic and persist in localStorage so the app remains useful in Preview even before a workspace is connected to a real account.

The backend will retain the starter auth/session contract and add a Drizzle schema for workspaces, events, tasks, budget items, suppliers, quotes, guests, schedule items, venues, layout items, notes, activity entries and templates. The frontend uses typed demo records with IDs matching those entities and an app store abstraction so replacing local persistence with tRPC mutations is incremental rather than a rewrite. The server continues to expose `/api/health`, the tRPC entrypoint and OAuth callback supplied by the starter.

## Design direction

### Style options

- **Editorial operations desk** — 0.08 probability: a warm paper-like planning surface with crisp rules, tabular data and one electric accent.
- **Night-shift production control** — 0.06 probability: a dark, cinematic command center with neon status signals and dense operational panels.
- **Playful civic toolkit** — 0.04 probability: a bright community-planning interface with friendly color blocks and softer rounded cards.

### Selected style: Editorial operations desk

- **Design Movement:** Modern editorial dashboard inspired by festival call sheets, studio production binders and wayfinding systems.
- **Core Principles:** Make the next operational decision obvious; show status before detail; keep dense information calm with strong alignment; use warmth and small moments of delight without becoming decorative.
- **Color Philosophy:** The base is a soft parchment/ink system that reduces glare and makes long planning sessions comfortable. A saturated coral-red is the ownable SceneSet signal for urgency, live moments and primary actions; mint and ochre are reserved for positive and attention states.
- **Layout Paradigm:** A fixed utility rail anchors the left edge, while the main surface reads like a set of clipped planning sheets: asymmetric hero summary, horizontal metric band, and wide data panels rather than centered marketing cards.
- **Signature Elements:** coral “live” pulse, punched-card metric labels, and thin ruled dividers with small uppercase section markers.
- **Interaction Philosophy:** Prefer inline edits, drag-and-drop, keyboard shortcuts and short confirmation to modal-heavy flows. Every page should answer “what needs attention next?” before offering secondary management actions.
- **Animation:** Use fast 150–220ms fades/slides for page changes and status updates; animate score rings and progress bars once on entry; avoid looping movement except the tiny live pulse and use reduced-motion-safe fallbacks.
- **Typography System:** Fraunces for display headings and numeric score moments; DM Sans for UI, labels and dense body text. Use tabular numerals for budgets and timestamps, uppercase micro-labels at 11px with generous tracking.
- **Brand Essence:** “The calm control room for making good events happen.” Personality: grounded, sharp, encouraging.
- **Brand Voice:** Headlines are direct and quietly optimistic; CTAs are verbs. Example lines: “Make the next move obvious.” and “Lock the room before doors open.”
- **Wordmark & Logo:** A compact “SS” mark formed from two offset ticket-stub brackets, paired with the SceneSet wordmark.
- **Signature Brand Color:** Signal Coral `#F25C54`, used sparingly enough to remain unmistakable.

## Main modules and responsibilities

- `client/src/pages/Workspace.tsx`: authenticated workspace shell, navigation, dashboard and all MVP views.
- `client/src/lib/demoData.ts`: fictional event, suppliers, guests, budget, tasks, schedule and layout records.
- `client/src/lib/appStore.ts`: local persistence and small mutation helpers for demo-first interactions.
- `client/src/App.tsx`: public landing/shared routes and workspace routing.
- `client/src/index.css`: design tokens, typography, layout primitives, dark-mode overrides, print styles and responsive rules.
- `drizzle/schema.ts`: user plus operational domain tables and enums.
- `server/db.ts`: database connection and typed read/write helpers.
- `server/routers.ts`: auth plus future-ready workspace/event procedures.
- `public/manus-routes.json`: complete page route manifest for Preview and publishing.
- `app.config.ts`: durable project logo metadata.

## Build sequence

1. Replace the starter home page with the SceneSet public landing page and app shell.
2. Add demo data/store and route all required workspace views through the shell.
3. Implement interactive task status, guest filters, supplier status updates, budget edits, schedule actions, layout dragging, notes, dark mode, print/day-of view and pricing test flow.
4. Expand the Drizzle schema and keep the server router/auth contract intact for full-stack evolution.
5. Run typecheck/build, inspect the Preview route manifest and exercise the core event-planning flow.
6. Fix confirmed issues, polish empty states, accessibility labels, keyboard affordances and responsive behavior.

## Material and delivery constraints

No external image assets are needed for this internal operations tool. Use Lucide icons and CSS-generated visual treatments rather than decorative stock imagery. Keep payments as a test-only modal, vendor referrals clearly separated from core planning, file uploads as a lightweight UI affordance, and complex multiplayer/ticketing/marketplace behavior out of scope. The app should work with fictional data and remain legible in both light and dark themes.
