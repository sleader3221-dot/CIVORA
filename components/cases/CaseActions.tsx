"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Printer, ShieldCheck } from "lucide-react";

export function CaseActions({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("Ready");

  async function verify() {
    const response = await fetch(`/api/cases/${caseId}/verify-ledger`, { method: "POST" });
    const json = await response.json() as { verification?: { valid: boolean; checkedRecords: number } };
    setMessage(json.verification?.valid ? `Evidence chain valid across ${json.verification.checkedRecords} records.` : "Evidence chain failed verification.");
  }

  async function report() {
    const response = await fetch(`/api/cases/${caseId}/generate-report`, { method: "POST" });
    const json = await response.json() as { report?: { id: string } };
    setMessage(json.report ? `Report generated: ${json.report.id}` : "Report generation failed.");
    router.refresh();
  }

  return (
    <div className="card">
      <p className="eyebrow">Case actions</p>
      <div className="hero-actions">
        <button className="button" onClick={() => startTransition(() => void verify())} disabled={isPending}>
          <ShieldCheck size={16} /> Verify Evidence Chain
        </button>
        <button className="button primary" onClick={() => startTransition(() => void report())} disabled={isPending}>
          <FileText size={16} /> Generate Report
        </button>
        <button className="button" onClick={() => window.print()}>
          <Printer size={16} /> Print Report
        </button>
        <button className="button ghost" onClick={() => router.push("/cases")}>
          <ArrowLeft size={16} /> Back to Cases
        </button>
      </div>
      <p className="demo-status">{message}</p>
    </div>
  );
}
