# Apprentice Guide — data sources (checked 17 Nov 2026, FY 2026–27)

The single source of truth is `site/js/rates.js`. This file records what was checked, where, and what could not be verified. The About page (`site/about-data.html`) renders the same list live from `rates.js`.

**Verified** = read from the primary source named below on 17 Nov 2026. **Unverified** = `verified:false` in `rates.js`; the UI labels it "illustrative — edit to suit" (calculator assumptions) or marks it † (research figures in guides).

## Award minimum rates (verified)
Source: Fair Work Ombudsman pay guides, effective first full pay period on or after 1 July 2026 (4.75% Annual Wage Review increase — FWC decision announcement). Weekly hire, apprentices who started on or after 1 Jan 2014, 38-hour week. Pay guide hourly = weekly / 38 (checked by a unit test).

| Trade (award) | Junior no Y12, yrs 1–4 (weekly) | Junior Y12, yrs 1–4 | Adult, yrs 1–4 | Qualified |
|---|---|---|---|---|
| Carpenter/joiner/tilelayer (MA000020, residential) — guide published 2 Jul 2026 | 654.49 / 766.40 / 934.27 / 1,102.13 | 710.45 / 822.36 / 934.27 / 1,102.13 | 1,108.44 all years | L3 1,214.04 |
| Bricklayer (MA000020, residential) | 642.53 / 754.44 / 922.31 / 1,090.17 | 698.49 / 810.40 / 922.31 / 1,090.17 | 1,096.48 all years | L3 1,202.08 |
| Electrician (MA000025) — published 7 Aug 2026 | 622.72 / 742.79 / 862.87 / 1,006.97 | 682.76 / 802.84 / 862.87 / 1,006.97 | 982.95 / 1,098.29 / 1,098.29 / 1,098.29 | Grade 5 licensed 1,223.11 |
| Plumber (MA000036) — published 11 Aug 2026 | 629.23 / 746.79 / 864.35 / 1,099.48 | 688.01 / 805.57 / 864.35 / 1,099.48 | 1,046.31 ×3 / 1,099.48 | L1 registered 1,246.54 (not registered 1,201.78) |

URLs:
- MA000020: https://calculate.fairwork.gov.au/Download/AwardSummary?awardCode=ma000020&effectiveDate=&fileType=pdf&krn=
- MA000025: https://calculate.fairwork.gov.au/Download/AwardSummary?awardCode=ma000025&fileType=pdf
- MA000036: https://calculate.fairwork.gov.au/Download/AwardSummary?awardCode=ma000036&effectiveDate=&fileType=pdf&krn=
- FWC AWR 2026 (4.75%, NMW $1,004.90/wk): https://www.fwc.gov.au/documents/resources/annual-wage-review-2026-decision-announcement.pdf

Notes: building-trade rates use the **residential** tables (KAP is housing-focused); non-residential rates are slightly higher (e.g. L3 carpenter non-residential $1,227.47). Pay guide rates include industry and tool allowances where applicable (electrical also licence allowance for grade 5; plumbing includes trade/registration allowance for the tradesperson). The pay guides do not tabulate apprentices who started before 1 Jan 2014 (they point to the Pay and Conditions Tool) — out of scope.

## Tax (verified unless noted)
- Resident rates 2026–27: 0–18,200 nil; 15% to 45,000; 30% to 135,000; 37% to 190,000; 45% above. Base tax $4,020 / $31,020 / $51,370. The 16% rate fell to 15% from 1 July 2026 and is legislated to fall to 14% from 1 July 2027. — https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents ; https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/personal-income-tax-new-tax-cuts-for-every-australian-taxpayer
- LITO: $700; −5c/$ from 37,500 to 45,000; then $325 −1.5c/$ to 66,667. — https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/low-income-tax-offset (page does not label the year; unchanged for many years)
- Medicare levy 2%. — ATO tax rates page.
- **UNVERIFIED for 2026–27:** Medicare low-income thresholds. Used 2025–26 singles: $28,011 / $35,013, phase-in 10c per $ (inferred from ATO worked example). 2026–27 thresholds not yet published. — https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/medicare-levy-reduction/medicare-levy-reduction-for-low-income-earners
- Not used: Working Australians tax offset ($250) — starts 2027–28.
- Super guarantee 12% (2025–26 and from 1 July 2026; Payday Super from 1 July 2026). — https://ato.gov.au/SuperRate

## Apprenticeship incentives (verified, DEWR payments overview effective 1 July 2026)
URL: https://www.dewr.gov.au/id/download/16760/australian-apprenticeships-incentive-system-payment-summary/43087/australian-apprenticeships-incentive-system-payments-overview/pdf (the plain `/download/...` URLs are robots-blocked for our fetcher; the language-prefixed mirror served the same document).
- Key Apprentice Incentive (KAP): FT $2,000 at 6, 12, 24, 36 months and completion (= $10,000); PT $1,000 each (= $5,000). Commenced/recommenced on or after 1 July 2025. Cert III+ on Priority List, housing construction or new energy; employer declaration.
- KAP Employer Incentive: FT $2,000 at 6 + $3,000 at 12 months (= $5,000); PT $1,000 + $1,500. Commencements from 1 Jan 2026. Minister: extended to December 2026 — https://ministers.dewr.gov.au/rishworth/apprentice-support-key-sectors-extended
- Priority Hiring Incentive (from 1 Jan 2026): up to $2,500 first year, 6 and 12 months (split not stated).
- AATSP: FT $625 at 6, 12, 18, 24 months (= $2,500).
- LAFHA: $125.52 / $94.14 / $47.07 per week (yrs 1–3).
- AASL: up to $27,048 (2026–27), repayment threshold $69,528, 20% off on completion.
- KAP factsheet (22 Dec 2025): https://www.dewr.gov.au/download/17045/key-apprenticeship-program-factsheet/41879/key-apprenticeship-program-factsheet/pdf
- **UNVERIFIED:** per-trade KAP eligibility. DEWR does not publish a plain occupation list we could fetch. Used an Apprentice Connect provider list (BUSY At Work, Jul 2025): housing stream includes Bricklayer, Carpenter, Carpenter and Joiner, Wall and Floor Tiler, Painter, Plasterer, Roof Tiler, Stonemason, Cabinet Maker etc.; Electrician (General) and Plumber (General) under "both streams". — https://www.busyatwork.com.au/wp-content/uploads/2025/07/List-of-KAP-eligible-occupations.pdf
- Tax treatment of KAP payments: not verified; calculators show them separately and do not tax them.

## HELP and uni (verified)
- 2026–27 repayment: nil to $69,528; 15c/$ over 69,528 to 129,717; $9,028 + 17c/$ over 129,717 to 186,050; 10% of total above. — https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds
- Indexation 2.8% on 1 June 2026 — Study Assist news item title (page itself robots-blocked; title states the rate): https://www.studyassist.gov.au/news/indexation-28-will-be-applied-your-study-loan-1-june-2026
- 2026 maximum student contributions: Band 1 (law, accounting, commerce, economics…) $17,399; engineering/science/IT/built environment $9,537; maths/education/English/nursing $4,738. HELP loan limit $129,883. — https://www.education.gov.au/download/19201/2026-indexed-rates/41481/document/pdf
- Graduate medians (QILT 2025 GOS National Report, June 2026, domestic undergrads): all $77,000; business & management $74,000; engineering $82,500; science & maths $73,100; computing $80,000; FT employment 75.4%. — https://www.qilt.edu.au/docs/default-source/default-document-library/2025-gos-national-report.pdf

## Research figures used in guides
- Verified (DEWR Minister media release citing NCVER Apprentice and trainee outcomes 2025): ~95% of trade completers employed; 77% of non-completers employed. — https://ministers.dewr.gov.au/giles/research-shows-apprenticeships-deliver-strong-job-outcomes
- **UNVERIFIED (†):** NCVER pages are robots-blocked for our fetcher.
  - 27.7% of trade non-completers left mainly over pay/conditions/workplace (from the project brief; NCVER outcomes 2025).
  - 42% four-year attrition (2021 trade starters); 58.7% six-year completion (2019 starters); electricians ~72% six-year completion — Future Campus (28 Jul 2026) reporting NCVER completion rates 2025: https://futurecampus.com.au/?p=22457
  - 116,700 extra workers needed for 1.2 million homes by 2029 — Ai Group summary of BuildSkills Australia 2025 study: https://cet.australianindustrygroup.com.au/news/blogs/2025/buildskills-jobs-and-skills-council-releases-its-2025-workforce-capacity-study ; HIA response: https://hia.com.au/our-industry/newsroom/skills-training-and-workforce/2025/09/buildskills-australia-releases-workforce-capacity-study
  - HIA "trades availability" index: not found/used; guide cites HIA's qualitative response only.

## Illustrative assumptions (no primary source; editable in UI)
Part-time study income $15,000/yr; pay growth 3%/yr; qualified pay above award 0%; workers comp 4% of wages; training fees $1,000/yr; tools/PPE $800/yr. A market-typical qualified tradesperson wage could not be sourced from a primary source (Jobs and Skills Australia / Your Career pages could not be read), so the trade path defaults to the award minimum.


## v1.1 additions (checked 17 Nov 2026)

### More trades (all verified against Fair Work 2026–27 sources unless noted)
Weekly / hourly, 38 hours, apprentices who started on or after 1 Jan 2014. Junior no-Y12 yrs 1–4 | Junior Y12 yrs 1–4 | Adult yrs 1–4 | Qualified.
| Table (award) | Trades | Junior no Y12 | Junior Y12 | Adult | Qualified |
|---|---|---|---|---|---|
| MA000020 plasterer group (residential) | Plasterer | 647.37 / 759.28 / 927.15 / 1,095.01 | 703.33 / 815.24 / same | 1,101.32 | L3 1,206.92 |
| MA000020 roof tiler group | Roof tiler | 634.86 / 746.77 / 914.64 / 1,082.50 | 690.82 / 802.73 / same | 1,088.81 | L3 1,194.41 |
| MA000020 glazier/painter/signwriter | Painter, glazier | 623.16 / 735.07 / 902.94 / 1,070.80 | 679.12 / 791.03 / same | 1,077.11 | L3 1,182.71 |
| MA000020 "all others" | Concreter (**mapping unverified**) | 613.27 / 725.18 / 893.05 / 1,060.91 | 669.23 / 781.14 / same | 1,067.22 | L3 no tool allowance 1,172.82 (verified:false) |
| MA000020 carpenter group | Carpenter, wall and floor tiler | (as before) | | | |
| MA000029 Joinery (published 24 Jun 2026) | Cabinetmaker/joiner | 601.54 / 713.44 / 881.24 / 1,049.14 | 657.44 / 769.34 / same | 948.44 / 993.14 / 1,026.74 / 1,093.94 ($28.78 as printed) | L5 1,161.04 (excl. $1.08/hr tool allowance) |
| MA000089 Vehicle (published 4 Nov 2026) | Light vehicle, diesel, auto electrician, panel beater, vehicle painter | 559.55 / 671.46 / 839.33 / 984.81 | 615.51 / 727.42 / 839.33 / 984.81 | 895.28 / 978.10 / 1,004.90 / 1,029.10 | Tradesperson L1 1,119.10 |
| MA000010 Manufacturing (published 29 Jul 2026) | Fitter and turner, boilermaker/welder | 559.55 / 671.46 / 839.33 / 984.81 | 615.51 / 727.42 / 839.33 / 1,029.10 | 895.28 / 978.10 / 1,004.90 / 1,029.10 | C10 1,119.10 |
| MA000009 Hospitality (General) (published 24 Jun 2026) | Chef/cook | 615.51 / 727.42 / 895.28 / 1,063.15 (no Y12 distinction) | same | 895.28 / 978.10 / 978.10 / 1,063.15 | Cook grade 3 (L4) 1,119.10 |
| MA000005 Hair and Beauty (award text, ppc 1 Jul 2026) | Hairdresser, barber | 559.55 / 671.46 / 861.71 / 1,007.19 | 615.51 / 727.42 / same | 895.28 / 1,056.80 ×3 (cl. 18.4 "greater of") | L3 1,119.10 |
| MA000101 Gardening (published 28 Aug 2026; hourly only) | Landscaper | 14.73 / 17.67 / 22.09 / 27.98 per hour | 16.20 / 19.14 / 22.09 / 27.98 | 23.56 / 25.74 / 25.74 / 27.98 | L4 1,119.10 |

Cooks: we used the Hospitality Industry (General) Award [MA000009]; restaurants use the Restaurant Industry Award [MA000119]. Hair: the calculate.fairwork.gov.au pay-guide endpoint kept returning the plumbing guide to our fetcher, so the hairdressing rates come from the award text on awards.fairwork.gov.au. FWO's hairdressing page confirms the $14.73 junior and $23.56 adult starting rates. **Not added:** air-conditioning and refrigeration mechanic. The award depends on the employer (electrical contracting, plumbing/mechanical services or manufacturing), so we couldn't verify a single right award.

### Priority List and KAP streams (verified)
DEWR Australian Apprenticeships Priority List, 1 April 2026: https://www.dewr.gov.au/it/download/17559/australian-apprenticeships-priority-list-1-april-2026/42585/australian-apprenticeships-priority-list-1-april-2026/pdf
- Housing Construction (HCA): carpenter, carpenter and joiner, bricklayer, wall and floor tiler, painter, plasterer, roof tiler, cabinet maker, landscape gardener.
- Both streams: electrician, plumber, glazier, joiner, fitter and turner, fitter (general), metal fabricator, welder (first class).
- New Energy only (NEA): automotive technician (general), automotive electrician.
- On the list, no KAP stream: diesel technician, panelbeater, vehicle painter, cook, hairdresser, barber.
- Not on the list: concreter.
- Stream columns were read from the row spacing in the extracted PDF text. Building trades matched the earlier provider list.

### Age, under-18s, WA, LAFHA (verified)
- Adult apprentice = 21+ at start: https://www.fairwork.gov.au/starting-employment/types-of-employees/apprentices-and-trainees/hairdressing-apprentices
- Under-18 wages are taxed at adult rates as excepted income: https://www.ato.gov.au/tax-rates-and-codes/tax-rates-if-you-re-under-18-years-old
- In Victoria a parent or guardian signs the training contract for under-18s: https://www.apprenticeships.vic.gov.au/your-training-contract
- WA state system covers sole traders, partnerships and trusts that aren't constitutional corporations (updated 27 Oct 2026): https://www.wa.gov.au/organisation/private-sector-labour-relations/which-system-of-employment-laws-applies
- LAFHA eligibility comes from the DEWR payments overview.

### State help and licensing (verified items only; see `rates.js` → `states` for text and URLs)
- NSW: fee-free apprenticeships (Smart and Skilled training starting before 30 Jun 2027); VTAS travel $0.52/km and $70/night over 110 km return; payroll tax rebate. Licensing: NSW Fair Trading.
- VIC: Free TAFE for six priority apprenticeships from 2027 (first-year fees); payroll tax exemption for re-employed out-of-trade apprentices. Licensing: Energy Safe Victoria and the Building and Plumbing Commission. **No travel allowance verified.**
- QLD: Free Apprenticeships for Under 25s (start by 30 Jun 2027); travel allowance 34c/km and $58/$112 a night, 100 km return minimum; payroll tax exemption plus rebate. Licensing: Electrical Safety Office and QBCC.
- WA: five fee-free apprenticeship qualifications from Jan 2026; Travel and Accommodation Allowance over 70 km round trip; Construction Training Fund apprentice bonus ($1,000 a year, up to $3,000) and tools (up to $2,000) (June 2025 doc); employer incentives (JSWA up to $8,500 base, Adult Apprentice up to $26,800, CTF up to $15,000); payroll tax exemption for apprentices. Licensing: Building and Energy and the Plumbers Licensing Board.
- SA: travel and accommodation allowance (distance thresholds differ between two SA pages, so we don't quote one). **No current payroll tax exemption** (the 2020–22 scheme has ended). Licensing: Consumer and Business Services.
- TAS: Travel and Accommodation Contribution. **The payroll tax rebate only covers apprentices who started by 30 Jun 2026, so it's omitted.** Licensing: CBOS.
- ACT: interstate block-release travel payment; payroll tax exemption for approved not-for-profit GTOs only. Licensing: Access Canberra (Construction Occupations Registrar).
- NT: travel and accommodation subsidy over 50 km one way. The page dates from 2016, so amounts are omitted. Licensing: Electrical Workers and Contractors Licensing Board and the Plumbers and Drainers Licensing Board.
- Regional-specific: no Commonwealth regional loading found. State travel allowances are distance-based and are highlighted when "Regional or remote" is selected. The WA JSWA regional loading amount isn't stated, so it isn't quoted.
