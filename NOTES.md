# Project Notes

Internal notes for whoever (probably future-you) keeps building this. Written to be honest, not polished.

## Status: what's actually working

Verified via automated smoke-testing (rendering every tab in a headless DOM, plus a real UI-driven save/reload cycle) before this repo was packaged:

- ✅ All 10 tabs (Dashboard, Daily Plan, Mobility, Training, Schedule, Recovery, Nutrition, Timeline, Metrics, Print) render correctly and the router shows the right page every time.
- ✅ `localStorage` persistence round-trip confirmed: logging a value through the real UI, waiting out the debounce, and reading it back from storage works.
- ✅ Mobile responsive layout (hamburger nav under ~880px) is in place and uses standard CSS, not JS-based breakpoints, so it should hold up.
- ✅ Print stylesheet (`@media print`) strips the dark theme and hides interactive controls for the Print Master Sheet and the Daily Plan's "print the week" view.
- ✅ Backup/Restore (export to `.json`, import from `.json`) is wired up. Export uses `Blob` + `URL.createObjectURL`, which is standard in all real browsers. (Note: this specific browser API isn't fully implemented in the `jsdom` sandbox I used for automated testing, so that one piece was verified by code review and the DOM being present/wired, not an automated click-through. Worth a manual click-test in an actual browser before you rely on it.)

## Phone-app pass (home-screen web app)

- **Installable PWA:** `manifest.webmanifest`, `sw.js` (offline cache; network-first for the page with a 3 s timeout, cache-first for fonts/icons), app icons in `icons/`, iOS meta tags, safe-area insets for the notch/home indicator.
- **Mobile shell:** under 880px the sidebar is replaced by a blurred top app bar + bottom tab bar (Home · Today · Train · Fuel · More) and a "More" bottom sheet. Desktop keeps the sidebar. Long intro paragraphs collapse to 3 lines on phones (tap to expand). Inputs are 16px so iOS doesn't zoom on focus; hover effects only apply on devices that actually hover.
- **Date bug fixed:** `todayStr()` used `toISOString()` (UTC), so in North America "today" rolled over in the late afternoon/evening — splitting food logs, resetting mobility checkboxes and breaking streaks. Dates are now local calendar days (`ymd()` / `parseYmd()`). `liftsThisWeek()` also mis-parsed `"YYYY-MM-DD"` as UTC midnight and dropped Monday's lifts. Logs saved before this fix keep whatever date they were stored with.
- **Saving:** the "✓ Saved" toast now reflects whether the write succeeded (red error toast if storage is full/blocked), and pending writes are flushed when the app is backgrounded (iOS can kill a home-screen app instantly).
- **Backup:** export uses the phone share sheet (Save to Files, AirDrop…) where supported, otherwise a normal download; `S.lastBackup` drives a reminder on Home/Today after 14 days. Import now rejects JSON that isn't a Blueprint backup instead of silently resetting data.
- **Today tab:** one-tap "workout done" (`S.dailyDone`) and "mobility done" (`S.quickMob`) — both feed the weekly-lift count and mobility streak.
- **Training:** weight field pre-fills from your last set, "undo last" for a mistyped set, and "Last time" stays visible while logging today. Gym/No-Gym choice and last-open tab are remembered per device (`blueprint:ui:v1`, not part of backups).
- **Nutrition page overflowed a phone screen** (the whole layout zoomed out); fixed with `minmax(0,1fr)` columns and wrapping long supplement doses. Food names are HTML-escaped.
- Added `<!doctype html>` — the page was previously rendering in quirks mode.

## Coaching pass (the app now acts on its own advice)

- **Log entries can be fixed.** Weight, measurements, sleep and toe-touch entries each have a "Recent · fix or delete" list (measurements get a ✕ column). Before this, one mistyped weigh-in (1675 instead of 167.5) put you in Phase 3 with a 14,290 kcal target and the only fix was hand-editing a backup file. Logging again on the same day now *replaces* that day's entry (measurements merge field by field), inputs are range-checked, and a weigh-in more than 6% off your average asks for confirmation. `upsertDay()` does the one-per-day logic.
- **Trend weight.** `curWeight()` is now the average of the last 7 days of weigh-ins (identical to the latest weigh-in if you weigh weekly). Phase, macros and progress all use it, so 175 → 177 → 175 no longer flips Phase 1 → 2 → 1. `lastWeighIn()` returns the raw latest entry.
- **Rate-of-gain coach.** `gainRate()` is a least-squares slope over the last 28 days (it needs 3+ weigh-ins spanning 14+ days). `rateCoach()` / `coachNote()` apply the plan's rule: under 0.25 lb/wk → +200 kcal, over 0.75 → −200 (with a water/creatine caveat in weeks 1–4). The one-tap button writes `profile.calAdj`, which `macros()` adds to the target, and `lastCalAdj` blocks a second change for 14 days. `calAdj` can also be set by hand in Metrics.
- **Training week + deloads.** `profile.startDate` (defaults to the first weigh-in; editable in Metrics) drives `planWeek()`. Every 7th week (`DELOAD_EVERY`) is a deload week: a banner on Today/Train, and each exercise's target switches to ~60% of sets at ~80% load.
- **Train tab.** Opens on today's scheduled session once per day (`SESSION_DAY`, `UI.trainAuto`), then respects a manual pick. `target(ex)` compares your last session with the rep scheme (`parseScheme()`): top of the range on every set → "▲ add weight"; otherwise "same weight, add a rep". Holds, carries and AMRAP get "beat last time". Phase-gated moves (`(P2+)`, `(P3)` in the scheme) show "not yet" before that phase; plyos (`plyo:true`) get quality cues instead of load.
- **Rest timer.** Logging a set starts it (`restFor()`: 2:00 for 6–10-rep work, 1:30 otherwise); it has +30s and ✕, vibrates on Android when done, and holds a screen wake lock only while counting.
- **Toe-touch on iPhone.** The iOS decimal keypad has no minus key, so negative ("past your toes") values couldn't be typed. There's now a "Short of floor / Past toes" toggle and the input is always positive.
- **Nutrition quick-add.** Your 8 most recent distinct meals (the generic "Meal" is skipped) show as tap-to-add chips.
- **Charts** space points by date and label the date range, so a two-week gap in logging looks like one.
- New state fields: `profile.calAdj`, `profile.startDate`, `lastCalAdj`. `normalize()` fills them for old data and backups, and also sorts the dated logs and drops malformed weight entries.

## Known bug that was fixed in an earlier pass

The previous draft only ever showed the Dashboard tab — every other page's root `<div class="page">` was missing the `.on` class that makes it visible, because only `pgDash()`'s template hardcoded `class="page on"`. Every other page function just wrote `class="page"`. Fixed by having the router (`render()`) always add `.on` to whatever page it just injected, instead of relying on each page template to remember to include it. If you add new pages later, you don't need to worry about this — the router handles it.

## The bigger fix in this pass: storage layer

The previous version used `window.storage`, an API that **only exists inside Claude.ai's artifact sandbox.** It would have silently failed everywhere else — a real browser, GitHub Pages, or a file opened locally — because `window.storage` simply wouldn't exist, and every save/load call was wrapped in a `try/catch` that swallowed the resulting error. That means the app would have *looked* like it was saving (the "✓ Saved" toast would even still fire, because the toast isn't conditional on success) while actually saving nothing.

This has been rewritten to use the browser's built-in `localStorage`, which is synchronous, has no dependency on any host environment, and is what the README now documents accurately. The "✓ Saved" toast is now driven by the return value of `store.set()`.

## Personal data that was found and removed/flagged

- A supplement note under Vitamin D3 referenced a specific city ("Calgary winter"). This was hardcoded into the app's content and would have shipped to anyone who read the page. It's been generalized to "northern latitudes." If you fork this for someone else or make it public, do a search for any other personalized phrasing you added later.
- The default profile values (start weight 167 lb, goal weight 195 lb, height 74 in, age 22, activity multiplier 1.6) are **runtime-editable defaults**, not identity information — but they are still specific numbers describing one real person, sitting in the `DEFAULTS` object in plain sight. Not a security issue, but worth knowing before you show someone else the source code or a screen-share of your editor.
- No API keys, tokens, account info, or other credentials exist anywhere in this codebase. It makes zero network calls other than loading its own files (fonts are self-hosted).

## Design decisions that aren't obvious from the code

- **Single-file app on purpose.** Everything (HTML, CSS, JS) lives in `index.html`. For a project this size, with no build step, splitting into separate `.css`/`.js` files adds file-juggling overhead without a real benefit — there's no code-sharing across multiple pages, no team of people editing concurrently, and it stays easier to hand the whole thing to an AI assistant or a friend as one file. Revisit this if the file keeps growing past a few thousand lines, or once code-splitting/tooling actually make sense.
- **Phase auto-detection is a rough proxy.** The active phase (1/2/3) is inferred purely from 7-day-average bodyweight thresholds (176 lb, 188 lb). This is intentionally simple — it will occasionally be "wrong" in spirit (e.g., you could hit 176 lb quickly but not actually be ready, movement-wise, for Phase 2 training). The **benchmark checklists** inside the Timeline tab are the real gate; the auto-detected phase number is a nudge, not a certification. Don't over-trust the number without glancing at the checkboxes.
- **No framework, no dependencies, no build tool.** Vanilla JS with template-literal HTML generation was chosen deliberately to keep this a zero-install, zero-config static file that works by double-clicking it. If this grows significantly (more views, more shared state, more complex interactions), consider a real framework (React/Vue/Svelte) and a small build step — but that's a genuine rewrite, not an incremental change, given how the current templating works.
- **The motivation line and the live indicator strip (streaks, weekly lift count, % to goal) on the Daily Plan tab are entirely derived from your own logged data** — there's no hardcoded "day 1/day 2" copy. This means they're accurate from day one but also *only as good as your logging habit*. If you stop logging, the streaks/indicators quietly go stale rather than erroring.

## Ideas for what's next

- **Cross-device sync.** Right now everything is trapped in one browser via `localStorage`. If you want this on your phone *and* your laptop with shared data, you need a real backend (even something minimal like a Cloudflare Worker + KV store, or Firebase/Supabase) plus some form of auth. This is a genuine architecture change, not a tweak.
- **Plan content decisions (not code bugs; they need the plan's author to decide):**
  - Phase 1 says "Reps 10–15, 3–4 in reserve", but the gym program's presses are fixed at 8–10 (the Train targets follow the program's scheme). Either make the rep ranges phase-aware or change the Phase 1 description.
  - The Today (simple) plan and the Train (full) program prescribe different exercises for the same weekday, and Today's Tue/Fri list jumps in Phase 1 even though the plan says plyos start in Phase 2.
  - Phase thresholds (176/188 lb) and the benchmark bodyweights are hardcoded, so they don't move if you change the goal weight in settings. The "22-year-old" and 6'2" wording is also hardcoded in the page text rather than read from the profile.
- **Per-exercise history + PRs.** Only "last time" is shown. A small chart per exercise (top set or estimated 1RM over time) and a "new PR" badge would make progress more visible.
- **A real "did I skip today" nudge.** The app is now an installable PWA, but it has no push notifications (that needs a push server; iOS only allows web push for home-screen apps). A phone alarm or calendar reminder is the zero-effort option.
- **A "phase readiness" check instead of a pure weight threshold.** Cross-reference the phase's benchmark checkboxes with the bodyweight-based auto-detection, and only advance the phase number once both agree, or at least flag the mismatch.
- **Data visualization depth.** The line charts are hand-rolled inline SVG (see `drawLine()`) to avoid a charting-library dependency. That's fine at this scale, but if you want zoom/pan/tooltips, that's the point where pulling in a small charting library becomes worth the tradeoff.

## Testing notes

The coaching pass was checked with a throwaway Playwright script (a 41-check end-to-end run with the clock fixed to a Tuesday, plus phone and desktop screenshots of every page); like the earlier jsdom script, it isn't committed. There is no automated test suite shipped in this repo (kept it a pure static app with zero tooling, per the design decision above). Before packaging this version, I ran a one-off Node.js/`jsdom` script that loaded `index.html`, exercised every tab via the router, and confirmed a real UI-driven save/reload cycle against `localStorage` — that script isn't included here since it required `npm install jsdom` and this project intentionally has no `package.json` or dependency footprint. If you want a repeatable regression check as the app grows, recreating a similar jsdom-based smoke test (or switching to Playwright/Cypress for real-browser testing) would be a reasonable investment.
