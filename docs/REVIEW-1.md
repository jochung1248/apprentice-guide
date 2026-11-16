# Review round 1 — 17 Nov 2026

**Reviewer status: NOT independent.** The build lead had no Agent/sub-agent tool in this session, so this review was carried out by the same agent that built the site, using independent methods where possible (a separate Python re-implementation of the maths, fresh re-fetches of the pay guides, axe-core, an offline browser run). Acceptance criterion 7 therefore remains **open**: the main session should spawn a fresh reviewer to sign off (brief: "Independent QA reviewer" in the build-lead instructions, plus a check against `docs/BRAND.md`).

## Method
1. `node --test` — 23 tests: 17 calculator/rates tests with hand-worked examples, 6 content/constraint tests.
2. `python3 tests/e2e_check.py --font-dir /tmp/fontsrc` — screenshots of 11 pages at 390x844 and 1280x800 (real brand fonts served locally because the sandbox can't reach Google Fonts), console errors, horizontal overflow, calculator runs, form runs.
3. `python3 tests/e2e_check.py --offline` — all non-localhost requests aborted.
4. Independent Python model (not calc.js) for tax, Medicare, LITO, HELP, apprentice pay, employer cost and trade-vs-uni; drove the UI with 12 new input sets and compared.
5. Re-fetched the three Fair Work pay guides with differently worded prompts and compared every apprentice/tradesperson figure in `rates.js`.
6. axe-core (WCAG 2 A/AA) on 8 pages.
7. Manual read of all copy for accuracy, tone, Australian English and disclaimers; brand check against `docs/BRAND.md`.

## Results
| # | Criterion | Result |
|---|---|---|
| 1 | Calculators work and match hand-checked examples; `node --test` passes | PASS — 23/23; UI matched the independent Python model for 5 pay, 4 employer and 3 trade-vs-uni input sets (to the dollar) |
| 2 | Every displayed figure traceable to `rates.js` with source + date; unverified labelled | PASS — `content.test.js` traces every `$`/`%` in HTML; about page renders sources from `rates.js`; illustrative inputs carry "illustrative — edit to suit"; secondary-source research figures marked † |
| 3 | Clean at 390px and 1280px, no console errors | PASS (after fixes below) |
| 4 | Zero network apart from Google Fonts | PASS — only `fonts.googleapis.com` requested; offline run clean |
| 5 | Five guides + about page complete, accurate, plain English, disclaimers | PASS — 5 guides, 780–920 words each, dated, FAQ + FAQPage JSON-LD, sources, disclaimer, calculator links |
| 6 | Forms show in-page confirmation; no dialogs | PASS — empty submit shows inline errors, valid submit shows confirmation, no navigation, no dialogs |
| 7 | Independent reviewer sign-off | **OPEN** — see note above |

Pay guide spot-check (10+ figures re-fetched): carpenter Y1 no-Y12 $654.49/$17.22, Y1 Y12 $710.45, Y4 $1,102.13, adult $1,108.44, L3 $1,214.04; bricklayer Y1 $642.53, adult $1,096.48, L3 $1,202.08; electrician Y1 $622.72/$16.39, Y12 Y2 $802.84, adult Y1 $982.95, grade 5 licensed $1,223.11; plumber Y1 $629.23, Y4 $1,099.48, adult $1,046.31, registered $1,246.54 — all match.

## Issues found and fixed in this round
| Priority | Issue | Fix |
|---|---|---|
| Major | axe colour-contrast: hivis-deep link on the alternate band (#EBE7DD) was 4.19:1 | Links on `.section-alt` use ink |
| Major | Offline (fallback fonts) the career-changer guide H1 overflowed at 390px | `overflow-wrap: break-word` on display headings |
| Major | Brand restyle required (`docs/BRAND.md` arrived mid-build) | Full restyle: tokens, Anton/Inter/JetBrains Mono via one css2 link, hazard-stripe top edge, tick ruler, payslip card, highlighter only behind each calculator's key number, chart orange = trade / blueprint = uni, hi-vis buttons with ink text |
| Minor | Employer page breakdown badges said "illustrative" only | Full "illustrative — edit to suit" label |
| Minor | Fieldset border line ran through mono legends | Removed the divider |
| Minor | Payslip total rule misaligned | Fixed alignment |
| Minor | Sources table didn't wrap on the about page | Wrapping column widths |
| Minor | Chart "Age" label overlapped the first x tick | Moved to the axis end |
| Minor | Unsourced claims in copy ("productive within months", "usually costs more", "NCVER tracks every contract", "awards recognise adult costs") | Softened or removed |
| Minor | Home lede said every figure came from Fair Work/ATO/DEWR (QILT and assumptions too) | Reworded |

## Known deviations from BRAND.md (deliberate, for accessibility)
- Trade line in the chart uses `hivis-deep` (#C2410C) instead of `hivis` (#FF6B1A): #FF6B1A is 2.78:1 on white, below the 3:1 non-text minimum. Pair validated with the dataviz palette checker (CVD ΔE 31.7, all checks pass).
- Links on ink use `blueprint-light` (#8FA8FF, 7.8:1) rather than `blueprint` (#2F5BEA is 3.2:1 on ink, below AA for text).
- `go` green (#1F8A4C) is 4.38:1 on white, so it's only used for borders next to text labels, never as small text.

## Remaining issues (not blockers)
- Medicare low-income thresholds are 2025–26 values (2026–27 not yet published) — labelled illustrative.
- KAP per-trade eligibility comes from an Apprentice Connect provider list (DEWR doesn't publish one we could read) — labelled illustrative, and users can untick it.
- NCVER completion/reason figures and the BuildSkills 116,700 figure come from secondary summaries (NCVER/BuildSkills sites block automated fetching) — marked † with a footnote.
- Mobile nav is a horizontally scrolling row (no menu button); works, but the last items are off-screen until scrolled.
- On mobile, calculator results sit below the inputs; consider a sticky result bar later.
- Canonical URLs use `https://www.example.com/` placeholders.
- Logo is a simple hard-hat glyph; BRAND.md warns against tradie cartoons — worth a designer's eye.

**Verdict (self-review): PASS on criteria 1–6. Criterion 7 requires an independent reviewer.**
