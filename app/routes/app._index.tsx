import { useFetcher } from "react-router";
import type { Route } from "./+types/app._index";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { inngest, pingEvent } from "../inngest/client.server";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { session } = await authenticate.admin(request);

  // Ensure a Shop record exists for this install (idempotent).
  const shop = await prisma.shop.upsert({
    where: { domain: session.shop },
    update: { uninstalledAt: null },
    create: { domain: session.shop },
  });

  const projects = await prisma.project.findMany({
    where: { shopId: shop.id },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return { shopDomain: session.shop, plan: shop.plan, projects };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { session } = await authenticate.admin(request);

  // Phase 0 acceptance check: one Inngest event round-trips.
  const { ids } = await inngest.send(
    pingEvent.create({
      shopDomain: session.shop,
      sentAt: new Date().toISOString(),
    }),
  );

  return { eventId: ids[0] };
};

export default function Index({ loaderData }: Route.ComponentProps) {
  const { shopDomain, plan, projects } = loaderData;
  const fetcher = useFetcher<typeof action>();
  const isPinging = fetcher.state !== "idle";

  return (
    <s-page heading="Atelier">
      <s-section heading="Welcome to Atelier">
        <s-paragraph>
          Turn a brand brief into a publish-ready, on-brand storefront. Atelier
          always creates a <s-text type="strong">new</s-text> theme — your
          existing themes are never touched, and everything it makes stays
          editable in Shopify&apos;s own theme editor.
        </s-paragraph>
        <s-paragraph>
          Installed on <s-text type="strong">{shopDomain}</s-text> · plan:{" "}
          <s-badge>{plan}</s-badge>
        </s-paragraph>
      </s-section>

      <s-section heading="Projects">
        {projects.length === 0 ? (
          <s-paragraph>
            No projects yet. The brand wizard (Phase 2) will live here: brand
            basics → logo &amp; colors → products → voice &amp; locale →
            generate.
          </s-paragraph>
        ) : (
          <s-unordered-list>
            {projects.map((project) => (
              <s-list-item key={project.id}>
                {project.name} — {project.status}
              </s-list-item>
            ))}
          </s-unordered-list>
        )}
      </s-section>

      <s-section heading="Pipeline status (Phase 0)">
        <s-paragraph>
          The generation pipeline is wired through Inngest with all nine steps
          stubbed. Fire a test event to verify the round-trip.
        </s-paragraph>
        <fetcher.Form method="post">
          <s-button
            type="submit"
            variant="primary"
            {...(isPinging ? { loading: true } : {})}
          >
            Send test event
          </s-button>
        </fetcher.Form>
        {fetcher.data?.eventId && (
          <s-paragraph>
            Event sent — id: <s-text type="strong">{fetcher.data.eventId}</s-text>
          </s-paragraph>
        )}
      </s-section>
    </s-page>
  );
}
