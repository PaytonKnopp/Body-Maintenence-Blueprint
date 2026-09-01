# The Blueprint

A personal strength, size, and mobility training system — built as a single-page interactive web app. It's a full transformation plan (mobility, gym + no-gym training programs, weekly schedule, sleep/recovery guidance, nutrition targets, phased timeline, and body-metrics tracking) plus a "just tell me what to do today" simplified daily view, all wrapped in a dark, dashboard-style UI.

This is a **personal-use tool**, not a commercial product. It was built for one person's specific training plan (lean bulk, wide-shoulder/back-width focus, back-friendly exercise selection, explosiveness for basketball/volleyball/baseball). The exercise selection and written guidance reflect that specific plan, not general-purpose fitness advice for any user.

## Features

- **Dashboard** — live progress bar to goal weight, current phase, this week at a glance, a rotating motivation line.
- **Daily Plan (Simple)** — one fixed workout per weekday (memorize Monday = Push, Tuesday = Legs & Jump, etc.), gym and no-gym versions, with live streaks and weekly-lift-count indicators. Printable as a one-page weekly cheat sheet.
- **Mobility & Back** — a ~12-minute daily routine with the reasoning behind each drill, a toe-touch distance tracker with a regression ladder, and a progress chart.
- **Training** — full Gym program (dumbbell/cable/machine, 4-day upper/lower split) and a full No-Equipment/Travel program, both with set/rep logging, exercise notes, and progression logic. Includes plyometric/vertical-jump and grip-training guidance.
- **Weekly Schedule** — the fixed weekly structure with a day-by-day breakdown.
- **Recovery & Sleep** — sleep-hours guidance, deload cadence, and a nightly sleep logger with a 7-day average chart.
- **Nutrition & Fuel** — calorie/macro targets computed live from your logged bodyweight (Mifflin-St Jeor + activity multiplier), a protein food-source table, a ranked supplement list, and a daily food logger.
- **Timeline & Phases** — three training phases with explicit differences (rep ranges, effort, volume, calories) and checkable benchmarks per phase. The active phase is auto-detected from logged bodyweight.
- **Metrics** — bodyweight and body-measurement logging with charts, plan settings (goal weight, height, age, activity level), and a **Backup & Restore** tool (export/import your data as a `.json` file).
- **Print Master Sheet** — a condensed, print-optimized version of the entire plan for a physical printout.

## How to run it

This is a **static, single-file, no-build web app**. There is nothing to install and nothing to compile.

1. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari) — double-click the file, or drag it into a browser window.
2. That's it. The app runs entirely client-side.

There is no local server, bundler, package manager, or build step required. If you open this project in an IDE, you are only ever *editing and previewing a static file* — there is no "run/build" command.

## Storage — read this before you rely on it

The app saves all your logged data (weight, measurements, workout logs, food logs, sleep logs, mobility check-ins, settings) to your **browser's `localStorage`**, under the key `blueprint:state:v2`.

This means:

- **Your data is tied to one browser, on one device.** It will not appear if you open `index.html` in a different browser, a different computer, an incognito/private window, or on your phone unless you specifically move it there.
- **Clearing your browser's site data/cache, or clearing browsing history with "cookies and site data" included, will delete it.** There is no cloud backup by default.
- **Nothing is sent to any server.** All data stays on your machine. This is good for privacy, but it means *you* are responsible for backing it up.
- Use the **Backup & Restore** tool on the Metrics tab to export your data to a `.json` file (and re-import it later, on this or another device/browser). Do this periodically, and especially before clearing browser data or making significant code changes to the app.

If you want cross-device sync in the future, that would require adding a real backend or a sync service (e.g., a small database + API, or a service like Firebase) — this version intentionally has none of that, to keep it a simple static file.

## External dependencies

- **Google Fonts** (via CDN, loaded in the `<head>`): Oswald, Inter, JetBrains Mono. Requires an internet connection on first load per browser session; if offline, the app still works but falls back to system fonts.
- No JavaScript frameworks, build tools, or npm packages are used or required to run the app. It's vanilla HTML/CSS/JS in one file.
- No API keys, accounts, or external services are needed. There is nothing to configure.

## Browser support

Built and tested against modern evergreen browsers (Chrome, Edge, Firefox, Safari — recent versions). Uses standard modern JS (template literals, arrow functions, `localStorage`, `fetch`-free architecture) and CSS (Grid, custom properties). No Internet Explorer support.

## License / usage

No license file is included by default — treat this as a private personal project. Add a `LICENSE` file yourself if you later decide to open it up for others to use or fork.
