# STH Live

Live operations dashboard for STH Piling Pty Ltd. Shown full-screen on the office wall computers — running jobs, weekly material totals, half-circle gauges of actual vs BOQ.

Hosted on GitHub Pages: **https://ajlewis4.github.io/sth-live/**

## What this repo is

A static PWA — just HTML/CSS/JS, no server. The wall screens load it in Chrome and "install" it as a desktop app via the yellow Install button in the header. Once installed it runs full-screen, refreshes data every 5 minutes, and keeps working if the network drops (service worker caches everything except `data.json`).

## Files

| File | Purpose |
|---|---|
| `index.html` | The dashboard UI. Don't edit unless changing layout/visuals. |
| `data.json` | All job + material data. **This is the only file weekly updates touch.** |
| `manifest.json` | PWA manifest — fullscreen, landscape, charcoal/yellow theme |
| `sw.js` | Service worker — offline cache, never caches `data.json` |
| `icon-*.png`, `favicon.png` | PWA icons |
| `README.md` | This file |
| `.gitignore` | Keeps OS junk out |

## Weekly update workflow

1. Al asks Cowork to "update this week's dashboard" — the `sth-piling-dashboard` skill rebuilds `data.json` with the new week's numbers
2. Drop the new `data.json` into this repo (drag-and-drop in the GitHub web UI works fine, or `git push` locally)
3. Commit message: `Week ending YYYY-MM-DD`
4. Wall screens pick up the change within 5 mins (or hit Ctrl+Shift+R for an instant refresh)

## Office screen setup (once per machine)

1. Open `https://ajlewis4.github.io/sth-live/` in Chrome
2. Click the yellow **Install** button in the header (top right)
3. Pin the app to the taskbar
4. Open it from the taskbar → press F11 for full-screen
5. Done — it now runs as its own app and survives reboots

## Data structure

`data.json` schema:

```json
{
  "lastUpdated": "ISO 8601 timestamp",
  "weekEnding": "YYYY-MM-DD",
  "materials": [
    { "key": "labour", "label": "Labour", "unit": "hrs" }
  ],
  "jobs": [
    {
      "id": "1309",
      "name": "44 Scott Grove",
      "client": "AG Construct",
      "status": "active",
      "supervisor": "Danny Brady",
      "startDate": "14 Apr 2026",
      "materials": {
        "labour": { "actual": 412, "boq": 580, "week": 78 }
      }
    }
  ]
}
```

`status` is one of `active`, `idle`, `complete`. Material values: `actual` is running total to date, `boq` is the quoted total (drives the gauge %), `week` is what was done this week (shown in the totals strip up top).

## Brand and visual rules

- Charcoal `#2E3038`, yellow `#F5C800`
- Gauge thresholds: green &lt;85%, yellow 85–100%, red &gt;100%
- 6 material columns currently — adding a 7th needs CSS tweaks in `index.html`

## Hosting

GitHub Pages, source: `main` branch, root folder. Public repo (free tier).
