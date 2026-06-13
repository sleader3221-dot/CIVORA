import type { Alert, RiskLevel } from "../types";

export const riskRank: Record<RiskLevel, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-MY", { maximumFractionDigits }).format(value);
}

export function activeAlerts(alerts: Alert[]) {
  return alerts.filter((alert) => alert.status === "active");
}

export function calculateSafetyScore(alerts: Alert[]) {
  const penalty = activeAlerts(alerts).reduce(
    (total, alert) => total + riskRank[alert.level] * 1.9,
    0
  );
  return Math.max(0, Math.round(98 - penalty));
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
