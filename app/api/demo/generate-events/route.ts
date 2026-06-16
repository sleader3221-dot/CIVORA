import { NextResponse } from "next/server";
import { generateDemoEvents } from "@/lib/demo/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const count = typeof body.count === "number" ? Math.min(Math.max(body.count, 1), 5000) : 1000;
  const dataset = generateDemoEvents(count);
  return NextResponse.json({
    ok: true,
    organization: "Northstar Pay",
    events: dataset.events.length,
    entities: dataset.entities.length,
    highRiskEntities: dataset.entities.filter((entity) => entity.riskScore >= 60).length,
    criticalCases: dataset.cases.filter((caseRecord) => caseRecord.severity === "critical").length,
    ledgerRecords: dataset.ledger.length,
    lastGeneratedAt: dataset.lastGeneratedAt,
    latestCriticalCaseId: dataset.cases[0]?.id ?? null
  });
}
