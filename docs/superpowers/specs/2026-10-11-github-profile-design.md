# Pueblo Aguilar GitHub profile

Publish the terminal profile in the public profile repository `PuebloAguilar/PuebloAguilar`. The user selected the layout inspired by Andrew6rant and approved automatic hourly updates using existing public AI metrics.

## Approved visual

Use the actual SOCEO apple-touch-icon in color at 80 columns and 48 rows, selected from the local symbol-resolution previews on 2026-10-11. Source: https://soceo.ai/assets/soceo-apple-touch-icon-256x256.png?v=20260827-5, saved unchanged at assets/soceo-symbol.png. Preserve the whole square icon and its purple, white and metallic colors. Character placement compensates for monospace proportions. Following the requested readability refinement, the symbol-only image has a 432×432 symbol with 9-pixel glyphs, 5.4-pixel advances and an 8-pixel outer inset in the same 448×448 image. The selected 80×48 character grid and sampled colors remain unchanged.

Place the symbol beside the terminal identity/contact/AI metrics. Below the symbol, show two independent uppercase HTML links: PUEBLO AGUILAR to https://www.instagram.com/puebloaguilar/, followed by SOCEO.AI to https://www.soceo.ai/. These must be real README anchors; links inside an SVG embedded as img cannot provide independent clicks on GitHub. A two-column README table pairs a symbol-only picture with a metrics-only picture and keeps both anchors below the symbol in one h3 block for larger captions. GitHub's own table borders and the 37%/63% column split are retained. The desktop metrics SVG uses a 600-pixel viewBox, 18.5-pixel type and 26-pixel line spacing. Reducing the dotted leaders from the previous 756-pixel canvas makes the displayed type about 41% larger at the same rendered width. The panel grows vertically to fit the larger text; changing the img width alone would still be constrained by GitHub's README column.

Use SOCEO purple keys, blue values and muted dotted leaders. The keys use the live site's violet palette: #9c6bff on dark backgrounds and #7839ee on light backgrounds. The symbol retains its dark background in both themes. The metrics use dark/light pictures and a narrow-screen source with a 320-pixel viewBox and 22-pixel type. Narrow views wrap values at word boundaries and place paired counters on separate rows, preserving every counter while avoiding tiny text. Also generate complete dark/light desktop/mobile SVGs for standalone previews; their uppercase captions have native SVG anchors. All generated images are script-free text-based SVGs, with no embedded bitmap. The updater emits ten SVGs plus the README and allowlisted counter summary. The public profile omits the About the AI metrics disclosure and all panel footnotes, as requested; operational metric definitions stay in this document. Keep picture blocks free of blank lines so GitHub Markdown renders their source and img tags instead of converting the indented HTML into a code block.

## Public data and meaning

Fetch only `https://www.puebloaguilar.com/api/ai-usage` and `https://soceo.ai/data/pueblo-ai-usage.json`. Validate owner, schema, collection timestamp, date ranges and nonnegative safe-integer counters. Publish an allowlisted summary with lifetime and seven-day totals. Select the newest valid source or cached snapshot without timestamp regression; temporary upstream failures preserve the previous collection.

Display tokens, input/output/cache tokens, messages, distinct sessions, tool calls and active days. Tokens include recorded cache usage; activity includes recorded subagents. Omit monetary cost estimates. Show the original source timestamp in America/Sao_Paulo and the recorded lifetime date range. No local prompts, session records, file paths or credentials are collected.

## Automation and dependencies

The current GitHub CLI credential permits repository writes but lacks the workflow scope. The working publication path is a macOS LaunchAgent at minute 17 of every hour using the existing authenticated Git credential. It runs while the Mac is awake, refuses to overwrite tracked work, uses an exclusive process lock, pulls with --ff-only, and commits only the generated README, ten SVGs and public counter summary. The original collection time remains visible. A GitHub Actions template supporting hourly schedule and manual dispatch is preserved at automation/profile.yml for a future move to hosted execution; it is not enabled.

Use npm sharp for image decoding and ASCII sampling. Pin consultation submodules under `.references/`; keep them outside the build. The small custom renderer is justified by the existing public aggregate schema and exact selected visual. The Andrew6rant repository is a visual reference without a declared source license, so its source or SVGs are not copied.

## Verification

Before publication: counter validation and failure-fallback tests, exact comparison against the approved 80×48 symbol, SVG XML parsing, square character geometry, dark/light and narrow-screen visual inspection, and staged-path review. After publication: confirm the profile README and raw SVGs load publicly, verify the two uppercase links have separate destinations in the GitHub-rendered HTML, then observe the registered LaunchAgent run successfully, verify its refreshed commit on GitHub, and confirm that the minute-17 hourly schedule is loaded. Configuration alone does not prove execution.
