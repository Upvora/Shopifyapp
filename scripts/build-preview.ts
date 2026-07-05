/**
 * Local visual harness for the 5 archetype presets: renders each archetype's
 * homepage by iterating its ACTUAL defaultPlan (constitution) and styling
 * every element ONLY from preset data. Taste gut-check before real Shopify
 * rendering; not a substitute for it.
 *
 * Run: npx tsx scripts/build-preview.ts <outDir>
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ARCHETYPES, getArchetype, TYPE_PAIRINGS } from "../app/generation/constitution.server";
import { ARCHETYPE_PRESETS } from "../app/generation/presets.server";

const outDir = process.argv[2] ?? join(import.meta.dirname, "..", ".previews");
mkdirSync(outDir, { recursive: true });

const SERIF = new Set(["playfair_display", "libre_baskerville", "prata", "cormorant", "lora", "vollkorn"]);

function parseFont(handle: string) {
  const match = handle.match(/^(.*)_n(\d)$/);
  const slug = match ? match[1] : handle;
  const weight = match ? Number(match[2]) * 100 : 400;
  const family = slug.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
  return { family, weight, fallback: SERIF.has(slug) ? "serif" : "sans-serif" };
}

interface DemoBrand {
  name: string;
  tagline: string;
  heroCta: string;
  products: string[];
  featuredProduct: { name: string; price: string; blurb: string };
  collections: string[];
  manifesto: string;
  richTitle: string;
  columns: [string, string][];
  trust: [string, string][];
  faq: [string, string][];
}

const DEMO_BRANDS: Record<string, DemoBrand> = {
  editorial: {
    name: "Maison Vert",
    tagline: "Considered clothing, made in small runs",
    heroCta: "Explore the collection",
    products: ["Wool overshirt", "Pleated trouser", "Silk scarf", "Knit cardigan"],
    featuredProduct: { name: "The wool overshirt", price: "€180", blurb: "Cut from undyed merino, finished by hand in our atelier." },
    collections: ["New arrivals", "Tailoring", "Accessories"],
    manifesto: "We make fewer things, better. Each piece is cut in our own atelier and finished by hand.",
    richTitle: "Our promise",
    columns: [["Small runs", "Every style is produced in limited quantities."], ["Natural fibres", "Wool, silk and organic cotton only."], ["Repairs for life", "Send any piece back and we will mend it."]],
    trust: [["Shipping", "Tracked delivery across Europe"], ["Returns", "30 days, no questions"], ["Payment", "Secure checkout"], ["Care", "Written by people, answered fast"]],
    faq: [["How do sizes run?", "True to size, with a relaxed shoulder."], ["Where is it made?", "Cut and sewn in our own atelier."], ["Can I return sale items?", "Yes, within 30 days."], ["Do you restock?", "Some styles return each season."]],
  },
  minimal: {
    name: "Studio Norm",
    tagline: "Objects for daily use",
    heroCta: "Shop objects",
    products: ["Desk lamp 01", "Stoneware mug", "Notebook A5", "Wall clock"],
    featuredProduct: { name: "Desk lamp 01", price: "€149", blurb: "Anodised aluminium, one hinge, no visible screws. Warm light, nothing else." },
    collections: ["Desk", "Kitchen", "Wall"],
    manifesto: "Nothing decorative. Everything considered. Tools that earn their place on your desk.",
    richTitle: "The idea",
    columns: [["Materials", "Anodised aluminium, beech, stoneware."], ["Guarantee", "Five years on every product."], ["Shipping", "Carbon-neutral from our warehouse."]],
    trust: [["Shipping", "2–4 days across Europe"], ["Returns", "30-day returns"], ["Warranty", "Five years, every product"], ["Support", "Answered within a day"]],
    faq: [["What is the warranty?", "Five years on all products."], ["Do lamps ship with plugs?", "EU plugs standard, UK on request."], ["Are mugs dishwasher-safe?", "Yes, all stoneware is."], ["Where do you ship?", "All of Europe."]],
  },
  "warm-craft": {
    name: "Atelier Brood",
    tagline: "Hand-thrown ceramics from our Antwerp workshop",
    heroCta: "See what's fresh from the kiln",
    products: ["Breakfast bowl", "Speckled mug", "Serving platter", "Bud vase"],
    featuredProduct: { name: "The breakfast bowl", price: "€34", blurb: "Thrown on the wheel, glazed in our signature oat speckle." },
    collections: ["Tableware", "Vases", "Gifts"],
    manifesto: "Every glaze is mixed in-house and every piece passes through six pairs of hands before it reaches yours.",
    richTitle: "From our hands to your table",
    columns: [["Made to be used", "Dishwasher-safe, chip-resistant stoneware."], ["Second firings", "Small imperfections, honestly priced."], ["Workshops", "Throw your own bowl on Saturdays."]],
    trust: [["Packaging", "Plastic-free, double-boxed"], ["Returns", "30 days, we cover breakage"], ["Care", "Dishwasher-safe glazes"], ["Visits", "Workshop open every Saturday"]],
    faq: [["Is every piece unique?", "Yes — glaze and form vary slightly."], ["What if it arrives broken?", "We replace it, no photos needed."], ["Food safe?", "All glazes are certified food-safe."], ["Do you do custom sets?", "Yes, from six pieces."]],
  },
  "bold-street": {
    name: "STOMP Supply",
    tagline: "Heavyweight gear for the city",
    heroCta: "Shop the drop",
    products: ["Oversized hoodie", "Cargo pant", "Logo beanie", "Canvas tote"],
    featuredProduct: { name: "Oversized hoodie", price: "€95", blurb: "450gsm fleece. Heavier than your other hoodie." },
    collections: ["Latest drop", "Fleece", "Headwear"],
    manifesto: "Built heavy, cut loose, printed loud. Designed in-house and tested on concrete.",
    richTitle: "No filler.",
    columns: [["450gsm fleece", "Heavier than your other hoodie."], ["Made to move", "Gusseted, reinforced, roomy."], ["No restocks", "When a drop is gone, it's gone."]],
    trust: [["Shipping", "Ships in 24h"], ["Returns", "30 days, easy"], ["Quality", "Heavyweight or nothing"], ["Support", "DM or email, we answer"]],
    faq: [["How oversized is oversized?", "One full size up, boxy cut."], ["Do drops restock?", "No. Gone is gone."], ["Shrinkage?", "Pre-washed, minimal."], ["International shipping?", "EU and UK."]],
  },
  "clinical-premium": {
    name: "Derma Lab",
    tagline: "Skincare formulated around published evidence",
    heroCta: "Browse formulations",
    products: ["Retinal serum 0.1%", "Barrier cream", "SPF 50 fluid", "Azelaic gel 10%"],
    featuredProduct: { name: "Retinal serum 0.1%", price: "€42", blurb: "Encapsulated retinaldehyde at a published-effective concentration." },
    collections: ["Actives", "Barrier care", "Sun"],
    manifesto: "Every ingredient is listed with its concentration. Every claim links to the study behind it.",
    richTitle: "Evidence first",
    columns: [["Full transparency", "Concentrations on every label."], ["Fragrance-free", "Formulated for reactive skin."], ["Batch-tested", "Certificates available per batch."]],
    trust: [["Formulation", "Concentrations disclosed"], ["Testing", "Per-batch certificates"], ["Returns", "30 days, opened or not"], ["Guidance", "Routine help by email"]],
    faq: [["Can I combine the actives?", "Retinal and azelaic — yes, alternate nights."], ["Pregnancy-safe options?", "Azelaic and barrier lines are."], ["Why no fragrance?", "Irritation risk without benefit."], ["Patch testing?", "Recommended for all actives."]],
  },
};

const HEADING_TRANSFORM: Record<string, string> = { "bold-street": "uppercase" };

function tile(bg: string, accent: string, i: number, extra = "") {
  const angles = [155, 20, 250, 320, 110, 200];
  return `background: linear-gradient(${angles[i % 6]}deg, ${bg} 0%, color-mix(in srgb, ${accent} 18%, ${bg}) 100%);${extra}`;
}

const SECTION_SCHEMES = ["scheme-1", "scheme-2", "scheme-1", "scheme-5", "scheme-2"] as const;

for (const archetype of ARCHETYPES) {
  const preset = ARCHETYPE_PRESETS[archetype.id];
  const brand = DEMO_BRANDS[archetype.id];
  const pairing = TYPE_PAIRINGS.find((p) => p.id === getArchetype(archetype.id).typePairings[0])!;
  const heading = parseFont(pairing.heading);
  const body = parseFont(pairing.body);
  const s = preset.schemes;
  const radius = Number(preset.settings.card_corner_radius ?? 0);
  const buttonRadius = Number(preset.settings.buttons_radius ?? 0);
  const outline = Number(preset.settings.buttons_border_thickness ?? 0) > 0;
  const headingScale = Number(preset.settings.heading_scale) / 100;
  const sectionPad = 3.5 + Number(preset.settings.spacing_sections) / 16;
  const transform = HEADING_TRANSFORM[archetype.id] ?? "none";

  const fontsUrl =
    `https://fonts.googleapis.com/css2?family=${heading.family.replace(/ /g, "+")}:wght@${heading.weight}` +
    `&family=${body.family.replace(/ /g, "+")}:wght@400;700&display=swap`;

  type Scheme = typeof s["scheme-1"];
  const btn = (scheme: Scheme, label: string) => outline
    ? `<a class="btn" style="background:transparent;color:${scheme.text};border:1px solid ${scheme.text};">${label}</a>`
    : `<a class="btn" style="background:${scheme.button};color:${scheme.button_label};">${label}</a>`;

  const schemeAt = (i: number): Scheme & { id: string } => {
    const id = i === 0 ? "scheme-1" : SECTION_SCHEMES[i % SECTION_SCHEMES.length];
    return { ...s[id as keyof typeof s], id };
  };

  // --- header patterns -----------------------------------------------------
  const nav = `<nav><span>Shop</span><span>About</span><span>Journal</span><span>Contact</span></nav>`;
  const headers: Record<string, string> = {
    "centered-stack": `
      <header class="hdr" style="flex-direction:column;gap:.9rem;padding:1.6rem 4rem 1.1rem;">
        <span class="wordmark" style="font-size:1.7rem;">${brand.name}</span>
        <div style="display:flex;gap:2.2rem;align-items:center;font-size:.9rem;opacity:.85;">
          <span>Shop</span><span>About</span><span>Journal</span><span>Contact</span><span>· Cart (0)</span>
        </div>
      </header>`,
    hairline: `
      <header class="hdr" style="padding:.9rem 4rem;border-bottom:1px solid color-mix(in srgb, ${s["scheme-1"].text} 14%, transparent);">
        <span class="wordmark" style="font-size:1rem;letter-spacing:.14em;text-transform:uppercase;">${brand.name}</span>
        <nav style="font-size:.85rem;letter-spacing:.05em;"><span>Shop</span><span>About</span><span>Contact</span></nav>
        <span style="font-size:.85rem;">Cart 0</span>
      </header>`,
    standard: `
      <header class="hdr" style="padding:1.2rem 4rem;border-bottom:2px solid color-mix(in srgb, ${s["scheme-1"].button} 30%, transparent);">
        <span class="wordmark" style="font-size:1.45rem;">${brand.name}</span>
        ${nav}
        <span style="font-size:.92rem;">Cart (0)</span>
      </header>`,
    poster: `
      <header class="hdr" style="padding:1rem 4rem;border-bottom:3px solid ${s["scheme-1"].button};">
        <span class="wordmark" style="font-size:1.6rem;">${brand.name}</span>
        ${nav}
        <span style="background:${s["scheme-1"].button};color:${s["scheme-1"].button_label};padding:.35rem .9rem;border-radius:${buttonRadius}px;font-size:.85rem;font-weight:700;">CART 0</span>
      </header>`,
    cta: `
      <header class="hdr" style="padding:1rem 4rem;border-bottom:1px solid color-mix(in srgb, ${s["scheme-1"].text} 12%, transparent);">
        <span class="wordmark" style="font-size:1.3rem;">${brand.name}</span>
        ${nav}
        <span style="display:flex;gap:1rem;align-items:center;">
          <span style="font-size:.9rem;">Cart (0)</span>
          ${btn(s["scheme-1"], "Take the skin quiz")}
        </span>
      </header>`,
  };

  // --- section renderers (one per plan step type) --------------------------
  const renderers: Record<string, (scheme: Scheme & { id: string }, i: number) => string> = {
    hero: (sc) => ({
      "full-bleed-scrim": `
        <section class="hero-bleed" style="background:
          linear-gradient(rgba(0,0,0,.28), rgba(0,0,0,.38)),
          linear-gradient(150deg, color-mix(in srgb, ${s["scheme-1"].button} 35%, #6b6b6b), #3d3d3d 70%);">
          <div>
            <h1 style="color:#fff;max-width:16ch;margin-bottom:1.4rem;">${brand.tagline}</h1>
            <a class="btn" style="background:${archetype.id === "bold-street" ? s["scheme-1"].button : "#ffffff"};color:${archetype.id === "bold-street" ? s["scheme-1"].button_label : "#111111"};">${brand.heroCta}</a>
          </div>
        </section>`,
      split: `
        <section class="hero-split" style="background:${s["scheme-1"].background};">
          <div>
            <h1 style="color:${s["scheme-1"].text};">${brand.tagline}</h1>
            <p style="color:${s["scheme-1"].text};opacity:.75;margin:1.1rem 0 1.7rem;max-width:44ch;">${brand.manifesto}</p>
            ${btn(s["scheme-1"], brand.heroCta)}
          </div>
          <div style="${tile(s["scheme-2"].background, s["scheme-1"].button, 0)} min-height:52vh;border-radius:${radius}px;"></div>
        </section>`,
      "type-led": `
        <section class="hero-type" style="background:${s["scheme-1"].background};">
          <h1 style="color:${s["scheme-1"].text};max-width:14ch;">${brand.tagline}</h1>
          ${btn(s["scheme-1"], brand.heroCta)}
        </section>`,
      "banner-compact": "",
    })[archetype.heroPattern],

    "rich-text": (sc) => `
      <section class="rich" style="background:${sc.background};color:${sc.text};">
        <h2>${brand.richTitle}</h2>
        <p>${brand.manifesto}</p>
      </section>`,

    "featured-collection": (sc, i) => `
      <section style="background:${sc.background};color:${sc.text};">
        <div class="sec-head"><h2>${i <= 2 ? "Featured" : "Back in the shop"}</h2><span class="see-all">View all →</span></div>
        <div class="grid4">
          ${brand.products.map((p, j) => `
          <div class="card">
            <div class="ph" style="${tile(sc.background, sc.button, j + i)}"></div>
            <p>${p}</p><p class="price">€${(38 + ((j + i) % 4) * 14).toFixed(2)}</p>
          </div>`).join("")}
        </div>
      </section>`,

    "featured-product": (sc) => `
      <section class="hero-split" style="background:${sc.background};color:${sc.text};min-height:0;">
        <div style="${tile(sc.background, sc.button, 2)} min-height:44vh;border-radius:${radius}px;"></div>
        <div>
          <p style="font-size:.85rem;letter-spacing:.1em;text-transform:uppercase;opacity:.6;margin-bottom:.6rem;">Featured</p>
          <h2 style="margin-bottom:.6rem;">${brand.featuredProduct.name}</h2>
          <p style="opacity:.75;max-width:42ch;margin-bottom:.9rem;">${brand.featuredProduct.blurb}</p>
          <p style="font-weight:700;margin-bottom:1.4rem;">${brand.featuredProduct.price}</p>
          ${btn(sc, "Add to cart")}
        </div>
      </section>`,

    "image-with-text": (sc) => `
      <section class="hero-split" style="background:${sc.background};color:${sc.text};min-height:0;">
        <div style="${tile(sc.background, sc.button, 3)} min-height:40vh;border-radius:${radius}px;"></div>
        <div>
          <h2>${brand.columns[0][0]}</h2>
          <p style="opacity:.78;max-width:46ch;">${brand.columns[0][1]} ${brand.manifesto}</p>
        </div>
      </section>`,

    multicolumn: (sc) => `
      <section style="background:${sc.background};color:${sc.text};">
        <div class="cols">
          ${brand.columns.map(([t, d]) => `<div><h3>${t}</h3><p>${d}</p></div>`).join("")}
        </div>
      </section>`,

    "collection-list": (sc) => `
      <section style="background:${sc.background};color:${sc.text};">
        <div class="sec-head"><h2>Shop by collection</h2></div>
        <div class="grid3">
          ${brand.collections.map((c, j) => `
          <div class="card">
            <div class="ph wide" style="${tile(sc.background, sc.button, j + 1)}"></div>
            <p style="font-weight:700;">${c} →</p>
          </div>`).join("")}
        </div>
      </section>`,

    "testimonial-placeholder": (sc) => `
      <section class="rich" style="background:${sc.background};color:${sc.text};">
        <p style="font-family:'${heading.family}', ${heading.fallback};font-size:1.5rem;line-height:1.35;max-width:38ch;margin:0 auto .9rem;">
          “[Placeholder — a real customer quote goes here. Atelier never invents testimonials.]”
        </p>
        <p style="opacity:.6;font-size:.9rem;">— Customer name, city</p>
      </section>`,

    "trust-row": (sc) => `
      <section style="background:${sc.background};color:${sc.text};padding-top:2.2rem;padding-bottom:2.2rem;">
        <div class="grid4 trust">
          ${brand.trust.map(([t, d]) => `
          <div style="border-top:2px solid color-mix(in srgb, ${sc.button} 55%, transparent);padding-top:.8rem;">
            <h3 style="font-size:.95rem;">${t}</h3><p style="font-size:.88rem;opacity:.75;">${d}</p>
          </div>`).join("")}
        </div>
      </section>`,

    faq: (sc) => `
      <section style="background:${sc.background};color:${sc.text};">
        <div class="sec-head"><h2>Questions, answered</h2></div>
        <div class="faq">
          ${brand.faq.map(([q, a]) => `
          <div class="faq-row" style="border-bottom:1px solid color-mix(in srgb, ${sc.text} 14%, transparent);">
            <p style="font-weight:700;">${q}<span style="float:right;opacity:.5;">+</span></p>
            <p style="opacity:.7;font-size:.95rem;">${a}</p>
          </div>`).join("")}
        </div>
      </section>`,

    newsletter: () => `
      <section class="newsletter" style="background:${s["scheme-3"].background};color:${s["scheme-3"].text};">
        <h2>Stay in the loop</h2>
        <p style="opacity:.85;">New pieces, no noise. One email a month.</p>
        <form>
          <input placeholder="Email address">
          <a class="btn" style="background:${s["scheme-3"].button};color:${s["scheme-3"].button_label};">Subscribe</a>
        </form>
      </section>`,
  };

  const bodyHtml = archetype.defaultPlan
    .map((step, i) => {
      const renderer = renderers[step];
      if (!renderer) throw new Error(`No preview renderer for plan step: ${step}`);
      return renderer(schemeAt(i), i);
    })
    .join("\n");

  const html = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${brand.name} — ${archetype.label} preview</title>
<link rel="stylesheet" href="${fontsUrl}">
<style>
  * { margin:0; box-sizing:border-box; }
  body { font-family:'${body.family}', ${body.fallback}; font-size:16px; line-height:1.6;
         background:${s["scheme-1"].background}; color:${s["scheme-1"].text}; }
  h1,h2,h3 { font-family:'${heading.family}', ${heading.fallback}; font-weight:${heading.weight};
              line-height:1.12; letter-spacing:-0.01em; text-transform:${transform}; }
  h1 { font-size:${(3.2 * headingScale).toFixed(2)}rem; }
  h2 { font-size:${(1.9 * headingScale).toFixed(2)}rem; }
  h3 { font-size:1.05rem; margin-bottom:.4rem; }
  section { padding:${sectionPad}rem 4rem; }
  .sec-head { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:1.2rem; }
  .see-all { font-size:.9rem; opacity:.65; }
  .btn { display:inline-block; padding:.85rem 1.9rem; border-radius:${buttonRadius}px;
         font-family:'${body.family}', ${body.fallback}; font-size:.95rem; text-decoration:none; font-weight:700; }
  .hdr { display:flex; justify-content:space-between; align-items:center;
         background:${s["scheme-1"].background}; color:${s["scheme-1"].text}; }
  .wordmark { font-family:'${heading.family}', ${heading.fallback}; font-weight:${heading.weight}; text-transform:${transform}; }
  nav { display:flex; gap:1.6rem; font-size:.92rem; opacity:.85; }
  .hero-bleed { min-height:66vh; display:flex; align-items:flex-end; padding:4rem; }
  .hero-split { display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:center; min-height:60vh; }
  .hero-type { min-height:52vh; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; gap:2rem; }
  .grid4 { display:grid; grid-template-columns:repeat(4,1fr); gap:${Number(preset.settings.spacing_grid_horizontal)}px; }
  .grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:${Number(preset.settings.spacing_grid_horizontal) + 8}px; }
  .grid4.trust { gap:2rem; }
  .card .ph { aspect-ratio:4/5; border-radius:${radius}px; margin-bottom:.8rem; }
  .card .ph.wide { aspect-ratio:3/2; }
  .card p { font-size:.95rem; }
  .price { opacity:.6; font-size:.9rem; }
  .rich { text-align:center; }
  .rich h2 { margin-bottom:1.2rem; }
  .rich p { max-width:52ch; margin:0 auto; font-size:1.15rem; }
  .cols { display:grid; grid-template-columns:repeat(3,1fr); gap:2.5rem; }
  .cols p { font-size:.95rem; opacity:.8; }
  .faq { max-width:46rem; }
  .faq-row { padding:1rem 0; }
  .newsletter { text-align:center; }
  .newsletter h2 { margin-bottom:.4rem; }
  .newsletter form { display:flex; gap:.6rem; justify-content:center; margin-top:1.4rem; }
  .newsletter input { padding:.85rem 1.1rem; border-radius:${buttonRadius}px; border:1px solid transparent; min-width:280px; font-size:.95rem; }
  footer { display:flex; justify-content:space-between; padding:2.5rem 4rem; font-size:.88rem; }
</style></head><body>

${headers[archetype.headerPattern]}

${bodyHtml}

<footer style="background:${s["scheme-4"].background};color:${s["scheme-4"].text};">
  <span>© ${brand.name}</span>
  <span style="opacity:.7;">Shipping · Returns · Privacy</span>
</footer>

</body></html>`;

  writeFileSync(join(outDir, `${archetype.id}.html`), html);
  console.log(`${outDir}/${archetype.id}.html (${archetype.defaultPlan.length} sections, header: ${archetype.headerPattern})`);
}
