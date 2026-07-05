import type { Route } from "./+types/webhooks.customers.data_request";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

/**
 * GDPR: customers/data_request.
 *
 * Atelier stores no customer PII (PRD §13 — PII minimalism: shop domain and
 * plan state only), so there is no customer data to compile. The request is
 * recorded for audit; a human follows up with the merchant if Shopify asks.
 */
export const action = async ({ request }: Route.ActionArgs) => {
  const { shop, topic, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  await prisma.webhookEvent.create({
    data: { topic, shop, payload: (payload ?? {}) as object, processed: true },
  });

  return new Response();
};
