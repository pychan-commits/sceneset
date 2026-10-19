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

## Interaction repair pass

- [x] Budget controls: contingency percentage is editable, category/status filters work, budget status has a real dropdown, and Add line creates a persisted line with edit/delete actions.
- [x] Notes & activity: teammate mention flow lists teammates, activity filtering works, note deletion confirms and removes the note, the audit-log option is removed, and the header bell opens an activity drawer.
- [x] Suppliers and guests: supplier category/status filters work, supplier status is a real dropdown, supplier row actions edit/delete, and guest row actions edit/delete while retaining bulk RSVP and final headcount.
- [x] Tasks: Add task opens a simple name/category modal, category is stored as a colored project tag, task edit/delete work, bulk status actions remain available, and drag/keyboard movement has visible targets.
- [x] Schedule and layout: Add moment creates a run-of-show item, timeline legend explains Crew/Show flow/Guest/Milestone, Add item creates a canvas facility, and locked/unlocked drag placement works.
- [x] Workspace and supporting flows: sidebar event/workspace/account controls are actionable, archived event recap opens the read-only workspace, pricing plan actions are useful, settings Manage files deletes attachments, Day-of Pack opens its preview, search filters current data, and readiness navigation/progress actions remain clickable.

## Latest interaction completion pass

- [x] Task board provides real assignee dropdowns, working status/priority/category filters, task edit/delete, coloured category tags, and a simple required-name/category add form with optional later priority/due editing.
- [x] Run of show provides real start/end time, title, type, owner and location fields for adding/editing moments, with timeline legend and time-based item movement.
- [x] Venue layout supports adding facilities from a palette, visible drag feedback, and deleting mistaken items.
- [x] Events supports event name, date, expected guests, venue and goal fields; past-event recap opens a real workspace view.
- [x] Workspace selector, invite teammate, manage files, guest CRUD/forms, supplier category/status controls, budget contingency/status/add-line, notes/mentions/activity, notification drawer, Day-of Pack preview, search and landing workflow controls are actionable.
- [x] Every newly added workflow uses real inputs and dropdowns rather than missing controls or prompt-only add forms.


## Sidebar / user menu cleanup

- [x] Removed the non-functional “…” overflow control next to Maya in the sidebar account row; the Maya row remains a direct Settings shortcut.


## Timeline and workspace completion pass

- [x] Timeline items now show their full time period and clicking an item opens the same real form used by Add moment: start time, end time, title, type, owner and location.
- [x] Past-event View recap opens a read-only recap for the specific event clicked instead of navigating to another event.
- [x] The sidebar receives live event data, so a newly created event immediately updates the event label and date/venue summary; the unused EVENT plus control was removed.
- [x] New workspace opens a real workspace-name/type form.
- [x] Supplier edit reopens a full form with name, category, contact, email/phone, quote amount, status and notes.
- [x] Venue layout supports additional Quiet room and Merch items; existing items retain drag and delete controls.
- [x] Pricing View plan details opens a clear detail modal for the Free personal and Organiser plans.

## Latest event and planning fixes

- [x] Notes & Activity no longer shows the View Audit Log option.
- [x] Every venue-map item is explicitly draggable when the layout is unlocked and remains deletable; the palette includes Stage, Bar, Seating, Entry, Power, Quiet room and Merch.
- [x] New tasks require both a due date and due time in the real add-task form before submission.
- [x] Event creation persists the new event, opens it as the current event, renders it in the Events list and updates the sidebar immediately; the sample event is named Midnight Garden Gala.
- [x] View recap opens a dedicated detailed read-only recap page with run of show, supplier contacts, guest/budget snapshot and layout notes.

## Latest state and deletion fixes

- [x] Removed the View Audit Log option and its related UI path from Notes & Activity.
- [x] Venue items are always draggable when unlocked, use pointer-events auto and a grab cursor, and Reset layout / return restores the canonical default positions.
- [x] New events are prepended to the persisted event state and immediately drive both the Events page and sidebar current-event summary.
- [x] Recaps use the unique event ID in `/app/recap/:id`, including stable IDs for archived demo events, so the selected event is rendered.
- [x] Event cards include confirmed-delete actions that remove the event from local state and select the next available event when the current event is deleted.

## Vercel static deployment

- [x] Added `vite.vercel.config.ts` and `pnpm build:vercel` for a client-only Vite build.
- [x] Added `vercel.json` with frozen pnpm installation, `dist/public` output, SPA rewrites and cache headers.
- [x] Added a static `/api/platform/config.js` asset and `.vercelignore` so backend TypeScript and migrations are not exposed by the static deployment.
- [x] Documented the Vercel deployment boundary in `VERCEL.md`.


## Latest UI polish

- [x] Venue Layout now labels the default-position restore control simply `Reset` while retaining instant restoration of all elements.
- [x] The sidebar SceneSet logo is a keyboard-focusable button that navigates to `/`.
- [x] Budget line editing now supports item name, category, budgeted amount, actual amount, status and notes in one real form.
