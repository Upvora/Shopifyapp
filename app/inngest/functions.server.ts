import prisma from "../db.server";
import {
  inngest,
  pingEvent,
  storeGenerateRequested,
} from "./client.server";

// Phase 0 acceptance: one event round-trips through Inngest.
export const ping = inngest.createFunction(
  { id: "atelier-ping", triggers: [pingEvent] },
  async ({ event }) => {
    return {
      message: `pong for ${event.data.shopDomain}`,
      receivedAt: new Date().toISOString(),
      sentAt: event.data.sentAt,
    };
  },
);

/**
 * The generation pipeline (PRD §8) — one step-function per run.
 *
 * Phase 0: every step is a stub that records itself in GenerationRun.steps.
 * Real implementations land per phase:
 *   Phase 2 — steps 1–3, 7–9 (wizard → tokens → plan → assemble → push)
 *   Phase 3 — steps 4–6 (copy, imagery, product enrichment)
 *
 * Budget: ≤ €2.50 target, €4.00 hard alarm per full run. Every step must
 * write its cost to CreditLedger once real engines are wired in.
 */
const PIPELINE_STEPS = [
  "intake.normalize", //  1. BrandSpec JSON            (sonnet)
  "brand.system", //      2. DesignTokens              (fable-5 flag / sonnet)
  "site.plan", //         3. SectionPlan               (fable-5 flag / sonnet)
  "copy.write", //        4. Per-section copy JSON     (sonnet, locale-native)
  "imagery.generate", //  5. Text-free brand imagery   (fal.ai, library fallback)
  "products.enrich", //   6. Draft copy/SEO/alt-text   (opt-in)
  "theme.assemble", //    7. settings_data + templates (local, lint + repair)
  "shopify.push", //      8. zip → signed URL → themeCreate
  "finalize", //          9. preview URL, notify, cost entry
] as const;

type StepRecord = Record<string, { status: string; startedAt: string }>;

export const storeGenerate = inngest.createFunction(
  {
    id: "store-generate",
    triggers: [storeGenerateRequested],
    concurrency: [
      { limit: 10 }, // global cap
      { limit: 1, key: "event.data.shopDomain" }, // per-shop
    ],
    onFailure: async ({ event }) => {
      const { runId } = event.data.event.data;
      await prisma.generationRun.update({
        where: { id: runId },
        data: {
          status: "failed",
          error: event.data.error.message,
          finishedAt: new Date(),
        },
      });
    },
  },
  async ({ event, step }) => {
    const { runId } = event.data;

    await step.run("run.start", async () => {
      await prisma.generationRun.update({
        where: { id: runId },
        data: { status: "running" },
      });
    });

    const stepResults: StepRecord = {};

    for (const name of PIPELINE_STEPS) {
      stepResults[name] = await step.run(name, async () => {
        // TODO(phase 2/3): real implementation per step. Stubs let the whole
        // pipeline round-trip end to end from day one.
        const startedAt = new Date().toISOString();
        await prisma.generationRun.update({
          where: { id: runId },
          data: {
            steps: { ...stepResults, [name]: { status: "stubbed", startedAt } },
          },
        });
        return { status: "stubbed", startedAt };
      });
    }

    await step.run("run.finish", async () => {
      await prisma.generationRun.update({
        where: { id: runId },
        data: {
          status: "succeeded",
          steps: stepResults,
          finishedAt: new Date(),
        },
      });
    });

    return { runId, steps: Object.keys(stepResults) };
  },
);

export const functions = [ping, storeGenerate];
