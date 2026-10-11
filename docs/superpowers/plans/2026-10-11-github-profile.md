# GitHub Profile Implementation Plan

Goal: Publish the selected terminal profile with public AI metrics and verified hourly automation.

Architecture: Node fetches both public feeds, validates and reduces them to an allowlisted summary, generates themed SVGs and updates a semantic README. sharp samples the public avatar into fixed-width ASCII. GitHub Actions refreshes generated artifacts hourly.

1. Test data boundaries before implementation in tests/usage.test.mjs: owner/schema validation, token accounting, newest timestamp selection, private-field exclusion, missing counters and failure fallback. Run npm test to observe missing behavior.
2. Implement scripts/usage.mjs with summarize(feed), selectSnapshot(candidates, cached) and loadSnapshot({urls,cached,fetchImpl}); preserve the original collected timestamp and allow only numeric public fields. Install sharp from package.json and pin .references consultation submodules.
3. Implement scripts/render-profile.mjs and scripts/update-profile.mjs. Generate assets/profile-{dark,light}.svg and mobile equivalents, data/usage.json and a README with public links and a narrow-screen picture source. Escape every interpolated SVG string.
4. Verify counters against the public feed, XML validity, bounds and rendered variants. Record verification outside the build and public repository. Review the staged paths for accidental private data.
5. Publish the new profile repository, enable .github/workflows/profile.yml with minute-17 hourly cron and manual dispatch. Verify public README/raw images and an observed update run; report scheduler/runtime limitations precisely.
