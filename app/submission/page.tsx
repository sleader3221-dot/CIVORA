import { Card } from "@/components/ui/Card";

export default function SubmissionPage() {
  return (
    <div className="page">
      <p className="eyebrow">Devpost-ready submission</p>
      <h1>ProofPilot AI - Evidence-Grade Fraud & Incident Operations OS</h1>
      <p className="lede">A Vercel-deployed B2B SaaS platform that turns suspicious events into risk-scored cases, linked evidence timelines, tamper-evident ledgers, and audit-ready reports using Aurora DSQL and DynamoDB.</p>
      <section className="section grid two">
        <Card><h2>Problem</h2><p>Fraud and incident teams drown in suspicious events but struggle to prove what happened, why it matters, and which evidence supports the action.</p></Card>
        <Card><h2>What it does</h2><p>ProofPilot ingests suspicious events, scores risk with explainable rules, opens cases, links entities, records evidence hashes, verifies the ledger, and generates reports.</p></Card>
        <Card><h2>How it was built</h2><p>Next.js App Router on Vercel, Zod API validation, deterministic TypeScript risk engine, DynamoDB-ready event repository, Aurora DSQL-ready workflow repositories, SHA-256 ledger, Recharts, and React Flow.</p></Card>
        <Card><h2>AWS databases used</h2><p>DynamoDB is the high-volume raw event store. Aurora DSQL/PostgreSQL is the relational system of record for cases, risk scores, ledgers, notes, reports, organizations, users, API keys, and billing.</p></Card>
        <Card><h2>Why Aurora DSQL</h2><p>Investigations need strong consistency across case state, analyst notes, evidence ledger rows, generated reports, and SaaS records.</p></Card>
        <Card><h2>Why DynamoDB</h2><p>Suspicious event ingestion is write-heavy, bursty, and access-pattern driven. Single-table design keeps raw event feeds fast and economical.</p></Card>
      </section>
      <section className="section card">
        <h2>Testing instructions</h2>
        <ol className="muted">
          <li>Open the Vercel link.</li>
          <li>Click Launch Live Demo.</li>
          <li>Open Judge Demo Mode.</li>
          <li>Click Generate Suspicious Events.</li>
          <li>Open the latest critical case.</li>
          <li>Review risk explanation, timeline, and entity graph.</li>
          <li>Click Verify Evidence Chain.</li>
          <li>Click Generate Report.</li>
          <li>Visit /architecture.</li>
          <li>Visit /system-health.</li>
        </ol>
      </section>
      <section className="section grid two">
        <Card>
          <h2>Demo video script under 3 minutes</h2>
          <p>0:00-0:15 Problem. 0:15-0:35 Solution. 0:35-1:25 Working app demo. 1:25-2:05 AWS database architecture. 2:05-2:35 Business impact. 2:35-2:55 Closing.</p>
        </Card>
        <Card>
          <h2>Required checklist</h2>
          <p>Screenshots: landing, demo, dashboard, case detail, entity graph, ledger verify, report, architecture, system health, AWS tables, Vercel env.</p>
          <p>Vercel Team ID placeholder: team_xxxxxxxxx.</p>
          <p>Bonus content: #H0Hackathon, AWS proof checklist, deployment notes, security notes.</p>
        </Card>
      </section>
      <section className="section card">
        <h2>Public content phrase</h2>
        <p>I created this content for the purposes of entering the H0: Hack the Zero Stack with Vercel v0 and AWS Databases hackathon.</p>
        <p>#H0Hackathon</p>
      </section>
    </div>
  );
}
