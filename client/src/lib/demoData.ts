export type ViewKey =
  | "events"
  | "overview"
  | "tasks"
  | "budget"
  | "suppliers"
  | "guests"
  | "schedule"
  | "layout"
  | "notes"
  | "templates"
  | "pricing"
  | "settings";

export type TaskStatus = "backlog" | "in-progress" | "review" | "done";
export type SupplierStatus = "Inquiry" | "Quote received" | "Confirmed" | "Paid";
export type RSVPStatus = "Confirmed" | "Pending" | "Declined";
export type GuestGender = "Male" | "Female" | "Other" | "Prefer not to say";
export type GuestSegment = "VIP" | "Media" | "Vendor" | "Staff" | "General";

export type Task = {
  id: string;
  title: string;
  project: string;
  owner: string;
  initials: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  status: TaskStatus;
  color: string;
};

export type BudgetItem = {
  id: string;
  name: string;
  category: string;
  planned: number;
  actual: number;
  status: "On track" | "Watch" | "Over";
};

export type Supplier = {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  status: SupplierStatus;
  quote: number;
  paid: number;
  initials: string;
  color: string;
  notes?: string;
};

export type Guest = {
  id: string;
  name: string;
  company: string;
  role: string;
  gender?: GuestGender;
  phone?: string;
  email?: string;
  tag: GuestSegment;
  rsvp: RSVPStatus;
  plusOne: boolean;
  initials: string;
  color: string;
};

export type ScheduleItem = {
  id: string;
  time: string;
  end: string;
  title: string;
  owner: string;
  location: string;
  kind: "Milestone" | "Show flow" | "Crew" | "Guest";
  complete: boolean;
};

export type LayoutItem = {
  id: string;
  type: "stage" | "table" | "bar" | "entrance" | "power" | "seating" | "quiet" | "merch";
  label: string;
  x: number;
  y: number;
  color: string;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  author: string;
  initials: string;
  updated: string;
  color: string;
  pinned?: boolean;
};

export type Activity = {
  id: string;
  actor: string;
  initials: string;
  action: string;
  subject: string;
  time: string;
  color: string;
};

export type FileRecord = {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  uploaded: string;
};

export type EventRecord = {
  id: string;
  name: string;
  date: string;
  weekday: string;
  venue: string;
  city: string;
  goal: string;
  attendees: number;
  accent: string;
  archived?: boolean;
};

export type SceneSetData = {
  event: EventRecord;
  tasks: Task[];
  budget: BudgetItem[];
  suppliers: Supplier[];
  guests: Guest[];
  schedule: ScheduleItem[];
  layout: LayoutItem[];
  notes: Note[];
  activity: Activity[];
  files: FileRecord[];
  layoutLocked: boolean;
  contingency: number;
};

export const defaultData: SceneSetData = {
  event: {
    id: "evt-1",
    name: "Afterglow / Community Night",
    date: "18 Oct 2026",
    weekday: "Sunday",
    venue: "The Tram Depot",
    city: "Manchester, UK",
    goal: "A warm, low-pressure night for the people who make the city move.",
    attendees: 240,
    accent: "#f25c54",
  },
  tasks: [
    { id: "t-1", title: "Lock final floor plan", project: "Production", owner: "Maya Chen", initials: "MC", due: "Today", priority: "High", status: "in-progress", color: "#e8b44c" },
    { id: "t-2", title: "Approve artist hospitality list", project: "Guest experience", owner: "Ari Bell", initials: "AB", due: "Today", priority: "High", status: "review", color: "#95cdbb" },
    { id: "t-3", title: "Collect public liability certificate", project: "Suppliers", owner: "Maya Chen", initials: "MC", due: "Tomorrow", priority: "Medium", status: "backlog", color: "#f25c54" },
    { id: "t-4", title: "Send access notes to crew", project: "Production", owner: "Jordan Lee", initials: "JL", due: "Tomorrow", priority: "Medium", status: "done", color: "#9b8bd8" },
    { id: "t-5", title: "Confirm quiet room signage", project: "Guest experience", owner: "Ari Bell", initials: "AB", due: "20 Oct", priority: "Low", status: "backlog", color: "#6ca8c9" },
    { id: "t-6", title: "Print wristband count sheet", project: "Front of house", owner: "Jordan Lee", initials: "JL", due: "20 Oct", priority: "Low", status: "done", color: "#e8b44c" },
    { id: "t-7", title: "Brief photographer on shot list", project: "Comms", owner: "Maya Chen", initials: "MC", due: "21 Oct", priority: "Medium", status: "review", color: "#95cdbb" },
    { id: "t-8", title: "Reconcile lighting quote", project: "Budget", owner: "Maya Chen", initials: "MC", due: "21 Oct", priority: "High", status: "in-progress", color: "#f25c54" },
  ],
  budget: [
    { id: "b-1", name: "Venue hire", category: "Space", planned: 3200, actual: 3200, status: "On track" },
    { id: "b-2", name: "Sound + lighting", category: "Production", planned: 4200, actual: 3850, status: "Watch" },
    { id: "b-3", name: "Artist fees", category: "Programme", planned: 5600, actual: 4900, status: "On track" },
    { id: "b-4", name: "Catering + bar", category: "Hospitality", planned: 2800, actual: 2640, status: "On track" },
    { id: "b-5", name: "Print + signage", category: "Guest experience", planned: 900, actual: 1120, status: "Over" },
    { id: "b-6", name: "Contingency", category: "Reserve", planned: 1200, actual: 0, status: "On track" },
  ],
  suppliers: [
    { id: "s-1", name: "Northstar AV", category: "Sound + light", contact: "Nia Patel", email: "nia@northstar.example", status: "Confirmed", quote: 3850, paid: 1925, initials: "NA", color: "#f25c54" },
    { id: "s-2", name: "Common Ground Catering", category: "Food + bar", contact: "Tomas Reed", email: "tomas@commonground.example", status: "Quote received", quote: 2640, paid: 0, initials: "CG", color: "#95cdbb" },
    { id: "s-3", name: "Paper Tiger Studio", category: "Print + signage", contact: "Sam Okafor", email: "sam@papertiger.example", status: "Paid", quote: 1120, paid: 1120, initials: "PT", color: "#e8b44c" },
    { id: "s-4", name: "Soft Focus Photo", category: "Photography", contact: "Rae Williams", email: "rae@softfocus.example", status: "Inquiry", quote: 850, paid: 0, initials: "SF", color: "#9b8bd8" },
    { id: "s-5", name: "Moss & Wire Florals", category: "Set dressing", contact: "Luca Moss", email: "luca@mosswire.example", status: "Confirmed", quote: 780, paid: 0, initials: "MW", color: "#6ca8c9" },
  ],
  guests: [
    { id: "g-1", name: "Aisha Rahman", company: "North West Arts", role: "Programme lead", tag: "VIP", rsvp: "Confirmed", plusOne: true, initials: "AR", color: "#f25c54" },
    { id: "g-2", name: "Theo Martin", company: "Local Lens", role: "Culture editor", tag: "Media", rsvp: "Confirmed", plusOne: false, initials: "TM", color: "#95cdbb" },
    { id: "g-3", name: "Rosa & Co.", company: "Rosa & Co. Studio", role: "Market vendor", tag: "Vendor", rsvp: "Pending", plusOne: true, initials: "RC", color: "#e8b44c" },
    { id: "g-4", name: "Jordan Lee", company: "SceneSet", role: "Floor manager", tag: "Staff", rsvp: "Confirmed", plusOne: false, initials: "JL", color: "#9b8bd8" },
    { id: "g-5", name: "Mina Okoro", company: "Open Door Choir", role: "Performer", tag: "VIP", rsvp: "Confirmed", plusOne: true, initials: "MO", color: "#6ca8c9" },
    { id: "g-6", name: "Elliot Price", company: "Northern Quarter FM", role: "Host", tag: "Media", rsvp: "Pending", plusOne: false, initials: "EP", color: "#f25c54" },
    { id: "g-7", name: "Sana Malik", company: "Freelance", role: "Stagehand", tag: "Staff", rsvp: "Declined", plusOne: false, initials: "SM", color: "#95cdbb" },
  ],
  schedule: [
    { id: "r-1", time: "08:00", end: "09:30", title: "Crew access + load-in", owner: "Jordan Lee", location: "South loading bay", kind: "Crew", complete: true },
    { id: "r-2", time: "09:30", end: "11:00", title: "Sound check / lighting focus", owner: "Northstar AV", location: "Main room", kind: "Show flow", complete: true },
    { id: "r-3", time: "11:30", end: "12:00", title: "Venue safety walk", owner: "Maya Chen", location: "All zones", kind: "Milestone", complete: false },
    { id: "r-4", time: "16:00", end: "17:30", title: "Artist arrival + green room", owner: "Ari Bell", location: "Studio 2", kind: "Guest", complete: false },
    { id: "r-5", time: "18:00", end: "18:15", title: "Doors + welcome", owner: "Jordan Lee", location: "Front entrance", kind: "Milestone", complete: false },
    { id: "r-6", time: "19:30", end: "20:15", title: "Open Door Choir", owner: "Mina Okoro", location: "Main room", kind: "Show flow", complete: false },
    { id: "r-7", time: "22:45", end: "23:30", title: "Close + clear venue", owner: "Jordan Lee", location: "All zones", kind: "Crew", complete: false },
  ],
  layout: [
    { id: "l-1", type: "stage", label: "STAGE", x: 40, y: 22, color: "#f25c54" },
    { id: "l-2", type: "bar", label: "BAR", x: 78, y: 28, color: "#95cdbb" },
    { id: "l-3", type: "entrance", label: "ENTRY", x: 12, y: 72, color: "#e8b44c" },
    { id: "l-4", type: "seating", label: "SEATING", x: 27, y: 52, color: "#9b8bd8" },
    { id: "l-5", type: "seating", label: "SEATING", x: 59, y: 54, color: "#9b8bd8" },
    { id: "l-6", type: "power", label: "POWER", x: 86, y: 76, color: "#6ca8c9" },
  ],
  notes: [
    { id: "n-1", title: "The room should feel generous", body: "Keep the centre lane clear between the entry and stage. The first impression is movement, not queueing.", author: "Maya Chen", initials: "MC", updated: "12 min ago", color: "#f25c54", pinned: true },
    { id: "n-2", title: "Quiet room checklist", body: "Two floor cushions, a soft lamp, water carafe and printed access note. @Jordan can you own the signage?", author: "Ari Bell", initials: "AB", updated: "1 hr ago", color: "#95cdbb" },
    { id: "n-3", title: "Photo moments", body: "Capture arrival details, hands at work and the choir warm-up. No flash during performances.", author: "Maya Chen", initials: "MC", updated: "Yesterday", color: "#e8b44c" },
  ],
  activity: [
    { id: "a-1", actor: "Maya Chen", initials: "MC", action: "moved", subject: "Lock final floor plan → In progress", time: "12 min ago", color: "#f25c54" },
    { id: "a-2", actor: "Jordan Lee", initials: "JL", action: "completed", subject: "Send access notes to crew", time: "35 min ago", color: "#9b8bd8" },
    { id: "a-3", actor: "Nia Patel", initials: "NP", action: "uploaded", subject: "Northstar AV quote v2.pdf", time: "1 hr ago", color: "#95cdbb" },
    { id: "a-4", actor: "Ari Bell", initials: "AB", action: "mentioned", subject: "Jordan in Quiet room checklist", time: "1 hr ago", color: "#e8b44c" },
    { id: "a-5", actor: "Maya Chen", initials: "MC", action: "locked", subject: "Event access / venue details", time: "Yesterday", color: "#f25c54" },
  ],
  files: [
    { id: "f-1", name: "Northstar AV quote v2.pdf", sizeBytes: 420000, mimeType: "application/pdf", uploaded: "1 hr ago" },
    { id: "f-2", name: "tram-depot-floor-plan.png", sizeBytes: 860000, mimeType: "image/png", uploaded: "Yesterday" },
    { id: "f-3", name: "afterglow-moodboard.jpg", sizeBytes: 1200000, mimeType: "image/jpeg", uploaded: "Yesterday" },
  ],
  layoutLocked: false,
  contingency: 8,
};

export const templateCards = [
  { name: "Pop-up Market", count: "32 tasks · 8 suppliers", tint: "#e8b44c", description: "A practical market-day setup with vendor arrivals, power and public flow." },
  { name: "Birthday Showcase", count: "24 tasks · 5 suppliers", tint: "#f25c54", description: "A warm, intimate format for a milestone birthday with a little stage time." },
  { name: "Community Festival", count: "48 tasks · 12 suppliers", tint: "#95cdbb", description: "A multi-zone plan for programming, volunteers, access and family-friendly flow." },
  { name: "Corporate Mixer", count: "28 tasks · 7 suppliers", tint: "#9b8bd8", description: "A polished run-of-show for a hosted evening with guests, speakers and partners." },
];

export const currency = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);

export const getReadiness = (data: SceneSetData) => {
  const taskScore = (data.tasks.filter(task => task.status === "done").length / data.tasks.length) * 25;
  const supplierScore = (data.suppliers.filter(supplier => supplier.status === "Confirmed" || supplier.status === "Paid").length / data.suppliers.length) * 20;
  const guestScore = (data.guests.filter(guest => guest.rsvp === "Confirmed").length / data.guests.length) * 15;
  const scheduleScore = (data.schedule.filter(item => item.complete).length / data.schedule.length) * 15;
  const planned = data.budget.reduce((sum, item) => sum + item.planned, 0);
  const actual = data.budget.reduce((sum, item) => sum + item.actual, 0);
  const budgetScore = Math.max(0, Math.min(10, ((planned - actual) / planned) * 10));
  const layoutScore = data.layoutLocked ? 15 : 11;
  return Math.round(taskScore + supplierScore + guestScore + scheduleScore + budgetScore + layoutScore);
};
