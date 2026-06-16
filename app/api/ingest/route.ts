import { NextResponse } from "next/server";
import { eventPayloadSchema } from "@/lib/validators/event";
import { DynamoDBEventRepository } from "@/lib/repositories/event-repository";
import { rateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local-demo";
  const limited = rateLimit(`ingest:${ip}`);
  if (!limited.allowed) {
    return NextResponse.json({ ok: false, error: "Rate limit exceeded" }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = eventPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const repository = new DynamoDBEventRepository();
  const result = await repository.ingest(parsed.data);
  return NextResponse.json({ ok: true, event: result.event, remaining: limited.remaining }, { status: 201 });
}
