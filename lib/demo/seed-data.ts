import { buildDemoDataset } from "./generate-events";

export const seedDataset = buildDemoDataset({
  eventCount: 180,
  generatedAt: new Date("2026-06-16T03:00:00.000Z")
});
