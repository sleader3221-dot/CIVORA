import Link from "next/link";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { Badge } from "@/components/ui/Badge";
import { Card, StatCard } from "@/components/ui/Card";
import { getDemoDataset } from "@/lib/demo/store";
import { formatDateTime, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const dataset = getDemoDataset();
  const averageRisk = Math.round(dataset.events.reduce((sum, event) => sum + event.riskScore, 0) / dataset.events.length);
  const severityData = ["low", "medium", "high", "critical"].map((severity) => ({
    name: severity,
    value: dataset.events.filter((event) => event.severity === severity).length
  }));
  const statusData = ["open", "investigating", "resolved"].map((status) => ({
    name: status,
    value: dataset.cases.filter((caseRecord) => caseRecord.status === status).length
  }));
  const volumeData = Array.from({ length: 8 }, (_, index) => {
    const slice = dataset.events.slice(index * 24, index * 24 + 24);
    return { time: `${index * 3}:00`, events: slice.length };
  });

  return (
    <div className="page">
      <p className="eyebrow">Command dashboard</p>
      <h1>Fraud operations, from event firehose to evidence-ready cases.</h1>
      <div className="stat-grid section">
        <StatCard label="Events ingested" value={formatNumber(dataset.events.length)} detail="DynamoDB raw store" />
        <StatCard label="Critical cases" value={dataset.cases.filter((item) => item.severity === "critical").length} detail="Auto-created" />
        <StatCard label="High-risk entities" value={dataset.entities.filter((item) => item.riskScore >= 60).length} detail="Graph linked" />
        <StatCard label="Ledger integrity" value="Valid" detail={`${dataset.ledger.length} evidence rows`} />
        <StatCard label="Reports generated" value={dataset.reports.length} detail="Compliance-ready" />
        <StatCard label="Average risk" value={averageRisk} detail="Across event stream" />
      </div>
      <section className="section">
        <DashboardCharts volume={volumeData} severity={severityData} status={statusData} />
      </section>
      <section className="section split">
        <Card>
          <h2>Recent critical events</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Event</th><th>Type</th><th>Entity</th><th>Risk</th><th>Source</th><th>Time</th></tr></thead>
              <tbody>
                {dataset.events.filter((event) => event.severity === "critical").slice(0, 6).map((event) => (
                  <tr key={event.id}>
                    <td>{event.id}</td>
                    <td>{event.eventType}</td>
                    <td>{event.entityId}</td>
                    <td><Badge tone={event.severity}>{event.riskScore}</Badge></td>
                    <td>{event.source}</td>
                    <td>{formatDateTime(event.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <h2>Recent cases</h2>
          <div className="timeline">
            {dataset.cases.slice(0, 5).map((caseRecord) => (
              <article key={caseRecord.id}>
                <time>{formatDateTime(caseRecord.updatedAt)}</time>
                <div>
                  <Badge tone={caseRecord.severity}>{caseRecord.severity}</Badge>
                  <h3><Link href={`/cases/${caseRecord.id}`}>{caseRecord.title}</Link></h3>
                  <p className="muted">{caseRecord.reasonCodes.slice(0, 3).join(", ")}</p>
                </div>
              </article>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
