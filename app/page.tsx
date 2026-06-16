import Link from "next/link";
import { ArrowRight, Database, FileCheck2, GitBranch, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DatabaseModeBadge } from "@/components/ui/DatabaseModeBadge";

export default function HomePage() {
  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">H0 Hackathon - Track 2 Monetizable B2B App</p>
          <h1>Evidence-grade fraud and incident operations in minutes.</h1>
          <p className="lede">
            ProofPilot AI turns suspicious fintech, SaaS, and marketplace events into risk-scored
            cases, linked evidence timelines, tamper-evident audit ledgers, and compliance-ready
            reports using Vercel, DynamoDB, and Aurora DSQL.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/demo">Launch Live Demo <ArrowRight size={16} /></Link>
            <Link className="button" href="/architecture">View Architecture</Link>
          </div>
        </div>
        <div className="hero-panel">
          <DatabaseModeBadge />
          <div className="terminal" aria-label="Demo proof path">
            <code><span>POST</span> /api/demo/generate-events</code>
            <code>1000 raw events - DynamoDB access pattern</code>
            <code><b>5 critical cases</b> - Aurora DSQL workflow record</code>
            <code>SHA-256 evidence ledger - verify chain</code>
            <code>HTML report - audit-ready export</code>
          </div>
          <div className="hero-metrics">
            <div><strong>1,000</strong><span>Generated events</span></div>
            <div><strong>50</strong><span>Linked entities</span></div>
            <div><strong>5+</strong><span>Critical cases</span></div>
          </div>
        </div>
      </section>

      <section className="section grid three">
        <Card>
          <ShieldAlert size={22} />
          <h3>The problem</h3>
          <p>Risk teams receive thousands of suspicious signals but lose time proving why an event matters and which evidence supports the response.</p>
        </Card>
        <Card>
          <GitBranch size={22} />
          <h3>The solution</h3>
          <p>ProofPilot links event evidence, entities, reasons, notes, ledger hashes, and reports into one judge-friendly investigation path.</p>
        </Card>
        <Card>
          <Database size={22} />
          <h3>Database-first</h3>
          <p>DynamoDB captures high-volume raw event streams. Aurora DSQL stores strongly consistent cases, ledgers, reports, and SaaS records.</p>
        </Card>
      </section>

      <section className="section">
        <h2>How the working demo flows</h2>
        <div className="grid four">
          {[
            "Generate suspicious events",
            "Score deterministic risk",
            "Auto-create critical cases",
            "Verify evidence ledger"
          ].map((item, index) => (
            <Card key={item}>
              <p className="eyebrow">Step {index + 1}</p>
              <h3>{item}</h3>
              <p>Each step mutates visible demo state and maps to a concrete data model or access pattern.</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section split">
        <Card>
          <p className="eyebrow">AWS database architecture preview</p>
          <h2>Raw event velocity plus consistent case workflow.</h2>
          <div className="diagram">
            <div><strong>Vercel</strong><span>Next.js App Router and API routes</span></div>
            <div><strong>DynamoDB</strong><span>PK/SK raw event store with entity and severity GSIs</span></div>
            <div><strong>Aurora DSQL</strong><span>Cases, notes, ledgers, reports, billing plans</span></div>
            <div><strong>Ledger</strong><span>Canonical JSON and SHA-256 hash chain verification</span></div>
          </div>
        </Card>
        <Card>
          <FileCheck2 size={22} />
          <h3>Trust and evidence ledger</h3>
          <p>Every case action can be hashed with the previous evidence record so a judge can verify integrity from the case page or global ledger page.</p>
          <div className="section-actions">
            <Link className="button" href="/ledger">Open Ledger</Link>
            <Link className="button" href="/pricing">View Pricing</Link>
          </div>
        </Card>
      </section>

      <section className="section grid three">
        {[
          ["Starter", "$29/month", "10k events/month for early-stage SaaS and fintech teams."],
          ["Growth", "$99/month", "100k events/month with investigation workflows and report exports."],
          ["Enterprise", "Custom", "SSO, audit retention, DSQL retention tiers, compliance exports."]
        ].map(([plan, price, body]) => (
          <Card key={plan}><h3>{plan}</h3><h2>{price}</h2><p>{body}</p></Card>
        ))}
      </section>

      <section className="section hero-panel">
        <p className="eyebrow">Ready for judges</p>
        <h2>One path shows product value, AWS database design, and monetizable B2B strategy.</h2>
        <div className="hero-actions">
          <Link className="button primary" href="/demo">Launch Judge Demo</Link>
          <Link className="button" href="/submission">View Devpost Content</Link>
        </div>
      </section>
    </div>
  );
}
