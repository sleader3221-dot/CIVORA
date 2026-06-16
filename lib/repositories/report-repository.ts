import type { ReportRecord } from "@/lib/types";
import { createReport, getDemoDataset } from "@/lib/demo/store";
import { DsqlWorkflowAdapter } from "@/lib/db/dsql";

export interface ReportRepository {
  list(caseId?: string): Promise<ReportRecord[]>;
  create(caseId: string): Promise<ReportRecord | null>;
}

export class DemoReportRepository implements ReportRepository {
  async list(caseId?: string) {
    return getDemoDataset().reports.filter((report) => !caseId || report.caseId === caseId);
  }

  async create(caseId: string) {
    return createReport(caseId);
  }
}

export class DsqlReportRepository extends DemoReportRepository {
  private readonly adapter = new DsqlWorkflowAdapter();

  isLiveReady() {
    return this.adapter.isConfigured();
  }
}
