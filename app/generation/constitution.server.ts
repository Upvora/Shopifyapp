/**
 * The Atelier design constitution (PRD §9), encoded as data + validators.
 *
 * Two consumers:
 *  (a) system prompts for pipeline steps 2–4 — the model designs INSIDE this
 *      ruleset (whitelists below are the only allowed values);
 *  (b) validators in step 7 (theme.assemble) — violations are bugs, not
 *      opinions, and fail the run into the auto-repair loop.
 */

// ---------------------------------------------------------------------------
// Type pairings — the ONLY heading/body combinations the pipeline may emit.
// Handles are Shopify font library font_picker handles (family_weight).
// ---------------------------------------------------------------------------

export interface TypePairing {
  id: string;
  heading: string; // Shopify font handle for settings.type_header_font
  body: string; //    Shopify font handle for settings.type_body_font
  mood: string; //    used in prompts to steer selection
}

export const TYPE_PAIRINGS: TypePairing[] = [
  { id: "playfair-assistant", heading: "playfair_display_n4", body: "assistant_n4", mood: "classic editorial, high-fashion" },
  { id: "libre-baskerville-source", heading: "libre_baskerville_n4", body: "source_sans_pro_n4", mood: "literary, calm authority" },
  { id: "prata-work", heading: "prata_n4", body: "work_sans_n4", mood: "quiet luxury, gallery" },
  { id: "cormorant-karla", heading: "cormorant_n5", body: "karla_n4", mood: "warm artisan elegance" },
  { id: "lora-karla", heading: "lora_n5", body: "karla_n4", mood: "handmade warmth, honest" },
  { id: "vollkorn-rubik", heading: "vollkorn_n6", body: "rubik_n4", mood: "hearty craft, food-adjacent" },
  { id: "tenor-nunito", heading: "tenor_sans_n4", body: "nunito_sans_n4", mood: "airy minimal, scandinavian" },
  { id: "work-work", heading: "work_sans_n6", body: "work_sans_n4", mood: "single-family minimal, neutral" },
  { id: "archivo-archivo", heading: "archivo_n7", body: "archivo_n4", mood: "loud, poster-like, street" },
  { id: "oswald-open", heading: "oswald_n5", body: "open_sans_n4", mood: "condensed impact, athletic" },
  { id: "dm-dm", heading: "dm_sans_n7", body: "dm_sans_n4", mood: "precise, product-led, tech" },
  { id: "poppins-open", heading: "poppins_n6", body: "open_sans_n4", mood: "clean geometric confidence" },
];

// ---------------------------------------------------------------------------
// Archetypes — the five design personalities. Every generated store IS one.
// ---------------------------------------------------------------------------

export interface PaletteRules {
  /** Background must stay near-neutral: max saturation (0–100). */
  backgroundMaxSaturation: number;
  /** Background lightness window (0–100). Dark themes only where allowed. */
  backgroundLightness: [number, number];
  /** Accent saturation window — how loud the brand color may be. */
  accentSaturation: [number, number];
  /** May derive a tinted (non-gray) surface from the accent hue. */
  tintedSurfaces: boolean;
  /** Dark scheme (light text on dark bg) permitted for this archetype. */
  darkAllowed: boolean;
}

export interface Archetype {
  id: string;
  label: string;
  description: string;
  typePairings: string[]; // TypePairing ids allowed for this archetype
  palette: PaletteRules;
  headingScale: number; //          settings.heading_scale (%)
  cornerRadius: number; //          px — cards/media
  buttonStyle: "solid" | "outline";
  /** Fixed hero pattern per archetype (composition rule: hero is not free). */
  heroPattern: "full-bleed-scrim" | "split" | "type-led" | "banner-compact";
  /** Header treatment per archetype — headers carry brand too. */
  headerPattern: "centered-stack" | "hairline" | "standard" | "poster" | "cta";
  /** Imagery art direction for step 5 prompts. Always text-free. */
  imageryDirection: string;
  /** Generated humans banned (uncanny risk) → curated library instead. */
  allowGeneratedHumans: false;
  /** Default homepage section sequence (section types, in order). */
  defaultPlan: string[];
}

export const ARCHETYPES: Archetype[] = [
  {
    id: "editorial",
    label: "Editorial",
    description:
      "Magazine-grade: large serif headlines, generous whitespace, image-led storytelling. For fashion, beauty, publishing-adjacent brands.",
    typePairings: ["playfair-assistant", "libre-baskerville-source", "prata-work"],
    palette: {
      backgroundMaxSaturation: 6,
      backgroundLightness: [92, 100],
      accentSaturation: [20, 70],
      tintedSurfaces: false,
      darkAllowed: false,
    },
    headingScale: 140,
    cornerRadius: 0,
    buttonStyle: "outline",
    heroPattern: "full-bleed-scrim",
    headerPattern: "centered-stack",
    imageryDirection:
      "cinematic photography, soft natural light, muted grade, negative space for composition — never text in image",
    allowGeneratedHumans: false,
    defaultPlan: [
      "hero",
      "rich-text",
      "featured-collection",
      "image-with-text",
      "collection-list",
      "testimonial-placeholder",
      "featured-collection",
      "trust-row",
      "newsletter",
    ],
  },
  {
    id: "minimal",
    label: "Minimal",
    description:
      "Product as hero: near-monochrome, tight grid, small type, zero ornament. For design objects, electronics, considered goods.",
    typePairings: ["tenor-nunito", "work-work", "dm-dm"],
    palette: {
      backgroundMaxSaturation: 3,
      backgroundLightness: [95, 100],
      accentSaturation: [0, 40],
      tintedSurfaces: false,
      darkAllowed: false,
    },
    headingScale: 110,
    cornerRadius: 4,
    buttonStyle: "solid",
    heroPattern: "type-led",
    headerPattern: "hairline",
    imageryDirection:
      "studio product photography on seamless neutral backgrounds, hard composition, consistent shadow direction",
    allowGeneratedHumans: false,
    defaultPlan: [
      "hero",
      "featured-collection",
      "rich-text",
      "featured-product",
      "multicolumn",
      "collection-list",
      "trust-row",
      "newsletter",
    ],
  },
  {
    id: "warm-craft",
    label: "Warm Craft",
    description:
      "Handmade and human: warm tinted neutrals, soft serif headings, texture. For makers, food, home goods, kids.",
    typePairings: ["cormorant-karla", "lora-karla", "vollkorn-rubik"],
    palette: {
      backgroundMaxSaturation: 14,
      backgroundLightness: [88, 98],
      accentSaturation: [30, 75],
      tintedSurfaces: true,
      darkAllowed: false,
    },
    headingScale: 125,
    cornerRadius: 12,
    buttonStyle: "solid",
    heroPattern: "split",
    headerPattern: "standard",
    imageryDirection:
      "warm daylight, natural materials, texture close-ups, earthy grade, hands-at-work from curated library only",
    allowGeneratedHumans: false,
    defaultPlan: [
      "hero",
      "multicolumn",
      "featured-collection",
      "image-with-text",
      "testimonial-placeholder",
      "collection-list",
      "featured-collection",
      "faq",
      "newsletter",
    ],
  },
  {
    id: "bold-street",
    label: "Bold Street",
    description:
      "Loud and graphic: poster type, high contrast, saturated accent, dense sections. For streetwear, drinks, youth brands.",
    typePairings: ["archivo-archivo", "oswald-open"],
    palette: {
      backgroundMaxSaturation: 8,
      backgroundLightness: [4, 16],
      accentSaturation: [70, 100],
      tintedSurfaces: false,
      darkAllowed: true,
    },
    headingScale: 155,
    cornerRadius: 0,
    buttonStyle: "solid",
    heroPattern: "full-bleed-scrim",
    headerPattern: "poster",
    imageryDirection:
      "flash-lit or high-contrast photography, saturated grade, urban context, graphic crops",
    allowGeneratedHumans: false,
    defaultPlan: [
      "hero",
      "featured-collection",
      "rich-text",
      "image-with-text",
      "collection-list",
      "featured-collection",
      "trust-row",
      "newsletter",
    ],
  },
  {
    id: "clinical-premium",
    label: "Clinical Premium",
    description:
      "Lab-grade trust: cool neutrals, precise sans type, evidence-led sections. For skincare, supplements, med-adjacent, B2B.",
    typePairings: ["dm-dm", "poppins-open", "prata-work"],
    palette: {
      backgroundMaxSaturation: 5,
      backgroundLightness: [94, 100],
      accentSaturation: [25, 60],
      tintedSurfaces: true,
      darkAllowed: false,
    },
    headingScale: 115,
    cornerRadius: 8,
    buttonStyle: "solid",
    heroPattern: "split",
    headerPattern: "cta",
    imageryDirection:
      "clean macro product shots, cool neutral grade, clinical surfaces, no lifestyle clutter",
    allowGeneratedHumans: false,
    defaultPlan: [
      "hero",
      "multicolumn",
      "featured-product",
      "rich-text",
      "featured-collection",
      "faq",
      "testimonial-placeholder",
      "trust-row",
      "newsletter",
    ],
  },
];

export function getArchetype(id: string): Archetype {
  const archetype = ARCHETYPES.find((a) => a.id === id);
  if (!archetype) {
    throw new Error(`Unknown archetype: ${id}`);
  }
  return archetype;
}

// ---------------------------------------------------------------------------
// Validators — step 7 runs these; failures enter the auto-repair loop.
// ---------------------------------------------------------------------------

export function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value.split("").map((c) => c + c).join("")
      : value;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function channelLuminance(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

/** WCAG contrast ratio between two hex colors (1–21). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

/** Hard ban: text below WCAG AA (4.5:1 body, 3:1 large headings). */
export function passesAA(
  foreground: string,
  background: string,
  largeText = false,
): boolean {
  return contrastRatio(foreground, background) >= (largeText ? 3 : 4.5);
}

/**
 * Hard bans on generated copy (PRD principle 4 — truthful by default).
 * Matched case-insensitively against every generated string.
 */
export const BANNED_COPY_PATTERNS: RegExp[] = [
  /lorem ipsum/i,
  /\b\d[\d.,]*\s*\+?\s*(five|5)[- ]star reviews?\b/i,
  /\b(rated|scored)\s+\d(\.\d)?\s*(\/|out of)\s*5\b/i,
  /\b\d[\d.,]*\+?\s*(happy|satisfied)\s+(customers|clients)\b/i,
  /\baward[- ]winning\b/i,
  /\bas seen (on|in)\b/i,
  /\b(only|just)\s+\d+\s+left\b/i,
  /\b(hurry|act now|don'?t miss out|limited time only)\b/i,
  /\b(clinically|scientifically) proven\b/i,
  /\b\d{1,3}\s*%\s*of (customers|users|buyers)\b/i,
];

export function findBannedCopy(text: string): RegExp | null {
  return BANNED_COPY_PATTERNS.find((p) => p.test(text)) ?? null;
}

/** Section types that render edge-to-edge imagery. */
const FULL_BLEED_SECTIONS = new Set(["hero", "image-banner", "slideshow", "video"]);

/**
 * Composition rule: never two adjacent full-bleed image sections; the plan
 * must alternate density (PRD §9).
 */
export function violatesComposition(sectionPlan: string[]): string | null {
  for (let i = 1; i < sectionPlan.length; i++) {
    if (
      FULL_BLEED_SECTIONS.has(sectionPlan[i]) &&
      FULL_BLEED_SECTIONS.has(sectionPlan[i - 1])
    ) {
      return `adjacent full-bleed sections: ${sectionPlan[i - 1]} → ${sectionPlan[i]}`;
    }
  }
  return null;
}

/** >2 typefaces is a hard ban; the pairing system enforces exactly 2 (or 1). */
export function validateTypePairing(archetypeId: string, pairingId: string): boolean {
  const archetype = getArchetype(archetypeId);
  return archetype.typePairings.includes(pairingId);
}
