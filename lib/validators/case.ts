import { z } from "zod";

export const caseNoteSchema = z.object({
  actor: z.string().min(2).max(120).default("Judge Demo Analyst"),
  body: z.string().min(2).max(1200)
});

export type CaseNotePayload = z.infer<typeof caseNoteSchema>;
