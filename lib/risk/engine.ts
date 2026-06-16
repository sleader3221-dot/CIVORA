import type { EventPayload } from "@/lib/validators/event";
import type { RiskReason, RiskScore, Severity } from "@/lib/types";
import { riskRules } from "./rules";

export interface RiskContext {
  baselineAmount?: number;
  failedLoginCount15m?: number;
  ipEntityCount?: number;
  hasChargebackHistory?: boolean;
  priorPasswordReset?: boolean;
  expectedCountry?: string;
}

export function severityFromScore(score: number): Severity {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

export function recommendedAction(score: number, reasonCodes: string[]) {
  if (score >= 80) return "Open critical case, block risky transaction, verify evidence chain, and escalate to fraud operations.";
  if (score >= 60) return "Create investigation case, require step-up verification, and monitor linked entities.";
  if (reasonCodes.includes("FAILED_LOGIN_VELOCITY")) return "Throttle login attempts and require credential reset verification.";
  return "Monitor entity and retain event evidence for trend analysis.";
}

export function scoreEvent(payload: EventPayload, context: RiskContext = {}): RiskScore {
  const metadata = payload.metadata ?? {};
  const baselineAmount = numberFrom(metadata.baselineAmount) ?? context.baselineAmount ?? 500;
  const failedLoginCount15m = numberFrom(metadata.failedLoginCount15m) ?? context.failedLoginCount15m ?? 0;
  const ipEntityCount = numberFrom(metadata.ipEntityCount) ?? context.ipEntityCount ?? 1;
  const hasChargebackHistory = booleanFrom(metadata.chargebackHistory) ?? context.hasChargebackHistory ?? false;
  const priorPasswordReset = booleanFrom(metadata.priorPasswordReset) ?? context.priorPasswordReset ?? false;
  const countryMismatch =
    booleanFrom(metadata.countryMismatch) ??
    (context.expectedCountry ? payload.country !== context.expectedCountry : false);
  const newDevice = booleanFrom(metadata.newDevice) ?? payload.eventType === "device_changed";
  const proxyLike = Boolean(metadata.proxyLike || metadata.torLike);
  const refundCluster = Boolean(metadata.refundCluster || payload.eventType === "suspicious_refund_cluster");
  const highValue = (payload.amount ?? 0) >= baselineAmount * 5;
  const reasons: RiskReason[] = [];

  add(reasons, failedLoginCount15m > 5, "FAILED_LOGIN_VELOCITY");
  add(reasons, newDevice && ["payment_attempt", "new_device_payment", "high_value_transfer"].includes(payload.eventType), "NEW_DEVICE_PAYMENT");
  add(reasons, newDevice && highValue && ["new_device_payment", "high_value_transfer", "payment_attempt"].includes(payload.eventType), "NEW_DEVICE_HIGH_VALUE");
  add(reasons, highValue, "AMOUNT_5X_BASELINE");
  add(reasons, ipEntityCount > 1, "SHARED_IP_MULTIPLE_ACCOUNTS");
  add(reasons, hasChargebackHistory || payload.eventType === "chargeback_created", "CHARGEBACK_HISTORY");
  add(reasons, payload.eventType === "impossible_travel", "IMPOSSIBLE_TRAVEL");
  add(reasons, refundCluster || payload.eventType === "suspicious_refund_cluster", "REFUND_CLUSTER");
  add(reasons, payload.eventType === "api_abuse" || Boolean(metadata.apiAbuseSpike), "API_ABUSE_SPIKE");
  add(reasons, priorPasswordReset && highValue, "PASSWORD_RESET_TO_HIGH_VALUE_PAYMENT");
  add(reasons, countryMismatch, "COUNTRY_MISMATCH");
  add(reasons, proxyLike, "PROXY_OR_TOR_SIGNAL");

  const score = Math.min(100, reasons.reduce((sum, reason) => sum + reason.points, 0));
  const reasonCodes = reasons.map((reason) => reason.code);

  return {
    score,
    severity: severityFromScore(score),
    reasonCodes,
    reasons,
    recommendedAction: recommendedAction(score, reasonCodes)
  };
}

function add(reasons: RiskReason[], condition: boolean, code: string) {
  if (!condition) return;
  const rule = riskRules.find((item) => item.code === code);
  if (rule) reasons.push({ code: rule.code, points: rule.points, explanation: rule.explanation });
}

function numberFrom(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function booleanFrom(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
}
