import type { EvidenceLedgerRecord, EntityRecord, FraudEvent, InvestigationCase, ReportRecord } from "@/lib/types";

export function sanitizeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function generateCaseReport({
  caseRecord,
  events,
  entities,
  ledger,
  generatedBy = "Judge Demo Analyst"
}: {
  caseRecord: InvestigationCase;
  events: FraudEvent[];
  entities: EntityRecord[];
  ledger: EvidenceLedgerRecord[];
  generatedBy?: string;
}): ReportRecord {
  const generatedAt = new Date().toISOString();
  const linkedEntities = entities.filter((entity) =>
    entity.id === caseRecord.primaryEntityId ||
    events.some((event) => event.entityId === entity.id || event.deviceId === entity.id)
  );
  const html = `
    <article class="report-document">
      <header>
        <p>ProofPilot AI Investigation Report</p>
        <h1>${sanitizeHtml(caseRecord.title)}</h1>
        <span>Generated ${sanitizeHtml(generatedAt)} by ${sanitizeHtml(generatedBy)}</span>
      </header>
      <section><h2>Case summary</h2><p>${sanitizeHtml(caseRecord.summary)}</p></section>
      <section><h2>Risk score</h2><p>${caseRecord.riskScore}/100 - ${sanitizeHtml(caseRecord.severity.toUpperCase())}</p></section>
      <section><h2>Reason codes</h2><ul>${caseRecord.reasons.map((reason) => `<li><strong>${sanitizeHtml(reason.code)}</strong>: ${sanitizeHtml(reason.explanation)}</li>`).join("")}</ul></section>
      <section><h2>Event timeline</h2><ol>${events.map((event) => `<li>${sanitizeHtml(event.createdAt)} - ${sanitizeHtml(event.eventType)} - score ${event.riskScore}</li>`).join("")}</ol></section>
      <section><h2>Linked entities</h2><ul>${linkedEntities.map((entity) => `<li>${sanitizeHtml(entity.type)} - ${sanitizeHtml(entity.label)} - risk ${entity.riskScore}</li>`).join("")}</ul></section>
      <section><h2>Evidence hashes</h2><ol>${ledger.map((record) => `<li>${sanitizeHtml(record.actionType)} - ${sanitizeHtml(record.currentHash.slice(0, 24))}...</li>`).join("")}</ol></section>
      <section><h2>Analyst notes</h2><ul>${caseRecord.notes.map((note) => `<li>${sanitizeHtml(note.body)}</li>`).join("")}</ul></section>
      <section><h2>Recommended action</h2><p>${sanitizeHtml(caseRecord.recommendedAction)}</p></section>
    </article>
  `;

  return {
    id: `report_${caseRecord.id}_${Date.now()}`,
    organizationId: caseRecord.organizationId,
    caseId: caseRecord.id,
    title: `Audit-ready report for ${caseRecord.title}`,
    html,
    generatedAt,
    generatedBy
  };
}
