import { describe, expect, it } from "vitest";
import { buildDemoDataset } from "@/lib/demo/generate-events";

describe("suspicious event generator", () => {
  it("creates the required demo scale and linked critical cases", () => {
    const dataset = buildDemoDataset({ eventCount: 1000, generatedAt: new Date("2026-06-16T00:00:00.000Z") });
    expect(dataset.events).toHaveLength(1000);
    expect(dataset.entities).toHaveLength(50);
    expect(dataset.entities.filter((entity) => entity.riskScore >= 60).length).toBeGreaterThanOrEqual(10);
    expect(dataset.cases.filter((caseRecord) => caseRecord.severity === "critical").length).toBeGreaterThanOrEqual(5);
    expect(dataset.ledger.length).toBeGreaterThan(dataset.cases.length);
  });
});
