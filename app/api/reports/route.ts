import { NextResponse } from "next/server";
import { DsqlReportRepository } from "@/lib/repositories/report-repository";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const caseId = url.searchParams.get("caseId") ?? undefined;
  const reports = await new DsqlReportRepository().list(caseId);
  return NextResponse.json({ ok: true, reports });
}
