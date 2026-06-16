import { DemoControls } from "@/components/demo/DemoControls";
import { Card, StatCard } from "@/components/ui/Card";
import { getDemoDataset } from "@/lib/demo/store";

export const dynamic = "force-dynamic";

export default function DemoPage() {
  const dataset = getDemoDataset();
  const latestCriticalCase = dataset.cases.find((caseRecord) => caseRecord.severity === "critical") ?? dataset.cases[0];
  return (
    <div className="page">
      <p className="eyebrow">Judge Demo Mode</p>
      <h1>Northstar Pay investigation workspace.</h1>
      <p className="lede">
        Use the buttons below to run the complete demo: generate suspicious events, store and score
        them, auto-create cases, inspect timelines and entity graphs, verify the ledger, generate a
        report, and review the architecture.
      </p>
      <div className="stat-grid section">
        <StatCard label="Events ready" value={dataset.events.length} detail="Raw event stream" />
        <StatCard label="Entities" value={dataset.entities.length} detail="Accounts, devices, IPs" />
        <StatCard label="Critical cases" value={dataset.cases.filter((caseRecord) => caseRecord.severity === "critical").length} detail="Auto-created" />
        <StatCard label="Ledger rows" value={dataset.ledger.length} detail="Tamper-evident chain" />
        <StatCard label="Reports" value={dataset.reports.length} detail="Audit-ready HTML" />
        <StatCard label="Org" value="Northstar" detail="Safe synthetic data" />
      </div>
      <section className="section split">
        <DemoControls initialCaseId={latestCriticalCase?.id ?? null} initialGeneratedAt={dataset.lastGeneratedAt} />
        <Card>
          <p className="eyebrow">Instructions for judges</p>
          <h2>Under three minutes, end to end.</h2>
          <ol className="muted">
            <li>Click Generate Suspicious Events.</li>
            <li>Open the latest critical case.</li>
            <li>Review risk reasons, timeline, graph, evidence hashes, and analyst notes.</li>
            <li>Verify the evidence chain and generate a printable report.</li>
            <li>Open Architecture and System Health to inspect AWS database readiness.</li>
          </ol>
        </Card>
      </section>
    </div>
  );
}
