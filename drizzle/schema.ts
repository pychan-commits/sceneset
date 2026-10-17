import { boolean, decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const workspaces = mysqlTable("workspaces", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const workspaceMembers = mysqlTable("workspaceMembers", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["owner", "organiser", "collaborator"]).default("collaborator").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  eventDate: timestamp("eventDate").notNull(),
  venue: varchar("venue", { length: 180 }),
  city: varchar("city", { length: 120 }),
  goal: text("goal"),
  attendeeTarget: int("attendeeTarget").default(0).notNull(),
  readinessScore: int("readinessScore").default(0).notNull(),
  shareMode: mysqlEnum("shareMode", ["private", "view-only", "comment-only"]).default("private").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  project: varchar("project", { length: 100 }),
  ownerId: int("ownerId"),
  status: mysqlEnum("status", ["backlog", "in-progress", "review", "done"]).default("backlog").notNull(),
  priority: mysqlEnum("priority", ["High", "Medium", "Low"]).default("Medium").notNull(),
  dueAt: timestamp("dueAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const suppliers = mysqlTable("suppliers", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  category: varchar("category", { length: 100 }),
  contactName: varchar("contactName", { length: 160 }),
  email: varchar("email", { length: 320 }),
  status: mysqlEnum("status", ["Inquiry", "Quote received", "Confirmed", "Paid"]).default("Inquiry").notNull(),
  quoteAmount: decimal("quoteAmount", { precision: 12, scale: 2 }).default("0").notNull(),
  paidAmount: decimal("paidAmount", { precision: 12, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const quotes = mysqlTable("quotes", {
  id: int("id").autoincrement().primaryKey(),
  supplierId: int("supplierId").notNull(),
  label: varchar("label", { length: 180 }),
  amount: decimal("amount", { precision: 12, scale: 2 }).default("0").notNull(),
  filePath: varchar("filePath", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const budgetItems = mysqlTable("budgetItems", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  category: varchar("category", { length: 100 }),
  plannedAmount: decimal("plannedAmount", { precision: 12, scale: 2 }).default("0").notNull(),
  actualAmount: decimal("actualAmount", { precision: 12, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const guests = mysqlTable("guests", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  company: varchar("company", { length: 180 }),
  guestRole: varchar("guestRole", { length: 140 }),
  tag: mysqlEnum("tag", ["VIP", "Media", "Vendor", "Staff"]).default("Staff").notNull(),
  rsvp: mysqlEnum("rsvp", ["Confirmed", "Pending", "Declined"]).default("Pending").notNull(),
  plusOne: boolean("plusOne").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const venues = mysqlTable("venues", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  address: text("address"),
  floorPlanPath: varchar("floorPlanPath", { length: 500 }),
  layoutLocked: boolean("layoutLocked").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const layoutItems = mysqlTable("layoutItems", {
  id: int("id").autoincrement().primaryKey(),
  venueId: int("venueId").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  label: varchar("label", { length: 100 }).notNull(),
  x: decimal("x", { precision: 7, scale: 2 }).default("0").notNull(),
  y: decimal("y", { precision: 7, scale: 2 }).default("0").notNull(),
  color: varchar("color", { length: 20 }),
});

export const scheduleItems = mysqlTable("scheduleItems", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  startTime: varchar("startTime", { length: 20 }).notNull(),
  endTime: varchar("endTime", { length: 20 }),
  title: varchar("title", { length: 240 }).notNull(),
  owner: varchar("owner", { length: 160 }),
  location: varchar("location", { length: 160 }),
  kind: mysqlEnum("kind", ["Milestone", "Show flow", "Crew", "Guest"]).default("Show flow").notNull(),
  complete: boolean("complete").default(false).notNull(),
});

export const notes = mysqlTable("notes", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  authorId: int("authorId"),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body").notNull(),
  pinned: boolean("pinned").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const activityLog = mysqlTable("activityLog", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  actorId: int("actorId"),
  action: varchar("action", { length: 100 }).notNull(),
  subject: varchar("subject", { length: 240 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const templates = mysqlTable("templates", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId"),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description"),
  templateType: varchar("templateType", { length: 80 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Event = typeof events.$inferSelect;
export type TaskRecord = typeof tasks.$inferSelect;
export type SupplierRecord = typeof suppliers.$inferSelect;
