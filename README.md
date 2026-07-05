# Atelier — AI Store Designer for Shopify

Turns a brand brief into a publish-ready, on-brand Shopify storefront in under
15 minutes. Atelier always creates a **new** Online Store 2.0 theme — it never
modifies the merchant's existing themes, and everything it generates stays
editable in Shopify's own theme editor forever (zero lock-in).

See `docs/PRD-atelier-ai-store-designer.md` for the full product spec.

## Status — Phase 0 (Foundation)

- [x] React Router v7 app scaffold (embedded, App Bridge, Polaris web components)
- [x] Prisma data model: `Session`, `Shop`, `Project`, `GenerationRun`, `CreditLedger`, `WebhookEvent`
- [x] Inngest wired: `atelier/ping` round-trip + `store/generate.requested` step function with all 9 pipeline steps stubbed (per-shop concurrency 1, global cap 10)
- [x] Webhooks: `app/uninstalled`, `app/scopes_update` + GDPR trio (`customers/data_request`, `customers/redact`, `shop/redact`) with real deletion
- [ ] Deployed to Railway
- [ ] Installed on a development store
- [ ] **`write_themes` exemption requested** ← do this on Day 1, see below

### ⚠️ Day-1 manual action: `write_themes` exemption (PRD §7.2)

`themeCreate`, `themeFilesUpsert`, and `themePublish` require the
`write_themes` scope **plus a Shopify-granted exemption** via an exception
request in the Partner Dashboard. Submit it with this use case:

> AI store designer that creates NEW themes only; never modifies the
> merchant's existing themes; publishing is an explicit merchant-confirmed
> action.

Development stores work while the request is pending. Track as top risk.

## Stack

| Layer | Choice |
|---|---|
| Framework | React Router v7 (official Shopify app template pattern), embedded, Polaris web components |
| Host | Railway (long-lived Node server) |
| DB | Supabase Postgres via Prisma; sessions via `@shopify/shopify-app-session-storage-prisma` |
| Jobs | Inngest (`store/generate` step function; per-shop concurrency 1, global cap 10) |
| LLM | Anthropic API (Phase 3) |
| Images | fal.ai behind a thin adapter, curated library fallback (Phase 3) |

## Getting started

1. Create the app in the Shopify Partner Dashboard, then link it:

   ```sh
   npm install
   npm run config:link   # fills client_id into shopify.app.toml
   ```

2. Copy `.env.example` to `.env` and fill in credentials (Supabase, Inngest).

3. Run migrations and start the dev loop:

   ```sh
   npx prisma migrate dev
   npm run dev           # shopify app dev (tunnel + install on dev store)
   ```

4. Start the Inngest dev server alongside for local pipeline runs:

   ```sh
   npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
   ```

The dashboard's **Send test event** button verifies the Inngest round-trip
(Phase 0 acceptance).

## Repo layout

```
app/
  shopify.server.ts          Shopify app config (auth, sessions, webhooks)
  db.server.ts               Prisma client singleton
  inngest/
    client.server.ts         Inngest client + typed events
    functions.server.ts      ping + store/generate pipeline (9 steps, stubbed)
  routes/
    _index/                  Public landing + login form
    auth.$.tsx, auth.login/  OAuth / token exchange
    app.tsx, app._index.tsx  Embedded admin app (Polaris web components)
    api.inngest.tsx          Inngest serve endpoint
    webhooks.*.tsx           Uninstall, scopes update, GDPR trio
prisma/schema.prisma         Data model (PRD §11)
shopify.app.toml             Scopes + webhook subscriptions (PRD §7.1)
docs/                        PRDs
```

## Build phases (PRD §16)

0. **Foundation** — this scaffold, Railway deploy, `write_themes` request ✅ (code part)
1. **Atelier Base theme** — fork reference theme, tokenize, 24 sections, 5 archetypes
2. **Pipeline skeleton** — wizard → BrandSpec → tokens → plan → assemble → `themeCreate`
3. **Real generation** — Anthropic copy, fal.ai imagery, remix, product enrichment
4. **Billing + compliance** — App Pricing plans, plan gate, reconcile job, telemetry
5. **Polish + submit** — listing assets, demo store, review checklist (PRD §14)
