import { describe, expect, it } from "vitest";
import { activeAlerts, calculateSafetyScore, formatNumber, riskRank } from "./utils";
import type { Alert } from "../types";

const alerts: Alert[] = [
  {
    id: "1",
    title: "Critical",
    detail: "Test",
    zone: "A",
    level: "critical",
    status: "active",
    time: "Now",
    category: "Environment"
  },
  {
    id: "2",
    title: "Resolved",
    detail: "Test",
    zone: "B",
    level: "high",
    status: "resolved",
    time: "Now",
    category: "PPE"
  }
];

describe("site intelligence utilities", () => {
  it("orders risk levels consistently", () => {
    expect(riskRank.critical).toBeGreaterThan(riskRank.high);
    expect(riskRank.high).toBeGreaterThan(riskRank.medium);
    expect(riskRank.medium).toBeGreaterThan(riskRank.low);
  });

  it("returns only active alerts", () => {
    expect(activeAlerts(alerts)).toHaveLength(1);
    expect(activeAlerts(alerts)[0].id).toBe("1");
  });

  it("removes acknowledged risk from the safety score penalty", () => {
    const activeScore = calculateSafetyScore(alerts);
    const acknowledgedScore = calculateSafetyScore([
      { ...alerts[0], status: "acknowledged" },
      alerts[1]
    ]);
    expect(acknowledgedScore).toBeGreaterThan(activeScore);
    expect(acknowledgedScore).toBe(98);
  });

  it("formats Malaysian-facing metrics", () => {
    expect(formatNumber(186420)).toBe("186,420");
  });
});
