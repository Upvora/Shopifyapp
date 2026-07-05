# PRD — Atelier: AI Store Designer for Shopify

| | |
|---|---|
| **Version** | 1.0 — 5 July 2026 |
| **Owner** | Andi (AndiBuilds) |
| **Builder** | Claude Code (Fable 5) |
| **Status** | Ready to build |
| **Working name** | Atelier — AI Store Designer *(verify name uniqueness on App Store before submission; must start with brand, ≤30 chars, no "Shopify" in name)* |

---

## 0. One-liner

Atelier turns a brand brief into a publish-ready, on-brand Shopify storefront in under 15 minutes — stores that don't look AI-generated, built for founders and agencies who actually care how their brand looks.

---

## 1. Why this wins

**The market reality (July 2026):** Shopify ships its own free AI store builder and Shopify Magic is included with every plan. The App Store already has multiple 4.7–4.9★ AI store builders (Forge, Atlas, DropMagic, BuildYourStore). Every single one targets **dropshippers testing products fast**. Their output is conversion-template-samey, their positioning is speed and cheapness, and Shopify's free native builder is eating that segment from below.

**Proof the category is winnable fast:** Forge launched 29 Oct 2025 from a small Lithuanian team ("The Logic Behind") and within ~8 months has 40 reviews at 4.9★ and the Built for Shopify badge, charging $24.99–$68.99/mo. A focused solo-speed operator can win a lane in this category in months.

**The open lane:** nobody serves the merchant who has a real brand — or the agency/freelancer building stores for clients — with output that has actual design taste. That's the wedge.

**Atelier's four moats:**

1. **Design constitution, not model vibes.** tasteskill v2 (`design-taste-frontend`) encoded as hard generation constraints + automated validators. Output quality is enforced, not hoped for.
2. **Native and portable — zero lock-in.** Atelier generates a standard Online Store 2.0 theme the merchant can keep editing in Shopify's own customizer forever, even after uninstall. Competitors lock merchants into their proprietary editors. This is the #1 listing differentiator.
3. **Locale-native copy (EN / NL / FR / DE).** The US tools write English. Benelux + DACH SMBs are underserved. This is also the Leppo client pipeline.
4. **Agency workflow.** Brand kits, client preview links, white-label handoff. Nobody in the category serves the "I build stores for clients" persona. Andi *is* this persona — permanent dogfood loop.

**Anti-goals (never build):** product sourcing, dropship spy tools, AliExpress import, fake reviews/testimonials generation, checkout modifications, becoming a generic page builder.

---

## 2. Users

**P1 — Brand-led founder.** Has real products (own brand or curated), hates that their store looks like a template, can't afford a €3–8k agency build. Willing to pay $29–79/mo. Success = "people compliment my site."

**P2 — Freelancer / agency.** Builds client stores, needs to compress a 2-week build into 2 days without output looking cheap. Needs brand kits, client previews, white-label. $199/mo is trivially ROI-positive against one client invoice.

**Non-target:** dropship product-testers spinning 10 stores/month on $20 budgets. Forge and Atlas own them; let them.

---

## 3. Product principles

1. **Design constitution over model creativity.** The model fills a constrained system; it doesn't freestyle.
2. **Create, never mutate.** Atelier always creates a *new* theme. It never touches the merchant's existing themes. Kills the entire "app broke my store" failure class and de-risks review.
3. **Publish is explicit and reversible.** Publishing requires a confirmation dialog; the previous theme stays in the merchant's library untouched.
4. **Truthful by default.** No fabricated testimonials, review counts, fake stats, or false urgency — ever. (App Store requires apps to be "secure, truthful"; it's also just correct for brand-led merchants.) Testimonial sections generate as clearly-labeled editable placeholders.
5. **Text lives in HTML, never in images.** All generated imagery is text-free. Copy is real, editable, translatable HTML.
6. **Generation never hard-fails.** Every step has a fallback (curated asset library, template copy). A merchant always gets a complete store.

---

## 4. Scope

### 4.1 MVP — target: 3 weeks build, submit for review end of week 3

- Embedded admin app (React Router v7 official template, App Bridge, Polaris web components)
- **Onboarding wizard:** brand basics → logo/colors → products → locale/voice → generate
- **Brand Kit:** logo upload → palette extraction; type pairing from curated whitelist; voice sliders; archetype pick (Editorial / Minimal / Warm Craft / Bold Street / Clinical Premium)
- **Full store generation:** homepage, product template, collection template, about, contact, FAQ, header/footer nav, fully tokenized `settings_data.json` theming
- Works with merchant's **existing products**; optional AI enrichment of titles/descriptions/SEO/alt-text (written as drafts, merchant approves)
- **Generated imagery:** hero, banners, textures — text-free, brand-tinted — uploaded via Files API
- **Preview:** unpublished theme + Shopify preview link, shareable with clients
- **Remix:** per-section regenerate with direction chips ("more minimal", "warmer", "bolder type") + inline copy edit
- **Publish flow:** plan gate → Shopify-hosted plan selection → confirm dialog → `themePublish`
- **Billing:** 4 plans via Shopify App Pricing, credits enforced in-app
- **Compliance:** GDPR webhook trio, `app/uninstalled`, clean uninstall, privacy policy
- **Locales:** copy generation in EN, NL, FR, DE

### 4.2 v1.1 (weeks 4–8)

- Brand kit library — save/reuse across projects (agency core loop)
- White-label client handoff PDF + branded client preview links
- Bulk product copy rewriter
- Image credit packs via App Events API usage meters (once verified — note: App Pricing meters don't currently support usage caps, so validate merchant-protection UX first)
- A/B homepage variants
- Workspace layer (email-linked account connecting multiple shop installs for agencies)

### 4.3 Later

- AI product photography studio (compositing pipeline — productize the Snoozr workflow)
- Full multi-language storefronts via Translate & Adapt integration
- CRO audit mode for existing stores (analysis → redesign upsell)

### 4.4 Explicitly out of scope

Product sourcing, checkout, email marketing, reviews, POS, anything requiring `read_orders`.

---

## 5. User flows

### 5.1 Onboard & generate
1. Install → OAuth → land on welcome (embedded)
2. Wizard step 1 — Brand: store name, one-line description, industry, archetype pick (visual cards, one tap)
3. Step 2 — Look: upload logo (palette auto-extracted, editable swatches) or pick palette; type pairing auto-suggested from archetype, override allowed
4. Step 3 — Products: pick featured collections/products from their catalog; toggle "improve my product copy too" (default off); "no products yet" → generate 6 draft placeholder products clearly marked DRAFT
5. Step 4 — Voice & locale: tone sliders (playful↔serious, minimal↔rich), store language (EN/NL/FR/DE)
6. Generate → progress screen

### 5.2 Generation progress
Step states with live status: Brand system → Layout plan → Copywriting → Imagery → Assembly → Pushing to Shopify. ETA shown. Cancel allowed. Failures resume from last completed step — never restart from zero.

### 5.3 Review & remix
Split view: theme preview iframe + section rail. Per section: **Regenerate** (direction chips), **Edit copy** (inline, writes to template JSON via `themeFilesUpsert`), **Swap image** (regenerate or upload own). Global: "Open in Shopify editor" button (reinforces zero-lock-in). Remix budget tracked per plan.

### 5.4 Publish
Publish button → plan gate. Free plan → Shopify-hosted plan selection page (App Pricing) → return with redirect params → verify subscription via Partner API → confirm dialog: *"This makes [Atelier — Brandname] your live theme. Your current theme stays in your library."* → `themePublish` → success screen with launch checklist (domain, payments, shipping, legal pages).

### 5.5 Agency (MVP-lite)
Projects list per shop; Agency plan raises limits + unlocks white-label handoff + client share links. Cross-shop brand kit sharing ships in v1.1 via workspace layer; MVP workaround: brand kit export/import as JSON.

---

## 6. Architecture

```
Merchant (Shopify admin iframe)
   │  App Bridge + Polaris web components
   ▼
React Router v7 app (official Shopify template) ── Railway
   │            │                    │
   │ Prisma     │ Inngest events     │ GraphQL Admin API
   ▼            ▼                    ▼
Supabase PG   Inngest Cloud      Shopify (themes, products,
(sessions,    (generation          pages, menus, files)
 projects,     pipeline)
 ledger)         │
                 ├── Anthropic API (copy, planning)
                 ├── fal.ai (imagery)
                 └── Supabase Storage (theme zips, signed URLs)
```

**Stack decisions (locked):**
- **Framework:** official `shopify-app-template-react-router` (embedded, App Bridge, Polaris web components). This is Shopify's recommended 2026 path; Remix template is legacy.
- **Host:** Railway (long-lived Node server → predictable webhook latency, no cold starts; Andi already operates Railway).
- **DB:** Supabase Postgres via Prisma; sessions via `@shopify/shopify-app-session-storage-prisma`.
- **Jobs:** Inngest. Generation = one step-function per run. Per-shop concurrency 1, global cap 10, step timeouts, automatic retries.
- **LLM:** Anthropic API. Default `claude-sonnet-4-6` for copy/enrichment; `claude-fable-5` behind a config flag for the design-plan step (steps 2–3) where taste matters most. All structured outputs zod-validated with one auto-repair retry.
- **Images:** fal.ai behind a thin adapter (model-agnostic; pick the current best price/quality flux-class model at build time). Hard fallback: curated gradient/texture library shipped in-repo so generation never fails on images.
- **Theme packaging:** base theme lives in repo → per-project zip assembled server-side → uploaded to Supabase Storage → signed URL → `themeCreate(source)`.

**Env vars:** `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `DATABASE_URL`, `ANTHROPIC_API_KEY`, `FAL_KEY`, `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `APP_URL`.

---

## 7. Shopify integration spec

### 7.1 App config (`shopify.app.toml`)
- `embedded = true`
- **Scopes (request the minimum; confirm exact handles via Shopify Dev MCP):** `read_products`, `write_products`, `read_themes`, `write_themes`, `read_content`, `write_content`, `read_files`, `write_files`, `read_online_store_navigation`, `write_online_store_navigation`, `read_locales`
- **Webhooks (declared in TOML, HMAC-verified):** `app/uninstalled`, `customers/data_request`, `customers/redact`, `shop/redact`

### 7.2 ⚠️ CRITICAL PATH — `write_themes` exemption
`themeCreate`, `themeFilesUpsert`, and `themePublish` require the `write_themes` scope **plus a Shopify-granted exemption** obtained via an exception request. Public store-builder apps demonstrably hold this exemption (Forge's published data-access list includes "Edit Online Store: pages, theme"), but it is an approval step Shopify controls.

**Action, Day 1 of build:** submit the exception request with a narrow, review-friendly use case: *"AI store designer that creates NEW themes only; never modifies the merchant's existing themes; publishing is an explicit merchant-confirmed action."* Build against a development store while pending (dev stores work). Track as top risk (§17).

### 7.3 Auth
Managed installation / token exchange as provided by the template. Note: Shopify moved to **expiring offline access tokens** (policy effective April 2026) — keep `@shopify/shopify-app-react-router` current and never cache tokens outside session storage.

### 7.4 Theme strategy — "Atelier Base"
- Fork Shopify's open-source reference theme (Dawn or Horizon — Claude Code: verify current license terms at fork time), strip to skeleton, extend with **~24 opinionated sections**, each with a rich settings schema.
- **Every visual decision is a token** in `config/settings_data.json`: colors, type, spacing scale, radius, button style. The AI writes tokens, not CSS.
- **The AI writes ONLY JSON at runtime:** `config/settings_data.json`, `templates/*.json`, `sections/header-group.json`, `sections/footer-group.json`, locale strings. **No runtime Liquid generation.** Quality is deterministic and Theme Check passes by construction.
- Remix = `themeFilesUpsert` of only the affected JSON files (≤50 files/request, batch accordingly).
- New themes are created with role `UNPUBLISHED`; `themePublish` only on explicit merchant confirmation.

### 7.5 Content APIs
- Pages: `pageCreate` for About / Contact / FAQ
- Navigation: `menuCreate` / `menuUpdate` for header + footer menus
- Products: `productUpdate` for opt-in enrichment (descriptionHtml, SEO, media alt) — batches of ≤10, exponential backoff on `THROTTLED`, respect GraphQL cost limits
- Files: `stagedUploadsCreate` + `fileCreate` for generated imagery → reference CDN URLs in theme settings

### 7.6 Uninstall & data lifecycle
`app/uninstalled` → invalidate tokens, mark shop uninstalled. **Leave all themes intact** — they're standard themes and the merchant's property (this is the zero-lock-in promise). Purge shop data 30 days post-uninstall. GDPR redact webhooks purge immediately and ack within spec.

---

## 8. Generation pipeline (Inngest fn: `store/generate`)

| # | Step | Output | Engine | Budget | Fallback |
|---|------|--------|--------|--------|----------|
| 1 | `intake.normalize` | BrandSpec JSON | sonnet-4-6 | $0.02 | re-ask wizard |
| 2 | `brand.system` | DesignTokens (palette via node-vibrant + rules; type pair from whitelist; WCAG AA validated) | fable-5 flag / sonnet | $0.10 | archetype defaults |
| 3 | `site.plan` | SectionPlan (sequence from allowed compositions per archetype) | fable-5 flag / sonnet | $0.05 | archetype default plan |
| 4 | `copy.write` | Per-section copy JSON, locale-native, voice-tuned | sonnet-4-6 | $0.30–0.60 | — (retry ×2) |
| 5 | `imagery.generate` | 8–16 text-free brand-tinted images | fal.ai | $0.30–0.80 | curated library |
| 6 | `products.enrich` (opt) | Draft copy/SEO/alt-text | sonnet-4-6 | $0.10–0.40 | skip |
| 7 | `theme.assemble` | settings_data + templates; Theme Check + schema + contrast lint; auto-repair ×2 | local | — | repair loop |
| 8 | `shopify.push` | zip → signed URL → `themeCreate`; poll job | GraphQL | — | retry ×3 |
| 9 | `finalize` | preview URL, notify, cost entry | — | — | — |

**Targets:** p50 wall-clock ≤ 8 min, p95 ≤ 15 min. **Cost per full run ≤ €2.50 target, €4.00 hard alarm.** Every step writes tokens/images/cost to `CreditLedger`. Copy in step 4 passes a banned-content validator: no invented reviews, ratings, statistics, awards, or countdown-scarcity claims.

---

## 9. Design constitution (tasteskill v2, machine-enforced)

- Install in repo: `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"` — Claude Code reads it before building the base theme and encodes it two ways:
  - **(a) System prompts** for steps 2–4 (the model designs inside the ruleset)
  - **(b) Validators** in step 7 (violations are bugs, not opinions)
- **Whitelists:** 5 archetypes × palette-derivation rules; 12 approved type pairings; one spacing scale; radius rules per archetype.
- **Hard bans (validated):** default-purple gradients; emoji in headings; >2 typefaces; text below WCAG AA contrast; text over busy imagery without scrim; center-aligned long body copy; lorem ipsum; stock-cliché image prompts.
- **Imagery art direction:** text-free always; consistent color grade per brand; no generated humans by default (uncanny risk) — human-led archetypes use the curated library instead.
- **Composition rules:** never two adjacent full-bleed image sections; alternate section density; hero pattern fixed per archetype.

---

## 10. Billing & plans

All merchant charges go through **Shopify App Pricing** exclusively (any external charging = automatic review rejection). Plans configured once in the Partner Dashboard; Shopify hosts plan selection, trials, proration, plan switching.

| Plan | Price | Includes |
|------|-------|----------|
| **Free — Preview** | $0 | 2 generations, preview only (theme name carries "Preview" tag), no publish, no product writes |
| **Launch** | $29/mo · $290/yr | 1 active project, publish, 3 full gens/mo, 30 remixes/mo, 150 image credits, all archetypes + locales |
| **Studio** | $79/mo · $790/yr | 3 projects, 10 gens/mo, 500 credits, brand kit save/reuse, priority queue |
| **Agency** | $199/mo · $1,990/yr | 10 projects, 30 gens/mo, 1,500 credits, white-label handoff, client links, priority support |

7-day free trial on all paid tiers. Annual = ~17% off (category convention — Forge does the same).

**Anchoring:** Forge charges $24.99 / $38.99 / $68.99 for dropship-grade output. Atelier prices above on design + agency value; free preview tier drives install volume and App Store ranking.

**Mechanics:**
- **Subscriptions only in MVP.** App Pricing usage meters don't currently support caps — a runaway-usage-bill risk we won't put on merchants. Image credits are enforced in-app; hitting the limit prompts upgrade. Metered credit packs revisit in v1.1.
- **Subscription state:** App Pricing sends **no webhooks** (post-April 2026); verify on redirect params returning from the plan page + query the Partner API Active Subscription endpoint + hourly reconcile job for cancels/freezes.
- Use the **$0 private test plan** for all billing testing pre-launch.
- Feature gating = one middleware reading cached plan state (revalidated hourly + on every billing redirect).

**Economics:** 0% Shopify rev share on the first $1M lifetime gross (register once, $19), 15% above; 2.9% processing fee on all billing — bake into margin math. At ≤€2.50/gen COGS, Launch at $29 with ~3 gens/mo holds >70% gross margin.

---

## 11. Data model (Prisma sketch)

```prisma
model Shop {
  id            String   @id @default(cuid())
  domain        String   @unique
  installedAt   DateTime @default(now())
  uninstalledAt DateTime?
  plan          String   @default("free")
  planSyncedAt  DateTime?
  projects      Project[]
  ledger        CreditLedger[]
}

model Project {
  id           String   @id @default(cuid())
  shopId       String
  name         String
  archetype    String
  locale       String   @default("en")
  brandKit     Json     // tokens: palette, type pair, voice, logo file GID
  themeGid     String?  // gid://shopify/OnlineStoreTheme/...
  status       String   @default("draft") // draft|generating|preview|published|failed
  runs         GenerationRun[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  shop         Shop     @relation(fields: [shopId], references: [id])
}

model GenerationRun {
  id         String   @id @default(cuid())
  projectId  String
  kind       String   // full | section_remix | product_enrich
  status     String   // queued|running|succeeded|failed|cancelled
  steps      Json     // per-step status, timings, costs
  costCents  Int      @default(0)
  error      String?
  createdAt  DateTime @default(now())
  finishedAt DateTime?
  project    Project  @relation(fields: [projectId], references: [id])
}

model CreditLedger {
  id        String   @id @default(cuid())
  shopId    String
  kind      String   // generation | remix | image
  delta     Int      // negative = spend
  runId     String?
  createdAt DateTime @default(now())
  shop      Shop     @relation(fields: [shopId], references: [id])
}

model WebhookEvent {
  id        String   @id @default(cuid())
  topic     String
  shop      String
  payload   Json
  processed Boolean  @default(false)
  createdAt DateTime @default(now())
}
// + Session model from the Shopify template (do not modify)
```

---

## 12. Analytics & KPIs

**Events:** `install`, `wizard_complete`, `gen_start|success|fail`, `preview_view`, `remix`, `publish_gate_hit`, `plan_selected`, `publish_success`, `uninstall`, `review_prompt_shown`.

**Day-60 targets:** install→generation 70% · generation success ≥97% · preview→publish 25% · trial→paid 40% · D30 logo churn <7% · ≥15 App Store reviews at ≥4.8★ (in-app review ask fires on publish-success high, never on failure paths).

---

## 13. Security & compliance

Session-token auth on every route (template default) · webhook HMAC verification · CSP `frame-ancestors` headers via template helpers · **no popups** for OAuth or billing (review requirement) · PII minimalism: store shop domain + plan state, avoid storing owner PII · GDPR webhook handlers perform real deletion, acked in-spec · no third-party cookies · secrets in Railway env, tokens only in session storage · structured logs with redaction.

---

## 14. App Store review — pass-first-time checklist

Reality check on timing: official SLA is 5–10 business days; the community has documented 30+ day waits in 2026. Submit end of week 3 and **do not block the launch motion on approval** (see §15). The two categories behind ~60% of all rejections are missing GDPR webhooks and broken billing flows — they're items 1 and 2 for a reason.

- [ ] GDPR trio implemented, HMAC-verified, tested with curl against prod URL
- [ ] Billing exclusively via App Pricing; decline, cancel, and reinstall paths all re-prompt correctly
- [ ] Full flow tested in incognito with devtools console open — **zero console errors** (reviewers do exactly this)
- [ ] Embedded auth + session tokens correct; no OAuth deviations
- [ ] App name "Atelier — AI Store Designer": brand-first, unique, ≤30 chars, no "Shopify"
- [ ] Icon: bold, simple, no text/screenshots/Shopify marks
- [ ] Privacy policy at a real URL; support email + docs page live
- [ ] Demo screencast recorded; reviewer demo store seeded with products + a finished generation
- [ ] Listing promises nothing that isn't shipped (misleading content = rejection)
- [ ] Admin routes p95 < 500ms; app adds zero storefront scripts (theme is static — inherently clean Lighthouse story)
- [ ] `write_themes` exemption granted (§7.2) — confirm before submission
- [ ] App Store registration completed ($19, unlocks 0%-to-$1M rev share)

---

## 15. Go-to-market

**Weeks 0–3 (build):** dogfood in parallel — regenerate **Snoozr** + **2 Leppo client stores** via custom-app installs on real stores (custom apps need no review). Output = 3 real before/afters, the entire launch asset kit.

**Pairstack arc:** this build *is* the content. "Building an AI store designer in public, 21 days, with Claude Code" — devlog thread + shorts per phase gate. Launch post lands the day the listing goes live.

**Submission:** end of week 3, with the §14 checklist green. While review runs: keep shipping v1.1, keep dogfooding, warm the waitlist from Pairstack.

**On approval:** listing SEO (5 terms, one idea each: `ai store builder`, `store design`, `theme design`, `brand kit`, `ai copywriting`) · founding-member annual deal (first 50 installs) · seed installs from the Leppo client base for early reviews · in-app review ask post-publish-success only.

---

## 16. Build plan for Claude Code (Fable 5)

> **Standing instructions:** Install and use the **Shopify Dev MCP** (`@shopify/dev-mcp`) for every GraphQL operation — never guess schema. Read `design-taste-frontend` (tasteskill v2) before Phase 1. Read shopify.dev pages for: App Pricing, theme mutations, App Store requirements. Confirm all scope handles against the live schema.

**Phase 0 — Foundation (Day 1–2)**
`shopify app init --template=https://github.com/Shopify/shopify-app-template-react-router` → wire Supabase Postgres + Prisma → deploy skeleton to Railway → `shopify app dev` loop working → **submit the `write_themes` exception request** (§7.2) → Inngest connected with a hello-world function.
✅ *Accept:* app installs on dev store, embedded page renders, one Inngest event round-trips.

**Phase 1 — Atelier Base theme (Day 3–6)**
Fork reference theme, strip, tokenize all visual decisions into settings, build 24 sections across the 5 archetypes, Theme Check green in CI.
✅ *Accept:* manually assembled settings_data + templates produce 5 distinct, taste-passing demo stores.

**Phase 2 — Pipeline skeleton (Day 7–9)**
Steps 1–3 + 7–9 with stubbed copy/images: wizard → BrandSpec → tokens → plan → assemble → zip → `themeCreate` → preview link.
✅ *Accept:* end-to-end generation lands an unpublished theme on the dev store in <5 min.

**Phase 3 — Real generation (Day 10–14)**
Anthropic copy step (locale-aware, schema-validated, banned-content filter), fal.ai imagery + library fallback, Files API upload, section remix via `themeFilesUpsert`, product enrichment drafts.
✅ *Accept:* 10 consecutive full runs, ≥97% step success, cost ledger accurate, all 4 locales produce native-quality copy (spot-check NL/FR yourself).

**Phase 4 — Billing + compliance (Day 15–18)**
App Pricing plans configured, $0 private test plan verified, plan gate middleware, Partner API subscription verification + hourly reconcile, GDPR trio + uninstall handler, telemetry events.
✅ *Accept:* full billing lifecycle (subscribe/decline/cancel/reinstall) passes on the test plan; GDPR curl tests ack correctly.

**Phase 5 — Polish + submit (Day 19–21)**
Empty/error/loading states, onboarding copy, listing assets (icon, screenshots, screencast), reviewer demo store, §14 checklist sweep, incognito console-clean pass, submit.
✅ *Accept:* every §14 box checked; submission confirmed.

---

## 17. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| `write_themes` exemption slow/denied | Med | Request Day 1 with narrow "create-only, never-mutate" use case; incumbents prove it's granted for this category. Plan B: assisted flow — app renders theme zip for merchant-side upload (degraded, shippable). Plan C: pivot to premium AI sections library (Phase 1 assets reusable). |
| Review takes 30+ days | Med-High | Launch motion runs on custom-app dogfood installs + Pairstack audience; approval is upside timing, not a dependency. |
| Shopify expands its free native builder | High (eventually) | It will stay generic. Moats: design depth, agency workflow, locales, brand kits. Move upmarket, never compete on free-and-fast. |
| Generation cost creep | Med | Per-run budgets + €4 alarm, model routing (sonnet default), image count caps per plan. |
| AI-copy quality dips in NL/FR | Low-Med | Andi native-checks; per-locale prompt tuning; human-edit affordance is first-class anyway. |
| One-recurring-charge-per-app constraint on plan switches | Low | Handled natively by App Pricing plan replacement/proration. |

---

## 18. Open questions (resolve during Phase 0, don't block)

1. Final name — check App Store uniqueness for "Atelier" (category is crowded with generic names; brand-first requirement helps).
2. Seed placeholder products for no-catalog merchants in MVP, or gate behind "add products first"? (Current call: yes, 6 clearly-marked drafts.)
3. Founding deal: annual-only at 30% off, or lifetime-price-lock? (Current call: annual-only.)
4. Workspace/multi-store account layer — confirm v1.1, not MVP.
