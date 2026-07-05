import type { Route } from "./+types/webhooks.app.uninstalled";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }: Route.ActionArgs) => {
  const { shop, session, topic, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Webhook requests can trigger multiple times and after an app has already
  // been uninstalled. If the session isn't found, the app is already gone.
  if (session) {
    await prisma.session.deleteMany({ where: { shop } });
  }

  // Mark the shop uninstalled; data is purged 30 days later (or immediately
  // on shop/redact). Themes Atelier created stay on the store — they're the
  // merchant's property (zero lock-in promise, PRD §7.6).
  await prisma.shop.updateMany({
    where: { domain: shop },
    data: { uninstalledAt: new Date() },
  });

  await prisma.webhookEvent.create({
    data: { topic, shop, payload: (payload ?? {}) as object, processed: true },
  });

  return new Response();
};
