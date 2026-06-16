import { describe, expect, it } from "vitest";
import { scoreEvent } from "@/lib/risk/engine";
import { organizationId } from "@/lib/types";

describe("risk engine", () => {
  it("creates a critical, explainable score for a new-device high-value payment", () => {
    const risk = scoreEvent({
      organizationId,
      entityId: "acct_00",
      eventType: "new_device_payment",
      amount: 9800,
      currency: "USD",
      country: "RU",
      metadata: {
        baselineAmount: 500,
        failedLoginCount15m: 8,
        ipEntityCount: 5,
        chargebackHistory: true,
        priorPasswordReset: true,
        countryMismatch: true,
        proxyLike: true,
        newDevice: true
      }
    });

    expect(risk.score).toBe(100);
    expect(risk.severity).toBe("critical");
    expect(risk.reasonCodes).toContain("NEW_DEVICE_HIGH_VALUE");
    expect(risk.recommendedAction).toMatch(/Open critical case/);
  });
});
