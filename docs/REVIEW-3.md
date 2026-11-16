# Review round 3 — independent QA of v1.1 "Apprentice Guide" (17 Nov 2026, commit 80f61d3)

**Reviewer:** the same independent reviewer as round 2 (did not build the site). No site files were edited. Method:
- Served on port 8768 (stopped afterwards).
- Ran my own Playwright scripts and my own Python model, all kept outside the repo.
- Opened the official sources live with WebFetch.

Screenshots are in `screenshots/review3/`.

## Verdict against the acceptance criteria

| # | Criterion | Verdict | Notes |
|---|---|---|---|
| 1 | Calculators match hand-checked examples; tests pass | **PASS** | `npm test`: 32/32. The UI matched my independent model to the cent on **12 apprentice-pay cases** across all 6 new awards (ages 15, 16, 17, 18, 19, 20, 21, 22, 25 and 30; Year 12 on and off; part-time) and **11 employer cases**. Age edge cases all behave correctly: 20 → junior, 21 → adult, 14 → 15, 61 → 60, blank → 17. The under-18 note shows at 15–17 only. One rounding quirk: m4. |
| 2 | Figures traceable to `rates.js`; unverified labelled | **PASS** (minor wording fixes) | All checked pay rates, Priority List streams and state items are traceable and correct. The WA fee-free item is worded inaccurately (m1) and one WA employer item leaves out an exclusion (m2). |
| 3 | Clean at 390px and 1280px, no console errors | **FAIL** | No console errors and no page overflow on any of the 11 pages at either width. N1 from round 2 is fixed (no card overflow at 960 or 1280px). **But the new desktop input-card scroll hides inputs with no visible cue (M1).** |
| 4 | Zero network apart from Google Fonts | **PASS** | Only Google Fonts is requested. No fetch, dialogs, images or root-absolute paths. |
| 5 | Guides + about page accurate, with disclaimers | **PASS** | The new "Other trades" table in the first-year guide matches `rates.js` and the pay guides. The KAP guide now cites the DEWR Priority List instead of the provider list. |
| 6 | Forms show in-page confirmation, no dialogs | **PASS** | Newsletter, enquiry and waitlist each show inline errors when empty (1, 6 and 3 errors) and an in-page confirmation when valid. The URL doesn't change. |
| 7 | Independent sign-off | **NOT SIGNED OFF — conditional on M1 and M2** | Both are small changes. I'll check them with screenshots; no full re-review is needed. |

## Automated checks
- **`npm test`:** 32/32 pass.
- **Pages:** all 11 pages at 390×844 and 1280×800.
  - 0 console or page errors and 0 horizontal overflow.
  - 28/28 internal links and fragments resolve.
  - No dialogs.
  - Only Google Fonts requested off-site.
- **axe-core** (WCAG 2.0/2.1 A/AA):
  - **0 violations** on all 11 pages at 390px and 1280px.
  - 0 violations on apprentice-pay at 390px for every state with "Regional" selected (electrician, so the licensing note shows).
  - 0 violations for the hairdresser + WA + regional combination.

## Pay rates: new awards checked against the official 2026–27 Fair Work pay guides
Each guide was fetched live. All figures match `rates.js`.

| Award (trade) | Pay guide | Checked | Result |
|---|---|---|---|
| MA000005 Hair & Beauty (hairdresser, barber) | Published 24 Jun 2026 | Y1–Y4 without Y12 (559.55 / 671.46 / 861.71 / 1,007.19); with Y12 (615.51 / 727.42; Y3 and Y4 the same); adult 895.28 then 1,056.80; level 3 1,119.10 | Match |
| MA000089 Vehicle (5 automotive trades) | Published 4 Nov 2026 | Both junior columns; adult 895.28 / 978.10 / 1,004.90 / 1,029.10; RS&R level 1 1,119.10 | Match |
| MA000009 Hospitality (cook) | Published 24 Jun 2026 | Apprentice cook 615.51 / 727.42 / 895.28 / 1,063.15; **no Year 12 distinction**, and the UI correctly says Year 12 doesn't change the rate; adult 895.28 / 978.10 / 978.10 / 1,063.15; cook grade 3 1,119.10 | Match |
| MA000010 Manufacturing (fitter, boilermaker) | Published 29 Jul 2026 | Junior Y1–Y4, including the **Year-12 uplift in year 4** (984.81 → 1,029.10), which the UI hint picks up; adult 895.28 / 978.10 / 1,004.90 / 1,029.10; C10 1,119.10 | Match |
| MA000029 Joinery (cabinetmaker or joiner) | Published 24 Jun 2026 | Junior both columns; adult 948.44 / 993.14 / 1,026.74 / 1,093.94; level 5 1,161.04. The rates include the industry allowance but not the tool allowance, as the note says. | Match |
| MA000101 Gardening & Landscaping (landscaper) | Published 28 Aug 2026 | The guide gives hourly rates only: 14.73 / 17.67 / 22.09 / 27.98, with Y12 16.20 / 19.14; adult 23.56 / 25.74 / 25.74 / 27.98. Weekly is hourly × 38 and is labelled as such. | Match |

Year 12 handling is right in every case (`y12Matters` reflects the pay-guide differences). Adult status uses age at start ≥ 21, which matches Fair Work. MA000020 groups (plasterer, roof tiler, painter/glazier, "all others") weren't re-fetched in this round; the building pay guide was verified in round 2.

## Priority List and KAP eligibility (DEWR Priority List, 1 April 2026, fetched live)
Column order in the source PDF is OCCUPATION | NEA | HCA, and I read the "E" markers by their column position.

| Trade | PDF row | `rates.js` | Result |
|---|---|---|---|
| Hairdresser 392132 | Listed, no stream | on list, none | Correct. KAP is disabled in the pay calculator; the training support payment and Priority Hiring are offered. |
| Cook 322331 | Listed, no stream | on list, none | Correct |
| Automotive Technician (General) 351131 | "E" in the NEA column | newEnergy, KAP unticked by default | Correct |
| Cabinet Maker 369131 / Landscape Gardener 342432 | "E" in the HCA column | housing | Correct |
| Glazier, Fitter (General), Electrician (General) | "E E" (both streams) | both (fitter defaults off, with an explanation) | Correct |
| Concreter | Not on the list | not listed | Correct; no incentive is deducted |

**Employer calculator only deducts incentives the trade can get:**
- Concreter with KAP or Priority Hiring selected → $0 deducted.
- Cook with KAP selected → $0.
- Hairdresser defaults to Priority Hiring: $2,500 full-time and $1,250 at 20 h.
- Light vehicle defaults to Priority Hiring ($2,500); with KAP selected it deducts $5,000 and shows the "only if your business works in new energy" hint.
- Glazier, part-time, KAP → $2,500.

## State panels: one or more items per state checked against the linked source

| State | Item | Result |
|---|---|---|
| NSW | VTAS $0.52/km and $70/night from 1 Nov 2025, more than 110 km return; fee-free apprenticeships for training starting before 30 Jun 2027 (normally up to $2,000); payroll tax **rebate, not exemption** | Match (pages dated 19 May 2026 and 14 Jul 2025) |
| VIC | Free TAFE: six priority apprenticeships from 2027, first-year tuition, at TAFE | Match (release 29 Oct 2026). Note: the release doesn't name the six courses; the site's examples are paraphrased from the release's sectors, which is fine. |
| QLD | 34c/km from 1 Jul 2025, $58 intrastate / $112 interstate, at least 100 km return; payroll tax exemption plus rebate | Match (11 Aug 2025 and 16 Sep 2026) |
| WA | Fee-free courses | **Wording is inaccurate (m1).** The statement says seven qualifications were *added* to the fee-free list for 2026, five of them apprenticeships (plumbing, bricklaying and blocklaying, wall and ceiling lining, solid plastering). The site says "five apprenticeship qualifications are fee-free". |
| WA | Construction Training Fund bonus $1,000 per year completed (up to $3,000); tools up to $1,000 at start and $1,000 at completion | Match (Jun 2025 PDF) |
| WA | Employer incentive up to $8,500; adult apprentice employer incentive up to $26,800; Construction Training Fund up to $15,000; payroll tax exemption | Amounts match (page 5 Oct 2026). **Leaves out that employers with payroll above $1m can't get the $8,500 incentive (they get the payroll tax exemption instead), and that the $26,800 incentive requires the apprentice to live and work in WA (m2).** |
| WA | State-system notice (sole traders, partnerships and trusts that aren't constitutional corporations are covered by WA awards) | Correct, but buried (M2) |
| SA | Travel/accommodation part-payment; employer checks eligibility and applies | Match. The page also states a 75 km rule; consider adding it. |
| TAS | Travel over 21 km each way; accommodation over 61 km; interstate airfares | Match |
| ACT | Interstate block-release travel payment | Match. Claims must be made within 3 months; consider adding that. |
| NT | 50 km one-way threshold | Match. The page is from 2016 and is correctly flagged as old. |

## Prioritised issues

### Blocker
None.

### Major

**M1. Desktop input cards now hide inputs inside an internal scroll with no visible cue (regression in v1.1).**
- Where: `site/css/styles.css` line 350: `.calc .inputs { max-height: calc(100vh - 2rem); overflow-y: auto; }`.
- At 1280×800 the inputs card clips **163px** on apprentice-pay, **511px** on employer-cost (fees, tools and the incentive selector are hidden) and **860px** on trade-vs-uni. That's more than half the trade-vs-uni inputs.
- There's no visible scrollbar (overlay scrollbars) and the card simply ends mid-field (`screenshots/review3/employer-cost-desktop.png`, left card ends at "Workers comp premium"). An employer may never see the incentive selector that drives a $5,000 swing.
- Fix: at ≥960px, drop `max-height`/`overflow-y` and make `.calc .inputs` `position: static`, so the page scrolls normally. The results card can be the sticky one instead (it's shorter). If you keep the inner scroll, add a visible cue: `scrollbar-gutter: stable; scrollbar-width: thin`, a bottom fade, and a "More inputs ↓" label.

**M2. The WA "state award may apply" caveat sits far from the headline number.**
- With WA selected, the caveat that WA sole traders, partnerships and trusts use WA state awards (not the national rates shown) is the first thing in the state panel. But at 390px that panel starts at **3,757px**, about 2,200px below the take-home figure (results start at 1,577px).
- The payslip, hero and sticky bar still say "award minimum" with no qualifier. For many small WA trade businesses the headline number may be the wrong award.
- Where: `site/js/ui-apprentice-pay.js` and `ui-employer-cost.js` `render()`, plus the payslip/hero markup.
- Fix: when `state === 'WA'`, add a one-line caveat inside the payslip and employer hero: "WA: if the employer is a sole trader, partnership or trust, WA state award rates apply instead — see below". Link it to `#state-card`, and use the `note-warn` style.

### Minor

- **m1. WA fee-free wording.**
  - Where: `rates.js` line 306.
  - Fix: "From January 2026 five more apprenticeship qualifications were added to WA's fee-free list: plumbing, bricklaying and blocklaying, wall and ceiling lining, and solid plastering."
- **m2. WA employer item is overstated.**
  - Where: `rates.js` line 312.
  - Fix: add "(employers with payroll above $1 million get the payroll tax exemption instead)" to the $8,500 incentive, and "who live and work in WA" to the $26,800 adult apprentice incentive.
- **m3. State panels aren't filtered by trade and are long on mobile.**
  - Construction Training Fund items (apprentice bonus and the $15,000 employer grant) show for a hairdresser or cook.
  - At 390px the panel is 2,061–2,211px tall in WA (about 2.5 screens), 1,564px in NSW and 1,615px in QLD.
  - Fix: add an `industries` array to construction-only items and filter on `t.industry`. On mobile, wrap each group (Training / Travel / Employers / Regional / Licensing) in `<details>`, with the regionally relevant group open by default.
- **m4. Age rounding.** A decimal age such as 20.6 rounds to 21 and becomes "adult". Use `Math.floor` (completed years) in `calc.apprenticeTypeForAge` and in both UI `readAge()` functions.
- **m5. Trade vs uni lets you add KAP to a non-KAP trade.**
  - The KAP box is not disabled for hairdresser, cook, concreter and the other stream-`none` trades. Ticking it adds $10,000 to the trade path.
  - The training support payment ($2,500) isn't modelled for Priority List trades.
  - The model assumes a 4-year apprenticeship for every trade, but hairdressing is usually 3.
  - Fix: mirror the pay page (`kap.disabled = !incentiveOptions(...).kapPossible`), and optionally add the training support payment and a per-table duration.
- **m6. Under-18 note uses Victoria's rule whatever state is chosen.** It always cites Victoria's parent-signs rule. Fix: use generic wording ("In most states a parent or guardian must also sign…") or per-state links.
- **m7. Employer "Not included" note says "state employer incentives (listed separately below)", but the state panel is above it.** Change to "above".
- **m8. Stale text.**
  - `rates.js` line 249: "under all three awards" (there are now 9).
  - PROGRESS.md "Status" still says it's waiting on the round-2 re-test.
  - PROGRESS.md "Known issues" still lists "per-trade KAP eligibility (provider list)" as unverified, though it's now verified from the Priority List.
  - `SRC.kapOccupationList` is no longer used.
- **m9. Regional panel styling and label.**
  - The "Regional or remote" paragraph renders larger than the other panel text.
  - The Living Away From Home Allowance is about moving out of home, not about being regional.
  - Fix: style it like the other `help-list` items and title it "Moving away from home".
- **m10. Hairdresser source link.** The hair rates link to the award text, but a pay guide exists (published 24 Jun 2026, figures match). Point `SRC2.pgHair` to the `calculate.fairwork.gov.au` pay guide, like the other awards.
- **m11. Edge cases in Priority List eligibility.**
  - The list puts heavy commercial vehicle qualifications (AUR31120) under Automotive Technician (General), which is NEA-eligible. Automotive refinishing (AUR32420) sits under Painter, which is HCA.
  - So "Not eligible for KAP" for diesel and vehicle painter is slightly too absolute.
  - Fix: "Usually not a KAP occupation — eligibility depends on the qualification; check with your Apprentice Connect provider."
- **m12. N2 residual.** At 390px the sticky bar still half-covers the focused "year" radio (25 of 47px). Add `html { scroll-padding-bottom: 6rem }` under 960px.

### Mobile UX notes (390px)
- **Trade dropdown:** groups are clear, with 7 optgroups and 22 trades. The native picker shows the group headings. `trade-dropdown-expanded-mobile.png` was produced by rendering the select expanded with a `size` attribute, because headless Chrome can't capture an open native picker.
- **Age input:** numeric keypad; the hint updates live (junior/adult explanation, under-18 note).
- **Sticky bar:** still works. It shows the live number from first load, updates on change, and scrolls away at the results.
- **Results position:** they now start at 1,597px on apprentice-pay (was 1,372px) and 2,087px on employer-cost (was 1,737px), because of the new inputs. The sticky bar covers this.

## Round-2 carry-overs
- N1 (employer card overflow): **fixed**.
- N3 (stale NCVER note): **fixed**.
- N2: partly fixed (now m12).

## Screenshots (`screenshots/review3/`)
- `apprentice-pay-mobile-hairdresser-WA-regional.png` (full page, 390px)
- `employer-cost-desktop.png` (1280px; shows the clipped input card, M1)
- `trade-dropdown-expanded-mobile.png` (simulated open dropdown, 390px)
- `all/`: every page at both widths
