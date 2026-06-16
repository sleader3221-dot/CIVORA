import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getDemoDataset } from "@/lib/demo/store";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  const dataset = getDemoDataset();
  const report = dataset.reports[0];
  return (
    <div className="page">
      <p className="eyebrow">Compliance reports</p>
      <h1>Audit-ready narratives generated from verified case evidence.</h1>
      <section className="section split">
        <Card>
          <h2>Generated reports list</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Report</th><th>Case</th><th>Generated</th><th>Open case</th></tr></thead>
              <tbody>
                {dataset.reports.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.caseId}</td>
                    <td>{formatDateTime(item.generatedAt)}</td>
                    <td><Link href={`/cases/${item.caseId}`}>Open</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <h2>Report contents</h2>
          <p>The report includes case summary, risk score, reasons, timeline, linked entities, evidence hashes, analyst notes, recommended action, and generated timestamp.</p>
          <Link className="button" href={report ? `/cases/${report.caseId}` : "/cases"}>Open printable case detail</Link>
        </Card>
      </section>
      {report && (
        <section className="section">
          <h2>Report preview</h2>
          <div className="report-preview" dangerouslySetInnerHTML={{ __html: report.html }} />
        </section>
      )}
    </div>
  );
}
