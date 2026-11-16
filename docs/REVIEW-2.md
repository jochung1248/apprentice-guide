# Review round 2 — independent QA (17 Nov 2026)

**Reviewer:** fresh agent that did not build the site. No site files were edited. Scripts used for this review live outside the repo (`/home/claude/review2_scripts/`); screenshots are in `screenshots/review2/`.

## Verdict against the acceptance criteria

| # | Criterion | Verdict | Notes |
|---|---|---|---|
| 1 | Calculators work and match hand-checked examples; `node --test` passes | **PASS** | `node --test` (from root): 23/23 pass. The literal `node --test tests/` **errors on Node 22** ("Cannot find module …/tests"); `node --test tests/*.test.js` passes 23/23 (see m1). The UI matched my own independent Python model (written from the ATO/DEWR rules, not from calc.js) on **19 input sets**: 8 apprentice-pay, 6 employer-cost, 5 trade-vs-uni. Every output agreed to the dollar or the cent, including the edge cases: adult year 4, part-time 20 h / 37.5 h, 0 / −5 / 50 hours, start age 25 and 30, max target 35, minimum span 18→21, 0% growth and 0% indexation. |
| 2 | Every displayed figure traceable to `rates.js` with source + date; unverified ones labelled | **FAIL** | One figure is wrong against its own source. The employer calculator deducts **$2,500 Priority Hiring Incentive for part-time apprentices**, but DEWR's 1 Jul 2026 overview gives **$1,250** for part-time ($500 + $750). The calculator's own hint says "Part-time amounts are lower" (M1). Everything else I spot-checked against primary sources is correct (see "Figures checked" below). |
| 3 | Clean at 390px and 1280px, no console errors | **PASS** (with UX Majors) | 11 pages × 2 viewports: no console or page errors, no horizontal page overflow, all 25 internal links and fragments resolve. Mobile UX problems (nav, results far below inputs) are listed as Majors M3 and M4. |
| 4 | Zero network apart from optional Google Fonts | **PASS** | The only off-site requests are `fonts.googleapis.com` and `fonts.gstatic.com`. There is no fetch/XHR/beacon/WebSocket/storage, no `<img>`, no remote CSS `url()` and no root-absolute paths. |
| 5 | Five guides + about page complete, accurate, plain English, disclaimers | **FAIL** (quick copy fixes) | All six pages are complete, dated, sourced and carry disclaimers; Australian English and tone are good. Three accuracy problems: the headline "4 in 10 **construction** apprentices" is a trade-wide statistic (M2); "five years" should be four (m4); and the FAQ says "roughly level by the mid-30s", which contradicts the guide's own numbers (m5). |
| 6 | Forms show in-page confirmation; no dialogs | **PASS** | Newsletter, enquiry and waitlist: an empty submit shows inline errors (1, 6 and 3) and moves focus; a valid submit hides the form, shows a role=status confirmation, stays on the same URL and opens no dialog. |
| 7 | Independent reviewer sign-off | **NOT SIGNED OFF — conditional** | I will sign off once **M1–M6** are fixed and re-tested. No Blockers were found, and all the Majors are small, contained changes. |

## Figures checked against primary sources (all fetched 17 Nov 2026)

| Figure(s) in `rates.js` | Source fetched | Result |
|---|---|---|
| MA000020 carpenter Y1–Y4 (no-Y12 and Y12), adult $1,108.44, L3 $1,214.04; bricklayer Y1 $642.53, adult $1,096.48, L3 $1,202.08; published 2 Jul 2026 | FWO pay guide PDF | Match |
| MA000025 electrician Y1–Y4 both columns, adult $982.95 / $1,098.29, grade 5 $1,223.11 ($32.19); published 7 Aug 2026 | FWO pay guide PDF | Match |
| MA000036 plumber Y1–Y4 both columns, adult $1,046.31 ×3 then $1,099.48, registered $1,246.54, not registered $1,201.78; published 11 Aug 2026 | FWO pay guide PDF | Match |
| 2026–27 resident brackets (15% / 30% / 37% / 45%; $18,200 / $45k / $135k / $190k) | ATO tax rates page | Match |
| LITO $700, 5c from $37,500, $325 at $45,000, 1.5c to $66,667, non-refundable | ATO LITO page | Match |
| Medicare low-income $28,011 / $35,013 (2025–26), 10c-per-$1 phase-in | ATO page (its worked example: $29,000 → $98.90) | Match; correctly labelled illustrative because 2026–27 isn't published |
| HELP 2026–27: nil to $69,528; 15c; $9,028 + 17c over $129,717; 10% of total above $186,050 | ATO repayment thresholds page | Match |
| HELP indexation 2.8% (1 June 2026) | ATO indexation rates page (the Study Assist URL is robots-blocked) | Match |
| KAP apprentice $2,000 ×5 / part-time $1,000 ×5; KAP employer $2,000 + $3,000 / part-time $1,000 + $1,500; commencement dates 1 Jul 2025 and 1 Jan 2026 | DEWR payments overview (eff. 1 Jul 2026) + KAP factsheet (22 Dec 2025) | Match |
| Priority Hiring Incentive full-time $1,000 + $1,500 | DEWR overview | Match. **Part-time $500 + $750 is missing from rates.js and the calculator uses $2,500 (M1)** |
| AATSP $625 ×4; LAFHA $125.52 / $94.14 / $47.07; AASL $27,048 / $69,528 | DEWR overview | Match |
| KAP employer incentive extended to Dec 2026 commencements | Minister's release | Match |
| AWR 2026 +4.75%, NMW $1,004.90 | FWC decision announcement | Match |
| Student contributions 2026: $17,399 / $9,537 / $4,738 | Dept of Education 2026 indexed rates | Match |
| QILT GOS 2025: medians $77,000 all, $74,000 business, $82,500 engineering, $73,100 science, $80,000 computing; FT employment 75.4%; definition change | QILT 2025 national report (June 2026) | Match |
| NCVER outcomes 2025: 94.8% of trade completers employed; **27.7%** of trade non-completers cite pay, conditions or the workplace | NCVER page (it opened fine today) | Match. 27.7% is still `verified:false` with the note "from the project brief", so it can now be upgraded (m6) |
| Future Campus: 42% four-year drop-out (2021 commencements), 58.7% six-year completion, electricians 72% | Future Campus, 28 Jul 2026 | Match. The 42% is **trade-wide, not construction** (M2). The article doesn't name the 58.7% cohort year, so "started in 2019" is an inference (m7) |
| BuildSkills: 116,700 extra workers by 2029 | Ai Group summary | Match |
| Super guarantee 12% | ATO page in `sourceUrl` | 12% is correct, but the linked page only covers earnings paid to 30 June 2026 and doesn't state the 2026–27 rate. Stale link (m8) |

## Prioritised issues

### Blocker
None.

### Major

**M1. Part-time Priority Hiring Incentive is overstated by $1,250 (employer calculator).**
- Where: `site/js/calc.js` `employerCost()` lines 260–261 (`defaultIncentive = R.incentives.priorityHiring.value.firstYearMax` ignores `partTime`). In `site/js/rates.js` line 177, `priorityHiring` has no part-time value.
- Repro: Employer cost, bricklayer, adult, year 1, 20 hours, Priority Hiring → "Incentive this year −$2,500", while the hint says "Part-time amounts are lower."
- Fix: in rates.js, change `priorityHiring` to `{ fullTime: [{month:6,amount:1000},{month:12,amount:1500}], partTime: [{month:6,amount:500},{month:12,amount:750}] }`. Update the note, which can drop "instalment split unverified" because DEWR's overview confirms it. In calc.js, sum `value[partTime ? 'partTime' : 'fullTime']` exactly as `kapEmployer` does. Change the hint in `ui-employer-cost.js` line 35 to print the actual part-time amount. Add a test asserting PHI = $1,250 at 20 h. Remove "Priority Hiring Incentive instalment split and part-time amount" from PROGRESS.md "Not verified".

**M2. "Why 4 in 10 *construction* apprentices don't finish" misstates the statistic.**
- The 42% figure (Future Campus reporting NCVER) is for **trade apprentices overall**. The guide's own lede says "trade apprentices", and so does its `<title>`.
- Where: `site/guides/why-apprentices-dont-finish.html` line 37 (h1) and line 12 (Article JSON-LD headline); `site/index.html` line 90; `site/guides/index.html` line 58; `tools/guide-src/why-apprentices-dont-finish.body.html`; BUILD_PLAN guide list.
- Fix: change "construction apprentices" to "trade apprentices" everywhere, matching the `<title>`.

**M3. Mobile navigation hides two of five items off-screen.**
- At 390px the nav row is 626px wide in a 355px viewport. "Guides" and "About the numbers" can't be seen, and the only cue is the clipped "Employer co" (`screenshots/review2/index-mobile-fold.png`).
- Where: `site/css/styles.css` lines 85–91 (`.site-nav { overflow-x: auto }`, `white-space: nowrap`).
- Fix (no JS needed): below 640px, let the list wrap (`.site-nav ul { flex-wrap: wrap; white-space: normal; }`) with slightly smaller padding, so all five items show on two rows. Alternatively, use a `<details>` "Menu" disclosure, which is CSP-safe and has no JS.

**M4. On mobile the results sit far below the inputs, with no cue.**
- Results start at 1,272px on apprentice-pay (about 1.5 screens), 1,591px on employer-cost (about 1.9) and **2,428px on trade-vs-uni (about 2.9 screens)**. Nothing tells the user the answer is further down.
- Where: `site/apprentice-pay.html`, `employer-cost.html` and `trade-vs-uni.html` (`.calc` grid); `site/css/styles.css` line 140 / 174.
- Fix (pick one):
  - (a) Below 960px, add a compact sticky summary bar (`position: sticky; bottom: 0`) showing the key number, e.g. "$611 / week — see breakdown ↓", linking to `#results`. Give each `.results` an `id`.
  - (b) Put a short result line directly under the first two inputs.
  - (c) At minimum, add a "See your result ↓" link at the top of each form.
  - For trade-vs-uni, also move "Compare up to age", trade and field to the top and collapse the advanced assumptions (`<details>`) on mobile.

**M5. Logo is a hard hat, against the brand direction.**
- The header glyph and favicon are an ink hard hat on a hi-vis square, on all 11 pages (`<a class="brand">` SVG at about line 17 of each page, plus the favicon `<link rel="icon">` at about line 9). BRAND.md says "never a cartoon of a tradie" and "no … hard hats". The brief for this review specifies a **"TN" monogram (ink square, hi-vis letters)**.
- Note: the `docs/BRAND.md` in the repo **does not actually contain the monogram spec** (it only mentions a "brand avatar"). Add it to BRAND.md so the spec and the build agree.
- Fix: replace the SVG with an ink (`#16181D`) rounded square (rx 6), "TN" in Anton, `#FF6B1A`. On the ink header, give it a 1.5px `#5B616A` or hi-vis outline so it doesn't disappear. Use the same mark for the favicon data-URI. The header and footer are duplicated per page, so update all 11 (or the guide template plus `tools/wrap_guides.py`).

**M6. Scrollable tables aren't keyboard-reachable (axe "scrollable-region-focusable", serious).**
- Flagged at 390px on `guides/first-year-apprentice-pay-nsw.html` line 51 and `guides/career-change-adult-apprenticeship.html` line 50. The same pattern is in `guides/trade-vs-uni-at-25.html:51`, `trade-vs-uni.html:140` (when the details are opened) and `about-data.html:73`.
- REVIEW-1 reported axe as clean, but it only ran on 8 pages.
- Fix: give every `.table-scroll` `tabindex="0" role="region" aria-label="<table caption>"`.

### Minor

- **m1. Test command.** `node --test tests/` fails on Node 22. Add a root `package.json` with `"scripts": {"test": "node --test tests/*.test.js"}` so `npm test` works, and use that same command in README and the review briefs.
- **m2. Hours edge cases are silently rewritten, and the two calculators are inconsistent.** On apprentice-pay, 0 or negative hours compute as **38** and 50 computes as 38, while the field still shows 0, −5 or 50 (`ui-apprentice-pay.js` line 27). On employer-cost, 0 hours computes as **1 hour** and shows "$54/week" (`ui-employer-cost.js` line 20). Fix: clamp the same way in both (1–38), write the clamped value back to the field, and show a hint such as "Max 38 ordinary hours" or "Enter at least 1 hour".
- **m3. Trade-vs-uni age slider can disagree with the result.** If start age is 30 and the slider is at 25, the result is computed and labelled "By age 32" while the slider still shows 25 (`ui-trade-vs-uni.js` lines 37–38). Fix: when start age changes, set `#target.min = startAge + 2` and move the slider value to match.
- **m4. Wrong number of years in the trade-vs-uni guide.** `guides/trade-vs-uni-at-25.html` line 62 says "the **five** years Sam spends finishing school and studying". It is four (one year of school from 17 to 18, then three years of uni). Fix: "four".
- **m5. FAQ contradicts the guide body.** `guides/trade-vs-uni-at-25.html` line 92 and the FAQ JSON-LD on line 13 say "roughly level by the mid-30s". The body (and my model) shows the trade still **$54,731 ahead at 35**; on the business example uni only passes the trade at about age 40. Fix: "…the trade path is ahead at 25 and the gap narrows a lot by 35; a higher-paid degree like engineering is close to level."
- **m6. 27.7% should be upgraded.** The NCVER outcomes 2025 page is now readable and confirms 27.7% (and 94.8%). Set `research.nonCompleterEmploymentReasons.verified = true` in `rates.js` lines 238–239, change the note from "from the project brief" to cite NCVER, and drop the † on that sentence in `why-apprentices-dont-finish.html`. The † footnote also wrongly implies this figure came "from published summaries".
- **m7. Cohort year is inferred.** `tradeSixYearCompletion` says "started in 2019", but the Future Campus article doesn't name the cohort year. Either soften it ("six-year completion rate, latest cohort") or confirm it from NCVER directly, which is now reachable.
- **m8. Stale super source.** `rates.js` line 37 `SRC.atoSuper` points to "quarterly super to 30 June 2026", which doesn't cover 2026–27. Point it to the current ATO "How much super to pay" or Payday Super page for earnings paid from 1 July 2026.
- **m9. HELP indexation timing slightly overstates debt.** Indexation only applies to debt unpaid for more than 11 months, so a contribution incurred during a study year isn't indexed on the first 1 June after it. The model (`calc.js` lines 203–206) indexes it immediately. At 25 in the default case this overstates Sam's debt by about $1.5k. Fix: index the opening balance before adding that year's contribution, or state the simplification on about-data.html and in the guide.
- **m10. Inline script on the home page.** `site/index.html` line 171 has an inline `<script>` (the hook figure). It works today, but it is the only inline script and would break under a `script-src 'self'` CSP. Move it to `js/ui-home.js`.
- **m11. Non-standard attribute.** The tooltip uses `<i style-color="…">` (`ui-trade-vs-uni.js` lines 137–140). Rename it to `data-series`.
- **m12. Truncated select on mobile.** The incentive option text on the employer page is cut off at 390px ("Key Apprenticeship Program employ…"). Shorten the labels to "KAP employer incentive", "Priority Hiring Incentive" and "None".
- **m13. Unsourced claims in `why-apprentices-dont-finish.html`.** "Other common themes in the research are…" names no source for the list. "If you can pay above award in the first year, it's one of the strongest retention tools you have" and "Underpayment is a common reason people feel undervalued" are stated as fact. Either cite them (e.g. the NCVER 34.6% "work situation would need to change") or soften them to advice ("can help", "many apprentices say").
- **m14. Leftover server.** A `python3 -m http.server 8765 --directory site` from the build session (PID 500) was still running, so this review served on port 8766. Kill the stray server and/or note it in the e2e instructions.

## Brand check (against docs/BRAND.md)
- **Matches:**
  - Colour tokens are exact.
  - Anton, Inter and JetBrains Mono all load and are applied (h1/big numbers, body, kickers/labels).
  - The hazard stripe is used only as a top edge (header, home hook card).
  - The tick ruler sits under the heroes.
  - The payslip card has a dashed tear line and mono labels.
  - The highlighter appears only behind the one key number on each calculator.
  - Orange = trade and blueprint = uni in the chart, legend and fieldset swatches.
  - Hi-vis buttons have ink text; there are no emoji, gradients or photos.
- **Accepted, deliberate deviations** (documented in REVIEW-1, I agree with them):
  - The chart line uses hivis-deep.
  - Links on ink use blueprint-light.
- **Not matching:** the hard-hat logo (M5).

## Accessibility summary
- **Passes:**
  - One h1 per page and no skipped heading levels.
  - Every input, select and textarea has a label.
  - Visible 3px focus rings: ink on light grounds, hi-vis on the dark header, footer and forms. Checked by tabbing through apprentice-pay (`screenshots/review2/focus-ring-apprentice-pay-mobile.png`).
  - axe-core WCAG 2.1 A/AA: 0 violations on all pages at 1280px.
- **Open:** at 390px, the only violation is M6.

## Screenshots (`screenshots/review2/`)
- `<page>-mobile.png` / `<page>-desktop.png`: full-page shots of all 11 pages.
- `<page>-mobile-fold.png`: first screen of each page.
- Extras:
  - `apprentice-pay-mobile-results.png`
  - `trade-vs-uni-mobile-results.png`
  - `tvu-edge-start30-desktop.png`
  - `focus-ring-apprentice-pay-mobile.png`
