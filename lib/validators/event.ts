import { z } from "zod";
import { eventTypes } from "@/lib/types";

export const eventPayloadSchema = z.object({
  organizationId: z.string().min(2),
  entityId: z.string().min(2),
  eventType: z.enum(eventTypes),
  amount: z.number().nonnegative().optional(),
  currency: z.string().length(3).optional(),
  ipAddress: z.string().min(3).optional(),
  deviceId: z.string().min(2).optional(),
  country: z.string().min(2).optional(),
  userAgent: z.string().max(500).optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.string().datetime().optional()
});

export type EventPayload = z.infer<typeof eventPayloadSchema>;
