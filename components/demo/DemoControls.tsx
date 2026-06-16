"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Rocket, ShieldAlert, Workflow } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface DemoResult {
  events?: number;
  entities?: number;
  criticalCases?: number;
  ledgerRecords?: number;
  lastGeneratedAt?: string;
  latestCriticalCaseId?: string | null;
  message?: string;
}

export function DemoControls({
  initialCaseId,
  initialGeneratedAt
}: {
  initialCaseId: string | null;
  initialGeneratedAt?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<DemoResult>({
    latestCriticalCaseId: initialCaseId,
    lastGeneratedAt: initialGeneratedAt
  });
  const statusText = result.message ??
    (typeof result.events === "number"
      ? `Generated ${result.events} events, ${result.entities ?? 50} entities, and ${result.criticalCases ?? "5+"} critical cases.`
      : "Seed events, 50 entities, 5+ critical cases.");

  async function post(url: string, body?: unknown) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: body ? JSON.stringify(body) : undefined
    });
    const json = (await response.json()) as DemoResult;
    setResult(json);
    router.refresh();
  }

  return (
    <div className="card">
      <p className="eyebrow">Judge controls</p>
      <h2>Run the complete proof path.</h2>
      <p className="muted">
        Generate synthetic Northstar Pay events, create risk-scored cases, then inspect the
        ledger, graph, and report outputs without login friction.
      </p>
      <div className="hero-actions">
        <button className="button primary" onClick={() => router.push("/dashboard")} disabled={isPending}>
          <Rocket size={16} /> Launch Demo Workspace
        </button>
        <button className="button danger" onClick={() => startTransition(() => void post("/api/demo/reset"))} disabled={isPending}>
          <RotateCcw size={16} /> Reset Demo Data
        </button>
        <button className="button" onClick={() => startTransition(() => void post("/api/demo/generate-events", { count: 1000 }))} disabled={isPending}>
          <ShieldAlert size={16} /> Generate Suspicious Events
        </button>
        <button
          className="button"
          onClick={() => router.push(result.latestCriticalCaseId ? `/cases/${result.latestCriticalCaseId}` : "/cases")}
          disabled={isPending}
        >
          <Workflow size={16} /> View Latest Critical Case
        </button>
        <button className="button ghost" onClick={() => router.push("/architecture")} disabled={isPending}>
          View Architecture
        </button>
      </div>
      <div className="demo-status" role="status">
        <strong>{isPending ? "Working..." : "Demo status"}</strong>
        <p>{statusText}</p>
        <p>Last generated event time: {result.lastGeneratedAt ? formatDateTime(result.lastGeneratedAt) : "Seed data ready"}</p>
      </div>
    </div>
  );
}
