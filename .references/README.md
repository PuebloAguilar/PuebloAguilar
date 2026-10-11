# Consultation references

These pinned submodules are research material. They are excluded from runtime/build dependencies; the updater does not load files from them, and the workflow does not check them out. Adopted packages are installed through npm.

| Reference | Purpose | License | Consulted commit |
| --- | --- | --- | --- |
| [lovell/sharp](https://github.com/lovell/sharp) | Public-avatar decoding, grayscale sampling and SVG validation. Adopted as npm `sharp@0.35.5`; supports Node >=20.9 and macOS ARM/Linux runners. Recent upstream development verified 2026-10-11. | Apache-2.0; dependency notices apply separately | `3887f0f4805a302f81207a28c25a9f23c4ccea3c` |
| [Andrew6rant/Andrew6rant](https://github.com/Andrew6rant/Andrew6rant) | The user's selected visual reference: ASCII portrait, dotted terminal fields and light/dark README images. | No source license declared; consultation only, no source/SVG copied | `e059bd772121adab3f2a8c7c49d75303d8f39164` |

## Alternatives and integration decision

[lowlighter/metrics](https://github.com/lowlighter/metrics) (MIT, last push verified 2026-05-29) provides extensive GitHub profile plugins and SVG rendering. Its GitHub-focused data model would require an additional custom plugin/renderer to consume Pueblo's existing public AI aggregate schema. It was evaluated but not selected for this small integration.

The local renderer is preferable for the selected layout: it reads a compact public summary, formats the exact counters already collected elsewhere, and emits four script-free SVG images. There is no additional telemetry collection, pricing calculation, image service, or persistent access token. sharp supplies the reusable image decoding/sampling rather than implementing that machinery locally.
