import type {
  DemoDataset,
  EntityRecord,
  EntityRelationship,
  EvidenceLedgerRecord,
  FraudEvent,
  InvestigationCase,
  ReportRecord,
  Severity,
  TimelineEntry
} from "@/lib/types";
import { organizationId } from "@/lib/types";
import { scoreEvent } from "@/lib/risk/engine";
import type { EventPayload } from "@/lib/validators/event";
import { ledgerCurrentHash, payloadHash } from "@/lib/ledger/hash";
import { generateCaseReport } from "@/lib/reports/generate-report";

const analysts = ["Aisha Tan", "Marcus Lee", "Priya Raman", "Daniel Koh", "Nadia Rahman"];
const countries = ["MY", "SG", "ID", "TH", "VN", "PH", "US"];
const eventCycle: EventPayload["eventType"][] = [
  "login_success",
  "payment_attempt",
  "login_failed",
  "refund_requested",
  "device_changed",
  "ip_velocity",
  "api_abuse",
  "password_reset",
  "new_device_payment",
  "high_value_transfer",
  "impossible_travel",
  "suspicious_refund_cluster"
];

export function buildDemoDataset({
  eventCount = 180,
  generatedAt = new Date("2026-06-16T03:00:00.000Z")
}: {
  eventCount?: number;
  generatedAt?: Date;
} = {}): DemoDataset {
  const random = mulberry32(42);
  const { entities, relationships } = buildEntities(generatedAt);
  const accounts = entities.filter((entity) => entity.type === "account");
  const events: FraudEvent[] = [];
  const casesByEntity = new Map<string, InvestigationCase>();
  const ledger: EvidenceLedgerRecord[] = [];

  for (let index = 0; index < eventCount; index += 1) {
    const criticalIndex = index % 200 === 0 && Math.floor(index / 200) < 5 ? Math.floor(index / 200) : -1;
    const account = criticalIndex >= 0 ? accounts[criticalIndex] : accounts[Math.floor(random() * accounts.length)];
    const cluster = account.attributes.cluster as number;
    const eventType = criticalIndex >= 0 ? criticalType(criticalIndex) : eventCycle[index % eventCycle.length];
    const amount = amountFor(eventType, random, criticalIndex >= 0);
    const createdAt = new Date(generatedAt.getTime() - (eventCount - index) * 55_000).toISOString();
    const payload: EventPayload = {
      organizationId,
      entityId: account.id,
      eventType,
      amount,
      currency: "USD",
      ipAddress: `203.0.113.${20 + (cluster % 40)}`,
      deviceId: `device_${cluster.toString().padStart(2, "0")}`,
      country: criticalIndex >= 0 ? "RU" : countries[Math.floor(random() * countries.length)],
      userAgent: "ProofPilot Demo Agent/1.0",
      metadata: {
        baselineAmount: criticalIndex >= 0 ? 550 : 420 + cluster * 35,
        failedLoginCount15m: criticalIndex >= 0 ? 8 : eventType === "login_failed" ? 2 + (index % 4) : 0,
        ipEntityCount: criticalIndex >= 0 ? 6 : 1 + (index % 3),
        chargebackHistory: criticalIndex >= 0 || cluster === 8,
        priorPasswordReset: criticalIndex >= 0 || eventType === "high_value_transfer",
        countryMismatch: criticalIndex >= 0 || eventType === "impossible_travel",
        proxyLike: criticalIndex >= 0 || index % 37 === 0,
        refundCluster: criticalIndex >= 0 || eventType === "suspicious_refund_cluster",
        newDevice: criticalIndex >= 0 || eventType === "new_device_payment" || eventType === "device_changed"
      },
      createdAt
    };
    const risk = scoreEvent(payload);
    const event: FraudEvent = {
      id: `evt_${(index + 1).toString().padStart(5, "0")}`,
      ...payload,
      source: "demo-adapter",
      metadata: payload.metadata ?? {},
      createdAt,
      riskScore: risk.score,
      severity: risk.severity,
      reasonCodes: risk.reasonCodes
    };
    events.push(event);

    updateEntityRisk(entities, account.id, risk.score, risk.severity, createdAt);
    if (event.deviceId) updateEntityRisk(entities, event.deviceId, Math.max(30, risk.score - 10), risk.severity, createdAt);

    if (risk.score >= 75) {
      const existing = casesByEntity.get(account.id);
      const caseRecord = existing ?? createCase(account, event, risk, generatedAt, casesByEntity.size);
      caseRecord.riskScore = Math.max(caseRecord.riskScore, risk.score);
      caseRecord.severity = severityMax(caseRecord.severity, risk.severity);
      caseRecord.eventIds = Array.from(new Set([...caseRecord.eventIds, event.id]));
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
      casesByEntity.set(account.id, caseRecord);
      appendLedger(ledger, caseRecord.id, "EVENT_LINKED", "risk-engine", {
        eventId: event.id,
        entityId: event.entityId,
        riskScore: risk.score,
        severity: risk.severity,
        reasonCodes: risk.reasonCodes
      }, createdAt);
    }
  }

  const cases = [...casesByEntity.values()]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, Math.max(5, casesByEntity.size));

  for (const caseRecord of cases) {
    appendLedger(ledger, caseRecord.id, "CASE_REVIEW_READY", "case-service", {
      caseId: caseRecord.id,
      eventCount: caseRecord.eventIds.length,
      recommendedAction: caseRecord.recommendedAction
    }, caseRecord.updatedAt);
    relationships.push({
      id: `rel_${caseRecord.primaryEntityId}_${caseRecord.id}`,
      source: caseRecord.primaryEntityId,
      target: caseRecord.id,
      label: "opened case"
    });
  }

  const reports: ReportRecord[] = cases.slice(0, 1).map((caseRecord) =>
    generateCaseReport({
      caseRecord,
      events: events.filter((event) => caseRecord.eventIds.includes(event.id)),
      entities,
      ledger: ledger.filter((record) => record.caseId === caseRecord.id),
      generatedBy: "ProofPilot Demo"
    })
  );

  return {
    events: events.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    entities: entities.sort((a, b) => b.riskScore - a.riskScore),
    relationships,
    cases,
    ledger: ledger.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    reports,
    lastGeneratedAt: generatedAt.toISOString()
  };
}

function buildEntities(generatedAt: Date): { entities: EntityRecord[]; relationships: EntityRelationship[] } {
  const entities: EntityRecord[] = [];
  const relationships: EntityRelationship[] = [];
  for (let cluster = 0; cluster < 10; cluster += 1) {
    const suffix = cluster.toString().padStart(2, "0");
    const account: EntityRecord = entity(`acct_${suffix}`, "account", `Northstar account ${suffix}`, cluster < 10 ? 55 + cluster * 3 : 20, cluster, generatedAt);
    const device = entity(`device_${suffix}`, "device", `Mobile device ${suffix}`, 25 + cluster * 4, cluster, generatedAt);
    const ip = entity(`ip_${suffix}`, "ip", `203.0.113.${20 + cluster}`, 20 + cluster * 5, cluster, generatedAt);
    const card = entity(`card_${suffix}`, "card", `Card ending ${4100 + cluster}`, 22 + cluster * 4, cluster, generatedAt);
    const tx = entity(`txn_${suffix}`, "transaction", `Transfer batch ${suffix}`, 30 + cluster * 5, cluster, generatedAt);
    entities.push(account, device, ip, card, tx);
    relationships.push(
      { id: `rel_account_device_${suffix}`, source: account.id, target: device.id, label: "uses device" },
      { id: `rel_device_ip_${suffix}`, source: device.id, target: ip.id, label: "seen from IP" },
      { id: `rel_account_card_${suffix}`, source: account.id, target: card.id, label: "owns card" },
      { id: `rel_card_tx_${suffix}`, source: card.id, target: tx.id, label: "funds transaction" }
    );
  }
  return { entities, relationships };
}

function entity(
  id: string,
  type: EntityRecord["type"],
  label: string,
  score: number,
  cluster: number,
  generatedAt: Date
): EntityRecord {
  return {
    id,
    organizationId,
    type,
    label,
    riskLevel: severityFromScoreLocal(score),
    riskScore: score,
    lastSeenAt: generatedAt.toISOString(),
    attributes: {
      cluster,
      region: cluster % 2 ? "APAC" : "Global",
      synthetic: true
    }
  };
}

function createCase(
  account: EntityRecord,
  event: FraudEvent,
  risk: ReturnType<typeof scoreEvent>,
  generatedAt: Date,
  index: number
): InvestigationCase {
  const createdAt = event.createdAt;
  const timeline: TimelineEntry[] = [
    {
      id: `tl_case_${event.id}`,
      type: "risk",
      title: "Critical risk threshold crossed",
      detail: risk.recommendedAction,
      createdAt
    }
  ];
  return {
    id: `case_${account.id}`,
    organizationId,
    title: `Critical fraud investigation for ${account.label}`,
    summary: `ProofPilot linked high-risk activity, device changes, network signals, and payment behavior for ${account.label}.`,
    severity: risk.severity,
    status: index % 3 === 0 ? "investigating" : "open",
    riskScore: risk.score,
    primaryEntityId: account.id,
    assignedAnalyst: analysts[index % analysts.length],
    eventIds: [event.id],
    evidenceCount: 1,
    reasonCodes: risk.reasonCodes,
    reasons: risk.reasons,
    recommendedAction: risk.recommendedAction,
    timeline,
    notes: [
      {
        id: `note_${account.id}_1`,
        caseId: `case_${account.id}`,
        actor: analysts[index % analysts.length],
        body: "Initial triage retained linked evidence and recommended step-up verification before funds release.",
        createdAt: new Date(generatedAt.getTime() - 1_800_000).toISOString()
      }
    ],
    createdAt,
    updatedAt: createdAt
  };
}

export function appendLedger(
  ledger: EvidenceLedgerRecord[],
  caseId: string,
  actionType: string,
  actor: string,
  payload: unknown,
  createdAt = new Date().toISOString()
) {
  const previous = [...ledger]
    .filter((record) => record.caseId === caseId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .at(-1);
  const recordPayloadHash = payloadHash(payload);
  const previousHash = previous?.currentHash ?? "GENESIS";
  const record: EvidenceLedgerRecord = {
    id: `led_${caseId}_${ledger.length + 1}`,
    organizationId,
    caseId,
    actionType,
    actor,
    payloadHash: recordPayloadHash,
    previousHash,
    currentHash: ledgerCurrentHash({ previousHash, payloadHash: recordPayloadHash, createdAt, actionType }),
    payloadJson: JSON.stringify(payload),
    createdAt
  };
  ledger.push(record);
  return record;
}

function updateEntityRisk(entities: EntityRecord[], entityId: string, score: number, severity: Severity, lastSeenAt: string) {
  const entity = entities.find((item) => item.id === entityId);
  if (!entity) return;
  entity.riskScore = Math.max(entity.riskScore, score);
  entity.riskLevel = severityMax(entity.riskLevel, severity);
  entity.lastSeenAt = lastSeenAt;
}

function mergeReasons(existing: InvestigationCase["reasons"], incoming: InvestigationCase["reasons"]) {
  const byCode = new Map(existing.map((reason) => [reason.code, reason]));
  for (const reason of incoming) byCode.set(reason.code, reason);
  return [...byCode.values()];
}

function severityMax(a: Severity, b: Severity): Severity {
  const rank: Record<Severity, number> = { low: 1, medium: 2, high: 3, critical: 4 };
  return rank[b] > rank[a] ? b : a;
}

function severityFromScoreLocal(score: number): Severity {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

function criticalType(index: number): EventPayload["eventType"] {
  const criticalTypes = ["high_value_transfer", "new_device_payment", "impossible_travel", "api_abuse", "suspicious_refund_cluster"] as const;
  return criticalTypes[index] ?? "high_value_transfer";
}

function amountFor(eventType: EventPayload["eventType"], random: () => number, critical: boolean) {
  if (critical) return 9200 + Math.floor(random() * 7000);
  if (["high_value_transfer", "new_device_payment", "payment_attempt"].includes(eventType)) return 120 + Math.floor(random() * 4200);
  if (eventType === "refund_requested") return 20 + Math.floor(random() * 1200);
  return undefined;
}

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
