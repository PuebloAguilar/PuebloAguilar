# GitHub Profile Implementation Plan

Goal: Publish the selected terminal profile with public AI metrics and verified hourly automation.

Architecture: Node fetches both public feeds, validates and reduces them to an allowlisted summary, generates themed SVGs and updates a semantic README. sharp samples the user-selected SOCEO symbol into an 80×48 color ASCII grid. A dedicated macOS LaunchAgent refreshes generated artifacts hourly using the existing Git authentication; a hosted Actions template is retained for later enablement.

1. Test data boundaries before implementation in tests/usage.test.mjs: owner/schema validation, token accounting, newest timestamp selection, private-field exclusion, missing counters and failure fallback. Run npm test to observe missing behavior.
2. Implement scripts/usage.mjs with summarize(feed), selectSnapshot(candidates, cached) and loadSnapshot({urls,cached,fetchImpl}); preserve the original collected timestamp and allow only numeric public fields. Install sharp from package.json and pin .references consultation submodules.
3. Implement scripts/render-profile.mjs and scripts/update-profile.mjs. Generate assets/profile-{dark,light}.svg and mobile equivalents, data/usage.json and a README with independent uppercase PUEBLO AGUILAR and SOCEO.AI links below the symbol, plus narrow-screen metric pictures. Escape every interpolated SVG string.
4. Verify counters against the public feed, XML validity, bounds and rendered variants. Record verification outside the build and public repository. Review the staged paths for accidental private data.
5. Publish the new profile repository. The CLI workflow-scope restriction requires the local publication path: verify publisher work-preservation tests, register a dedicated LaunchAgent at minute 17 each hour, and observe a real refreshed public commit. Retain automation/profile.yml as the hosted Actions template. Verify public README/raw images and report that local refresh requires an awake host.
