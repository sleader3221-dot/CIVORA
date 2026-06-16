import type { EvidenceLedgerRecord } from "@/lib/types";
import { getCaseLedger, getDemoDataset, verifyCaseLedger, verifyGlobalLedger } from "@/lib/demo/store";
import { DsqlWorkflowAdapter } from "@/lib/db/dsql";

export interface LedgerRepository {
  list(caseId?: string): Promise<EvidenceLedgerRecord[]>;
  verify(caseId?: string): Promise<unknown>;
}

export class DemoLedgerRepository implements LedgerRepository {
  async list(caseId?: string) {
    return caseId ? getCaseLedger(caseId) : getDemoDataset().ledger;
  }

  async verify(caseId?: string) {
    return caseId ? verifyCaseLedger(caseId) : verifyGlobalLedger();
  }
}

export class DsqlLedgerRepository extends DemoLedgerRepository {
  private readonly adapter = new DsqlWorkflowAdapter();

  isLiveReady() {
    return this.adapter.isConfigured();
  }
}
