# Pueblo Aguilar GitHub profile

Publish the terminal profile in the public profile repository `PuebloAguilar/PuebloAguilar`. The user selected the layout inspired by Andrew6rant and approved automatic hourly updates using existing public AI metrics.

## Approved visual

Use style 02, grayscale, at 50 columns and 30 rows, selected from the local resolution previews on 2026-10-11. Preserve the entire original square GitHub avatar, including its background; do not crop it or apply a silhouette mask. Character placement compensates for monospace proportions so the rendered photo area remains exactly square. The desktop photo occupies 408×408 pixels, with 13.6-pixel glyphs and 8.16-pixel advances. Dark-theme glyphs, positions and grayscale values match the approved preview exactly.

The panel pairs the ASCII portrait with identity, projects, public contact links and AI usage. Use orange keys, blue values and muted dotted leaders. Provide desktop dark/light and vertically arranged narrow-screen variants through a README picture element. Keep the portrait's dark square background in the light theme so the approved grayscale image stays recognizable. All final images are script-free, text-based SVGs; no bitmap portrait is embedded.

## Public data and meaning

Fetch only `https://www.puebloaguilar.com/api/ai-usage` and `https://soceo.ai/data/pueblo-ai-usage.json`. Validate owner, schema, collection timestamp, date ranges and nonnegative safe-integer counters. Publish an allowlisted summary with lifetime and seven-day totals. Select the newest valid source or cached snapshot without timestamp regression; temporary upstream failures preserve the previous collection.

Display tokens, input/output/cache tokens, messages, distinct sessions, tool calls and active days. Tokens include recorded cache usage; activity includes recorded subagents. Omit monetary cost estimates. Show the original source timestamp in America/Sao_Paulo and the recorded lifetime date range. No local prompts, session records, file paths or credentials are collected.

## Automation and dependencies

A GitHub Actions workflow runs at minute 17 of every hour and supports manual dispatch. Node 24 runs npm ci, counter-validation tests and the updater, then commits only the generated README, SVGs and public counter summary. Use the ephemeral GITHUB_TOKEN with repository contents write permission. GitHub may delay scheduled jobs; the original collection time remains visible.

Use npm sharp for image decoding and ASCII sampling. Pin consultation submodules under `.references/`; keep them outside the build. The small custom renderer is justified by the existing public aggregate schema and exact selected visual. The Andrew6rant repository is a visual reference without a declared source license, so its source or SVGs are not copied.

## Verification

Before publication: counter validation and failure-fallback tests, exact comparison against the approved ASCII portrait, SVG XML parsing, square character geometry, dark/light and narrow-screen visual inspection, and staged-path review. After publication: confirm the profile README and raw SVGs load publicly, then observe a successful manual Actions run that refreshes and publishes the panel. Configuration alone does not prove execution.
