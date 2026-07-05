/**
 * Archetype presets: concrete Dawn settings for each design archetype.
 *
 * These are the deterministic fallbacks of pipeline steps 2–3 ("archetype
 * defaults") and the starting point brand.system mutates with brand-derived
 * colors. Everything here writes ONLY into config/settings_data.json and
 * templates/*.json — never Liquid (PRD §7.4).
 *
 * Scheme roles (consistent across archetypes so the section planner can rely
 * on them):
 *   scheme-1 — base page
 *   scheme-2 — surface (subtle tinted/gray, alternating sections)
 *   scheme-3 — accent (loud: banners, newsletter, CTAs)
 *   scheme-4 — dark (footer, contrast blocks)
 *   scheme-5 — soft accent tint (quiet emphasis)
 */

import { getArchetype, TYPE_PAIRINGS } from "./constitution.server";

interface SchemeColors {
  background: string;
  text: string;
  button: string;
  button_label: string;
  secondary_button_label: string;
  shadow: string;
}

export interface ArchetypePreset {
  archetypeId: string;
  schemes: Record<
    "scheme-1" | "scheme-2" | "scheme-3" | "scheme-4" | "scheme-5",
    SchemeColors
  >;
  /** Flat Dawn global settings merged into settings_data.current. */
  settings: Record<string, string | number | boolean>;
}

const shared = {
  page_width: 1200,
  spacing_sections: 8,
  spacing_grid_horizontal: 12,
  spacing_grid_vertical: 12,
  animations_reveal_on_scroll: false,
  animations_hover_elements: "default",
  buttons_shadow_opacity: 0,
  card_shadow_opacity: 0,
  card_image_padding: 0,
  card_text_alignment: "left",
  card_border_thickness: 0,
  card_style: "standard",
  collection_card_style: "standard",
  collection_card_border_thickness: 0,
  collection_card_shadow_opacity: 0,
  collection_card_text_alignment: "left",
  blog_card_style: "standard",
  blog_card_border_thickness: 0,
  blog_card_shadow_opacity: 0,
  blog_card_text_alignment: "left",
  text_boxes_border_thickness: 0,
  text_boxes_shadow_opacity: 0,
  media_border_thickness: 1,
  media_border_opacity: 5,
  media_shadow_opacity: 0,
  badge_position: "bottom left",
} as const;

function radiusSet(radius: number) {
  return {
    buttons_radius: Math.min(radius, 40),
    card_corner_radius: radius,
    collection_card_corner_radius: radius,
    blog_card_corner_radius: radius,
    text_boxes_radius: radius,
    media_radius: radius,
    inputs_radius: Math.min(radius, 12),
    variant_pills_radius: Math.min(radius, 40),
    badge_corner_radius: Math.min(radius, 40),
    popup_corner_radius: radius,
    drawer_border_thickness: 1,
  };
}

function fontsFor(archetypeId: string) {
  const archetype = getArchetype(archetypeId);
  const pairing = TYPE_PAIRINGS.find((p) => p.id === archetype.typePairings[0])!;
  return {
    type_header_font: pairing.heading,
    type_body_font: pairing.body,
    heading_scale: archetype.headingScale,
    body_scale: 100,
  };
}

function outlineButtons(thickness = 1) {
  return {
    buttons_border_thickness: thickness,
    buttons_border_opacity: 100,
  };
}

export const ARCHETYPE_PRESETS: Record<string, ArchetypePreset> = {
  editorial: {
    archetypeId: "editorial",
    schemes: {
      "scheme-1": { background: "#FFFFFF", text: "#111111", button: "#1A1A1A", button_label: "#FFFFFF", secondary_button_label: "#111111", shadow: "#111111" },
      "scheme-2": { background: "#F5F4F1", text: "#111111", button: "#1A1A1A", button_label: "#FFFFFF", secondary_button_label: "#111111", shadow: "#111111" },
      "scheme-3": { background: "#1A1A1A", text: "#FFFFFF", button: "#FFFFFF", button_label: "#1A1A1A", secondary_button_label: "#FFFFFF", shadow: "#000000" },
      "scheme-4": { background: "#141414", text: "#F5F4F1", button: "#F5F4F1", button_label: "#141414", secondary_button_label: "#F5F4F1", shadow: "#000000" },
      "scheme-5": { background: "#ECE9E2", text: "#1B1B1B", button: "#1A1A1A", button_label: "#FFFFFF", secondary_button_label: "#1B1B1B", shadow: "#111111" },
    },
    settings: { ...shared, ...fontsFor("editorial"), ...radiusSet(0), ...outlineButtons(1) },
  },

  minimal: {
    archetypeId: "minimal",
    schemes: {
      "scheme-1": { background: "#FAFAFA", text: "#161616", button: "#2B2B2B", button_label: "#FAFAFA", secondary_button_label: "#161616", shadow: "#161616" },
      "scheme-2": { background: "#F0F0F0", text: "#161616", button: "#2B2B2B", button_label: "#FAFAFA", secondary_button_label: "#161616", shadow: "#161616" },
      "scheme-3": { background: "#2B2B2B", text: "#FAFAFA", button: "#FAFAFA", button_label: "#161616", secondary_button_label: "#FAFAFA", shadow: "#000000" },
      "scheme-4": { background: "#101010", text: "#EDEDED", button: "#EDEDED", button_label: "#101010", secondary_button_label: "#EDEDED", shadow: "#000000" },
      "scheme-5": { background: "#E8E8E8", text: "#161616", button: "#2B2B2B", button_label: "#FAFAFA", secondary_button_label: "#161616", shadow: "#161616" },
    },
    settings: { ...shared, ...fontsFor("minimal"), ...radiusSet(4), buttons_border_thickness: 0, buttons_border_opacity: 100, spacing_sections: 4 },
  },

  "warm-craft": {
    archetypeId: "warm-craft",
    schemes: {
      "scheme-1": { background: "#FAF6F0", text: "#2A2622", button: "#A34E31", button_label: "#FFF8F2", secondary_button_label: "#2A2622", shadow: "#2A2622" },
      "scheme-2": { background: "#F1E9DC", text: "#2A2622", button: "#A34E31", button_label: "#FFF8F2", secondary_button_label: "#2A2622", shadow: "#2A2622" },
      "scheme-3": { background: "#A34E31", text: "#FFF8F2", button: "#FFF8F2", button_label: "#A34E31", secondary_button_label: "#FFF8F2", shadow: "#5A2B1B" },
      "scheme-4": { background: "#2A2622", text: "#F5EFE6", button: "#F5EFE6", button_label: "#2A2622", secondary_button_label: "#F5EFE6", shadow: "#000000" },
      "scheme-5": { background: "#F6EDE2", text: "#2A2622", button: "#A34E31", button_label: "#FFF8F2", secondary_button_label: "#2A2622", shadow: "#2A2622" },
    },
    settings: { ...shared, ...fontsFor("warm-craft"), ...radiusSet(12), buttons_border_thickness: 0, buttons_border_opacity: 100 },
  },

  "bold-street": {
    archetypeId: "bold-street",
    schemes: {
      "scheme-1": { background: "#0E0E0E", text: "#F5F5F5", button: "#D7FF3E", button_label: "#0E0E0E", secondary_button_label: "#F5F5F5", shadow: "#000000" },
      "scheme-2": { background: "#1A1A1A", text: "#F5F5F5", button: "#D7FF3E", button_label: "#0E0E0E", secondary_button_label: "#F5F5F5", shadow: "#000000" },
      "scheme-3": { background: "#D7FF3E", text: "#0E0E0E", button: "#0E0E0E", button_label: "#D7FF3E", secondary_button_label: "#0E0E0E", shadow: "#0E0E0E" },
      "scheme-4": { background: "#F5F5F5", text: "#0E0E0E", button: "#0E0E0E", button_label: "#F5F5F5", secondary_button_label: "#0E0E0E", shadow: "#0E0E0E" },
      "scheme-5": { background: "#161616", text: "#F5F5F5", button: "#D7FF3E", button_label: "#0E0E0E", secondary_button_label: "#F5F5F5", shadow: "#000000" },
    },
    settings: { ...shared, ...fontsFor("bold-street"), ...radiusSet(0), buttons_border_thickness: 0, buttons_border_opacity: 100, spacing_sections: 0 },
  },

  "clinical-premium": {
    archetypeId: "clinical-premium",
    schemes: {
      "scheme-1": { background: "#FBFCFD", text: "#17202A", button: "#2C5F92", button_label: "#FFFFFF", secondary_button_label: "#17202A", shadow: "#17202A" },
      "scheme-2": { background: "#EEF2F5", text: "#17202A", button: "#2C5F92", button_label: "#FFFFFF", secondary_button_label: "#17202A", shadow: "#17202A" },
      "scheme-3": { background: "#2C5F92", text: "#FFFFFF", button: "#FFFFFF", button_label: "#2C5F92", secondary_button_label: "#FFFFFF", shadow: "#14293E" },
      "scheme-4": { background: "#17202A", text: "#EDF1F5", button: "#EDF1F5", button_label: "#17202A", secondary_button_label: "#EDF1F5", shadow: "#000000" },
      "scheme-5": { background: "#E4EBF1", text: "#17202A", button: "#2C5F92", button_label: "#FFFFFF", secondary_button_label: "#17202A", shadow: "#17202A" },
    },
    settings: { ...shared, ...fontsFor("clinical-premium"), ...radiusSet(8), buttons_border_thickness: 0, buttons_border_opacity: 100 },
  },
};

/** Full settings_data.json `current` object for an archetype. */
export function buildSettingsData(archetypeId: string) {
  const preset = ARCHETYPE_PRESETS[archetypeId];
  if (!preset) throw new Error(`No preset for archetype: ${archetypeId}`);
  const colorSchemes: Record<string, { settings: Record<string, string> }> = {};
  for (const [id, scheme] of Object.entries(preset.schemes)) {
    colorSchemes[id] = { settings: { ...scheme, background_gradient: "" } };
  }
  return {
    current: {
      ...preset.settings,
      color_schemes: colorSchemes,
    },
  };
}

/**
 * Map the archetype's abstract section plan onto Dawn section types and emit
 * templates/index.json. Placeholder copy is clearly labeled (truthful-by-
 * default: testimonials are never invented).
 */
const PLAN_TO_DAWN: Record<string, string> = {
  hero: "image-banner",
  "rich-text": "rich-text",
  "featured-collection": "featured-collection",
  "image-with-text": "image-with-text",
  multicolumn: "multicolumn",
  "featured-product": "featured-product",
  newsletter: "newsletter",
  faq: "collapsible-content",
  "testimonial-placeholder": "multicolumn",
  "collection-list": "collection-list",
  "trust-row": "multicolumn",
};

/** Scheme rotation so adjacent sections alternate density (PRD §9). */
const SECTION_SCHEMES = ["scheme-1", "scheme-2", "scheme-1", "scheme-5", "scheme-2"];

export function buildIndexTemplate(archetypeId: string) {
  const archetype = getArchetype(archetypeId);
  const sections: Record<string, object> = {};
  const order: string[] = [];

  archetype.defaultPlan.forEach((planStep, i) => {
    const dawnType = PLAN_TO_DAWN[planStep];
    if (!dawnType) throw new Error(`Unmapped plan step: ${planStep}`);
    const id = `${planStep.replace(/[^a-z0-9]/g, "_")}_${i}`;
    const scheme = i === 0 ? "scheme-1" : SECTION_SCHEMES[i % SECTION_SCHEMES.length];

    const base: Record<string, unknown> = {
      type: dawnType,
      settings: { color_scheme: scheme },
    };

    if (planStep === "testimonial-placeholder") {
      base.blocks = {
        quote_1: {
          type: "column",
          settings: {
            title: "A word from your customers",
            text: "<p>[Placeholder — replace with a real customer quote. Atelier never invents testimonials.]</p>",
          },
        },
      };
      base.block_order = ["quote_1"];
    }

    sections[id] = base;
    order.push(id);
  });

  return { sections, order };
}
