import { NextResponse } from "next/server";
import { createReport } from "@/lib/demo/store";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const report = createReport(id);
  if (!report) return NextResponse.json({ ok: false, error: "Case not found" }, { status: 404 });
  return NextResponse.json({ ok: true, report }, { status: 201 });
}
