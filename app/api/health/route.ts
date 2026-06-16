import { NextResponse } from "next/server";
import { getEnvironment } from "@/lib/config/env";

export async function GET() {
  const env = getEnvironment();
  return NextResponse.json({
    status: "ok",
    app: "ProofPilot AI",
    databaseMode: env.databaseMode,
    dsqlConfigured: env.dsqlConfigured,
    dynamoConfigured: env.dynamoConfigured,
    timestamp: new Date().toISOString()
  });
}
