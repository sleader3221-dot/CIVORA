import { EntityGraph } from "@/components/entities/EntityGraph";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getDemoDataset } from "@/lib/demo/store";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function EntitiesPage() {
  const dataset = getDemoDataset();
  return (
    <div className="page">
      <p className="eyebrow">Entity intelligence</p>
      <h1>Account to device to IP to transaction to case relationships.</h1>
      <section className="section">
        <EntityGraph entities={dataset.entities} relationships={dataset.relationships} cases={dataset.cases} />
      </section>
      <section className="section grid two">
        <Card>
          <h2>High-risk entities</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Entity</th><th>Type</th><th>Risk</th><th>Last seen</th><th>Attributes</th></tr></thead>
              <tbody>
                {dataset.entities.slice(0, 30).map((entity) => (
                  <tr key={entity.id}>
                    <td>{entity.label}</td>
                    <td>{entity.type}</td>
                    <td><Badge tone={entity.riskLevel}>{entity.riskScore}</Badge></td>
                    <td>{formatDateTime(entity.lastSeenAt)}</td>
                    <td>{Object.entries(entity.attributes).slice(0, 2).map(([key, value]) => `${key}: ${value}`).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <h2>Entity timeline</h2>
          <div className="timeline">
            {dataset.events.slice(0, 7).map((event) => (
              <article key={event.id}>
                <time>{formatDateTime(event.createdAt)}</time>
                <div><Badge tone={event.severity}>{event.riskScore}</Badge><h3>{event.entityId}</h3><p className="muted">{event.eventType} from {event.ipAddress}</p></div>
              </article>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
