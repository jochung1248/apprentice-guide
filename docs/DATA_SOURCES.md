# Tradie Numbers — data sources (checked 17 Nov 2026, FY 2026–27)

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
