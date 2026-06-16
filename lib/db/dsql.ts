import { getEnvironment } from "@/lib/config/env";

export function getDsqlStatus() {
  const env = getEnvironment();
  return {
    configured: env.dsqlConfigured,
    driver: "PostgreSQL-compatible Aurora DSQL adapter",
    connectionStringConfigured: Boolean(process.env.DATABASE_URL)
  };
}

export class DsqlWorkflowAdapter {
  isConfigured() {
    return Boolean(process.env.DATABASE_URL);
  }

  assertConfigured() {
    if (!this.isConfigured()) {
      throw new Error("Aurora DSQL/PostgreSQL adapter is not configured");
    }
  }
}
