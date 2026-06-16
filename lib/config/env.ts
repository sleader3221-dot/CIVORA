import type { DatabaseMode } from "@/lib/types";

export function getEnvironment() {
  const dsqlConfigured = Boolean(process.env.DATABASE_URL);
  const dynamoConfigured = Boolean(
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.DYNAMODB_EVENTS_TABLE
  );
  const databaseMode: DatabaseMode = dsqlConfigured && dynamoConfigured ? "live" : "demo";

  return {
    databaseMode,
    dsqlConfigured,
    dynamoConfigured,
    dynamoTableName: process.env.DYNAMODB_EVENTS_TABLE ?? null,
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    demoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false"
  };
}
