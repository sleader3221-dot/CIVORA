import {
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  index
} from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  createdAt: timestamp("created_at").notNull()
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 160 }).notNull()
});

export const memberships = pgTable("memberships", {
  id: uuid("id").primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  userId: uuid("user_id").notNull(),
  role: varchar("role", { length: 60 }).notNull()
});

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  keyPrefix: varchar("key_prefix", { length: 24 }).notNull(),
  hashedKey: text("hashed_key").notNull(),
  createdAt: timestamp("created_at").notNull()
});

export const entities = pgTable("entities", {
  id: varchar("id", { length: 80 }).primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  type: varchar("type", { length: 40 }).notNull(),
  label: varchar("label", { length: 220 }).notNull(),
  riskScore: integer("risk_score").notNull(),
  attributes: jsonb("attributes").notNull(),
  lastSeenAt: timestamp("last_seen_at").notNull()
});

export const cases = pgTable("cases", {
  id: varchar("id", { length: 80 }).primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  status: varchar("status", { length: 40 }).notNull(),
  severity: varchar("severity", { length: 40 }).notNull(),
  riskScore: integer("risk_score").notNull(),
  primaryEntityId: varchar("primary_entity_id", { length: 80 }).notNull(),
  assignedAnalyst: varchar("assigned_analyst", { length: 160 }).notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull()
}, (table) => [
  index("cases_org_status_idx").on(table.organizationId, table.status),
  index("cases_org_severity_idx").on(table.organizationId, table.severity)
]);

export const caseEvents = pgTable("case_events", {
  id: uuid("id").primaryKey(),
  caseId: varchar("case_id", { length: 80 }).notNull(),
  eventId: varchar("event_id", { length: 80 }).notNull(),
  createdAt: timestamp("created_at").notNull()
});

export const riskScores = pgTable("risk_scores", {
  id: uuid("id").primaryKey(),
  entityId: varchar("entity_id", { length: 80 }).notNull(),
  score: integer("score").notNull(),
  reasons: jsonb("reasons").notNull(),
  createdAt: timestamp("created_at").notNull()
}, (table) => [
  index("risk_scores_entity_score_idx").on(table.entityId, table.score)
]);

export const evidenceLedger = pgTable("evidence_ledger", {
  id: varchar("id", { length: 120 }).primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  caseId: varchar("case_id", { length: 80 }).notNull(),
  actionType: varchar("action_type", { length: 80 }).notNull(),
  actor: varchar("actor", { length: 160 }).notNull(),
  payloadHash: varchar("payload_hash", { length: 64 }).notNull(),
  previousHash: varchar("previous_hash", { length: 64 }).notNull(),
  currentHash: varchar("current_hash", { length: 64 }).notNull(),
  payloadJson: jsonb("payload_json").notNull(),
  createdAt: timestamp("created_at").notNull()
}, (table) => [
  index("evidence_ledger_case_created_idx").on(table.caseId, table.createdAt)
]);

export const caseNotes = pgTable("case_notes", {
  id: uuid("id").primaryKey(),
  caseId: varchar("case_id", { length: 80 }).notNull(),
  actor: varchar("actor", { length: 160 }).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull()
});

export const reports = pgTable("reports", {
  id: varchar("id", { length: 120 }).primaryKey(),
  caseId: varchar("case_id", { length: 80 }).notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  html: text("html").notNull(),
  generatedAt: timestamp("generated_at").notNull()
}, (table) => [
  index("reports_case_idx").on(table.caseId)
]);

export const billingPlans = pgTable("billing_plans", {
  id: uuid("id").primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  plan: varchar("plan", { length: 80 }).notNull(),
  monthlyPrice: numeric("monthly_price").notNull()
});
