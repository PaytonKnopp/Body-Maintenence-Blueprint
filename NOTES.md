# Project Notes

Internal notes for whoever (probably future-you) keeps building this. Written to be honest, not polished.

## Status: what's actually working

Verified via automated smoke-testing (rendering every tab in a headless DOM, plus a real UI-driven save/reload cycle) before this repo was packaged:

- ✅ All 10 tabs (Dashboard, Daily Plan, Mobility, Training, Schedule, Recovery, Nutrition, Timeline, Metrics, Print) render correctly and the router shows the right page every time.
- ✅ `localStorage` persistence round-trip confirmed: logging a value through the real UI, waiting out the debounce, and reading it back from storage works.
- ✅ Mobile responsive layout (hamburger nav under ~880px) is in place and uses standard CSS, not JS-based breakpoints, so it should hold up.
- ✅ Print stylesheet (`@media print`) strips the dark theme and hides interactive controls for the Print Master Sheet and the Daily Plan's "print the week" view.
- ✅ Backup/Restore (export to `.json`, import from `.json`) is wired up. Export uses `Blob` + `URL.createObjectURL`, which is standard in all real browsers. (Note: this specific browser API isn't fully implemented in the `jsdom` sandbox I used for automated testing, so that one piece was verified by code review and the DOM being present/wired, not an automated click-through. Worth a manual click-test in an actual browser before you rely on it.)

## Known bug that was fixed in this pass

The previous draft only ever showed the Dashboard tab — every other page's root `<div class="page">` was missing the `.on` class that makes it visible, because only `pgDash()`'s template hardcoded `class="page on"`. Every other page function just wrote `class="page"`. Fixed by having the router (`render()`) always add `.on` to whatever page it just injected, instead of relying on each page template to remember to include it. If you add new pages later, you don't need to worry about this — the router handles it.

## The bigger fix in this pass: storage layer

The previous version used `window.storage`, an API that **only exists inside Claude.ai's artifact sandbox.** It would have silently failed everywhere else — a real browser, GitHub Pages, or a file opened locally — because `window.storage` simply wouldn't exist, and every save/load call was wrapped in a `try/catch` that swallowed the resulting error. That means the app would have *looked* like it was saving (the "✓ Saved" toast would even still fire, because the toast isn't conditional on success) while actually saving nothing.

This has been rewritten to use the browser's built-in `localStorage`, which is synchronous, has no dependency on any host environment, and is what the README now documents accurately. If you ever see the "✓ Saved" toast not matching reality again, check `persist()` and `store.set()` first — that toast currently fires optimistically rather than based on a confirmed write.

## Personal data that was found and removed/flagged

- A supplement note under Vitamin D3 referenced a specific city ("Calgary winter"). This was hardcoded into the app's content and would have shipped to anyone who read the page. It's been generalized to "northern latitudes." If you fork this for someone else or make it public, do a search for any other personalized phrasing you added later.
- The default profile values (start weight 167 lb, goal weight 195 lb, height 74 in, age 22, activity multiplier 1.6) are **runtime-editable defaults**, not identity information — but they are still specific numbers describing one real person, sitting in the `DEFAULTS` object in plain sight. Not a security issue, but worth knowing before you show someone else the source code or a screen-share of your editor.
- No API keys, tokens, account info, or other credentials exist anywhere in this codebase. It makes zero network calls other than the static Google Fonts CDN request.

## Design decisions that aren't obvious from the code

- **Single-file app on purpose.** Everything (HTML, CSS, JS) lives in `index.html`. For a project this size, with no build step, splitting into separate `.css`/`.js` files adds file-juggling overhead without a real benefit — there's no code-sharing across multiple pages, no team of people editing concurrently, and it stays easier to hand the whole thing to an AI assistant or a friend as one file. Revisit this if the file keeps growing past a few thousand lines, or once code-splitting/tooling actually make sense.
- **Phase auto-detection is a rough proxy.** The active phase (1/2/3) is inferred purely from logged bodyweight thresholds (176 lb, 188 lb). This is intentionally simple — it will occasionally be "wrong" in spirit (e.g., you could hit 176 lb quickly but not actually be ready, movement-wise, for Phase 2 training). The **benchmark checklists** inside the Timeline tab are the real gate; the auto-detected phase number is a nudge, not a certification. Don't over-trust the number without glancing at the checkboxes.
- **No framework, no dependencies, no build tool.** Vanilla JS with template-literal HTML generation was chosen deliberately to keep this a zero-install, zero-config static file that works by double-clicking it. If this grows significantly (more views, more shared state, more complex interactions), consider a real framework (React/Vue/Svelte) and a small build step — but that's a genuine rewrite, not an incremental change, given how the current templating works.
- **The motivation line and the live indicator strip (streaks, weekly lift count, % to goal) on the Daily Plan tab are entirely derived from your own logged data** — there's no hardcoded "day 1/day 2" copy. This means they're accurate from day one but also *only as good as your logging habit*. If you stop logging, the streaks/indicators quietly go stale rather than erroring.

## Ideas for what's next

- **Cross-device sync.** Right now everything is trapped in one browser via `localStorage`. If you want this on your phone *and* your laptop with shared data, you need a real backend (even something minimal like a Cloudflare Worker + KV store, or Firebase/Supabase) plus some form of auth. This is a genuine architecture change, not a tweak.
- **Automated progression suggestions.** The app currently just shows your last logged sets; it doesn't yet suggest "you hit the top of your rep range last time, add 5 lb today." That logic would live in `renderExos()` / `logSet()` in the Training tab and would be a nice, contained next feature.
- **A real "did I skip today" nudge.** The mobility streak counter exists, but there's no push notification or reminder system (this is a static page — it can't notify you when it's not open). If you want reminders, that requires either a native app wrapper, a PWA with notification permissions, or an external reminder tool (calendar, phone alarm) — worth deciding deliberately rather than half-building.
- **A "phase readiness" check instead of a pure weight threshold.** Cross-reference the phase's benchmark checkboxes with the bodyweight-based auto-detection, and only advance the phase number once both agree, or at least flag the mismatch.
- **Data visualization depth.** The line charts are hand-rolled inline SVG (see `drawLine()`) to avoid a charting-library dependency. That's fine at this scale, but if you want zoom/pan/tooltips, that's the point where pulling in a small charting library becomes worth the tradeoff.
- **PWA / installable app.** Adding a manifest + service worker would let this be "installed" to a phone home screen and work offline (fonts aside) without becoming a native app. Independent of any backend work above.

## Testing notes

There is no automated test suite shipped in this repo (kept it a pure static app with zero tooling, per the design decision above). Before packaging this version, I ran a one-off Node.js/`jsdom` script that loaded `index.html`, exercised every tab via the router, and confirmed a real UI-driven save/reload cycle against `localStorage` — that script isn't included here since it required `npm install jsdom` and this project intentionally has no `package.json` or dependency footprint. If you want a repeatable regression check as the app grows, recreating a similar jsdom-based smoke test (or switching to Playwright/Cypress for real-browser testing) would be a reasonable investment.
