import type { InvestigationCase } from "@/lib/types";
import { getCase, getDemoDataset } from "@/lib/demo/store";
import { DsqlWorkflowAdapter } from "@/lib/db/dsql";

export interface CaseRepository {
  list(filters?: { status?: string; severity?: string }): Promise<InvestigationCase[]>;
  get(id: string): Promise<InvestigationCase | null>;
}

export class DemoCaseRepository implements CaseRepository {
  async list(filters: { status?: string; severity?: string } = {}) {
    return getDemoDataset().cases.filter((caseRecord) =>
      (!filters.status || caseRecord.status === filters.status) &&
      (!filters.severity || caseRecord.severity === filters.severity)
    );
  }

  async get(id: string) {
    return getCase(id);
  }
}

export class DsqlCaseRepository extends DemoCaseRepository {
  private readonly adapter = new DsqlWorkflowAdapter();

  isLiveReady() {
    return this.adapter.isConfigured();
  }
}
