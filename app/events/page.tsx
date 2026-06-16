import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { getDemoDataset } from "@/lib/demo/store";
import { formatDateTime } from "@/lib/utils";
import type { Severity } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ severity?: Severity; eventType?: string; entity?: string }> }) {
  const params = await searchParams;
  const dataset = getDemoDataset();
  const caseByEvent = new Map(dataset.cases.flatMap((caseRecord) => caseRecord.eventIds.map((eventId) => [eventId, caseRecord.id])));
  const events = dataset.events.filter((event) =>
    (!params.severity || event.severity === params.severity) &&
    (!params.eventType || event.eventType === params.eventType) &&
    (!params.entity || event.entityId.includes(params.entity))
  );
  return (
    <div className="page">
      <p className="eyebrow">Event stream</p>
      <h1>DynamoDB-mode event feed with visible risk evidence.</h1>
      <div className="filters">
        {["low", "medium", "high", "critical"].map((severity) => (
          <Link key={severity} href={`/events?severity=${severity}`} className={params.severity === severity ? "active" : ""}>{severity}</Link>
        ))}
        <Link href="/events">Clear filters</Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Event ID</th><th>Type</th><th>Entity</th><th>Severity</th><th>Risk</th><th>Timestamp</th><th>Source</th><th>Open</th></tr></thead>
          <tbody>
            {events.slice(0, 80).map((event) => {
              const caseId = caseByEvent.get(event.id);
              return (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.eventType}</td>
                  <td>{event.entityId}</td>
                  <td><Badge tone={event.severity}>{event.severity}</Badge></td>
                  <td>{event.riskScore}</td>
                  <td>{formatDateTime(event.createdAt)}</td>
                  <td><Badge tone="demo">{event.source}</Badge></td>
                  <td><Link href={caseId ? `/cases/${caseId}` : `/entities?focus=${event.entityId}`}>Open</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
