import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { useSceneSetData } from "@/lib/appStore";
import {
  currency,
  getReadiness,
  templateCards,
  type BudgetItem,
  type Guest,
  type SceneSetData,
  type ScheduleItem,
  type SupplierStatus,
  type Task,
  type TaskStatus,
  type ViewKey,
} from "@/lib/demoData";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  AtSign,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleDashed,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  CloudUpload,
  Copy,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Flag,
  GripVertical,
  HeartPulse,
  LayoutDashboard,
  Link2,
  ListFilter,
  LockKeyhole,
  MapPinned,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Moon,
  NotebookPen,
  PanelLeft,
  Pencil,
  Plus,
  Radio,
  Receipt,
  Rocket,
  Search,
  Send,
  Settings2,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Tag,
  Target,
  Trash2,
  Upload,
  UserPlus,
  Users,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type IconType = typeof LayoutDashboard;

type NavItem = {
  key: ViewKey;
  label: string;
  icon: IconType;
  shortcut?: string;
};

const navItems: NavItem[] = [
  { key: "events", label: "Events", icon: CalendarDays },
  { key: "overview", label: "Overview", icon: LayoutDashboard, shortcut: "G" },
  { key: "tasks", label: "Task board", icon: ClipboardList, shortcut: "T" },
  { key: "budget", label: "Budget", icon: WalletCards },
  { key: "suppliers", label: "Suppliers", icon: Receipt },
  { key: "guests", label: "Guests", icon: Users },
  { key: "schedule", label: "Run of show", icon: Clock3, shortcut: "S" },
  { key: "layout", label: "Venue layout", icon: MapPinned },
  { key: "notes", label: "Notes & activity", icon: NotebookPen },
];

const secondaryItems: NavItem[] = [
  { key: "templates", label: "Templates", icon: Copy },
  { key: "pricing", label: "Plans & pricing", icon: Sparkles },
  { key: "settings", label: "Settings", icon: Settings2 },
];

const taskColumns: { key: TaskStatus; label: string; hint: string }[] = [
  { key: "backlog", label: "Backlog", hint: "Queue it up" },
  { key: "in-progress", label: "In progress", hint: "Make it move" },
  { key: "review", label: "Review", hint: "One more look" },
  { key: "done", label: "Done", hint: "Locked in" },
];

const money = (value: number) => currency(value).replace("£", "£");

function Avatar({ initials, color, size = "normal" }: { initials: string; color: string; size?: "normal" | "small" | "large" }) {
  return <span className={`avatar avatar-${size}`} style={{ background: color }}>{initials}</span>;
}

function StatusPill({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "good" | "warn" | "bad" | "coral" }) {
  return <span className={`status-pill status-${tone}`}><span className="status-dot" />{label}</span>;
}

function SectionLabel({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return <div className="section-label"><span>{children}</span>{action}</div>;
}

function ProgressBar({ value, tone = "coral" }: { value: number; tone?: string }) {
  return <div className="progress-track"><span className={`progress-fill ${tone}`} style={{ width: `${Math.min(100, value)}%` }} /></div>;
}

function WorkspaceHeader({
  data,
  activeView,
  onNavigate,
  query,
  setQuery,
  onShare,
  onPrint,
}: {
  data: SceneSetData;
  activeView: ViewKey;
  onNavigate: (view: ViewKey) => void;
  query: string;
  setQuery: (value: string) => void;
  onShare: () => void;
  onPrint: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  return (
    <header className="workspace-header">
      <div className="crumbs">
        <span className="crumb-muted">SceneSet</span><ChevronRight size={14} /><span>{data.event.name}</span><ChevronRight size={14} /><strong>{navItems.concat(secondaryItems).find(item => item.key === activeView)?.label}</strong>
      </div>
      <div className="header-actions">
        <label className="search-box"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search workspace" /><kbd>⌘ K</kbd></label>
        <Button variant="ghost" size="icon" className="icon-button" aria-label="Open activity"><Bell size={17} /><span className="notification-dot" /></Button>
        <Button variant="ghost" size="icon" className="icon-button" onClick={toggleTheme} aria-label="Toggle dark mode">{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</Button>
        <Button variant="outline" size="sm" onClick={onShare}><Share2 size={15} />Share</Button>
        <Button variant="default" size="sm" onClick={onPrint}><Download size={15} />Day-of pack</Button>
        <button className="user-chip" onClick={() => onNavigate("settings")}><Avatar initials={user?.name?.slice(0, 2).toUpperCase() || "MC"} color="#f25c54" size="small" /><span>{user?.name?.split(" ")[0] || "Maya"}</span><ChevronDown size={13} /></button>
      </div>
    </header>
  );
}

function Sidebar({ activeView, onNavigate, onReset }: { activeView: ViewKey; onNavigate: (view: ViewKey) => void; onReset: () => void }) {
  const { user } = useAuth();
  return <aside className="sidebar">
    <div className="brand-lockup" onClick={() => onNavigate("overview")} role="button" tabIndex={0}>
      <span className="brand-mark"><span /><span /></span><span className="brand-name">SceneSet</span><span className="beta-badge">BETA</span>
    </div>
    <div className="workspace-switcher"><span className="workspace-avatar">A</span><span><small>WORKSPACE</small><strong>Afterglow team</strong></span><ChevronDown size={14} /></div>
    <div className="sidebar-scroll">
      <SectionLabel action={<button className="small-icon-button" onClick={() => toast.info("Event switcher coming next") } aria-label="Add event"><Plus size={14} /></button>}>EVENT</SectionLabel>
      <button className="event-switcher"><span className="event-color" /><span><strong>{"Afterglow / Community Night"}</strong><small>18 Oct · The Tram Depot</small></span><ChevronDown size={14} /></button>
      <SectionLabel>PLAN</SectionLabel>
      <nav className="side-nav">{navItems.map(item => <NavButton key={item.key} item={item} active={activeView === item.key} onClick={() => onNavigate(item.key)} />)}</nav>
      <SectionLabel>MORE</SectionLabel>
      <nav className="side-nav">{secondaryItems.map(item => <NavButton key={item.key} item={item} active={activeView === item.key} onClick={() => onNavigate(item.key)} />)}</nav>
      <div className="sidebar-card"><div className="sidebar-card-icon"><HeartPulse size={16} /></div><strong>You're 6 moves from ready.</strong><p>Finish the high-priority items before your next team check-in.</p><button onClick={() => onNavigate("tasks")}>See next moves <ArrowRight size={14} /></button></div>
    </div>
    <div className="sidebar-footer"><button className="sidebar-footer-button" onClick={() => toast.info("Invite link copied to clipboard") }><UserPlus size={16} />Invite teammate<span className="shortcut">⌘ I</span></button><button className="sidebar-footer-button" onClick={onReset}><CircleDashed size={16} />Reset demo data</button><div className="account-row"><Avatar initials={user?.name?.slice(0, 2).toUpperCase() || "MC"} color="#f25c54" /><span><strong>{user?.name || "Maya Chen"}</strong><small>{user ? "Owner" : "Demo workspace"}</small></span><MoreHorizontal size={16} /></div></div>
  </aside>;
}

function NavButton({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return <button className={`nav-button ${active ? "active" : ""}`} onClick={onClick}><Icon size={17} /><span>{item.label}</span>{item.shortcut && <span className="shortcut">{item.shortcut}</span>}</button>;
}

function EventIntro({ data, onNavigate }: { data: SceneSetData; onNavigate: (view: ViewKey) => void }) {
  return <div className="event-intro">
    <div><div className="eyebrow"><span className="live-dot" />SUNDAY · 18 OCTOBER 2026</div><h1>{data.event.name}</h1><p>{data.event.goal}</p><div className="intro-meta"><span><MapPinned size={15} />{data.event.venue}</span><span><Users size={15} />{data.event.attendees} expected</span><span><Target size={15} />Community night</span></div></div>
    <div className="intro-actions"><button className="text-button" onClick={() => onNavigate("settings")}><Pencil size={14} />Edit event</button><button className="outline-pill" onClick={() => onNavigate("schedule")}><Radio size={14} />Open live run of show</button></div>
  </div>;
}

function EventsView({ data, onNavigate, update }: { data: SceneSetData; onNavigate: (view: ViewKey) => void; update: (next: SceneSetData | ((current: SceneSetData) => SceneSetData)) => void }) {
  const archived = [
    { name: "Lantern Room / Winter Social", date: "06 Dec 2025", venue: "Moss Side Community Hall", status: "Complete", accent: "#95cdbb" },
    { name: "Small Acts / Pilot Night", date: "22 Aug 2025", venue: "The Tram Depot", status: "Complete", accent: "#9b8bd8" },
  ];
  return <div className="view-stack"><PageHeading eyebrow="WORKSPACE / EVENTS" title="Your events" description="Keep every plan close, without losing the shape of the one happening next." actions={<><Button variant="outline" onClick={() => toast.info("Choose a template to start a new event") }><Sparkles size={15} />From template</Button><Button onClick={() => { const name = window.prompt("Name the new event"); if (name) { update(current => ({ ...current, event: { ...current.event, name: `${name} / Untitled event`, goal: "A new event plan waiting for its first good decision." } })); toast.success("Draft event created"); } }}><Plus size={15} />New event</Button></>} /><div className="event-list-grid"><Card className="event-list-card current-event"><div className="event-card-top"><span className="event-card-status"><span className="live-dot" />ACTIVE EVENT</span><button className="small-icon-button"><MoreHorizontal size={16} /></button></div><div className="event-card-date"><strong>{data.event.date}</strong><span>{data.event.weekday}</span></div><h2>{data.event.name}</h2><p>{data.event.goal}</p><div className="event-card-meta"><span><MapPinned size={14} />{data.event.venue}</span><span><Users size={14} />{data.event.attendees} expected</span></div><div className="event-card-footer"><StatusPill label="In planning" tone="coral" /><button className="card-link" onClick={() => onNavigate("overview")}>Open workspace <ArrowRight size={14} /></button></div></Card>{archived.map(event => <Card className="event-list-card archived-event" key={event.name}><div className="event-card-top"><span className="event-card-status"><span className="status-dot" style={{ background: event.accent }} />PAST EVENT</span><button className="small-icon-button"><MoreHorizontal size={16} /></button></div><div className="event-card-date"><strong>{event.date}</strong><span>Archived</span></div><h2>{event.name}</h2><p>{event.venue}</p><div className="event-card-meta"><span><CheckCircle2 size={14} />Run sheet complete</span><span><Users size={14} />Shared recap saved</span></div><div className="event-card-footer"><StatusPill label={event.status} tone="good" /><button className="card-link" onClick={() => toast.info("Archived events open in read-only mode")}>View recap <ArrowRight size={14} /></button></div></Card>)}</div><div className="event-list-footer"><div><span className="eyebrow">KEEP THE GOOD BITS</span><h3>Need a faster start?</h3><p>Templates turn a proven event shape into a fresh, editable plan.</p></div><Button variant="outline" onClick={() => onNavigate("templates")}>Browse templates <ArrowRight size={15} /></Button></div></div>;
}

function ReadinessCard({ data }: { data: SceneSetData }) {
  const score = getReadiness(data);
  const circumference = 2 * Math.PI * 42;
  return <Card className="readiness-card"><div className="card-topline"><SectionLabel>READINESS / GO-LIVE</SectionLabel><button className="small-icon-button" aria-label="More readiness options"><MoreHorizontal size={16} /></button></div><div className="readiness-body"><div className="score-ring" style={{ "--score": `${score}%`, "--dash": `${(score / 100) * circumference}` } as React.CSSProperties}><svg viewBox="0 0 100 100"><circle className="ring-base" cx="50" cy="50" r="42" /><circle className="ring-progress" cx="50" cy="50" r="42" /></svg><div><strong>{score}</strong><span>/100</span></div></div><div className="readiness-copy"><strong>{score >= 80 ? "Good momentum." : "Keep the room moving."}</strong><p>Most foundations are in place. Clear the next few blockers before the team sync.</p><span className="tiny-update"><Zap size={13} />+8 since last check-in</span></div></div><div className="readiness-breakdown"><ReadinessRow label="Tasks" value={`${data.tasks.filter(task => task.status === "done").length}/${data.tasks.length}`} progress={(data.tasks.filter(task => task.status === "done").length / data.tasks.length) * 100} /><ReadinessRow label="Suppliers" value={`${data.suppliers.filter(supplier => supplier.status === "Confirmed" || supplier.status === "Paid").length}/${data.suppliers.length}`} progress={(data.suppliers.filter(supplier => supplier.status === "Confirmed" || supplier.status === "Paid").length / data.suppliers.length) * 100} /><ReadinessRow label="Guest RSVPs" value={`${data.guests.filter(guest => guest.rsvp === "Confirmed").length}/${data.guests.length}`} progress={(data.guests.filter(guest => guest.rsvp === "Confirmed").length / data.guests.length) * 100} /><ReadinessRow label="Run of show" value={`${data.schedule.filter(item => item.complete).length}/${data.schedule.length}`} progress={(data.schedule.filter(item => item.complete).length / data.schedule.length) * 100} /></div></Card>;
}

function ReadinessRow({ label, value, progress }: { label: string; value: string; progress: number }) {
  return <div className="readiness-row"><span>{label}</span><ProgressBar value={progress} /><strong>{value}</strong></div>;
}

function OverviewView({ data, onNavigate, update }: { data: SceneSetData; onNavigate: (view: ViewKey) => void; update: (next: SceneSetData | ((current: SceneSetData) => SceneSetData)) => void }) {
  const planned = data.budget.reduce((sum, item) => sum + item.planned, 0);
  const actual = data.budget.reduce((sum, item) => sum + item.actual, 0);
  const confirmed = data.guests.filter(guest => guest.rsvp === "Confirmed").length;
  const completeTasks = data.tasks.filter(task => task.status === "done").length;
  const nextMoves = data.tasks.filter(task => task.status !== "done").slice(0, 3);
  const toggleTask = (id: string) => update(current => ({ ...current, tasks: current.tasks.map(task => task.id === id ? { ...task, status: task.status === "done" ? "in-progress" : "done" } : task) }));
  return <>
    <EventIntro data={data} onNavigate={onNavigate} />
    <div className="overview-grid"><ReadinessCard data={data} /><Card className="next-moves-card"><div className="card-topline"><SectionLabel>NEXT MOVES</SectionLabel><Badge variant="outline">{nextMoves.length} today</Badge></div><h2>Make the next move obvious.</h2><div className="next-list">{nextMoves.map(task => <button className="next-item" key={task.id} onClick={() => toggleTask(task.id)}><span className="check-circle" /><span><strong>{task.title}</strong><small>{task.due} · {task.owner}</small></span><ArrowUpRight size={15} /></button>)}</div><button className="card-link" onClick={() => onNavigate("tasks")}>Open task board <ArrowRight size={15} /></button></Card></div>
    <div className="metric-grid"><MetricCard label="Committed spend" value={money(actual)} meta={`of ${money(planned)}`} icon={WalletCards} tone="coral" trend="12% under plan" trendIcon={ArrowDownRight} onClick={() => onNavigate("budget")} /><MetricCard label="Guest RSVPs" value={`${confirmed}/${data.guests.length}`} meta={`${Math.round((confirmed / data.guests.length) * 100)}% confirmed`} icon={Users} tone="mint" trend="+14 this week" trendIcon={ArrowUpRight} onClick={() => onNavigate("guests")} /><MetricCard label="Supplier pulse" value={`${data.suppliers.filter(s => s.status === "Confirmed" || s.status === "Paid").length}/${data.suppliers.length}`} meta="confirmed or paid" icon={Receipt} tone="lilac" trend="2 quotes to chase" trendIcon={AlertTriangle} onClick={() => onNavigate("suppliers")} /><MetricCard label="Tasks shipped" value={`${completeTasks}/${data.tasks.length}`} meta="done across the plan" icon={ClipboardCheck} tone="ochre" trend="3 due today" trendIcon={Flag} onClick={() => onNavigate("tasks")} /></div>
    <div className="dashboard-lower"><Card className="timeline-card"><div className="card-topline"><SectionLabel>UP NEXT</SectionLabel><button className="card-link" onClick={() => onNavigate("schedule")}>Full run of show <ArrowRight size={14} /></button></div><div className="timeline-list">{data.schedule.slice(0, 5).map(item => <ScheduleLine key={item.id} item={item} onToggle={() => update(current => ({ ...current, schedule: current.schedule.map(entry => entry.id === item.id ? { ...entry, complete: !entry.complete } : entry) }))} />)}</div></Card><Card className="activity-card"><div className="card-topline"><SectionLabel>ACTIVITY FEED</SectionLabel><button className="small-icon-button" onClick={() => onNavigate("notes")} aria-label="View all activity"><ArrowRight size={15} /></button></div><div className="activity-list">{data.activity.slice(0, 5).map(item => <ActivityLine key={item.id} item={item} />)}</div></Card></div>
  </>;
}

function MetricCard({ label, value, meta, icon: Icon, tone, trend, trendIcon: TrendIcon, onClick }: { label: string; value: string; meta: string; icon: IconType; tone: string; trend: string; trendIcon: IconType; onClick: () => void }) {
  return <button className="metric-card" onClick={onClick}><div className={`metric-icon ${tone}`}><Icon size={16} /></div><span className="metric-label">{label}</span><strong className="metric-value">{value}<small>{meta}</small></strong><span className={`metric-trend ${tone}`}><TrendIcon size={13} />{trend}</span><ArrowUpRight className="metric-arrow" size={15} /></button>;
}

function ScheduleLine({ item, onToggle }: { item: ScheduleItem; onToggle: () => void }) {
  return <div className={`schedule-line ${item.complete ? "complete" : ""}`}><button className="schedule-check" onClick={onToggle} aria-label={`Mark ${item.title} ${item.complete ? "incomplete" : "complete"}`}>{item.complete ? <CheckCircle2 size={18} /> : <Circle size={18} />}</button><span className="schedule-time">{item.time}<small>{item.end}</small></span><span className="schedule-title"><strong>{item.title}</strong><small>{item.owner} · {item.location}</small></span><StatusPill label={item.kind} tone={item.kind === "Milestone" ? "coral" : "neutral"} /></div>;
}

function ActivityLine({ item }: { item: SceneSetData["activity"][number] }) {
  return <div className="activity-line"><Avatar initials={item.initials} color={item.color} size="small" /><span><strong>{item.actor} <em>{item.action}</em></strong><small>{item.subject}</small><time>{item.time}</time></span></div>;
}

function TasksView({ data, update }: { data: SceneSetData; update: (next: SceneSetData | ((current: SceneSetData) => SceneSetData)) => void }) {
  const [filter, setFilter] = useState("All tasks");
  const [dragged, setDragged] = useState<string | null>(null);
  const addTask = () => {
    const title = window.prompt("What needs doing?");
    if (!title) return;
    update(current => ({ ...current, tasks: [...current.tasks, { id: `t-${Date.now()}`, title, project: "New work", owner: "Maya Chen", initials: "MC", due: "Next up", priority: "Medium", status: "backlog", color: "#f25c54" }] }));
    toast.success("Task added to backlog");
  };
  const moveTask = (id: string, status: TaskStatus) => update(current => ({ ...current, tasks: current.tasks.map(task => task.id === id ? { ...task, status } : task) }));
  const visibleTasks = data.tasks.filter(task => filter === "All tasks" || task.priority === filter || task.project === filter);
  return <div className="view-stack"><PageHeading eyebrow="PLANNING / TASKS" title="Task board" description="Keep the work visible, small and moving." actions={<><Button variant="outline" onClick={() => toast.info("Filter presets saved") }><Filter size={15} />Filter</Button><Button onClick={addTask}><Plus size={15} />New task</Button></>} /><div className="board-toolbar"><div className="segmented"><button className={filter === "All tasks" ? "selected" : ""} onClick={() => setFilter("All tasks")}>All tasks <span>{data.tasks.length}</span></button><button className={filter === "High" ? "selected" : ""} onClick={() => setFilter("High")}>High priority <span>{data.tasks.filter(task => task.priority === "High").length}</span></button><button className={filter === "Production" ? "selected" : ""} onClick={() => setFilter("Production")}>Production <span>{data.tasks.filter(task => task.project === "Production").length}</span></button></div><span className="keyboard-note"><kbd>T</kbd> new task <span>·</span> drag cards to move</span></div><div className="kanban-grid">{taskColumns.map(column => <div className="kanban-column" key={column.key} onDragOver={event => event.preventDefault()} onDrop={() => dragged && moveTask(dragged, column.key)}><div className="kanban-heading"><span className={`column-dot ${column.key}`} /><div><strong>{column.label}</strong><small>{column.hint}</small></div><span className="column-count">{visibleTasks.filter(task => task.status === column.key).length}</span></div><div className="task-stack">{visibleTasks.filter(task => task.status === column.key).map(task => <TaskCard key={task.id} task={task} onDragStart={() => setDragged(task.id)} onMove={status => moveTask(task.id, status)} />)}<button className="add-card" onClick={addTask}><Plus size={14} />Add task</button></div></div>)}</div></div>;
}

function TaskCard({ task, onDragStart, onMove }: { task: Task; onDragStart: () => void; onMove: (status: TaskStatus) => void }) {
  return <div className="task-card" draggable onDragStart={onDragStart}><div className="task-card-top"><span className="task-project" style={{ "--task-color": task.color } as React.CSSProperties}>{task.project}</span><button className="small-icon-button" aria-label="Task options"><MoreHorizontal size={15} /></button></div><strong>{task.title}</strong><div className="task-card-footer"><span className={`priority priority-${task.priority.toLowerCase()}`}><Flag size={12} />{task.priority}</span><span className="task-due">{task.due}</span><Avatar initials={task.initials} color={task.color} size="small" /></div><div className="task-hover-actions"><button onClick={() => onMove("backlog")} aria-label="Move to backlog">B</button><button onClick={() => onMove("in-progress")} aria-label="Move to in progress">I</button><button onClick={() => onMove("review")} aria-label="Move to review">R</button><button onClick={() => onMove("done")} aria-label="Move to done">D</button></div></div>;
}

function PageHeading({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: React.ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div><div className="page-actions">{actions}</div></div>;
}

function BudgetView({ data, update }: { data: SceneSetData; update: (next: SceneSetData | ((current: SceneSetData) => SceneSetData)) => void }) {
  const planned = data.budget.reduce((sum, item) => sum + item.planned, 0);
  const actual = data.budget.reduce((sum, item) => sum + item.actual, 0);
  const reserve = Math.round(planned * (data.contingency / 100));
  const forecast = actual + reserve;
  return <div className="view-stack"><PageHeading eyebrow="MONEY / BUDGET" title="Budget control" description="Know what is committed, what is moving and what is still yours to protect." actions={<><Button variant="outline" onClick={() => window.print()}><Download size={15} />Export summary</Button><Button onClick={() => toast.success("Budget line added") }><Plus size={15} />Add line</Button></>} /><div className="budget-summary"><BudgetSummary label="Planned envelope" value={money(planned)} meta="including contingency" /><BudgetSummary label="Committed spend" value={money(actual)} meta={`${Math.round((actual / planned) * 100)}% of plan`} tone="coral" /><BudgetSummary label="Contingency" value={`${data.contingency}%`} meta={money(reserve) + " held back"} tone="ochre" /><BudgetSummary label="Forecast total" value={money(forecast)} meta={forecast <= planned + reserve ? "within envelope" : "needs a review"} tone="mint" /></div><Card className="budget-card"><div className="card-topline"><div><SectionLabel>SPEND BY CATEGORY</SectionLabel><p className="card-subtitle">Update actuals as quotes become invoices.</p></div><button className="outline-pill" onClick={() => toast.info("Contingency is applied to the event envelope") }><SlidersHorizontal size={14} />Contingency <strong>{data.contingency}%</strong></button></div><div className="budget-table"><div className="table-row table-head"><span>Line item</span><span>Category</span><span>Planned</span><span>Actual</span><span>Status</span><span /></div>{data.budget.map(item => <BudgetRow key={item.id} item={item} onEdit={() => { const next = window.prompt(`Actual spend for ${item.name}`, String(item.actual)); if (next && !Number.isNaN(Number(next))) update(current => ({ ...current, budget: current.budget.map(row => row.id === item.id ? { ...row, actual: Number(next), status: Number(next) > row.planned ? "Over" : Number(next) > row.planned * .8 ? "Watch" : "On track" } : row) })); }} />)}</div><div className="budget-footer"><span><CheckCircle2 size={15} />Budget health is <strong>good</strong> — one line needs a closer look.</span><button className="card-link" onClick={() => toast.info("Budget CSV export queued")}>Download CSV <Download size={14} /></button></div></Card></div>;
}

function BudgetSummary({ label, value, meta, tone = "neutral" }: { label: string; value: string; meta: string; tone?: string }) {
  return <Card className={`budget-summary-card ${tone}`}><span>{label}</span><strong>{value}</strong><small>{meta}</small></Card>;
}

function BudgetRow({ item, onEdit }: { item: BudgetItem; onEdit: () => void }) {
  const progress = item.planned ? Math.min(100, (item.actual / item.planned) * 100) : 0;
  return <div className="table-row"><span className="line-name"><span className="line-icon"><DollarSign size={14} /></span><strong>{item.name}</strong></span><span className="muted-cell">{item.category}</span><span className="number-cell">{money(item.planned)}</span><span className="actual-cell"><strong>{money(item.actual)}</strong><ProgressBar value={progress} tone={item.status === "Over" ? "bad" : item.status === "Watch" ? "ochre" : "mint"} /></span><StatusPill label={item.status} tone={item.status === "Over" ? "bad" : item.status === "Watch" ? "warn" : "good"} /><button className="small-icon-button" onClick={onEdit} aria-label={`Edit ${item.name}`}><Pencil size={14} /></button></div>;
}

function SuppliersView({ data, update }: { data: SceneSetData; update: (next: SceneSetData | ((current: SceneSetData) => SceneSetData)) => void }) {
  const statuses: SupplierStatus[] = ["Inquiry", "Quote received", "Confirmed", "Paid"];
  const advance = (id: string) => update(current => ({ ...current, suppliers: current.suppliers.map(supplier => { if (supplier.id !== id) return supplier; const index = statuses.indexOf(supplier.status); return { ...supplier, status: statuses[Math.min(statuses.length - 1, index + 1)] }; }) }));
  return <div className="view-stack"><PageHeading eyebrow="PARTNERS / SUPPLIERS" title="Supplier desk" description="Compare quotes, chase the right people and keep payment status honest." actions={<><Button variant="outline"><Upload size={15} />Upload quote</Button><Button onClick={() => toast.success("Supplier added to directory") }><Plus size={15} />Add supplier</Button></>} /><div className="pipeline-strip">{statuses.map((status, index) => <div className="pipeline-step" key={status}><span className={`pipeline-number ${index === 2 ? "current" : ""}`}>{String(index + 1).padStart(2, "0")}</span><div><strong>{status}</strong><small>{data.suppliers.filter(supplier => supplier.status === status).length} suppliers</small></div>{index < statuses.length - 1 && <ArrowRight size={15} />}</div>)}</div><Card className="suppliers-card"><div className="card-topline"><div><SectionLabel>QUOTE COMPARISON</SectionLabel><p className="card-subtitle">A simple pipeline for the things that make the room happen.</p></div><div className="filter-pair"><button className="outline-pill"><ListFilter size={14} />All categories</button><button className="small-icon-button"><MoreHorizontal size={16} /></button></div></div><div className="supplier-table"><div className="table-row table-head"><span>Supplier</span><span>Category</span><span>Contact</span><span>Quote</span><span>Status</span><span /></div>{data.suppliers.map(supplier => <div className="table-row" key={supplier.id}><span className="supplier-name"><Avatar initials={supplier.initials} color={supplier.color} /><span><strong>{supplier.name}</strong><small>{supplier.email}</small></span></span><span className="muted-cell">{supplier.category}</span><span className="contact-cell">{supplier.contact}</span><span className="number-cell">{money(supplier.quote)}</span><span><button className="status-select" onClick={() => advance(supplier.id)}><StatusPill label={supplier.status} tone={supplier.status === "Paid" || supplier.status === "Confirmed" ? "good" : supplier.status === "Quote received" ? "warn" : "neutral"} /><ChevronDown size={13} /></button></span><button className="small-icon-button" aria-label={`Open ${supplier.name}`}><ExternalLink size={14} /></button></div>)}</div><div className="supplier-footer"><span><CloudUpload size={15} />5 of 25 free-plan files used</span><button className="card-link" onClick={() => toast.info("Quote comparison ready to share")}>Share comparison <Share2 size={14} /></button></div></Card><div className="referral-callout"><div className="referral-mark"><Sparkles size={17} /></div><div><strong>Need a trusted hand?</strong><p>Optional vendor referrals live here — separate from your core event plan.</p></div><button className="text-button" onClick={() => toast.info("Vendor referrals are coming soon")}>Browse referrals <ArrowRight size={14} /></button></div></div>;
}

function GuestsView({ data }: { data: SceneSetData }) {
  const [tag, setTag] = useState("All guests");
  const [rsvp, setRsvp] = useState("All RSVPs");
  const tags = ["All guests", "VIP", "Media", "Vendor", "Staff"];
  const visible = data.guests.filter(guest => (tag === "All guests" || guest.tag === tag) && (rsvp === "All RSVPs" || guest.rsvp === rsvp));
  return <div className="view-stack"><PageHeading eyebrow="PEOPLE / GUESTS" title="Guest list" description="Know who is coming, who needs a nudge and who gets the quiet room." actions={<><Button variant="outline" onClick={() => toast.info("Guest import supports CSV in the paid plan") }><Upload size={15} />Import list</Button><Button onClick={() => toast.success("Guest added") }><Plus size={15} />Add guest</Button></>} /><div className="guest-summary"><div><strong>{data.guests.filter(guest => guest.rsvp === "Confirmed").length}</strong><span>confirmed</span></div><div><strong>{data.guests.filter(guest => guest.rsvp === "Pending").length}</strong><span>to chase</span></div><div><strong>{data.guests.filter(guest => guest.rsvp === "Declined").length}</strong><span>declined</span></div><div className="guest-summary-note"><HeartPulse size={15} />82% of your VIPs are confirmed.</div></div><Card className="guests-card"><div className="guest-toolbar"><div className="tag-filter">{tags.map(item => <button key={item} className={tag === item ? "selected" : ""} onClick={() => setTag(item)}>{item}<span>{item === "All guests" ? data.guests.length : data.guests.filter(guest => guest.tag === item).length}</span></button>)}</div><select value={rsvp} onChange={event => setRsvp(event.target.value)}><option>All RSVPs</option><option>Confirmed</option><option>Pending</option><option>Declined</option></select></div><div className="guest-table"><div className="table-row table-head"><span>Guest</span><span>Role</span><span>Segment</span><span>RSVP</span><span>Plus one</span><span /></div>{visible.map(guest => <GuestRow guest={guest} key={guest.id} />)}</div></Card></div>;
}

function GuestRow({ guest }: { guest: Guest }) {
  return <div className="table-row"><span className="supplier-name"><Avatar initials={guest.initials} color={guest.color} /><span><strong>{guest.name}</strong><small>{guest.company}</small></span></span><span className="muted-cell">{guest.role}</span><span><span className={`tag-chip tag-${guest.tag.toLowerCase()}`}><Tag size={11} />{guest.tag}</span></span><span><StatusPill label={guest.rsvp} tone={guest.rsvp === "Confirmed" ? "good" : guest.rsvp === "Pending" ? "warn" : "bad"} /></span><span className="muted-cell">{guest.plusOne ? "Yes" : "—"}</span><button className="small-icon-button" aria-label={`Edit ${guest.name}`}><MoreHorizontal size={15} /></button></div>;
}

function ScheduleView({ data, update }: { data: SceneSetData; update: (next: SceneSetData | ((current: SceneSetData) => SceneSetData)) => void }) {
  const [mode, setMode] = useState<"run" | "timeline">("run");
  const toggle = (id: string) => update(current => ({ ...current, schedule: current.schedule.map(item => item.id === id ? { ...item, complete: !item.complete } : item) }));
  return <div className="view-stack"><PageHeading eyebrow="TIMING / RUN OF SHOW" title="Run of show" description="A shared clock for the people making the room happen." actions={<><Button variant="outline" onClick={() => toast.info("Timeline exported") }><Download size={15} />Export run sheet</Button><Button onClick={() => toast.success("Schedule item added") }><Plus size={15} />Add moment</Button></>} /><div className="schedule-toolbar"><div className="segmented"><button className={mode === "run" ? "selected" : ""} onClick={() => setMode("run")}><Clock3 size={14} />Run of show</button><button className={mode === "timeline" ? "selected" : ""} onClick={() => setMode("timeline")}><Activity size={14} />Timeline / milestones</button></div><span className="keyboard-note"><kbd>S</kbd> jump to schedule <span>·</span> <kbd>Space</kbd> complete selected</span></div>{mode === "run" ? <Card className="run-sheet"><div className="run-sheet-head"><span>EVENT DAY · SUNDAY 18 OCT</span><span><LockKeyhole size={14} /> Internal working copy</span></div><div className="run-sheet-body">{data.schedule.map(item => <ScheduleLine key={item.id} item={item} onToggle={() => toggle(item.id)} />)}</div><button className="add-row" onClick={() => toast.success("Schedule item added") }><Plus size={14} />Add line to run sheet</button></Card> : <TimelineView data={data} />}</div>;
}

function TimelineView({ data }: { data: SceneSetData }) {
  return <Card className="timeline-board"><div className="timeline-axis"><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>00:00</span></div><div className="timeline-hours">{data.schedule.map((item, index) => <div className={`timeline-block timeline-${index % 4}`} key={item.id} style={{ gridColumn: `${Math.min(10, 1 + index)} / span ${index === 1 ? 2 : 1}` }}><span>{item.time}</span><strong>{item.title}</strong><small>{item.owner}</small></div>)}</div><div className="milestones-row"><span><i className="milestone-coral" />Doors</span><span><i className="milestone-mint" />Peak moment</span><span><i className="milestone-ochre" />Close</span></div></Card>;
}

function LayoutView({ data, update }: { data: SceneSetData; update: (next: SceneSetData | ((current: SceneSetData) => SceneSetData)) => void }) {
  const [dragged, setDragged] = useState<string | null>(null);
  const moveLayout = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!dragged) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(5, Math.min(90, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(8, Math.min(86, ((event.clientY - rect.top) / rect.height) * 100));
    update(current => ({ ...current, layout: current.layout.map(item => item.id === dragged ? { ...item, x, y } : item) }));
  };
  return <div className="view-stack"><PageHeading eyebrow="SPACE / VENUE LAYOUT" title="Room plan" description="A simple shared canvas for flow, access and the things people need to find." actions={<><Button variant="outline" onClick={() => toast.info("Floor plan attachment added") }><Upload size={15} />Attach plan</Button><Button onClick={() => update(current => ({ ...current, layoutLocked: !current.layoutLocked }))}>{data.layoutLocked ? <LockKeyhole size={15} /> : <Check size={15} />}{data.layoutLocked ? "Unlock layout" : "Lock layout"}</Button></>} /><div className="layout-toolbar"><div className="layout-legend"><span><i className="legend-swatch stage" />Program</span><span><i className="legend-swatch access" />Access</span><span><i className="legend-swatch guest" />Guest experience</span><span><i className="legend-swatch support" />Support</span></div><span className="layout-status">{data.layoutLocked ? <><LockKeyhole size={14} /> Locked for handoff</> : <><Pencil size={14} /> Editing canvas</>}</span></div><Card className="layout-card"><div className="layout-canvas" onDragOver={moveLayout}>{data.layout.map(item => <div key={item.id} className={`layout-object object-${item.type}`} draggable={!data.layoutLocked} onDragStart={() => setDragged(item.id)} style={{ left: `${item.x}%`, top: `${item.y}%`, "--object-color": item.color } as React.CSSProperties}><GripVertical className="drag-grip" size={14} /><span>{item.label}</span></div>)}<div className="canvas-label canvas-top">NORTH WALL · WINDOWS</div><div className="canvas-label canvas-bottom">SOUTH LOADING BAY · ACCESS</div><div className="canvas-aisle aisle-one" /><div className="canvas-aisle aisle-two" /></div><div className="layout-footer"><span><MapPinned size={15} /><strong>The Tram Depot</strong> · Main room · 22m × 14m</span><span>Drag items to plan the room <GripVertical size={14} /></span></div></Card></div>;
}

function NotesView({ data, update }: { data: SceneSetData; update: (next: SceneSetData | ((current: SceneSetData) => SceneSetData)) => void }) {
  const [activeNote, setActiveNote] = useState(data.notes[0]?.id || "");
  const note = data.notes.find(item => item.id === activeNote) || data.notes[0];
  const addNote = () => update(current => ({ ...current, notes: [{ id: `n-${Date.now()}`, title: "Untitled note", body: "Write the thing the team needs to remember…", author: "Maya Chen", initials: "MC", updated: "Just now", color: "#f25c54" }, ...current.notes] }));
  return <div className="view-stack"><PageHeading eyebrow="MEMORY / NOTES & ACTIVITY" title="Notes & activity" description="Keep the nuance close to the plan, not buried in another chat." actions={<><Button variant="outline" onClick={() => toast.info("Mention someone with @ in a note") }><AtSign size={15} />Mention</Button><Button onClick={addNote}><Plus size={15} />New note</Button></>} /><div className="notes-grid"><Card className="notes-list"><div className="card-topline"><SectionLabel>TEAM NOTES</SectionLabel><Badge variant="outline">{data.notes.length} notes</Badge></div>{data.notes.map(item => <button className={`note-list-item ${item.id === note?.id ? "selected" : ""}`} key={item.id} onClick={() => setActiveNote(item.id)}><span className="note-color" style={{ background: item.color }} /><span><strong>{item.title}</strong><small>{item.body.slice(0, 58)}…</small><time>{item.updated}</time></span>{item.pinned && <Tag size={14} />}</button>)}</Card><Card className="note-editor"><div className="note-editor-head"><span className="pin-label"><Tag size={14} />{note?.pinned ? "Pinned note" : "Team note"}</span><div><button className="small-icon-button" aria-label="Share note"><Share2 size={15} /></button><button className="small-icon-button" aria-label="Delete note"><Trash2 size={15} /></button></div></div><input className="note-title-input" value={note?.title || ""} onChange={event => update(current => ({ ...current, notes: current.notes.map(item => item.id === note?.id ? { ...item, title: event.target.value } : item) }))} /><textarea className="note-body-input" value={note?.body || ""} onChange={event => update(current => ({ ...current, notes: current.notes.map(item => item.id === note?.id ? { ...item, body: event.target.value } : item) }))} /><div className="mention-hint"><AtSign size={14} />Type <strong>@</strong> to mention a teammate <span>·</span> autosaved</div></Card><Card className="activity-panel"><div className="card-topline"><SectionLabel>ACTIVITY FEED</SectionLabel><button className="outline-pill"><Filter size={13} />All activity</button></div><div className="activity-list">{data.activity.map(item => <ActivityLine key={item.id} item={item} />)}</div><button className="card-link">View audit log <ArrowRight size={14} /></button></Card></div></div>;
}

function TemplatesView({ onNavigate, update }: { onNavigate: (view: ViewKey) => void; update: (next: SceneSetData | ((current: SceneSetData) => SceneSetData)) => void }) {
  return <div className="view-stack"><PageHeading eyebrow="STARTING POINTS / TEMPLATES" title="Start with a shape" description="Good events have patterns. Use one, then make it yours." actions={<Button variant="outline" onClick={() => toast.info("Your event template will be saved here") }><Plus size={15} />Save current as template</Button>} /><div className="template-intro"><div className="template-intro-icon"><Sparkles size={20} /></div><div><strong>Templates are a shortcut, not a constraint.</strong><p>Every template brings a starter task board, suppliers, schedule and budget categories into a new event.</p></div></div><div className="template-grid">{templateCards.map(card => <Card className="template-card" key={card.name}><span className="template-swatch" style={{ background: card.tint }} /><div className="template-card-content"><span className="eyebrow">SCENESET TEMPLATE</span><h2>{card.name}</h2><p>{card.description}</p><span className="template-count">{card.count}</span><button onClick={() => { update(current => ({ ...current, event: { ...current.event, name: card.name + " / Untitled event" } })); toast.success(`${card.name} template loaded`); onNavigate("overview"); }}>Use template <ArrowRight size={15} /></button></div></Card>)}</div><div className="duplicate-panel"><div><span className="eyebrow">KEEP THE GOOD BITS</span><h2>Duplicate an event</h2><p>Bring the structure across, then update the date, venue and guest list.</p></div><Button variant="outline" onClick={() => { toast.success("Event duplicated as a draft"); onNavigate("overview"); }}><Copy size={15} />Duplicate Afterglow</Button></div></div>;
}

function PricingView() {
  const [paymentOpen, setPaymentOpen] = useState(false);
  return <div className="view-stack"><PageHeading eyebrow="SCENESET / PLANS" title="Make room for bigger plans" description="Start free. Upgrade the moment the event needs more breathing space." actions={<Button variant="outline" onClick={() => toast.info("Plan comparison copied") }><Link2 size={15} />Share plans</Button>} /><div className="pricing-grid"><PlanCard name="Free personal" price="£0" suffix="forever" description="For one organiser finding their rhythm." features={["1 active event", "25 suppliers + files", "Core run sheet + layout", "Shared view-only link"]} /><PlanCard name="Event upgrade" price="£19" suffix="per event" featured description="For an event that needs the full room." features={["Unlimited guests + suppliers", "Day-of pack export", "Comment-only share links", "25 GB event storage"]} action={() => setPaymentOpen(true)} /><PlanCard name="Organiser" price="£29" suffix="per month" description="For organisers running a season." features={["Unlimited active events", "Team roles + activity history", "Saved templates", "Priority support"]} /> </div><div className="pricing-footnote"><Sparkles size={16} /><span><strong>Simple by design.</strong> No ticketing fees, marketplace lock-in or live payment processing in SceneSet.</span></div><div className="test-payment-row"><div><span className="eyebrow">TEST PAYMENT FLOW</span><h3>See the handoff without the charge.</h3><p>The upgrade action opens a mock checkout only. No card is stored or billed.</p></div><Button onClick={() => setPaymentOpen(true)}><Receipt size={15} />Open test checkout</Button></div>{paymentOpen && <div className="modal-backdrop" onClick={() => setPaymentOpen(false)}><div className="checkout-modal" onClick={event => event.stopPropagation()}><button className="modal-close" onClick={() => setPaymentOpen(false)}><X size={18} /></button><div className="checkout-icon"><Sparkles size={20} /></div><span className="eyebrow">TEST CHECKOUT</span><h2>Event upgrade</h2><p>Unlock day-of exports, comment-only links and 25 GB storage for this event.</p><div className="checkout-total"><span>Today</span><strong>£19.00</strong></div><Button className="full-button" onClick={() => { setPaymentOpen(false); toast.success("Test payment complete — no charge made"); }}>Confirm test payment <ArrowRight size={15} /></Button><small>No real payment is processed.</small></div></div>}</div>;
}

function PlanCard({ name, price, suffix, description, features, featured = false, action }: { name: string; price: string; suffix: string; description: string; features: string[]; featured?: boolean; action?: () => void }) {
  return <Card className={`plan-card ${featured ? "featured" : ""}`}>{featured && <span className="recommended">RECOMMENDED</span>}<span className="eyebrow">{name}</span><strong className="plan-price">{price}<small>{suffix}</small></strong><p>{description}</p><div className="plan-features">{features.map(feature => <span key={feature}><CheckCircle2 size={14} />{feature}</span>)}</div><Button variant={featured ? "default" : "outline"} className="full-button" onClick={action}>{featured ? "Upgrade this event" : "Keep exploring"}<ArrowRight size={15} /></Button></Card>;
}

function SettingsView({ data, update }: { data: SceneSetData; update: (next: SceneSetData | ((current: SceneSetData) => SceneSetData)) => void }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  return <div className="view-stack"><PageHeading eyebrow="WORKSPACE / SETTINGS" title="Keep the workspace yours" description="Small controls for the people, access and defaults behind the plan." actions={<Button onClick={() => toast.success("Settings saved") }><Check size={15} />Save changes</Button>} /><div className="settings-grid"><Card className="settings-card"><SectionLabel>EVENT DETAILS</SectionLabel><div className="settings-form"><label>Event name<input value={data.event.name} onChange={event => update(current => ({ ...current, event: { ...current.event, name: event.target.value } }))} /></label><label>Venue<input value={data.event.venue} onChange={event => update(current => ({ ...current, event: { ...current.event, venue: event.target.value } }))} /></label><label>Event goal<textarea value={data.event.goal} onChange={event => update(current => ({ ...current, event: { ...current.event, goal: event.target.value } }))} /></label></div></Card><Card className="settings-card"><SectionLabel>WORKSPACE ACCESS</SectionLabel><div className="access-row"><Avatar initials="MC" color="#f25c54" /><span><strong>{user?.name || "Maya Chen"}</strong><small>Owner · full access</small></span><StatusPill label="Owner" tone="coral" /></div><div className="access-row"><Avatar initials="AB" color="#95cdbb" /><span><strong>Ari Bell</strong><small>Organiser · can edit</small></span><StatusPill label="Organiser" tone="good" /></div><div className="access-row"><Avatar initials="JL" color="#9b8bd8" /><span><strong>Jordan Lee</strong><small>Collaborator · can comment</small></span><StatusPill label="Collaborator" /></div><button className="add-row" onClick={() => toast.info("Invite link copied") }><UserPlus size={14} />Invite teammate</button></Card><Card className="settings-card"><SectionLabel>PREFERENCES</SectionLabel><ToggleRow label="Dark mode" description="A quieter palette for late-night production work." checked={theme === "dark"} onToggle={toggleTheme} icon={<Moon size={16} />} /><ToggleRow label="Live activity" description="Show lightweight updates in the activity feed." checked={true} onToggle={() => toast.info("Live activity remains on for this demo") } icon={<Activity size={16} />} /><ToggleRow label="Compact density" description="Fit more rows into task and guest tables." checked={false} onToggle={() => toast.info("Compact density is coming next") } icon={<SlidersHorizontal size={16} />} /></Card><Card className="settings-card"><SectionLabel>FILES & STORAGE</SectionLabel><div className="storage-meter"><div><strong>1.8 GB</strong><span>of 25 GB used</span></div><ProgressBar value={7} tone="mint" /></div><button className="add-row" onClick={() => toast.info("Storage manager opened") }><CloudUpload size={14} />Manage files</button></Card></div><div className="settings-footer"><button className="text-button danger" onClick={() => logout().catch(() => toast.error("Could not sign out"))}><ExternalLink size={14} />Sign out</button><span>SceneSet demo workspace · v0.1</span></div></div>;
}

function ToggleRow({ label, description, checked, onToggle, icon }: { label: string; description: string; checked: boolean; onToggle?: () => void; icon: React.ReactNode }) {
  return <button className="toggle-row" onClick={onToggle}><span className="toggle-icon">{icon}</span><span><strong>{label}</strong><small>{description}</small></span><span className={`toggle ${checked ? "on" : ""}`}><span /></span></button>;
}

export default function Workspace() {
  const [location, setLocation] = useLocation();
  const { data, update, resetDemo } = useSceneSetData();
  const [query, setQuery] = useState("");
  const routeView = location.split("/")[2] || "overview";
  const validViews = navItems.concat(secondaryItems).map(item => item.key);
  const activeView = validViews.includes(routeView as ViewKey) ? routeView as ViewKey : "overview";
  const onNavigate = (view: ViewKey) => setLocation(`/app/${view}`);
  const onShare = () => { const shareUrl = `${window.location.origin}/shared`; navigator.clipboard?.writeText(shareUrl).catch(() => undefined); toast.success("Shared day-of link copied"); };
  const onPrint = () => { toast.info("Opening print-friendly day-of pack"); window.print(); };
  const filteredData = useMemo(() => {
    if (!query.trim()) return data;
    const needle = query.toLowerCase();
    return {
      ...data,
      tasks: data.tasks.filter(item => `${item.title} ${item.project} ${item.owner}`.toLowerCase().includes(needle)),
      suppliers: data.suppliers.filter(item => `${item.name} ${item.category} ${item.contact}`.toLowerCase().includes(needle)),
      guests: data.guests.filter(item => `${item.name} ${item.company} ${item.role}`.toLowerCase().includes(needle)),
    };
  }, [data, query]);
  const renderView = () => {
    switch (activeView) {
      case "events": return <EventsView data={data} onNavigate={onNavigate} update={update} />;
      case "tasks": return <TasksView data={filteredData} update={update} />;
      case "budget": return <BudgetView data={filteredData} update={update} />;
      case "suppliers": return <SuppliersView data={filteredData} update={update} />;
      case "guests": return <GuestsView data={filteredData} />;
      case "schedule": return <ScheduleView data={filteredData} update={update} />;
      case "layout": return <LayoutView data={filteredData} update={update} />;
      case "notes": return <NotesView data={filteredData} update={update} />;
      case "templates": return <TemplatesView onNavigate={onNavigate} update={update} />;
      case "pricing": return <PricingView />;
      case "settings": return <SettingsView data={filteredData} update={update} />;
      default: return <OverviewView data={filteredData} onNavigate={onNavigate} update={update} />;
    }
  };
  return <div className="app-shell"><Sidebar activeView={activeView} onNavigate={onNavigate} onReset={() => { resetDemo(); toast.success("Demo data reset"); }} /><main className="main-shell"><WorkspaceHeader data={data} activeView={activeView} onNavigate={onNavigate} query={query} setQuery={setQuery} onShare={onShare} onPrint={onPrint} /><div className="workspace-content">{query && <div className="search-banner"><Search size={15} /><span>Showing workspace results for <strong>“{query}”</strong></span><button onClick={() => setQuery("")}><X size={14} /></button></div>}{renderView()}</div></main></div>;
}
