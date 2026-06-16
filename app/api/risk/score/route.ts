import { NextResponse } from "next/server";
import { scoreEvent } from "@/lib/risk/engine";
import { eventPayloadSchema } from "@/lib/validators/event";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = eventPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }
  return NextResponse.json({ ok: true, risk: scoreEvent(parsed.data) });
}
