/**
 * Emit the Phase 1 demo artifacts: per-archetype settings_data.json +
 * templates/index.json under demos/<archetype>/. These are exactly the two
 * files the pipeline's theme.assemble step will write per generated store.
 * Run: npx tsx scripts/build-archetype-demos.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ARCHETYPES } from "../app/generation/constitution.server";
import { buildIndexTemplate, buildSettingsData } from "../app/generation/presets.server";

const root = join(import.meta.dirname, "..", "demos");

for (const archetype of ARCHETYPES) {
  const dir = join(root, archetype.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "settings_data.json"),
    JSON.stringify(buildSettingsData(archetype.id), null, 2),
  );
  writeFileSync(
    join(dir, "index.json"),
    JSON.stringify(buildIndexTemplate(archetype.id), null, 2),
  );
  console.log(`demos/${archetype.id}: settings_data.json + index.json`);
}
