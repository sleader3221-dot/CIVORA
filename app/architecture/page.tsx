import { Card } from "@/components/ui/Card";

export default function ArchitecturePage() {
  const migrationTables = [
    "organizations", "users", "memberships", "api_keys", "entities", "cases",
    "case_events", "risk_scores", "evidence_ledger", "case_notes", "reports", "billing_plans"
  ];
  return (
    <div className="page">
      <p className="eyebrow">Architecture</p>
      <h1>ProofPilot AI architecture: Vercel plus DynamoDB plus Aurora DSQL.</h1>
      <p className="lede">The app separates high-volume raw event capture from strongly consistent investigation workflow state. That split is the core technical decision.</p>

      <section className="section card">
        <h2>Visual architecture diagram</h2>
        <div className="diagram">
          <div><strong>Vercel Edge + Next.js</strong><span>Landing, dashboard, demo, API routes, server-side adapters</span></div>
          <div><strong>DynamoDB ProofPilotEvents</strong><span>Raw immutable event stream, entity timelines, severity feed GSIs</span></div>
          <div><strong>Aurora DSQL</strong><span>Organizations, cases, risk scores, notes, ledgers, reports, billing plans</span></div>
          <div><strong>Evidence outputs</strong><span>Hash verification, report generation, Devpost-ready proof path</span></div>
        </div>
      </section>

      <section className="section grid two">
        <Card>
          <h2>Mermaid diagram</h2>
          <pre className="code">{`flowchart LR
  Judge[Judge Browser] --> Vercel[Vercel / Next.js App Router]
  Vercel --> API[Next.js API Routes]
  API --> Risk[Deterministic Risk Engine]
  API --> DDB[(DynamoDB ProofPilotEvents)]
  API --> DSQL[(Aurora DSQL / PostgreSQL)]
  DDB --> Raw[Raw event stream + GSIs]
  DSQL --> Cases[Cases, Notes, Ledger, Reports]
  Risk --> Cases
  Cases --> Ledger[SHA-256 Evidence Ledger]
  Ledger --> Reports[Compliance-ready HTML Report]`}</pre>
        </Card>
        <Card>
          <h2>Why this split matters</h2>
          <p>DynamoDB is optimized for write-heavy suspicious event ingestion where access patterns are predictable: latest organization events, entity timeline, high-risk feed, and event detail.</p>
          <p>Aurora DSQL is used for relational investigation workflows where strong consistency and SQL querying matter: cases, notes, risk scores, evidence ledgers, reports, organizations, and billing.</p>
        </Card>
      </section>

      <section className="section grid three">
        <Card>
          <h2>DynamoDB access patterns</h2>
          <ul className="muted">
            <li>PK = ORG#organizationId, SK = EVENT#timestamp#eventId.</li>
            <li>GSI1PK = ENTITY#entityId, GSI1SK = EVENT#timestamp.</li>
            <li>GSI2PK = RISK#severity, GSI2SK = timestamp#eventId.</li>
            <li>Queries support latest events, entity timeline, high-risk feed, event detail.</li>
          </ul>
        </Card>
        <Card>
          <h2>Aurora DSQL schema overview</h2>
          <p>{migrationTables.join(", ")}.</p>
          <p>Required indexes are included for cases by organization/status, cases by organization/severity, risk by entity/score, ledger by case/time, and reports by case.</p>
        </Card>
        <Card>
          <h2>Proof path for AWS database usage</h2>
          <p>Environment variables activate live adapters. Without them, the app uses demo adapters and displays that status clearly. No UI claims live AWS unless both DSQL and DynamoDB env vars are configured.</p>
        </Card>
      </section>

      <section className="section grid three">
        {[
          ["Security", "Server-side AWS SDK calls, Zod validation, no committed secrets, rate-limit helper, sanitized report HTML, synthetic data only."],
          ["Reliability", "Demo adapter works without credentials; live adapter fails closed if env is incomplete; ledger verification pinpoints broken records."],
          ["Scalability", "DynamoDB single-table design absorbs event volume; Aurora DSQL handles workflow consistency and relational reporting."],
          ["Cost optimization", "Raw events stay in DynamoDB access patterns; relational writes are reserved for cases, ledgers, reports, and billing state."],
          ["Operational excellence", "System health route shows adapter mode, API readiness, and environment checklist without exposing secret values."],
          ["Vercel readiness", "Next.js App Router, API routes, environment template, production build script, and no login friction for judging."]
        ].map(([title, body]) => (
          <Card key={title}><h3>{title}</h3><p>{body}</p></Card>
        ))}
      </section>

      <section className="section card">
        <h2>AWS proof screenshot checklist</h2>
        <div className="grid three">
          {[
            "DynamoDB table ProofPilotEvents with PK/SK and GSI1/GSI2",
            "Aurora DSQL/PostgreSQL schema migration applied",
            "Vercel environment variables configured",
            "System health page showing Live AWS mode",
            "Generated case with ledger verification",
            "Report page generated from verified evidence"
          ].map((item) => <p key={item} className="status-line">{item}</p>)}
        </div>
      </section>
    </div>
  );
}
