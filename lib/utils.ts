import { clsx, type ClassValue } from "clsx";
import type { Severity } from "@/lib/types";

export function cn(...values: ClassValue[]) {
  return clsx(values);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function severityRank(severity: Severity) {
  return { low: 1, medium: 2, high: 3, critical: 4 }[severity];
}
