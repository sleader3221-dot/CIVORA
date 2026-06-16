import { NextResponse } from "next/server";
import { getSystemHealth } from "@/lib/demo/store";

export async function GET() {
  return NextResponse.json({ ok: true, health: getSystemHealth() });
}
