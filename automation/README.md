# Weekly profile refresh — Tuesdays

Updated21October2026. One local coordinator runs Tuesday09:00America/Sao_Paulo, collects the existing public aggregate once, publishes the website snapshot and runs this repository publisher with `AI_USAGE_SOURCE_FILE` pointing to the same collection. The coordinator lives in the personal-site project: `/Users/pueblo/Projects/paginadelinks/scripts/publish-weekly-metrics.mjs`.

The active LaunchAgent is `com.pueblo.profile.ai-usage`, with `StartCalendarInterval` Tuesday09:00, no per-minute interval and no RunAtLoad. The previous `com.pueblo.github-profile` job is unloaded/disabled with its original plist preserved and backed up. The computer must be on with the user session and network available; sleep events are coalesced on wake. This is a local schedule, not hosted execution.

The publisher operates in `/Users/pueblo/.local/state/weekly-ai-metrics/github-profile`, a clean operational clone. The existing developer checkout, including its uncommitted generated images/data and output folder, is preserved. The publisher retains its clean-work guard and concurrency lock, fast-forward pull and generated-file allowlist.

`npm run publish:profile` commits fourteen SVGs and the public counter summary first, then writes/commits the README with image URLs pinned to that immutable asset commit. Both commits are pushed together. The four company-section variants preserve the independent SOCEO.AI link immediately below PUEBLO AGUILAR while keeping the black panel continuous. README updates include the collection date and all displayed values; they are part of the weekly job. An invalid supplied shared snapshot fails closed. Manual calls without `AI_USAGE_SOURCE_FILE` retain the existing public-endpoint fallback behavior.

`profile.yml` remains an inactive GitHub Actions template outside `.github/workflows/`, updated to Tuesday12:00UTC. Enabling it would require removing the local duplicate publisher and arranging the shared source; it is not enabled by this change.

GitHub renders static README HTML/images. Reload or revisit the profile to see a new publication. Immutable URLs prevent mutable-branch image caches from keeping the older panel. No credential or private conversation content is stored in this repository.
