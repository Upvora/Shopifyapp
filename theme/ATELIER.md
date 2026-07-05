# Atelier Base — provenance and plan

## Provenance

Imported from **Dawn 15.5.0**, commit `83d5e6b4094d8019820bffafe04b242d0602ffe2`
of the fork `upvora/dawn` (upstream `Shopify/dawn`), on 2026-07-05.

Locales trimmed to the Atelier target set: EN (default), NL, FR, DE
(PRD §4.1). Everything else is unmodified Dawn at import time; Atelier
changes layer on top in subsequent commits so the diff vs upstream stays
auditable.

## License note (diligence item)

Dawn's license (see LICENSE.md) is MIT-style **with a field-of-use
restriction**: rights may only be exercised "to develop themes that
integrate or interoperate with Shopify software or services", with
distribution via the Shopify Theme Store called out. Atelier generates
derivative themes exclusively for merchants' own Shopify stores through
Shopify's Admin API — squarely the permitted purpose, and the same pattern
as agency Dawn customization. **Action before public launch:** have counsel
confirm this reading. (PRD §7.4 "verify current license terms at fork time"
— done, this is the result.)

## Tokenization plan (Phase 1)

1. Keep Dawn's settings/schema working at all times (Theme Check green).
2. Introduce Atelier design tokens as color schemes + settings presets per
   archetype (Editorial / Minimal / Warm Craft / Bold Street / Clinical
   Premium) rather than rewriting Dawn's CSS variable system.
3. Add ~24 opinionated Atelier sections alongside Dawn's, prefixed
   `atelier-`, each with a rich settings schema the pipeline writes to.
4. The AI writes ONLY JSON at runtime: config/settings_data.json,
   templates/*.json, section groups, locale strings. No runtime Liquid.
