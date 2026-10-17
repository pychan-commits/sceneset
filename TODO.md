# SceneSet delivery TODO

- [ ] **Authenticated workspace entry and role-aware app shell**
  - Provide landing, sign-up/sign-in entry and password-reset intent using the starter Manus OAuth/session flow rather than a simulated login.
  - Provide a workspace shell that supports Owner, organiser and collaborator role labels, event switching, global search, settings, logout and light/dark mode.
  - Keep the authenticated operational experience clearly separate from the public landing page and shared day-of view.

- [ ] **Fictional demo event and events/templates flow**
  - Provide fictional guests, suppliers, quotes, budget items, tasks, run-of-show entries, venue/layout items, notes and activity for at least one event.
  - Provide an events list, event switcher, event goals/date/venue summary, built-in templates for Pop-up Market, Birthday Showcase, Community Festival and Corporate Mixer, plus Duplicate Event behavior.

- [ ] **Readiness / Go-Live Score dashboard**
  - Show an event dashboard that aggregates budget status, task completion, supplier confirmations, guest RSVPs, run-of-show completeness and venue-layout lock into a clear Readiness / Go-Live Score.
  - Show urgent next actions, milestones, spend summary, supplier pulse, RSVP progress and latest activity in a professional operational interface.

- [ ] **Planning operations modules**
  - Provide a Kanban-style task board with keyboard-friendly task movement and task creation/status changes.
  - Provide budget tracking with categories, spend, forecast, contingency percentage and remaining amount.
  - Provide supplier directory, quote comparison and the Inquiry → Quote received → Confirmed → Paid status pipeline.
  - Provide guest list management with VIP, Media, Vendor and Staff tags plus filters and RSVP states.
  - Provide run-of-show schedule and Timeline / Milestone view with keyboard-friendly schedule actions.
  - Provide a simple drag-and-drop venue-layout canvas with lock/unlock state and layout items.
  - Provide Notes + @mentions and lightweight Activity Feed.

- [ ] **Sharing, export and supporting flows**
  - Provide a view-only or comment-only shared live/day-of route with run-of-show, contact sheet, layout and budget summary.
  - Provide export/print-friendly summary and a Day-of Pack presentation of run-of-show, contacts, layout and budget summary.
  - Provide a light file-upload affordance for contracts, floor plans and mood boards with a visible free-plan storage limit.
  - Provide a Pricing page with free personal, per-event paid upgrade and monthly organiser plan options, a test payment flow only, and an optional clearly separated vendor referral section.

- [ ] **Backend/data foundations and delivery quality**
  - Keep the managed server/database setup, starter auth/session contract, health route and typed tRPC entrypoint working.
  - Add the operational entity schema for Users, Workspaces, Events, Tasks, Schedules, Suppliers, Quotes, Budget items, Guests, Venues, Layout items, Notes, Activity/Audit log and Templates.
  - Keep `public/manus-routes.json` synchronized with all page routes, preserve accessible labels/contrast, and ensure production build/typecheck succeed.
