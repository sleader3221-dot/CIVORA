import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { getDemoDataset } from "@/lib/demo/store";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CasesPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams;
  const dataset = getDemoDataset();
  const cases = dataset.cases.filter((caseRecord) => {
    if (!filter) return true;
    if (filter === "critical") return caseRecord.severity === "critical";
    return caseRecord.status === filter;
  });
  return (
    <div className="page">
      <p className="eyebrow">Case management</p>
      <h1>Risk-scored investigations with evidence counts and owners.</h1>
      <div className="filters">
        {["open", "investigating", "resolved", "critical"].map((item) => (
          <Link className={filter === item ? "active" : ""} key={item} href={`/cases?filter=${item}`}>{item}</Link>
        ))}
        <Link href="/cases">All</Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Case</th><th>Severity</th><th>Status</th><th>Risk</th><th>Primary entity</th><th>Evidence</th><th>Analyst</th><th>Updated</th></tr></thead>
          <tbody>
            {cases.map((caseRecord) => (
              <tr key={caseRecord.id}>
                <td><Link href={`/cases/${caseRecord.id}`}>{caseRecord.title}</Link></td>
                <td><Badge tone={caseRecord.severity}>{caseRecord.severity}</Badge></td>
                <td>{caseRecord.status}</td>
                <td>{caseRecord.riskScore}</td>
                <td>{caseRecord.primaryEntityId}</td>
                <td>{caseRecord.evidenceCount}</td>
                <td>{caseRecord.assignedAnalyst}</td>
                <td>{formatDateTime(caseRecord.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
