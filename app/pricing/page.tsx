import { Card } from "@/components/ui/Card";

export default function PricingPage() {
  const plans = [
    ["Starter", "$29/month", "10k events/month", "Solo founder and early SaaS fraud workflow."],
    ["Growth", "$99/month", "100k events/month", "Case workflows, ledger verification, report export, and team review."],
    ["Enterprise", "Custom", "SSO + retention", "SSO, audit retention, compliance exports, custom DSQL data residency."]
  ];
  return (
    <div className="page">
      <p className="eyebrow">Pricing</p>
      <h1>Monetizable B2B fraud operations for teams that need evidence, not noise.</h1>
      <section className="section grid three">
        {plans.map(([name, price, quota, body]) => (
          <Card key={name}>
            <p className="eyebrow">{quota}</p>
            <h2>{name}</h2>
            <h1 style={{ fontSize: 44 }}>{price}</h1>
            <p>{body}</p>
          </Card>
        ))}
      </section>
      <section className="section card">
        <h2>Why this is monetizable</h2>
        <p>Fraud, trust and safety, abuse, and incident teams already pay for tools that reduce manual review time and compliance risk. ProofPilot packages event ingestion, deterministic risk scoring, evidence retention, ledger verification, and reports into a clear per-event SaaS model.</p>
      </section>
    </div>
  );
}
