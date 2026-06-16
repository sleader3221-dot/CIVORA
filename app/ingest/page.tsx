import { IngestActions } from "@/components/ingest/IngestActions";
import { Card } from "@/components/ui/Card";

const examplePayload = `{
  "organizationId": "org_northstar",
  "entityId": "acct_00",
  "eventType": "new_device_payment",
  "amount": 9800,
  "currency": "USD",
  "ipAddress": "203.0.113.44",
  "deviceId": "device_00",
  "country": "RU",
  "userAgent": "NorthstarPay/checkout",
  "metadata": {
    "baselineAmount": 550,
    "failedLoginCount15m": 8,
    "ipEntityCount": 6,
    "chargebackHistory": true,
    "priorPasswordReset": true,
    "countryMismatch": true,
    "proxyLike": true,
    "newDevice": true
  }
}`;

export default function IngestPage() {
  return (
    <div className="page">
      <p className="eyebrow">API ingestion</p>
      <h1>Capture raw suspicious events without losing audit context.</h1>
      <p className="lede">POST /api/ingest validates every event with Zod, scores it deterministically, stores it through the event repository, and opens a case when risk crosses the threshold.</p>
      <section className="section split">
        <Card>
          <h2>Example JSON payload</h2>
          <pre className="code">{examplePayload}</pre>
        </Card>
        <Card>
          <h2>cURL example</h2>
          <pre className="code">{`curl -X POST http://localhost:3000/api/ingest \\
  -H "content-type: application/json" \\
  -d '${examplePayload.replaceAll("'", "\\'")}'`}</pre>
        </Card>
      </section>
      <section className="section grid two">
        <IngestActions />
        <Card>
          <h2>DynamoDB raw event store</h2>
          <p>ProofPilot uses a single-table design where PK = ORG#organizationId and SK = EVENT#timestamp#eventId. GSI1 supports entity timelines, and GSI2 supports high/critical risk event feeds.</p>
          <p>When AWS credentials are absent, the same repository contract routes to the safe demo adapter and the UI clearly labels the mode.</p>
        </Card>
      </section>
    </div>
  );
}
