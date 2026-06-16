import { NextResponse } from "next/server";
import { DsqlCaseRepository } from "@/lib/repositories/case-repository";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? undefined;
  const severity = url.searchParams.get("severity") ?? undefined;
  const repository = new DsqlCaseRepository();
  const cases = await repository.list({ status, severity });
  return NextResponse.json({ ok: true, cases });
}
