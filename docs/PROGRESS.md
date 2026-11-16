# Tradie Numbers — progress log

## Status (17 Nov 2026)
MVP built. Independent review round 2 (`docs/REVIEW-2.md`) raised 6 Majors and 14 Minors; all Majors and most Minors are fixed (see below). **Awaiting the round-2 reviewer's re-test/sign-off of M1–M6 (criterion 7).**

## What's built
- Pages: `index.html`, `apprentice-pay.html`, `trade-vs-uni.html`, `employer-cost.html`, `about-data.html`, `guides/index.html` + 5 guides.
- Data: `site/js/rates.js` (single source of truth, FY 2026–27). Research log: `docs/DATA_SOURCES.md`.
- Maths: `site/js/calc.js` (UMD, pure functions).
- Tests: `tests/calc.test.js` (hand-worked examples), `tests/content.test.js` (figure traceability, CSP, structure), `tests/e2e_check.py` (Playwright screenshots, console errors, calculator and form runs, `--offline`).
- Brand: `docs/BRAND.md` applied in `site/css/styles.css`.

## Key decisions
- **No framework, no build step.** Header/footer are duplicated in each page. Guides were wrapped once with `tools/wrap_guides.py` from `tools/guide-src/*.body.html`; either edit the HTML directly or re-run the script.
- **Building trades use residential rates** (KAP is housing-focused). Non-residential rates are slightly higher; noted in UI and about page.
- **Pay guide figures are used as published** (weekly and hourly). Part-time = weekly ÷ 38 × hours.
- **Tax** = end-of-year resident liability on weekly × 52 (not PAYG withholding). LITO is non-refundable and doesn't reduce Medicare.
- **KAP/incentive payments** are shown separately and are not taxed in any calculator (tax treatment unverified).
- **Trade vs uni** holds 2026–27 tax/HELP thresholds constant; same pay growth for both paths; HELP: add contribution → deduct compulsory repayment → index remainder each year. Trade qualified wage defaults to the **award minimum** (0% loading) because no primary-source market wage was found; graduate salary is the QILT **median** — the guide spells out this asymmetry.
- **Adult apprentice** = starting age 21+ (trade-vs-uni switches to adult rates automatically).
- **Unverified figures**: `verified:false` → "illustrative — edit to suit" badge in calculators and the about table; research figures in guides from secondary sources → † footnote linking to `about-data.html#research`.
- **Forms** are front-end only; `submitToBackend()` in `js/ui-common.js` is the single plug-in point. Enquiry form states 18+ or parent/guardian and has the "Under 18 – I'm a parent/guardian enquiring" age band.
- **Brand deviations for accessibility**: chart trade line uses hivis-deep; links on ink use blueprint-light; go-green only as borders. Details in `docs/REVIEW-1.md`.
- **No inline `style=` attributes** (strict CSP); dynamic positioning uses the CSSOM.
- Fonts: one Google Fonts css2 link per page; system fallbacks. Offline run verified.

## Review rounds
- **Round 1 (self-review, not independent)** — `docs/REVIEW-1.md`. Fixed: contrast on alternate band, offline heading overflow, brand restyle, badge wording, fieldset divider, payslip alignment, sources-table wrapping, chart label overlap, unsourced copy claims. Verdict: PASS on 1–6; 7 open.

- **Round 2 (independent)** — `docs/REVIEW-2.md`. Conditional: sign-off once M1–M6 fixed. Fixed in response:
  - M1 part-time Priority Hiring Incentive now $1,250 ($500 + $750) in `rates.js` + `employerCost()`; new test; hint prints the actual FT/PT amount.
  - M2 "construction" → "trade" apprentices in the guide title/H1/JSON-LD, home card and guides index (BUILD_PLAN.md left as the owner's original brief).
  - M3 mobile nav wraps to two rows below 640px (all five links visible).
  - M4 sticky compact result bar on all three calculators below 960px (key number + "See full breakdown ↓" → `#results`).
  - M5 hard hat replaced by the "TN" monogram (header + favicon data URI, all 11 pages and `tools/wrap_guides.py`); spec added to `docs/BRAND.md`.
  - M6 every `.table-scroll` has `tabindex="0" role="region" aria-label`. axe WCAG 2.1 A/AA: 0 violations on all 11 pages at 390px and 1280px.
  - Minors fixed: m1 `package.json` (`npm test`) + README; m2 hours clamped 1–38 in both calculators, written back with a hint; m3 age slider min follows start age; m4 "five" → "four" years; m5 FAQ "mid-30s" corrected; m6 27.7% now verified (NCVER outcomes 2025, which also confirms 94.8%); m7 58.7% cohort year no longer asserted; m8 super source → ATO "How to work out and pay super" (earnings from 1 July 2026); m9 HELP indexation simplification stated on about page and in the guide (model unchanged); m10 home inline script moved to `js/ui-home.js`; m11 `data-series` attribute; m12 shorter incentive option labels; m13 unsourced claims softened; m14 stray server stopped (README notes `pkill`).
  - Not done: trade-vs-uni field reordering/collapsing on mobile (sticky bar addresses the main problem); m9 model change (stated instead).

## Known issues
- Unverified (labelled in UI): Medicare levy low-income thresholds (2025–26 values used); per-trade KAP eligibility (provider list); NCVER completion figures 42% / 58.7% / 72% and BuildSkills 116,700 (secondary sources); all illustrative assumptions (part-time study income $15,000, pay growth 3%, market loading 0%, workers comp 4%, training fees $1,000, tools/PPE $800).
- Not verified: tax treatment of KAP payments.
- HELP indexation is applied to new debt immediately (slightly overstates balances; stated in UI copy).
- Canonical URLs are `example.com` placeholders. Working name and domain unchecked.
- The KAP employer incentive is announced only for commencements to December 2026 — re-check in January 2027.

## Next steps
1. Round-2 reviewer to re-test M1–M6 and sign off criterion 7.
2. Re-check Medicare 2026–27 thresholds when published; confirm KAP occupation list with DEWR or an Apprentice Connect provider.
3. Pick a domain, replace canonical placeholders, wire `submitToBackend()` to real services.
4. Consider reordering/collapsing the trade-vs-uni inputs on mobile.
