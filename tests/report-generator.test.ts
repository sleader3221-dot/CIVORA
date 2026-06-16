import { describe, expect, it } from "vitest";
import { buildDemoDataset } from "@/lib/demo/generate-events";
import { generateCaseReport } from "@/lib/reports/generate-report";

describe("report generator", () => {
  it("renders report sections from case evidence and escapes unsafe HTML", () => {
    const dataset = buildDemoDataset({ eventCount: 240, generatedAt: new Date("2026-06-16T00:00:00.000Z") });
    const caseRecord = { ...dataset.cases[0], title: "<script>alert(1)</script>" };
    const report = generateCaseReport({
      caseRecord,
      events: dataset.events.filter((event) => caseRecord.eventIds.includes(event.id)),
      entities: dataset.entities,
      ledger: dataset.ledger.filter((record) => record.caseId === caseRecord.id)
    });

    expect(report.html).toContain("Case summary");
    expect(report.html).toContain("Evidence hashes");
    expect(report.html).not.toContain("<script>");
    expect(report.html).toContain("&lt;script&gt;");
  });
});
