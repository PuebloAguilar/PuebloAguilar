# Hourly public profile refresh

The active publisher is a dedicated macOS LaunchAgent scheduled at minute 17 of every hour. It runs while the host Mac is awake, using the existing authenticated Git credential. The panel always shows the original public source collection time.

`npm run publish:profile` fetches the newest valid public counters, renders the approved 50×30 grayscale portrait, commits only the six generated files and pushes `main`. It refuses to start when tracked work is present, locks concurrent runs and only pulls fast-forward changes. Temporary source failures keep the last valid snapshot. No additional credential is stored in the repository.

The LaunchAgent executes `scripts/publish-profile.mjs` with Node 24 or newer. Its stdout/stderr logs and plist belong to the host's local state and LaunchAgents directories, outside the public repository.

`profile.yml` is the equivalent GitHub Actions template with an hourly cron and manual dispatch. It is intentionally outside `.github/workflows/`: the current CLI credential lacks the `workflow` scope, so hosted execution is not active. To migrate later, install that file under `.github/workflows/`, verify a successful hosted run, then unload the local LaunchAgent to avoid duplicate publishing.
