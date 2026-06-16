import { NextResponse } from "next/server";
import type { Severity } from "@/lib/types";
import { DynamoDBEventRepository } from "@/lib/repositories/event-repository";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const severity = url.searchParams.get("severity") as Severity | null;
  const entityId = url.searchParams.get("entityId") ?? undefined;
  const eventType = url.searchParams.get("eventType") ?? undefined;
  const limit = Number(url.searchParams.get("limit") ?? 200);
  const repository = new DynamoDBEventRepository();
  const events = await repository.list({
    severity: severity ?? undefined,
    entityId,
    eventType,
    limit: Number.isFinite(limit) ? limit : 200
  });
  return NextResponse.json({ ok: true, events });
}
