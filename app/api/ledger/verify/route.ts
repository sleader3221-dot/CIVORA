import { NextResponse } from "next/server";
import { verifyGlobalLedger } from "@/lib/demo/store";

export async function POST() {
  return NextResponse.json({ ok: true, verification: verifyGlobalLedger() });
}
