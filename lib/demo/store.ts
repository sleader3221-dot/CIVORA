import type {
  CaseNote,
  DemoDataset,
  FraudEvent,
  InvestigationCase,
  SystemHealth
} from "@/lib/types";
import { organizationId } from "@/lib/types";
import type { EventPayload } from "@/lib/validators/event";
import type { CaseNotePayload } from "@/lib/validators/case";
import { scoreEvent } from "@/lib/risk/engine";
import { verifyLedgerChain } from "@/lib/ledger/verify";
import { appendLedger, buildDemoDataset } from "./generate-events";
import { seedDataset } from "./seed-data";
import { generateCaseReport } from "@/lib/reports/generate-report";
import { getEnvironment } from "@/lib/config/env";

let dataset: DemoDataset = clone(seedDataset);
let lastLedgerVerification: string | null = null;

export function getDemoDataset() {
  return dataset;
}

export function resetDemoDataset() {
  dataset = clone(seedDataset);
  lastLedgerVerification = null;
  return dataset;
}

export function generateDemoEvents(count = 1000) {
  dataset = buildDemoDataset({ eventCount: count, generatedAt: new Date() });
  return dataset;
}

export function ingestDemoEvent(payload: EventPayload) {
  const risk = scoreEvent(payload);
  const createdAt = payload.createdAt ?? new Date().toISOString();
  const event: FraudEvent = {
    id: `evt_api_${Date.now()}`,
    organizationId: payload.organizationId,
    entityId: payload.entityId,
    eventType: payload.eventType,
    amount: payload.amount,
    currency: payload.currency,
    ipAddress: payload.ipAddress,
    deviceId: payload.deviceId,
    country: payload.country,
    userAgent: payload.userAgent,
    metadata: payload.metadata ?? {},
    createdAt,
    source: "api",
    riskScore: risk.score,
    severity: risk.severity,
    reasonCodes: risk.reasonCodes
  };
  dataset.events = [event, ...dataset.events].slice(0, 2000);

  if (risk.score >= 75) {
    const existing = dataset.cases.find((item) => item.primaryEntityId === event.entityId);
    const caseRecord = existing ?? createApiCase(event, risk);
    caseRecord.riskScore = Math.max(caseRecord.riskScore, risk.score);
    caseRecord.severity = risk.severity === "critical" ? "critical" : caseRecord.severity;
    caseRecord.eventIds = Array.from(new Set([event.id, ...caseRecord.eventIds]));
    caseRecord.evidenceCount = caseRecord.eventIds.length;
    caseRecord.reasonCodes = Array.from(new Set([...caseRecord.reasonCodes, ...risk.reasonCodes]));
    caseRecord.reasons = mergeReasons(caseRecord.reasons, risk.reasons);
    caseRecord.updatedAt = createdAt;
    caseRecord.timeline.unshift({
      id: `tl_${event.id}`,
      type: "event",
      title: `${event.eventType.replaceAll("_", " ")} scored ${risk.score}`,
      detail: risk.recommendedAction,
      createdAt
    });
    if (!existing) dataset.cases = [caseRecord, ...dataset.cases];
    appendLedger(dataset.ledger, caseRecord.id, "API_EVENT_INGESTED", "ingest-api", event, createdAt);
  }

  return { event, risk };
}

export function addCaseNote(caseId: string, payload: CaseNotePayload) {
  const caseRecord = getCase(caseId);
  if (!caseRecord) return null;
  const note: CaseNote = {
    id: `note_${caseId}_${Date.now()}`,
    caseId,
    actor: payload.actor,
    body: payload.body,
    createdAt: new Date().toISOString()
  };
  caseRecord.notes = [note, ...caseRecord.notes];
  caseRecord.timeline.unshift({
    id: `tl_${note.id}`,
    type: "note",
    title: "Analyst note added",
    detail: note.body,
    createdAt: note.createdAt
  });
  appendLedger(dataset.ledger, caseId, "ANALYST_NOTE_ADDED", note.actor, note, note.createdAt);
  return note;
}

export function getCase(caseId: string) {
  return dataset.cases.find((item) => item.id === caseId) ?? null;
}

export function getCaseEvents(caseId: string) {
  const caseRecord = getCase(caseId);
  if (!caseRecord) return [];
  return dataset.events.filter((event) => caseRecord.eventIds.includes(event.id));
}

export function getCaseLedger(caseId: string) {
  return dataset.ledger
    .filter((record) => record.caseId === caseId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function verifyCaseLedger(caseId: string) {
  const result = verifyLedgerChain(getCaseLedger(caseId));
  lastLedgerVerification = new Date().toISOString();
  return result;
}

export function verifyGlobalLedger() {
  const caseIds = Array.from(new Set(dataset.ledger.map((record) => record.caseId)));
  const failures = caseIds
    .map((caseId) => ({ caseId, result: verifyLedgerChain(getCaseLedger(caseId)) }))
    .filter((item) => !item.result.valid);
  lastLedgerVerification = new Date().toISOString();
  return {
    valid: failures.length === 0,
    checkedChains: caseIds.length,
    checkedRecords: dataset.ledger.length,
    failures
  };
}

export function createReport(caseId: string) {
  const caseRecord = getCase(caseId);
  if (!caseRecord) return null;
  const report = generateCaseReport({
    caseRecord,
    events: getCaseEvents(caseId),
    entities: dataset.entities,
    ledger: getCaseLedger(caseId),
    generatedBy: "Judge Demo Analyst"
  });
  dataset.reports = [report, ...dataset.reports];
  caseRecord.timeline.unshift({
    id: `tl_${report.id}`,
    type: "report",
    title: "Audit-ready report generated",
    detail: report.title,
    createdAt: report.generatedAt
  });
  appendLedger(dataset.ledger, caseId, "REPORT_GENERATED", "report-service", { reportId: report.id }, report.generatedAt);
  return report;
}

export function getSystemHealth(): SystemHealth {
  const env = getEnvironment();
  return {
    appStatus: "ok",
    buildMode: process.env.NODE_ENV ?? "development",
    databaseMode: env.databaseMode,
    dynamoTableName: env.dynamoTableName,
    dsqlConfigured: env.dsqlConfigured,
    dynamoConfigured: env.dynamoConfigured,
    lastEventGenerated: dataset.lastGeneratedAt ?? null,
    lastLedgerVerification,
    apiRoutes: [
      "/api/health",
      "/api/demo/generate-events",
      "/api/ingest",
      "/api/events",
      "/api/risk/score",
      "/api/cases",
      "/api/reports",
      "/api/system-health"
    ].map((route) => ({ route, status: "ok" as const })),
    checklist: [
      { label: "Demo adapter available", ready: true },
      { label: "DynamoDB table configured", ready: env.dynamoConfigured },
      { label: "Aurora DSQL/PostgreSQL URL configured", ready: env.dsqlConfigured },
      { label: "Secrets absent from client bundle", ready: true },
      { label: "Vercel App URL configured", ready: Boolean(process.env.NEXT_PUBLIC_APP_URL) }
    ]
  };
}

function createApiCase(event: FraudEvent, risk: ReturnType<typeof scoreEvent>): InvestigationCase {
  const entity = dataset.entities.find((item) => item.id === event.entityId);
  return {
    id: `case_${event.entityId}`,
    organizationId,
    title: `Critical investigation for ${entity?.label ?? event.entityId}`,
    summary: "Created automatically from the ingest API because the risk score crossed the case threshold.",
    severity: risk.severity,
    status: "open",
    riskScore: risk.score,
    primaryEntityId: event.entityId,
    assignedAnalyst: "Judge Demo Analyst",
    eventIds: [event.id],
    evidenceCount: 1,
    reasonCodes: risk.reasonCodes,
    reasons: risk.reasons,
    recommendedAction: risk.recommendedAction,
    timeline: [],
    notes: [],
    createdAt: event.createdAt,
    updatedAt: event.createdAt
  };
}

function mergeReasons(existing: InvestigationCase["reasons"], incoming: InvestigationCase["reasons"]) {
  const byCode = new Map(existing.map((reason) => [reason.code, reason]));
  for (const reason of incoming) byCode.set(reason.code, reason);
  return [...byCode.values()];
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
