import { describe, expect, it } from "vitest";
import { appendLedger } from "@/lib/demo/generate-events";
import { verifyLedgerChain } from "@/lib/ledger/verify";
import type { EvidenceLedgerRecord } from "@/lib/types";

describe("evidence ledger", () => {
  it("verifies a deterministic hash chain and pinpoints tampering", () => {
    const records: EvidenceLedgerRecord[] = [];
    appendLedger(records, "case_test", "CASE_CREATED", "test", { caseId: "case_test" }, "2026-06-16T00:00:00.000Z");
    appendLedger(records, "case_test", "EVENT_LINKED", "test", { eventId: "evt_1" }, "2026-06-16T00:01:00.000Z");

    expect(verifyLedgerChain(records)).toEqual({ valid: true, checkedRecords: 2 });

    records[1].payloadJson = JSON.stringify({ eventId: "evt_tampered" });
    const result = verifyLedgerChain(records);
    expect(result.valid).toBe(false);
    expect(result.brokenRecordId).toBe(records[1].id);
  });
});
