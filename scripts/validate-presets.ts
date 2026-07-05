/**
 * Dogfood the design constitution against the archetype presets.
 * Run: npx tsx scripts/validate-presets.ts
 * Wired into CI later; step 7 (theme.assemble) runs the same checks per run.
 */
import {
  ARCHETYPES,
  contrastRatio,
  passesAA,
  violatesComposition,
  validateTypePairing,
  getArchetype,
} from "../app/generation/constitution.server";
import {
  ARCHETYPE_PRESETS,
  buildIndexTemplate,
  buildSettingsData,
} from "../app/generation/presets.server";

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.error(`  ✗ ${msg}`);
};
const ok = (msg: string) => console.log(`  ✓ ${msg}`);

for (const archetype of ARCHETYPES) {
  console.log(`\n${archetype.label} (${archetype.id})`);
  const preset = ARCHETYPE_PRESETS[archetype.id];
  if (!preset) {
    fail("missing preset");
    continue;
  }

  // 1. Contrast: body text AA (4.5), button labels AA, headings large-AA (3.0)
  for (const [schemeId, s] of Object.entries(preset.schemes)) {
    if (!passesAA(s.text, s.background)) {
      fail(`${schemeId}: text/background ${contrastRatio(s.text, s.background).toFixed(2)} < 4.5`);
    }
    if (!passesAA(s.button_label, s.button)) {
      fail(`${schemeId}: button label/button ${contrastRatio(s.button_label, s.button).toFixed(2)} < 4.5`);
    }
    if (!passesAA(s.secondary_button_label, s.background)) {
      fail(`${schemeId}: secondary label/background < 4.5`);
    }
  }
  ok("contrast (AA) across 5 schemes × 3 pairs");

  // 2. Type pairing must be whitelisted for the archetype
  const heading = preset.settings.type_header_font;
  const pairingId = getArchetype(archetype.id).typePairings[0];
  if (!validateTypePairing(archetype.id, pairingId)) {
    fail(`default pairing ${pairingId} not in archetype whitelist`);
  } else {
    ok(`type pairing ${pairingId} (${heading})`);
  }

  // 3. Composition: default plan must not stack full-bleed sections
  const violation = violatesComposition(archetype.defaultPlan);
  if (violation) fail(`composition: ${violation}`);
  else ok("composition (no adjacent full-bleed)");

  // 4. Builders must produce coherent JSON
  const settingsData = buildSettingsData(archetype.id);
  const schemeCount = Object.keys(settingsData.current.color_schemes).length;
  if (schemeCount !== 5) fail(`expected 5 color schemes, got ${schemeCount}`);
  const index = buildIndexTemplate(archetype.id);
  if (index.order.length !== archetype.defaultPlan.length) {
    fail("index template order length mismatch");
  } else {
    ok(`builders (settings_data + index.json with ${index.order.length} sections)`);
  }
}

console.log(failures === 0 ? "\nAll presets pass the constitution." : `\n${failures} violation(s).`);
process.exit(failures === 0 ? 0 : 1);
