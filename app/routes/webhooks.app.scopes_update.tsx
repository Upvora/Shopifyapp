import type { Route } from "./+types/webhooks.app.scopes_update";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }: Route.ActionArgs) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  const current = payload.current as string[];
  if (session) {
    await prisma.session.update({
      where: { id: session.id },
      data: { scope: current.toString() },
    });
  }

  return new Response();
};
