import { VerifyLedgerButton } from "@/components/ledger/VerifyLedgerButton";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getDemoDataset } from "@/lib/demo/store";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function LedgerPage() {
  const dataset = getDemoDataset();
  return (
    <div className="page">
      <p className="eyebrow">Evidence ledger</p>
      <h1>Tamper-evident case evidence with exact hash chain fields.</h1>
      <section className="section split">
        <Card>
          <h2>Hash chain explorer</h2>
          <p>Each row stores payloadHash, previousHash, currentHash, action type, actor, and timestamp. Verification recomputes canonical JSON and SHA-256 in chain order.</p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Case</th><th>Action</th><th>Status</th><th>Payload hash</th><th>Previous hash</th><th>Current hash</th><th>Time</th></tr></thead>
              <tbody>
                {dataset.ledger.slice(0, 60).map((record) => (
                  <tr key={record.id}>
                    <td>{record.caseId}</td>
                    <td>{record.actionType}</td>
                    <td><Badge tone="low">verified</Badge></td>
                    <td className="hash">{record.payloadHash}</td>
                    <td className="hash">{record.previousHash}</td>
                    <td className="hash">{record.currentHash}</td>
                    <td>{formatDateTime(record.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <VerifyLedgerButton />
      </section>
    </div>
  );
}
