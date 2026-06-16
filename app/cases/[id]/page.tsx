import { notFound } from "next/navigation";
import { CaseActions } from "@/components/cases/CaseActions";
import { EntityGraph } from "@/components/entities/EntityGraph";
import { Badge } from "@/components/ui/Badge";
import { Card, StatCard } from "@/components/ui/Card";
import { getCase, getCaseEvents, getCaseLedger, getDemoDataset } from "@/lib/demo/store";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseRecord = getCase(id);
  if (!caseRecord) notFound();

  const dataset = getDemoDataset();
  const events = getCaseEvents(id);
  const ledger = getCaseLedger(id);
  const reports = dataset.reports.filter((report) => report.caseId === id);
  const linkedEntityIds = new Set([
    caseRecord.primaryEntityId,
    ...events.flatMap((event) => [event.entityId, event.deviceId ?? ""])
  ]);
  const linkedEntities = dataset.entities.filter((entity) => linkedEntityIds.has(entity.id));

  return (
    <div className="page">
      <p className="eyebrow">Case detail</p>
      <h1>{caseRecord.title}</h1>
      <p className="lede">{caseRecord.summary}</p>
      <div className="stat-grid section">
        <StatCard label="Risk score" value={`${caseRecord.riskScore}/100`} detail={caseRecord.recommendedAction} />
        <StatCard label="Severity" value={caseRecord.severity} detail="Deterministic scoring" />
        <StatCard label="Evidence count" value={caseRecord.evidenceCount} detail="Linked events" />
        <StatCard label="Ledger rows" value={ledger.length} detail="Hash chain" />
        <StatCard label="Status" value={caseRecord.status} detail="Aurora DSQL workflow" />
        <StatCard label="Analyst" value={caseRecord.assignedAnalyst} detail="Assigned owner" />
      </div>

      <section className="section split">
        <Card>
          <h2>Risk explanation</h2>
          <div className="grid two">
            {caseRecord.reasons.map((reason) => (
              <div className="status-line" key={reason.code}>
                <div>
                  <strong>{reason.code}</strong>
                  <p className="muted">{reason.explanation}</p>
                </div>
                <Badge tone={caseRecord.severity}>+{reason.points}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <CaseActions caseId={id} />
      </section>

      <section className="section split">
        <Card>
          <h2>Event timeline</h2>
          <div className="timeline">
            {caseRecord.timeline.slice(0, 10).map((entry) => (
              <article key={entry.id}>
                <time>{formatDateTime(entry.createdAt)}</time>
                <div><Badge tone={caseRecord.severity}>{entry.type}</Badge><h3>{entry.title}</h3><p className="muted">{entry.detail}</p></div>
              </article>
            ))}
          </div>
        </Card>
        <Card>
          <h2>Analyst notes</h2>
          {caseRecord.notes.map((note) => (
            <article className="status-line" key={note.id}>
              <div><strong>{note.actor}</strong><p className="muted">{note.body}</p></div>
              <time>{formatDateTime(note.createdAt)}</time>
            </article>
          ))}
        </Card>
      </section>

      <section className="section">
        <h2>Entity relationship graph</h2>
        <EntityGraph entities={linkedEntities.length ? linkedEntities : dataset.entities.slice(0, 8)} relationships={dataset.relationships} cases={[caseRecord]} />
      </section>

      <section className="section grid two">
        <Card>
          <h2>Linked evidence records</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Event</th><th>Type</th><th>Risk</th><th>Reason codes</th></tr></thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.id}</td>
                    <td>{event.eventType}</td>
                    <td><Badge tone={event.severity}>{event.riskScore}</Badge></td>
                    <td>{event.reasonCodes.slice(0, 3).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <h2>Evidence ledger chain</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Action</th><th>Previous hash</th><th>Current hash</th></tr></thead>
              <tbody>
                {ledger.map((record) => (
                  <tr key={record.id}>
                    <td>{record.actionType}</td>
                    <td className="hash">{record.previousHash}</td>
                    <td className="hash">{record.currentHash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {reports[0] && (
        <section className="section">
          <h2>Printable report preview</h2>
          <div className="report-preview" dangerouslySetInnerHTML={{ __html: reports[0].html }} />
        </section>
      )}
    </div>
  );
}
