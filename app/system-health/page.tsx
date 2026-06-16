import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getSystemHealth } from "@/lib/demo/store";

export const dynamic = "force-dynamic";

export default function SystemHealthPage() {
  const health = getSystemHealth();
  return (
    <div className="page">
      <p className="eyebrow">System health</p>
      <h1>Environment readiness without exposing secrets.</h1>
      <section className="section grid three">
        <Card><h3>App status</h3><Badge tone="low">{health.appStatus}</Badge><p>Build mode: {health.buildMode}</p></Card>
        <Card><h3>Database adapter mode</h3><Badge tone={health.databaseMode === "live" ? "live" : "demo"}>{health.databaseMode === "live" ? "Live AWS" : "Demo Adapter"}</Badge><p>No live AWS claim unless all required env vars are present.</p></Card>
        <Card><h3>DynamoDB table</h3><p>{health.dynamoTableName ?? "Not configured"}</p><p>Dynamo configured: {String(health.dynamoConfigured)}</p></Card>
      </section>
      <section className="section split">
        <Card>
          <h2>API route status</h2>
          {health.apiRoutes.map((route) => (
            <div className="status-line" key={route.route}><strong>{route.route}</strong><Badge tone="low">{route.status}</Badge></div>
          ))}
        </Card>
        <Card>
          <h2>Environment readiness checklist</h2>
          {health.checklist.map((item) => (
            <div className="status-line" key={item.label}><strong>{item.label}</strong><Badge tone={item.ready ? "low" : "medium"}>{item.ready ? "ready" : "pending"}</Badge></div>
          ))}
          <p>Last event generated: {health.lastEventGenerated ?? "None"}</p>
          <p>Last ledger verification: {health.lastLedgerVerification ?? "None"}</p>
        </Card>
      </section>
    </div>
  );
}
