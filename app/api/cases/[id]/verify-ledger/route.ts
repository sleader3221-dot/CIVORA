import { NextResponse } from "next/server";
import { verifyCaseLedger } from "@/lib/demo/store";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return NextResponse.json({ ok: true, verification: verifyCaseLedger(id) });
}
