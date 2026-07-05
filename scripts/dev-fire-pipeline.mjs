/**
 * Dev helper: seed a demo Shop/Project/GenerationRun and fire the
 * store/generate.requested event at the local Inngest dev server, then poll
 * the run until it finishes. Mirrors what the app does when a merchant hits
 * "Generate" — useful for exercising the pipeline without a Shopify store.
 *
 * Usage:
 *   DATABASE_URL=... INNGEST_DEV=1 INNGEST_BASE_URL=http://127.0.0.1:8288 \
 *     node scripts/dev-fire-pipeline.mjs
 */
import { PrismaClient } from "@prisma/client";
import { Inngest } from "inngest";

const prisma = new PrismaClient();
const inngest = new Inngest({ id: "atelier" });

const shop = await prisma.shop.upsert({
  where: { domain: "atelier-demo.myshopify.com" },
  update: {},
  create: { domain: "atelier-demo.myshopify.com" },
});

const project = await prisma.project.create({
  data: {
    shopId: shop.id,
    name: "Snoozr — demo brand",
    archetype: "warm_craft",
    locale: "nl",
    brandKit: {
      palette: ["#2A2622", "#E8DCCB", "#B4593A"],
      typePair: "fraunces/inter",
      voice: { playfulSerious: 0.4, minimalRich: 0.7 },
    },
    status: "generating",
  },
});

const run = await prisma.generationRun.create({
  data: { projectId: project.id, kind: "full", status: "queued", steps: {} },
});

await inngest.send({
  name: "store/generate.requested",
  data: {
    shopDomain: shop.domain,
    projectId: project.id,
    runId: run.id,
    kind: "full",
  },
});
console.log(`Fired store/generate.requested for run ${run.id}`);

for (let i = 0; i < 30; i++) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const current = await prisma.generationRun.findUnique({
    where: { id: run.id },
  });
  console.log(`  status: ${current.status}`);
  if (current.status === "succeeded" || current.status === "failed") {
    console.log("steps:", JSON.stringify(current.steps, null, 2));
    break;
  }
}

await prisma.$disconnect();
