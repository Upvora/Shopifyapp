/**
 * Local visual harness for the 5 archetype presets: renders an approximation
 * of each archetype's homepage (per its defaultPlan + schemes + type pairing)
 * as a static HTML file, styled ONLY from preset data. Used for taste gut
 * checks before real Shopify rendering; not a substitute for it.
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

const DEMO_BRANDS: Record<string, { name: string; tagline: string; heroCta: string; products: string[]; manifesto: string; columns: [string, string][] }> = {
  editorial: {
    name: "Maison Vert",
    tagline: "Considered clothing, made in small runs",
    heroCta: "Explore the collection",
    products: ["Wool overshirt", "Pleated trouser", "Silk scarf", "Knit cardigan"],
    manifesto: "We make fewer things, better. Each piece is cut in our own atelier and finished by hand.",
    columns: [["Small runs", "Every style is produced in limited quantities."], ["Natural fibres", "Wool, silk and organic cotton only."], ["Repairs for life", "Send any piece back and we will mend it."]],
  },
  minimal: {
    name: "Studio Norm",
    tagline: "Objects for daily use",
    heroCta: "Shop objects",
    products: ["Desk lamp 01", "Stoneware mug", "Notebook A5", "Wall clock"],
    manifesto: "Nothing decorative. Everything considered. Tools that earn their place on your desk.",
    columns: [["Materials", "Anodised aluminium, beech, stoneware."], ["Guarantee", "Five years on every product."], ["Shipping", "Carbon-neutral from our warehouse."]],
  },
  "warm-craft": {
    name: "Atelier Brood",
    tagline: "Hand-thrown ceramics from our Antwerp workshop",
    heroCta: "See what's fresh from the kiln",
    products: ["Breakfast bowl", "Speckled mug", "Serving platter", "Bud vase"],
    manifesto: "Every glaze is mixed in-house and every piece passes through six pairs of hands before it reaches yours.",
    columns: [["Made to be used", "Dishwasher-safe, chip-resistant stoneware."], ["Second firings", "Small imperfections, honestly priced."], ["Workshops", "Throw your own bowl on Saturdays."]],
  },
  "bold-street": {
    name: "STOMP Supply",
    tagline: "Heavyweight gear for the city",
    heroCta: "Shop the drop",
    products: ["Oversized hoodie", "Cargo pant", "Logo beanie", "Canvas tote"],
    manifesto: "Built heavy, cut loose, printed loud. Designed in-house and tested on concrete.",
    columns: [["450gsm fleece", "Heavier than your other hoodie."], ["Made to move", "Gusseted, reinforced, roomy."], ["No restocks", "When a drop is gone, it's gone."]],
  },
  "clinical-premium": {
    name: "Derma Lab",
    tagline: "Skincare formulated around published evidence",
    heroCta: "Browse formulations",
    products: ["Retinal serum 0.1%", "Barrier cream", "SPF 50 fluid", "Azelaic gel 10%"],
    manifesto: "Every ingredient is listed with its concentration. Every claim links to the study behind it.",
    columns: [["Full transparency", "Concentrations on every label."], ["Fragrance-free", "Formulated for reactive skin."], ["Batch-tested", "Certificates available per batch."]],
  },
};

const HEADING_TRANSFORM: Record<string, string> = {
  "bold-street": "uppercase",
};

function productTile(scheme: { background: string; text: string }, accent: string, i: number) {
  const angles = [155, 20, 250, 320];
  return `background: linear-gradient(${angles[i % 4]}deg, ${scheme.background} 0%, color-mix(in srgb, ${accent} 18%, ${scheme.background}) 100%);`;
}

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

  const btn = (scheme: typeof s["scheme-1"], label: string) => outline
    ? `<a class="btn" style="background:transparent;color:${scheme.text};border:1px solid ${scheme.text};">${label}</a>`
    : `<a class="btn" style="background:${scheme.button};color:${scheme.button_label};">${label}</a>`;

  const hero = {
    "full-bleed-scrim": `
      <section class="hero-bleed" style="background:
        linear-gradient(rgba(0,0,0,.28), rgba(0,0,0,.38)),
        linear-gradient(150deg, color-mix(in srgb, ${s["scheme-1"].button} 35%, #6b6b6b), #3d3d3d 70%);">
        <div class="hero-inner">
          <h1 style="color:#fff;">${brand.tagline}</h1>
          <a class="btn" style="background:${archetype.id === "bold-street" ? s["scheme-1"].button : "#ffffff"};color:${archetype.id === "bold-street" ? s["scheme-1"].button_label : "#111111"};">${brand.heroCta}</a>
        </div>
      </section>`,
    split: `
      <section class="hero-split" style="background:${s["scheme-1"].background};">
        <div class="hero-copy">
          <h1 style="color:${s["scheme-1"].text};">${brand.tagline}</h1>
          <p style="color:${s["scheme-1"].text};opacity:.75;">${brand.manifesto}</p>
          ${btn(s["scheme-1"], brand.heroCta)}
        </div>
        <div class="hero-media" style="${productTile(s["scheme-2"], s["scheme-1"].button, 0)} border-radius:${radius}px;"></div>
      </section>`,
    "type-led": `
      <section class="hero-type" style="background:${s["scheme-1"].background};">
        <h1 style="color:${s["scheme-1"].text};max-width:14ch;">${brand.tagline}</h1>
        ${btn(s["scheme-1"], brand.heroCta)}
      </section>`,
    "banner-compact": "",
  }[archetype.heroPattern];

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
  h2 { font-size:${(1.9 * headingScale).toFixed(2)}rem; margin-bottom:1.2rem; }
  h3 { font-size:1.05rem; margin-bottom:.4rem; }
  section { padding:${sectionPad}rem 4rem; }
  .btn { display:inline-block; padding:.85rem 1.9rem; border-radius:${buttonRadius}px;
         font-family:'${body.family}', ${body.fallback}; font-size:.95rem; text-decoration:none; font-weight:700; }
  header { display:flex; justify-content:space-between; align-items:center; padding:1.1rem 4rem;
           border-bottom:1px solid color-mix(in srgb, ${s["scheme-1"].text} 12%, transparent); }
  .wordmark { font-family:'${heading.family}', ${heading.fallback}; font-weight:${heading.weight};
              font-size:1.35rem; text-transform:${transform}; }
  nav { display:flex; gap:1.6rem; font-size:.92rem; opacity:.85; }
  .hero-bleed { min-height:66vh; display:flex; align-items:flex-end; padding:4rem; }
  .hero-bleed h1 { max-width:16ch; margin-bottom:1.4rem; }
  .hero-split { display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:center; min-height:60vh; }
  .hero-copy p { margin:1.1rem 0 1.7rem; max-width:44ch; }
  .hero-media { min-height:52vh; }
  .hero-type { min-height:52vh; display:flex; flex-direction:column; justify-content:center; gap:2rem; }
  .grid { display:grid; grid-template-columns:repeat(4,1fr); gap:${Number(preset.settings.spacing_grid_horizontal)}px; }
  .card .ph { aspect-ratio:4/5; border-radius:${radius}px; margin-bottom:.8rem; }
  .card p { font-size:.95rem; }
  .price { opacity:.6; font-size:.9rem; }
  .rich { text-align:center; }
  .rich p { max-width:52ch; margin:0 auto; font-size:1.15rem; }
  .cols { display:grid; grid-template-columns:repeat(3,1fr); gap:2.5rem; }
  .cols p { font-size:.95rem; opacity:.8; }
  .newsletter { text-align:center; }
  .newsletter form { display:flex; gap:.6rem; justify-content:center; margin-top:1.4rem; }
  .newsletter input { padding:.85rem 1.1rem; border-radius:${buttonRadius}px; border:1px solid transparent; min-width:280px; font-size:.95rem; }
  footer { display:flex; justify-content:space-between; padding:2.5rem 4rem; font-size:.88rem; }
</style></head><body>

<header style="background:${s["scheme-1"].background};color:${s["scheme-1"].text};">
  <span class="wordmark">${brand.name}</span>
  <nav><span>Shop</span><span>About</span><span>Journal</span><span>Contact</span></nav>
  <span style="font-size:.92rem;">Cart (0)</span>
</header>

${hero}

<section style="background:${s["scheme-2"].background};color:${s["scheme-2"].text};">
  <h2>Featured</h2>
  <div class="grid">
    ${brand.products.map((p, i) => `
    <div class="card">
      <div class="ph" style="${productTile(s["scheme-2"], s["scheme-2"].button, i)}"></div>
      <p>${p}</p><p class="price">€${(38 + i * 14).toFixed(2)}</p>
    </div>`).join("")}
  </div>
</section>

<section class="rich" style="background:${s["scheme-1"].background};color:${s["scheme-1"].text};">
  <h2>${archetype.id === "bold-street" ? "No filler." : "Our promise"}</h2>
  <p>${brand.manifesto}</p>
</section>

<section style="background:${s["scheme-5"].background};color:${s["scheme-5"].text};">
  <div class="cols">
    ${brand.columns.map(([t, d]) => `<div><h3>${t}</h3><p>${d}</p></div>`).join("")}
  </div>
</section>

<section class="newsletter" style="background:${s["scheme-3"].background};color:${s["scheme-3"].text};">
  <h2>Stay in the loop</h2>
  <p style="opacity:.85;">New pieces, no noise. One email a month.</p>
  <form>
    <input placeholder="Email address">
    <a class="btn" style="background:${s["scheme-3"].button};color:${s["scheme-3"].button_label};">Subscribe</a>
  </form>
</section>

<footer style="background:${s["scheme-4"].background};color:${s["scheme-4"].text};">
  <span>© ${brand.name}</span>
  <span style="opacity:.7;">Shipping · Returns · Privacy</span>
</footer>

</body></html>`;

  writeFileSync(join(outDir, `${archetype.id}.html`), html);
  console.log(`${outDir}/${archetype.id}.html`);
}
