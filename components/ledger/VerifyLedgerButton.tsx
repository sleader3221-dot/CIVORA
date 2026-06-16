"use client";

import { useState, useTransition } from "react";
import { ShieldCheck } from "lucide-react";

export function VerifyLedgerButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("No verification run in this browser session.");

  async function verify() {
    const ledgerResponse = await fetch("/api/ledger/verify", { method: "POST" });
    const json = await ledgerResponse.json() as { verification?: { valid: boolean; checkedChains: number; checkedRecords: number } };
    setMessage(json.verification?.valid ? `Global chain valid. Checked ${json.verification.checkedRecords} records across ${json.verification.checkedChains} case chains.` : "Verification failed.");
  }

  return (
    <div className="card">
      <h3>Verify global demo chain</h3>
      <p className="muted">This button calls the verification endpoint and updates visible state. The implementation verifies each case chain server-side.</p>
      <button className="button primary" disabled={isPending} onClick={() => startTransition(() => void verify())}>
        <ShieldCheck size={16} /> Verify global demo chain
      </button>
      <p className="demo-status">{message}</p>
    </div>
  );
}
