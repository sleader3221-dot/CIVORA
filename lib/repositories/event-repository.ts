import type { FraudEvent, Severity } from "@/lib/types";
import { getDemoDataset, ingestDemoEvent } from "@/lib/demo/store";
import type { EventPayload } from "@/lib/validators/event";
import { DynamoDBEventAdapter } from "@/lib/aws/dynamodb";

export interface EventRepository {
  list(filters?: { severity?: Severity; entityId?: string; eventType?: string; limit?: number }): Promise<FraudEvent[]>;
  ingest(payload: EventPayload): Promise<{ event: FraudEvent }>;
}

export class DemoEventRepository implements EventRepository {
  async list(filters: { severity?: Severity; entityId?: string; eventType?: string; limit?: number } = {}) {
    const events = getDemoDataset().events.filter((event) =>
      (!filters.severity || event.severity === filters.severity) &&
      (!filters.entityId || event.entityId === filters.entityId) &&
      (!filters.eventType || event.eventType === filters.eventType)
    );
    return events.slice(0, filters.limit ?? 200);
  }

  async ingest(payload: EventPayload) {
    const { event } = ingestDemoEvent(payload);
    return { event };
  }
}

export class DynamoDBEventRepository extends DemoEventRepository {
  private readonly adapter = new DynamoDBEventAdapter();

  override async list(filters: { severity?: Severity; entityId?: string; eventType?: string; limit?: number } = {}) {
    if (!this.adapter.isConfigured()) return super.list(filters);
    if (filters.severity) return this.adapter.eventsBySeverity(filters.severity, filters.limit);
    return this.adapter.latestEvents("org_northstar", filters.limit);
  }

  override async ingest(payload: EventPayload) {
    const result = await super.ingest(payload);
    if (this.adapter.isConfigured()) await this.adapter.putEvent({ ...result.event, source: "dynamodb" });
    return result;
  }
}
