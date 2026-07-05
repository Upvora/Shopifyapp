# PRD — Mysterybot: AI Mystery Shopper for Shopify

| | |
|---|---|
| **Version** | 1.0 — 5 July 2026 |
| **Owner** | Andi (AndiBuilds) |
| **Builder** | Claude Code (Fable 5) |
| **Status** | Ready to build |
| **Working name** | Mysterybot — AI Mystery Shopper *(check App Store name collision before submission; brand-first, ≤30 chars, no "Shopify")* |
| **Sibling doc** | `PRD-atelier-ai-store-designer.md` — shared stack, shared review checklist (§14 there applies verbatim here) |

---

## 0. One-liner

Paste your store URL. An AI shopping agent tries to actually buy something. You get back a watchable replay of exactly where it succeeded, struggled, or gave up — plus a score, a fix list, and ongoing monitoring so an update never silently kills your AI sales again.

---

## 1. Why this wins

**The wave (verified July 2026):**
- Shopify auto-activated Agentic Storefronts for 2M+ US stores in March 2026 — every merchant is inside ChatGPT / Copilot / Gemini / Google AI Mode by default, most without knowing it.
- Q1 2026: AI-driven traffic to Shopify stores grew 8× YoY, AI-sourced orders grew ~13×. AI traffic now converts **42% better** than non-AI traffic with **37% higher revenue per visit**.
- OpenAI retired Instant Checkout in March 2026. The settled model: **discovery happens in chat, checkout happens on the merchant's own site.** The merchant's storefront is now the bottleneck.
- Documented failure modes merchants can't see: a ChatGPT agent stopped mid-purchase by a CAPTCHA; bot-defense systems blocking legitimate AI buyers; JS-heavy themes hiding price/stock from agents; Shopify itself flip-flopping its default robots.txt on AI checkout agents within weeks.
- Attribution is broken: ~70% of AI referrals are invisible in GA4; AI contribution undercounted 3–4×.
- Forrester's read on merchant psychology: *"Nobody has figured it out, but everyone has FOMO."*

**The crowded lane (do NOT enter):** the "AI visibility" category — llms.txt generators, JSON-LD injectors, citation trackers (GEORank, FSEO, Avada AEO, ShopRank, RankTail, LLM Rank, Surfient, IndexGPT…). 10+ apps, some Built for Shopify. They all answer *"does AI mention you."*

**The open lane (this product):** nobody merchant-facing answers *"can an AI agent actually complete a purchase journey on your store, and where exactly does it die."* The closest things are a dev-facing UCP protocol validator ($9/mo, JSON-manifest nerd territory) and a readiness scanner Shopware built for its own ecosystem — which proves the format resonates and proves Shopify-native whitespace.

**Moats:**
1. **The replay.** Everyone else ships dashboards; Mysterybot ships a *watchable journey with the agent's deadpan inner monologue*. A video of an AI giving up at your cookie popup out-shares any score.
2. **Dynamic truth vs static guessing.** GEO apps infer readiness from files; Mysterybot observes actual agent behavior. When they disagree, we're right.
3. **The test corpus.** Snoozr + the Leppo client portfolio (Cliniza, Perla, Dakwerken Antony, Bellini, Ronin) = real stores for calibration before anyone else sees the tool.
4. **Honesty as brand.** No bypassing, no fake precision, published methodology. In a category full of "guaranteed ChatGPT rankings" snake oil, the credible lab wins.

**Anti-goals:** never bypass security, never complete purchases, never promise rankings/citations, never become llms.txt-injector #15 (fixes exist only to close gaps the agent *found*).

---

## 2. Users

**P1 — Shopify merchant (any size, US-selling first).** Just learned they're "in ChatGPT" and has zero idea what that means. Fear: invisible lost sales. Wants: a verdict in plain language and a fix list.

**P2 — Agency / freelancer.** Wants a client-facing audit that sells retainers and rebuilds. White-label PDF = pitch weapon. (This is Leppo. Permanent dogfood.)

**P3 — The sharer (not a buyer, still critical).** Creators and ecom-Twitter/LinkedIn posters running famous brands through it for content. They ARE the distribution.

---

## 3. Product principles

1. **Show, don't score.** The replay is the product; the number is the caption.
2. **A block is a finding, never a challenge.** CAPTCHA, WAF, bot-wall → record, explain, stop. Zero circumvention, ever.
3. **Never buy, never touch payment.** The agent abandons before payment entry by hard design, on every store, every mode.
4. **Two-tier depth by ownership.** Unowned domains get a read-only journey. Verified owners unlock deep simulation. (Respectful *and* an upgrade incentive.)
5. **Truthful numbers only.** Revenue-opportunity figures are labeled estimates with visible assumptions and ranges — never fake precision.
6. **The bot is polite.** Identified crawler UA, honored opt-outs, strict rate limits, minimal page loads.

---

## 4. Product surfaces (two-front structure)

| Surface | What | Ships | Review needed |
|---|---|---|---|
| **A. Web tool** (mysterybot domain) | Free scanner + replay + leaderboard + agency workspace | **Week 1** | None — pure web app |
| **B. Shopify app** | Continuous monitoring, alerts, AI-traffic analytics, fix pack | Weeks 2–4 → review | Yes (5–10 biz days official, 30+ observed) |

The web tool is the viral engine and lead capture; the app is the recurring revenue. A launches while B sits in the review queue. This is the structural answer to "instantly."

---

## 5. Surface A — the free web tool

### 5.1 Scan flow
1. Paste store URL (any Shopify store — detect platform; non-Shopify gets a lite scan + "built for Shopify stores" note)
2. Live progress theater: "Asking ChatGPT-style questions about this category… Reading your product data… Sending in the shopper…" (progress states are real pipeline steps)
3. **Result page:** verdict headline ("The agent reached checkout but couldn't determine shipping costs"), score dial, furthest-step-reached timeline, first 3 replay steps visible
4. **Email gate:** full replay + complete fix report + PDF
5. CTAs: "Monitor this weekly" → Shopify app · "The problem is your store's data & design" → Atelier cross-sell (rule-based: only when Readability/Navigability pillars are the dominant failures)

### 5.2 The replay (the viral artifact)
- Scrubbable step-through: screenshot per step + the agent's narrated reasoning as captions. Voice: dry, deadpan, first-person bot. ("Attempting to close this newsletter popup. The close button is 8 pixels wide. Attempt 2. Attempt 3. Moving on with the popup covering 40% of the viewport.")
- **Auto-rendered vertical MP4 (9:16, ≤45s) via Remotion** — screenshots + captions + score card ending. One-tap download. This is the creator-format deliverable.
- OG share card: store favicon + score + verdict line, generated per scan — links unfurl as mini-roasts.

### 5.3 Leaderboard (launch content engine)
- Pre-computed weekly runs of ~100 famous DTC brands (Gymshark, SKIMS, Allbirds, Glossier tier). Public pages: "[Brand] — AI Agent Readiness: 71/100," each with replay highlights.
- SEO surface + endless social material + the comparison hook ("your store vs SKIMS").
- Guardrails: public methodology page, factual tone only (scores, observed steps — no editorializing about the company), re-test-on-request for any brand, agent version stamped on every result.

### 5.4 Agency workspace — $99/mo (web product, separate from the app)
Unlimited client-domain scans (fair use), white-label PDF reports, saved client list, embeddable "Get your AI readiness score" widget for the agency's own site (their lead magnet, our distribution).
**Compliance note:** this is a standalone web product. Shopify **app** functionality is never paywalled outside Shopify billing — the app's plans are exclusively App Pricing (§8).

### 5.5 Free-tier economics
2 scans per domain per 30 days · results cached 7 days · per-IP and per-email caps · unowned-domain scans use the read-only journey (cheaper + polite). Cost targets in §7.6.

---

## 6. Surface B — the Shopify app

### 6.1 Core loop
1. Install → instant first deep run (ownership = the install; unlocks full-depth simulation)
2. **Scheduled runs:** weekly (Scout) or 2×/week × 3 shopper personas (Pro) — personas vary intent: "gift under budget," "specific product + shipping question," "compare two variants"
3. **Change-triggered runs:** `themes/publish` webhook → automatic re-run → diff vs last score
4. **Alerts:** email (Scout) / email + Slack (Pro): "Score dropped 61 → 43 after yesterday's theme update. The agent can no longer find Add to Cart. Replay inside."
5. **Fix pack (Pro):** one-click llms.txt + JSON-LD via theme app embed *(commodity, included not led with)*; product data-gap fixes (missing shipping info, variant clarity, alt text) reusing Atelier's enrichment pipeline — always framed as "close the gaps run #N found"
6. **AI traffic analytics (Pro):** Web Pixel extension detecting AI referrers (chatgpt.com, perplexity.ai, gemini, copilot, claude.ai) → sessions, landing pages, add-to-carts by AI source. Directly attacks the "70% invisible in GA4" gap.
   - **Scope note:** MVP is traffic-level via Web Pixel (no PII, no `read_orders`). Order-level revenue attribution = v1.1, gated on Shopify's protected customer data approval — plan it like Atelier's `write_themes` exemption: apply early, don't block MVP on it.
7. **BFCM Readiness Report** (seasonal, Sept–Nov): one-click full audit + trendline + "fix before the holiday quarter" framing. The research literally tells merchants to audit tracking before the 2026 holiday quarter — ride it.

### 6.2 Deep-run additions (owned stores only)
Checkout form-fill with clearly-labeled test data (name: "Mysterybot TEST — do not fulfill") up to but **never through** payment · discount-code field handling · shipping-option parseability · abandoned test checkouts auto-noted to merchant so their flows aren't polluted unknowingly.

---

## 7. The agent engine (shared backend)

### 7.1 Run pipeline (Inngest fn: `scan/run`)
| # | Step | What | Cost target |
|---|------|------|-------------|
| 1 | `static.crawl` | robots.txt AI-bot rules (GPTBot/ClaudeBot/PerplexityBot/Google-Extended), llms.txt, sitemap, JSON-LD extraction, **JS-off render diff** (what agents see vs humans), page weight | €0.01 |
| 2 | `citation.panel` | 3–5 live category-shopping queries against current model APIs; does the store/products surface | €0.05 |
| 3 | `journey.run` | Playwright + Claude (vision loop): land → handle popups → find product (search + nav) → read PDP (price/variants/shipping/stock) → add to cart → reach checkout → [owned: fill to payment step] → abandon. Every step: screenshot, action, reasoning, timing | €0.10–0.30 |
| 4 | `score.compute` | Rubric (§7.3), verdict line, furthest-step, diffs vs prior runs | ~€0 |
| 5 | `report.render` | Fix list (prioritized, effort-tagged), replay assembly, Remotion MP4, OG card, PDF | €0.02 |

Model: `claude-sonnet-4-6` for the journey loop (vision + tool use); `claude-haiku-4-5` for caption polish. Per-run budget: **≤ €0.35 target, €0.60 alarm** (read-only) / ≤ €0.55 (deep). Every run logs cost to ledger.

### 7.2 Agent behavior policy (non-negotiable, published on /bot)
- Crawler steps use declared UA `MysteryBot/1.0 (+https://…/bot)` and honor robots.txt, including a `MysteryBot` disallow as full opt-out (plus a web opt-out form)
- Journey steps use a standard browser profile (the realistic condition being tested) — but: **1 concurrent session per domain, ≤40 page loads/run, no retry-against-block**
- **Never:** solve or bypass CAPTCHAs/bot challenges (finding, stop) · create accounts or log in · enter payment data of any kind · complete an order · submit personal data on unowned stores · use proxy rotation or fingerprint evasion of any kind
- A blocked run still produces value: partial score from static analysis + the finding "your bot defense blocks AI shoppers — here's the tradeoff"
- Data: screenshots/DOM of public pages only; auto-purge unowned-store artifacts at 30 days

### 7.3 Scoring rubric (100 pts)
| Pillar | Pts | Sample checks |
|---|---|---|
| Discoverability | 25 | AI-crawler access, llms.txt, sitemap, feed/Catalog signals, live citation panel result |
| Machine readability | 25 | Product/Offer JSON-LD completeness, price + stock + shipping visible without JS, variant clarity, alt text |
| Agent navigability | 20 | Popup interference, search findability, PDP reachable ≤3 steps, load performance |
| Cart & checkout | 20 | Add-to-cart succeeds, cart parseable, checkout reachable, guest checkout, bot-wall interference, shipping-cost transparency |
| Trust & policy | 10 | Returns/shipping policies findable + parseable, contact identity, HTTPS |

Tiers: 85+ **Agent-ready** · 65–84 **Leaking AI sales** · 40–64 **Agents struggle here** · <40 **Invisible or unbuyable to AI**. Headline always = furthest step reached + failure point.

### 7.4 Opportunity estimate (truthful mode)
"Estimated AI-channel opportunity: €X–Y/mo" computed from category AI-traffic benchmarks × store-size proxy × published conversion deltas — shown as a **range with an expandable assumptions panel**. Never a single confident number. If inputs are too thin: show the qualitative tier only.

### 7.5 Accuracy safeguards (protect the brand)
- **Canary suite:** 12 known-good + known-bad reference stores (incl. Snoozr + Leppo portfolio) re-run before any agent-version ship; regression = no deploy
- Agent version stamped on every result; free re-runs after version bumps
- Low-confidence runs (agent uncertainty, timeouts) flagged and human-reviewed during the first 60 days — wrongly telling a merchant "your store is broken" when it's our harness bug is the #1 reputational risk

### 7.6 Infra
Agent Runner: Node + Playwright workers on Railway (autoscaled, headless Chromium pool) · Inngest orchestration (per-domain concurrency 1, global cap 12) · artifacts → Supabase Storage · Postgres (Supabase) via Prisma · Remotion render workers for MP4 · web tool: Next.js on Vercel (tasteskill v2 applies) · Shopify app: RR7 official template on Railway (clone Atelier's Phase 0 scaffold).

---

## 8. Billing (Shopify app — App Pricing exclusively)

| Plan | Price | Includes |
|---|---|---|
| **Free** | $0 | 1 manual deep run/mo, topline score + first 3 replay steps |
| **Scout** | $19/mo · $190/yr | Weekly runs, full replays + MP4s, email alerts, theme-change re-runs, fix list |
| **Pro** | $49/mo · $490/yr | 2×/week × 3 personas, AI-traffic pixel analytics, one-click fix pack, Slack alerts, BFCM report, score API |

7-day trials · subscriptions only (no meters — same caps rationale as Atelier §10) · state via redirect params + Partner API Active Subscription + hourly reconcile (no billing webhooks) · $0 private test plan for QA · web Agency plan ($99/mo) lives entirely on Surface A and never gates app features.

**Unit economics:** Scout = ~4 deep runs/mo ≈ €2.20 COGS → ~87% gross margin. Pro = ~24 runs + pixel ≈ €14 COGS → ~70%. Free tool = marketing spend, capped (§5.5). Rev share: 0% to $1M lifetime (registered), then 15%; 2.9% processing on all billing.

---

## 9. Data model (Prisma sketch)

```prisma
model Domain {
  id           String   @id @default(cuid())
  hostname     String   @unique
  platform     String?  // shopify | other
  verifiedById String?  // -> Shop.id when app-installed, or email-verified
  optedOut     Boolean  @default(false)
  scans        Scan[]
}

model Scan {
  id            String   @id @default(cuid())
  domainId      String
  mode          String   // readonly | deep
  trigger       String   // manual | scheduled | theme_change | leaderboard
  persona       String?
  agentVersion  String
  status        String   // queued|running|done|blocked|failed
  score         Int?
  pillarScores  Json?
  furthestStep  String?
  verdict       String?
  findings      Json?    // [{pillar, severity, title, fix, effort}]
  costCents     Int      @default(0)
  confidence    String   @default("normal") // normal | low (human review)
  artifactsKey  String?  // storage prefix: screenshots, mp4, pdf, og
  createdAt     DateTime @default(now())
  domain        Domain   @relation(fields: [domainId], references: [id])
}

model Shop {          // Shopify app installs
  id        String   @id @default(cuid())
  domain    String   @unique
  plan      String   @default("free")
  planSyncedAt DateTime?
  slackWebhook String?
  installedAt  DateTime @default(now())
  uninstalledAt DateTime?
}

model Lead {          // web tool email captures
  id        String   @id @default(cuid())
  email     String
  domainId  String
  source    String   // scan_gate | leaderboard | widget
  createdAt DateTime @default(now())
}

model PixelSession { // AI-referral analytics (no PII)
  id        String   @id @default(cuid())
  shopId    String
  aiSource  String   // chatgpt|perplexity|gemini|copilot|claude|other
  landing   String
  events    Json     // page_view, add_to_cart, checkout_started counts
  day       DateTime
}
// + Session model from Shopify template · CreditLedger + WebhookEvent as in Atelier
```

---

## 10. Analytics & KPIs

**Viral loop:** scans/day · share actions per scan (MP4 downloads + link shares, target ≥15%) · email capture ≥35% · leaderboard organic traffic.
**Funnel:** scan → app install 8–12% (Shopify-detected domains) · install → paid trial 40% · trial → paid ≥35% · D30 logo churn <8%.
**Quality:** run success ≥95% · blocked-rate tracked by defense vendor · false-positive reports <2% of runs · p50 scan wall-clock ≤4 min.

---

## 11. Compliance

Atelier PRD **§14 checklist applies verbatim** (GDPR trio, App Pricing-only billing, console-clean incognito pass, name/icon/listing rules, demo store + screencast, p95 <500ms).
Additions here: Web Pixel privacy disclosure in listing + privacy policy · protected-customer-data application filed early for v1.1 order attribution · listing must not promise citations/rankings (truthful-marketing requirement and our own principle) · /bot page with policy + opt-out live before public launch.

---

## 12. GTM & launch sequence

**Week 1 — Surface A live.** Days 1–4 engine on the dogfood corpus (Snoozr, Cliniza, Perla, Dakwerken Antony, Bellini, Ronin — calibrate scoring on stores where ground truth is known). Days 5–7: public tool + replay + OG cards + email gate.

**Week 2 — ignition.** Publish the 100-brand leaderboard · Pairstack build-in-public arc ("we built an AI that mystery-shops famous stores — here's who failed") · seed 10–15 ecom creators with the "roast big brands" format + their own free deep scan · Product Hunt · AndiBuilds video: the replay compilation of famous stores failing.

**Weeks 2–4 — Surface B.** App built on the Atelier scaffold → submit ~day 24 (queues behind Atelier; the shared checklist is already battle-tested by then).

**Sept–Nov — the BFCM campaign.** "Is your store agent-ready for the first AI holiday season?" Re-scan pushes, readiness report, urgency emails to the lead base. This is the monetization spike; the July–Aug window builds the list it fires into.

**Always-on:** every Leppo client gets scanned (audit → retainer/rebuild pitch) · Atelier ↔ Mysterybot cross-sell rules live in both products.

---

## 13. Build plan for Claude Code (Fable 5)

> **Standing instructions:** clone learnings + scaffold patterns from the Atelier repo (RR7 template, App Pricing wiring, webhook handlers, review checklist). Use Shopify Dev MCP for all GraphQL. Read tasteskill v2 before building any public-facing UI. The agent behavior policy (§7.2) is implemented as hard code paths, not prompts — the journey loop must be *incapable* of submitting a payment form or solving a challenge.

**Phase 0 — Engine core (Day 1–4)**
Playwright + Claude vision loop harness · static crawler + JS-off differ · scoring rubric v1 · run end-to-end on Snoozr.
✅ *Accept:* full read-only journey on 6 dogfood stores; findings match known ground truth; cost logged ≤€0.35/run.

**Phase 1 — Report & replay (Day 4–6)**
Fix-list generator · scrubbable replay UI · Remotion vertical MP4 · OG card · PDF export · deadpan caption voice pass.
✅ *Accept:* a non-technical person watches a replay and can retell where the agent died; MP4 renders <90s.

**Phase 2 — Public web tool (Day 5–7, overlaps)**
Next.js site (tasteskill) · scan queue + progress theater · email gate · caps/cache/opt-out + /bot policy page · canary suite in CI.
✅ *Accept:* stranger-usable end to end; abuse caps verified; ship it.

**Phase 3 — Leaderboard + hardening (Week 2)**
100-brand batch runner + public pages + weekly refresh · low-confidence review queue · agency workspace + white-label PDF + Stripe for the $99 web plan.
✅ *Accept:* leaderboard live with methodology page; agency PDF is client-presentable.

**Phase 4 — Shopify app (Weeks 2–3)**
RR7 scaffold clone · install→first deep run · schedules + personas · `themes/publish` re-run diffing · alerts (email/Slack) · Web Pixel AI-referrer analytics · fix pack (llms.txt + JSON-LD embed, product data fixes via Atelier enrichment module) · App Pricing plans + gating · GDPR trio + uninstall.
✅ *Accept:* full lifecycle on dev store incl. billing on $0 test plan; deep run fills checkout with TEST data and provably cannot pass the payment step.

**Phase 5 — Review & polish (Week 4)**
Listing assets, screencast, reviewer demo store, checklist sweep, submit.
✅ *Accept:* every checklist box green; submission confirmed ~day 24.

---

## 14. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Widespread bot-defense blocks thin out reports | Med | A block is itself the product's headline finding; static pillars still score; publish block-rate transparency. Never escalate to evasion — the honest stance IS the moat. |
| Shopify ships a native "agent readiness" report | Med | Platform will grade its own homework, single-engine, no replay, no cross-store comparison. Moat = independence + replay UX + leaderboard. Shopware precedent: platforms build for themselves only. |
| Named-brand leaderboard blowback | Med | Factual tone, public methodology, agent-version stamps, re-test on request, takedown-review path. Precedent: PageSpeed/SSL graders. |
| False negatives blame stores for our bugs | Med | Canary suite gate, confidence flags, human review window, free re-runs on version bumps (§7.5). |
| Free-tier cost abuse | Med | Caps + cache + email gate + per-IP limits; leaderboard cached content absorbs the demo demand. |
| Virality doesn't spark organically | Med | The spark is manufactured: leaderboard drop + creator seeding + Pairstack arc + PH, all week 2. Worst case: a strong lead-gen audit tool with agency revenue — still a business. |
| Journey agent brittleness across exotic themes | Med-High | Persona/journey scoped to canonical Shopify flows first; graceful "couldn't complete — low confidence" state; expand theme coverage from real failure logs. |

---

## 15. Open questions (resolve in Phase 0, don't block)

1. Final name — Mysterybot vs alternatives; check App Store + domain + social handles in one pass.
2. Leaderboard at launch: 100 brands or start with 25 sharpest names and refresh faster?
3. Free scan depth: is 3 visible replay steps the right tease, or gate the MP4 only?
4. Web Agency plan at $99 — validate against 3 Leppo-adjacent agencies before pricing is printed.
