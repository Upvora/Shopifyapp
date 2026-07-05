import type { Route } from "./+types/webhooks.shop.redact";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

/**
 * GDPR: shop/redact — sent 48 hours after uninstall.
 *
 * Performs real deletion (PRD §13): all projects, generation runs, credit
 * ledger entries, sessions, and the shop record itself are purged
 * immediately. Themes already on the store are the merchant's property and
 * live in Shopify, not here.
 */
export const action = async ({ request }: Route.ActionArgs) => {
  const { shop, topic, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  const shopRecord = await prisma.shop.findUnique({ where: { domain: shop } });

  if (shopRecord) {
    await prisma.$transaction([
      prisma.generationRun.deleteMany({
        where: { project: { shopId: shopRecord.id } },
      }),
      prisma.project.deleteMany({ where: { shopId: shopRecord.id } }),
      prisma.creditLedger.deleteMany({ where: { shopId: shopRecord.id } }),
      prisma.shop.delete({ where: { id: shopRecord.id } }),
    ]);
  }

  await prisma.session.deleteMany({ where: { shop } });

  await prisma.webhookEvent.create({
    data: { topic, shop, payload: (payload ?? {}) as object, processed: true },
  });

  return new Response();
};
