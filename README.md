# The Blueprint

A personal strength, size, and mobility training system — built as a single-page web app that installs to your phone's home screen and works offline. It's a full transformation plan (mobility, gym + no-gym training programs, weekly schedule, sleep/recovery guidance, nutrition targets, phased timeline, and body-metrics tracking) plus a "just tell me what to do today" simplified daily view, all wrapped in a dark, dashboard-style UI.

This is a **personal-use tool**, not a commercial product. It was built for one person's specific training plan (lean bulk, wide-shoulder/back-width focus, back-friendly exercise selection, explosiveness for basketball/volleyball/baseball). The exercise selection and written guidance reflect that specific plan, not general-purpose fitness advice for any user.

## Features

- **Phone app** — add it to your home screen and it opens full-screen with its own icon, a bottom tab bar (Home · Today · Train · Fuel · More), and works with no signal.
- **Dashboard** — live progress bar to goal weight, current phase, this week at a glance, a rotating motivation line.
- **Daily Plan (Simple)** — one fixed workout per weekday (memorize Monday = Push, Tuesday = Legs & Jump, etc.), gym and no-gym versions, with live streaks and weekly-lift-count indicators, plus one-tap "workout done" / "mobility done" buttons. Printable as a one-page weekly cheat sheet.
- **Mobility & Back** — a ~12-minute daily routine with the reasoning behind each drill, a toe-touch distance tracker with a regression ladder, and a progress chart.
- **Training** — full Gym program (dumbbell/cable/machine, 4-day upper/lower split) and a full No-Equipment/Travel program, both with set/rep logging, exercise notes, and progression logic. Includes plyometric/vertical-jump and grip-training guidance.
- **Weekly Schedule** — the fixed weekly structure with a day-by-day breakdown.
- **Recovery & Sleep** — sleep-hours guidance, deload cadence, and a nightly sleep logger with a 7-day average chart.
- **Nutrition & Fuel** — calorie/macro targets computed live from your logged bodyweight (Mifflin-St Jeor + activity multiplier), a protein food-source table, a ranked supplement list, and a daily food logger.
- **Timeline & Phases** — three training phases with explicit differences (rep ranges, effort, volume, calories) and checkable benchmarks per phase. The active phase is auto-detected from logged bodyweight.
- **Metrics** — bodyweight and body-measurement logging with charts, plan settings (goal weight, height, age, activity level), and a **Backup & Restore** tool (export/import your data as a `.json` file).
- **Print Master Sheet** — a condensed, print-optimized version of the entire plan for a physical printout.

## Install it on your phone

The app is published with GitHub Pages at:

**https://paytonknopp.github.io/Body-Maintenence-Blueprint/**

(Pages serves the `master` branch; changes show up there a minute or two after they're merged.)

- **iPhone:** open the link in **Safari** → tap **Share** → **Add to Home Screen** → **Add**.
- **Android:** open the link in **Chrome** → menu **⋮** → **Add to Home screen** / **Install app**.

It then launches full-screen like a normal app. After the first launch it works offline, and it picks up new versions automatically the next time you open it with a connection.

On a computer you can also just open `index.html` in a browser. Offline mode only works when the app is served over `https://` (or `localhost`), not from a double-clicked file.

## Storage — read this before you rely on it

The app saves all your logged data (weight, measurements, workout logs, food logs, sleep logs, mobility check-ins, settings) to your **browser's `localStorage`**, under the key `blueprint:state:v2`.

This means:

- **Your data is tied to one browser, on one device.** It will not appear in a different browser, a different device, or an incognito/private window unless you move it there with a backup file.
- **On iPhone, the home-screen app and Safari keep separate data.** If you logged anything in Safari before adding the app to your home screen, export a backup in Safari and import it inside the home-screen app.
- **Clearing your browser's site data/cache, or clearing browsing history with "cookies and site data" included, will delete it.** There is no cloud backup by default.
- **Nothing is sent to any server.** All data stays on your machine. This is good for privacy, but it means *you* are responsible for backing it up.
- Use the **Backup & Restore** tool (More → Metrics & Backup) to save your data to a `.json` file and restore it later. On a phone, the export opens the share sheet — pick **Save to Files** or send it to yourself. The Home and Today screens remind you if it has been more than two weeks since your last backup.

If you want cross-device sync in the future, that would require adding a real backend or a sync service (e.g., a small database + API, or a service like Firebase) — this version intentionally has none of that, to keep it a simple static file.

## Files

- `index.html` — the whole app (HTML, CSS, JS).
- `manifest.webmanifest` — app name, colours and icons for "Add to Home Screen".
- `sw.js` — service worker that caches the app so it opens offline. Bump `VERSION` in it if you change fonts or icons.
- `icons/` — app icon (`icon.svg` is the source; the PNGs are rendered from it).
- `fonts/` — Oswald, Inter and JetBrains Mono, self-hosted so the app looks right offline (SIL Open Font License, see `fonts/LICENSE.md`).

No JavaScript frameworks, build tools, npm packages, API keys or accounts are used. The app makes no network requests except loading its own files.

## Browser support

Built for iPhone Safari / Android Chrome as an installed app, and still works in desktop Chrome, Edge, Firefox and Safari. Uses standard modern JS (template literals, arrow functions, `localStorage`, `fetch`-free architecture) and CSS (Grid, custom properties). No Internet Explorer support.

## License / usage

No license file is included by default — treat this as a private personal project. Add a `LICENSE` file yourself if you later decide to open it up for others to use or fork.
