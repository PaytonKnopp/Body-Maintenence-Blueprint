# The Blueprint

A personal strength, size, and mobility training system — built as a single-page web app that installs to your phone's home screen and works offline. It's a full transformation plan (mobility, gym + no-gym training programs, weekly schedule, sleep/recovery guidance, nutrition targets, phased timeline, and body-metrics tracking) plus a "just tell me what to do today" simplified daily view, all wrapped in a dark, dashboard-style UI.

This is a **personal-use tool**, not a commercial product. It was built for one person's specific training plan (lean bulk, wide-shoulder/back-width focus, back-friendly exercise selection, explosiveness for basketball/volleyball/baseball). The exercise selection and written guidance reflect that specific plan, not general-purpose fitness advice for any user.

## Features

- **Phone app** — add it to your home screen and it opens full-screen with its own icon, a bottom tab bar (Home · Today · Train · Fuel · More), and works with no signal.
- **Dashboard** — live progress bar to goal weight, current phase, this week at a glance, a rotating motivation line, and your rate of gain with an "eat more / eat less" call. When you reach your goal it says so and switches the plan to maintenance.
- **Daily Plan (Simple)** — one fixed workout per weekday (memorize Monday = Push, Tuesday = Legs & Jump, etc.), gym and no-gym versions (jumps are swapped for pogo hops and landing practice until Phase 2), with live streaks and weekly-lift-count indicators, the current training week and when the next deload falls, plus one-tap "workout done" / "mobility done" buttons. Printable as a one-page weekly cheat sheet.
- **Mobility & Back** — a ~12-minute daily routine with the reasoning behind each drill, a toe-touch distance tracker ("short of floor" / "past toes") with a regression ladder, and a progress chart.
- **Training** — full Gym program (dumbbell/cable/machine, 4-day upper/lower split) and a full No-Equipment/Travel program, both with set/rep logging and exercise notes. Opens on today's scheduled session; each exercise shows today's target from your last session ("add weight" once you hit the top of the rep range on every set, otherwise "same weight, add a rep"), flags Phase 2/3 moves that are too early, and switches to deload guidance on deload weeks. In Phase 3 the main lifts (DB shoulder press, flat DB press, chest-supported row, trap-bar deadlift) drop to 5–8 reps, as the phase table says. Your best set per exercise is shown, with a 🏆 toast when you beat it. Logging a set starts a rest timer (2 min for heavier compounds, 90 s otherwise) that keeps the screen awake while it counts. Includes plyometric/vertical-jump and grip-training guidance.
- **Weekly Schedule** — the fixed weekly structure with a day-by-day breakdown.
- **Recovery & Sleep** — sleep-hours guidance, deload cadence, and a nightly sleep logger with a 7-day average chart.
- **Nutrition & Fuel** — calorie/macro targets computed live from your 7-day average bodyweight (Mifflin-St Jeor + activity multiplier + the phase's surplus: +300 → +425 → +250, then maintenance at your goal, plus an optional calorie adjustment), a rate-of-gain check that offers a one-tap ±200 kcal change when you're gaining too slowly or too fast, a protein food-source table, a ranked supplement list, and a daily food logger with one-tap re-add of recent meals.
- **Timeline & Phases** — three training phases with explicit differences (rep ranges, effort, volume, calories) and checkable benchmarks per phase. The active phase is auto-detected from your 7-day average bodyweight. The phase lines and bodyweight benchmarks scale with your start and goal weight, a phase only moves backwards if you drop 3+ lb below its line, and you get a warning if your weight moves you up a phase before the previous phase's benchmarks are checked.
- **Metrics** — bodyweight and body-measurement logging with dated charts, plan settings (goal weight, height, age (counts up by itself), activity level, calorie adjustment, plan start date), and a **Backup & Restore** tool (export/import your data as a `.json` file). Every log (weight, measurements, sleep, toe-touch) can be corrected or deleted; logging again on the same day replaces that day's entry, and obviously wrong numbers (e.g. a 1675 lb weigh-in) are rejected.
- **Print Master Sheet** — a condensed, print-optimized version of the entire plan for a physical printout.

## Install it on your phone

The app is published with GitHub Pages at:

**https://paytonknopp.github.io/Body-Maintenence-Blueprint/**

(Pages serves the `master` branch; changes show up there a minute or two after they're merged.)

- **iPhone:** open the link in **Safari** → tap **Share** → **Add to Home Screen** → **Add**.
- **Android:** open the link in **Chrome** → menu **⋮** → **Add to Home screen** / **Install app**.

It then launches full-screen like a normal app. After the first launch it works offline, and it picks up new versions automatically the next time you open it with a connection.

### Getting a new home-screen icon

Everything else updates by itself, but the icon doesn't:

- **iPhone** saves the icon when you add the app and never re-checks it. To get a new icon you have to remove the app and add it again, **and removing it deletes its data**, so do it in this order:
  1. In the app: **More → Metrics & Backup → Export backup** → **Save to Files**.
  2. Long-press the Blueprint icon → **Remove App** → **Delete from Home Screen**.
  3. In Safari, open the link above → **Share** → **Add to Home Screen** → **Add**.
  4. In the new app: **More → Metrics & Backup → Import backup** → pick the file you saved.
- **Android** (Chrome) updates an installed app's icon on its own within a day or so. Nothing to do.

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
- `icons/` — app icon: an ember heart with a heartbeat line on the dark blueprint grid. `icon.svg` is the source; the PNGs are rendered from it (the 32 px favicon uses thicker strokes). Keep the heart inside the central 80% so Android's round masks don't clip it, and bump `VERSION` in `sw.js` when the icons change.
- `fonts/` — Oswald, Inter and JetBrains Mono, self-hosted so the app looks right offline (SIL Open Font License, see `fonts/LICENSE.md`).

No JavaScript frameworks, build tools, npm packages, API keys or accounts are used. The app makes no network requests except loading its own files.

## Browser support

Built for iPhone Safari / Android Chrome as an installed app, and still works in desktop Chrome, Edge, Firefox and Safari. Uses standard modern JS (template literals, arrow functions, `localStorage`, `fetch`-free architecture) and CSS (Grid, custom properties). No Internet Explorer support.

## License / usage

No license file is included by default — treat this as a private personal project. Add a `LICENSE` file yourself if you later decide to open it up for others to use or fork.
