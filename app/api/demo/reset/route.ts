import { NextResponse } from "next/server";
import { resetDemoDataset } from "@/lib/demo/store";

export async function POST() {
  const dataset = resetDemoDataset();
  return NextResponse.json({
    ok: true,
    message: "Demo data reset to the safe Northstar Pay seed dataset.",
    events: dataset.events.length,
    cases: dataset.cases.length,
    reports: dataset.reports.length
  });
}
