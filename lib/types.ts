export const organizationId = "org_northstar";
export const organizationName = "Northstar Pay";

export const eventTypes = [
  "login_failed",
  "login_success",
  "payment_attempt",
  "refund_requested",
  "chargeback_created",
  "device_changed",
  "ip_velocity",
  "api_abuse",
  "account_created",
  "password_reset",
  "impossible_travel",
  "high_value_transfer",
  "new_device_payment",
  "suspicious_refund_cluster"
] as const;

export type EventType = (typeof eventTypes)[number];
export type Severity = "low" | "medium" | "high" | "critical";
export type CaseStatus = "open" | "investigating" | "resolved";
export type EntityType = "account" | "device" | "ip" | "card" | "transaction";
export type DatabaseMode = "demo" | "live";

export interface FraudEvent {
  id: string;
  organizationId: string;
  entityId: string;
  eventType: EventType;
  amount?: number;
  currency?: string;
  ipAddress?: string;
  deviceId?: string;
  country?: string;
  userAgent?: string;
  source: "demo-adapter" | "dynamodb" | "api";
  metadata: Record<string, unknown>;
  createdAt: string;
  riskScore: number;
  severity: Severity;
  reasonCodes: string[];
}

export interface RiskReason {
  code: string;
  points: number;
  explanation: string;
}

export interface RiskScore {
  score: number;
  severity: Severity;
  reasonCodes: string[];
  reasons: RiskReason[];
  recommendedAction: string;
}

export interface EntityRecord {
  id: string;
  organizationId: string;
  type: EntityType;
  label: string;
  riskLevel: Severity;
  riskScore: number;
  lastSeenAt: string;
  attributes: Record<string, string | number | boolean>;
}

export interface EntityRelationship {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface TimelineEntry {
  id: string;
  type: "event" | "risk" | "ledger" | "note" | "report";
  title: string;
  detail: string;
  createdAt: string;
}

export interface CaseNote {
  id: string;
  caseId: string;
  actor: string;
  body: string;
  createdAt: string;
}

export interface EvidenceLedgerRecord {
  id: string;
  organizationId: string;
  caseId: string;
  actionType: string;
  actor: string;
  payloadHash: string;
  previousHash: string;
  currentHash: string;
  payloadJson: string;
  createdAt: string;
}

export interface InvestigationCase {
  id: string;
  organizationId: string;
  title: string;
  summary: string;
  severity: Severity;
  status: CaseStatus;
  riskScore: number;
  primaryEntityId: string;
  assignedAnalyst: string;
  eventIds: string[];
  evidenceCount: number;
  reasonCodes: string[];
  reasons: RiskReason[];
  recommendedAction: string;
  timeline: TimelineEntry[];
  notes: CaseNote[];
  createdAt: string;
  updatedAt: string;
}

export interface ReportRecord {
  id: string;
  organizationId: string;
  caseId: string;
  title: string;
  html: string;
  generatedAt: string;
  generatedBy: string;
}

export interface DemoDataset {
  events: FraudEvent[];
  entities: EntityRecord[];
  relationships: EntityRelationship[];
  cases: InvestigationCase[];
  ledger: EvidenceLedgerRecord[];
  reports: ReportRecord[];
  lastGeneratedAt?: string;
}

export interface SystemHealth {
  appStatus: "ok";
  buildMode: string;
  databaseMode: DatabaseMode;
  dynamoTableName: string | null;
  dsqlConfigured: boolean;
  dynamoConfigured: boolean;
  lastEventGenerated: string | null;
  lastLedgerVerification: string | null;
  apiRoutes: Array<{ route: string; status: "ok" }>;
  checklist: Array<{ label: string; ready: boolean }>;
}
