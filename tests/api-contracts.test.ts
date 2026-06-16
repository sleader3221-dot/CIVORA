import { describe, expect, it } from "vitest";
import { eventPayloadSchema } from "@/lib/validators/event";
import { ingestDemoEvent, resetDemoDataset } from "@/lib/demo/store";
import { organizationId } from "@/lib/types";

describe("api contracts", () => {
  it("validates and ingests a suspicious event payload", () => {
    resetDemoDataset();
    const parsed = eventPayloadSchema.parse({
      organizationId,
      entityId: "acct_00",
      eventType: "high_value_transfer",
      amount: 12000,
      currency: "USD",
      metadata: {
        baselineAmount: 500,
        newDevice: true,
        priorPasswordReset: true,
        proxyLike: true
      }
    });
    const result = ingestDemoEvent(parsed);
    expect(result.event.id).toMatch(/^evt_api_/);
    expect(result.risk.score).toBeGreaterThanOrEqual(75);
  });
});
