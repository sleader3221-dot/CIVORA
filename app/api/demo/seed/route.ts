import { NextResponse } from "next/server";
import { resetDemoDataset } from "@/lib/demo/store";

export async function POST() {
  const dataset = resetDemoDataset();
  return NextResponse.json({
    ok: true,
    events: dataset.events.length,
    cases: dataset.cases.length,
    ledgerRecords: dataset.ledger.length,
    lastGeneratedAt: dataset.lastGeneratedAt
  });
}
