import { Inngest, eventType } from "inngest";
import { z } from "zod";

export const pingEvent = eventType("atelier/ping", {
  schema: z.object({
    shopDomain: z.string(),
    sentAt: z.string(),
  }),
});

export const storeGenerateRequested = eventType("store/generate.requested", {
  schema: z.object({
    shopDomain: z.string(),
    projectId: z.string(),
    runId: z.string(),
    kind: z.enum(["full", "section_remix", "product_enrich"]),
  }),
});

export const inngest = new Inngest({ id: "atelier" });
