# Apprentice Guide — developer README

Static MVP site: plain HTML + one CSS file + vanilla JS. No framework, no build step for the site, no runtime network requests except the optional Google Fonts stylesheet (system fonts take over if it can't load).

## Run locally
```bash
cd site
python3 -m http.server 8765
# open http://localhost:8765/
```
Pages also work from any static host (Cloudflare Pages, Netlify) and as a claude.ai artifact (relative paths only, no fetch/XHR, no remote images, no dialogs, forms use preventDefault).

## Tests
```bash
# from the project root
npm test                         # = node --test tests/*.test.js  (unit tests + content/constraint checks)
# (plain `node --test` from the root also works; `node --test tests/` does NOT on Node 22)

# browser checks + screenshots (needs Python Playwright and Chrome)
python3 -m http.server 8765 --directory site &     # stop it afterwards: pkill -f "http.server 8765"
python3 tests/e2e_check.py                        # screenshots (TN_BASE=http://localhost:PORT/ to use another port) -> screenshots/, prints JSON report, exit 1 on problems
python3 tests/e2e_check.py --offline              # aborts every non-localhost request (zero-network check)
python3 tests/e2e_check.py --font-dir /tmp/fontsrc  # sandbox without internet: serve brand fonts from local
                                                  # @fontsource packages (npm i @fontsource/anton @fontsource/inter @fontsource/jetbrains-mono)
```
`content.test.js` fails if any `$` or `%` figure in the HTML can't be traced to `rates.js` (directly or via a calc.js output listed in the test), if a CSP rule is broken (fetch, dialogs, remote images, root-absolute paths, inline `style=` attributes, external resources other than Google Fonts), or if a guide is missing its date, FAQ JSON-LD, sources, disclaimer or calculator link.

## File map
```
site/
  index.html               home: hook, calculator cards, guides, pre-apprenticeship enquiry form, newsletter
  apprentice-pay.html      calculator 1 (payslip card)
  trade-vs-uni.html        calculator 2 (inline SVG chart)
  employer-cost.html       calculator 3 + GTO explainer + Employer Dashboard waitlist (fake door)
  about-data.html          methodology, sources table rendered from rates.js, disclaimers
  guides/index.html + 5 guides
  css/styles.css           brand theme (docs/BRAND.md)
  js/rates.js              SINGLE SOURCE OF TRUTH for every figure {value, effectiveFrom, sourceUrl, sourceName, verified, note}
                           (payTables -> trades; states -> extra help + licensing; adultAge; under18; waNotice)
  js/calc.js               pure functions (UMD): incomeTax, helpRepayment, apprenticePay, tradeVsUni, employerCost
  js/ui-common.js          formatting, last-checked date, demo form handling (BACKEND PLUG-IN POINT: submitToBackend)
  js/ui-apprentice-pay.js, ui-trade-vs-uni.js, ui-employer-cost.js, ui-about.js   page wiring
tests/
  calc.test.js             hand-worked examples (arithmetic in comments)
  content.test.js          figure traceability + CSP + structure checks
  e2e_check.py             Playwright: screenshots at 390x844 and 1280x800, console errors, calculator and form runs
tools/
  wrap_guides.py           one-off authoring helper that wrapped tools/guide-src/*.body.html into site/guides/*.html
docs/
  BUILD_PLAN.md, BRAND.md, DATA_SOURCES.md, PROGRESS.md, REVIEW-<n>.md
```

## Updating rates each 1 July
0. Pay guides now cover nine awards (see `payTables` in `rates.js` and `docs/DATA_SOURCES.md`). Re-check the Priority List (DEWR publishes updates during the year) and every state item's date.
1. Read the Fair Work Commission's Annual Wage Review decision (usually early June) and wait for the new **pay guides** for MA000020, MA000025 and MA000036 (links in `docs/DATA_SOURCES.md`). Copy weekly and hourly figures into `rates.js` (`trades.*`), update `effectiveFrom`, `sourceName` (published date) and `research.awardIncrease2026` (rename for the year).
2. ATO: resident tax rates, LITO, Medicare levy low-income thresholds (set `verified:true` once the new year is published), super guarantee, HELP repayment thresholds.
3. DEWR: incentive payments overview (KAP apprentice/employer, Priority Hiring, AATSP, LAFHA, AASL) — watch for the KAP employer incentive end date (currently commencements to Dec 2026).
4. Study Assist: indexation rate (1 June). Department of Education: student contribution amounts (calendar year). QILT: new GOS report (usually mid-year).
5. Update `meta.lastChecked`, `meta.lastCheckedLabel`, `meta.financialYear`. Update static "last checked" text in page footers (`grep -rl "data-last-checked" site`) — JS overwrites it at runtime, but the static text is what search engines and no-JS users see.
6. Run `node --test`. The content test will list every guide figure that no longer matches — update guide text (edit `site/guides/*.html` directly, or the bodies in `tools/guide-src` and re-run `python3 tools/wrap_guides.py tools/guide-src`). Update the worked examples in `tests/calc.test.js` (recompute by hand).
7. Run `tests/e2e_check.py` and eyeball the screenshots.

## Adding a trade
Add (or reuse) a pay table in `T` in `rates.js`, then add a `trade(...)` line with its industry, table, Priority List name and KAP stream. The calculators, about page and tests pick it up automatically.

## Deploying
`tools/deploy-pages.sh` pushes `site/` to the `gh-pages` branch (GitHub Pages).

## Wiring real backends later
All three forms call `submitToBackend(formName, data)` in `js/ui-common.js`. Replace its body with the newsletter provider (Beehiiv/ConvertKit), the enquiry/lead endpoint (Tally/Formspree or an RTO/GTO lead API) and the waitlist endpoint. Under a strict CSP that will need a `connect-src`/`form-action` allowance on the real host.
