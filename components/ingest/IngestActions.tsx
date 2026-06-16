"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RadioReceiver } from "lucide-react";

export function IngestActions() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("Ready to generate synthetic suspicious events.");

  async function generate() {
    const response = await fetch("/api/demo/generate-events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ count: 1000 })
    });
    const json = await response.json() as { events: number; criticalCases: number; latestCriticalCaseId?: string };
    setMessage(`Generated ${json.events} events and ${json.criticalCases} critical cases. Latest case: ${json.latestCriticalCaseId}.`);
    router.refresh();
  }

  return (
    <div className="card">
      <h3>CSV/demo ingest</h3>
      <p className="muted">For judging, this simulates a high-volume event batch and updates the same demo repositories used by the UI.</p>
      <button className="button primary" disabled={isPending} onClick={() => startTransition(() => void generate())}>
        <RadioReceiver size={16} /> Generate 1,000 Suspicious Events
      </button>
      <p className="demo-status">{message}</p>
    </div>
  );
}
