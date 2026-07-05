import type { Route } from "./+types/webhooks.customers.redact";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

/**
 * GDPR: customers/redact.
 *
 * Atelier stores no customer records (PRD §13), so there is nothing to
 * delete for a specific customer. The request is recorded for audit.
 */
export const action = async ({ request }: Route.ActionArgs) => {
  const { shop, topic, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  await prisma.webhookEvent.create({
    data: { topic, shop, payload: (payload ?? {}) as object, processed: true },
  });

  return new Response();
};
