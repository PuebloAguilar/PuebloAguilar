# Consultation references

These pinned submodules are research material. They are excluded from runtime/build dependencies; the updater does not load files from them, and the workflow does not check them out. Adopted packages are installed through npm.

| Reference | Purpose | License | Consulted commit |
| --- | --- | --- | --- |
| [lovell/sharp](https://github.com/lovell/sharp) | Public image decoding, ASCII sampling and SVG validation. Adopted as npm `sharp@0.35.5`; supports Node >=20.9 and macOS ARM/Linux runners. Recent upstream development verified 2026-10-11. | Apache-2.0; dependency notices apply separately | `3887f0f4805a302f81207a28c25a9f23c4ccea3c` |
| [Andrew6rant/Andrew6rant](https://github.com/Andrew6rant/Andrew6rant) | The user's selected visual reference: ASCII portrait, dotted terminal fields and light/dark README images. | No source license declared; consultation only, no source/SVG copied | `e059bd772121adab3f2a8c7c49d75303d8f39164` |
| [node-cron/node-cron](https://github.com/node-cron/node-cron) | Evaluated minute/second scheduling and overlap prevention for the requested 60-second cadence. Consulted source version 4.6.0 supports Node >=20, ESM/CommonJS, and has no runtime dependencies. Upstream is not archived; latest push verified 2026-09-11 on 2026-10-12. Consultation only, not installed. | ISC; verified in LICENSE.md | `22cacf992364cd8786fd3b547aab0f1ac09c6f8e` |

## Alternatives and integration decision

[lowlighter/metrics](https://github.com/lowlighter/metrics) (MIT, last push verified 2026-05-29) provides extensive GitHub profile plugins and SVG rendering. Its GitHub-focused data model would require an additional custom plugin/renderer to consume Pueblo's existing public AI aggregate schema. It was evaluated but not selected for this small integration.

The local renderer is preferable for the selected layout: it reads a compact public summary, formats the exact counters already collected elsewhere, and emits themed, script-free SVG images. There is no additional telemetry collection, pricing calculation, image service, or persistent access token. sharp supplies the reusable image decoding/sampling rather than implementing that machinery locally.

For the 60-second refresh, native macOS launchd is preferable to adopting node-cron: the existing LaunchAgent already supplies process launch, logs and wake-aware scheduling, and the publisher already prevents overlap with a process lock. Changing StartInterval to 60 requires no permanent Node scheduler or new runtime dependency. node-cron would still need a supervised long-running process, adding integration work without solving GitHub's lack of live README updates. GitHub Actions was also evaluated; its minimum five-minute scheduled interval cannot supply the requested 60-second cadence. No custom scheduling loop is implemented.

## SOCEO brand asset

The user selected the SOCEO apple-touch-icon actually served by https://soceo.ai/assets/soceo-apple-touch-icon-256x256.png?v=20260827-5. Its original bytes are stored in assets/soceo-symbol.png and sampled into the approved 80×48 color ASCII grid. This is the user's requested brand asset, separate from the third-party consultation references.
