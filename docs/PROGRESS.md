# Tradie Numbers — progress log

## Status (17 Nov 2026)
MVP built and self-reviewed. All automated checks pass. **Waiting on an independent reviewer (acceptance criterion 7)** — the build session had no sub-agent tool, so the main session needs to spawn a fresh reviewer (see `docs/REVIEW-1.md` for what was checked and how).

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

## Known issues
- Unverified (labelled in UI): Medicare levy low-income thresholds (2025–26 values used); per-trade KAP eligibility (provider list); NCVER 27.7% / 42% / 58.7% / 72% figures and BuildSkills 116,700 (secondary sources); all illustrative assumptions (part-time study income $15,000, pay growth 3%, market loading 0%, workers comp 4%, training fees $1,000, tools/PPE $800).
- Not verified: tax treatment of KAP payments; Priority Hiring Incentive instalment split and part-time amount.
- Mobile nav scrolls horizontally; results sit below inputs on mobile.
- Canonical URLs are `example.com` placeholders. Working name and domain unchecked.
- Logo glyph (hard hat) may need a designer's review against BRAND.md "never a cartoon of a tradie".
- The KAP employer incentive is announced only for commencements to December 2026 — re-check in January 2027.

## Next steps
1. Main session: spawn an independent reviewer for criterion 7 (and BRAND.md check); fix anything it raises.
2. Re-check Medicare 2026–27 thresholds when published; confirm KAP occupation list with DEWR or an Apprentice Connect provider.
3. Pick a domain, replace canonical placeholders, wire `submitToBackend()` to real services.
4. Consider a sticky mobile result bar and a menu button for mobile nav.
