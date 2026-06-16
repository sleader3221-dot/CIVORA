import type { EvidenceLedgerRecord } from "@/lib/types";
import { ledgerCurrentHash, payloadHash } from "./hash";

export interface LedgerVerification {
  valid: boolean;
  checkedRecords: number;
  brokenRecordId?: string;
  expectedHash?: string;
  actualHash?: string;
}

export function verifyLedgerChain(records: EvidenceLedgerRecord[]): LedgerVerification {
  const sorted = [...records].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  let previousHash = "GENESIS";

  for (const record of sorted) {
    const expectedPayloadHash = payloadHash(JSON.parse(record.payloadJson));
    if (expectedPayloadHash !== record.payloadHash) {
      return {
        valid: false,
        checkedRecords: sorted.indexOf(record),
        brokenRecordId: record.id,
        expectedHash: expectedPayloadHash,
        actualHash: record.payloadHash
      };
    }
    const expectedCurrentHash = ledgerCurrentHash({
      previousHash,
      payloadHash: record.payloadHash,
      createdAt: record.createdAt,
      actionType: record.actionType
    });
    if (record.previousHash !== previousHash || record.currentHash !== expectedCurrentHash) {
      return {
        valid: false,
        checkedRecords: sorted.indexOf(record),
        brokenRecordId: record.id,
        expectedHash: expectedCurrentHash,
        actualHash: record.currentHash
      };
    }
    previousHash = record.currentHash;
  }

  return { valid: true, checkedRecords: sorted.length };
}
