import { NextResponse } from "next/server";
import { addCaseNote } from "@/lib/demo/store";
import { caseNoteSchema } from "@/lib/validators/case";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const json = await request.json().catch(() => null);
  const parsed = caseNoteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }
  const note = addCaseNote(id, parsed.data);
  if (!note) return NextResponse.json({ ok: false, error: "Case not found" }, { status: 404 });
  return NextResponse.json({ ok: true, note }, { status: 201 });
}
