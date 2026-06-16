import { NextResponse } from "next/server";
import { DsqlCaseRepository } from "@/lib/repositories/case-repository";
import { getCaseEvents, getCaseLedger } from "@/lib/demo/store";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const repository = new DsqlCaseRepository();
  const caseRecord = await repository.get(id);
  if (!caseRecord) return NextResponse.json({ ok: false, error: "Case not found" }, { status: 404 });
  return NextResponse.json({
    ok: true,
    case: caseRecord,
    events: getCaseEvents(id),
    ledger: getCaseLedger(id)
  });
}
