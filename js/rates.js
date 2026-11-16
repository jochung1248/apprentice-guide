/*
 * Apprentice Guide — rates.js
 * SINGLE SOURCE OF TRUTH for every figure shown on the site.
 *
 * Each figure is an object: { value, effectiveFrom, sourceUrl, sourceName, verified, note }
 *   verified: true  -> checked against the named primary source on meta.lastChecked
 *   verified: false -> could not be checked against a primary source; the UI labels it
 *                      "illustrative — edit to suit" and it is listed in docs/PROGRESS.md
 *
 * HOW TO UPDATE (each 1 July): see docs/README.md ("Updating rates each 1 July").
 * Works in the browser (window.TN_RATES) and in Node (require('./rates.js')).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.TN_RATES = factory(); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function fig(value, effectiveFrom, sourceUrl, sourceName, verified, note) {
    return { value: value, effectiveFrom: effectiveFrom, sourceUrl: sourceUrl, sourceName: sourceName, verified: verified, note: note || '' };
  }
  // Pay rate pair taken straight from a Fair Work pay guide table (weekly and hourly, 38-hour week).
  function pr(weekly, hourly) { return { weekly: weekly, hourly: hourly }; }

  var FY_START = '2026-07-01';

  // ---- Source URLs -------------------------------------------------------
  var SRC = {
    pgBuilding: 'https://calculate.fairwork.gov.au/Download/AwardSummary?awardCode=ma000020&effectiveDate=&fileType=pdf&krn=',
    pgElectrical: 'https://calculate.fairwork.gov.au/Download/AwardSummary?awardCode=ma000025&fileType=pdf',
    pgPlumbing: 'https://calculate.fairwork.gov.au/Download/AwardSummary?awardCode=ma000036&effectiveDate=&fileType=pdf&krn=',
    fwPayCalc: 'https://calculate.fairwork.gov.au/',
    atoTaxRates: 'https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents',
    atoTaxCut: 'https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/personal-income-tax-new-tax-cuts-for-every-australian-taxpayer',
    atoLito: 'https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/low-income-tax-offset',
    atoMedicareLow: 'https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/medicare-levy-reduction/medicare-levy-reduction-for-low-income-earners',
    atoSuper: 'https://www.ato.gov.au/businesses-and-organisations/super-for-employers/payday-super/paying-super-on-payday/making-super-payments',
    atoHelp: 'https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds',
    dewrPayments: 'https://www.dewr.gov.au/id/download/16760/australian-apprenticeships-incentive-system-payment-summary/43087/australian-apprenticeships-incentive-system-payments-overview/pdf',
    dewrKapFactsheet: 'https://www.dewr.gov.au/download/17045/key-apprenticeship-program-factsheet/41879/key-apprenticeship-program-factsheet/pdf',
    ministerKapExtended: 'https://ministers.dewr.gov.au/rishworth/apprentice-support-key-sectors-extended',
    ministerOutcomes: 'https://ministers.dewr.gov.au/giles/research-shows-apprenticeships-deliver-strong-job-outcomes',
    kapOccupationList: 'https://www.busyatwork.com.au/wp-content/uploads/2025/07/List-of-KAP-eligible-occupations.pdf',
    studyAssistIndexation: 'https://www.studyassist.gov.au/news/indexation-28-will-be-applied-your-study-loan-1-june-2026',
    eduIndexedRates2026: 'https://www.education.gov.au/download/19201/2026-indexed-rates/41481/document/pdf',
    qiltGos2025: 'https://www.qilt.edu.au/docs/default-source/default-document-library/2025-gos-national-report.pdf',
    ncverOutcomes2025: 'https://www.ncver.edu.au/research-and-statistics/publications/all-publications/apprentice-and-trainee-outcomes-2025',
    ncverCompletion2025: 'https://www.ncver.edu.au/research-and-statistics/publications/all-publications/apprentice-and-trainee-completion-rates-2025',
    futureCampusCompletion: 'https://futurecampus.com.au/?p=22457',
    buildSkillsAigroup: 'https://cet.australianindustrygroup.com.au/news/blogs/2025/buildskills-jobs-and-skills-council-releases-its-2025-workforce-capacity-study',
    hiaBuildSkills: 'https://hia.com.au/our-industry/newsroom/skills-training-and-workforce/2025/09/buildskills-australia-releases-workforce-capacity-study'
  };

  var PG_B = 'Fair Work Ombudsman pay guide — Building and Construction General On-site Award [MA000020], published 2 Jul 2026';
  var PG_E = 'Fair Work Ombudsman pay guide — Electrical, Electronic and Communications Contracting Award [MA000025], published 7 Aug 2026';
  var PG_P = 'Fair Work Ombudsman pay guide — Plumbing and Fire Sprinklers Award [MA000036], published 11 Aug 2026';

  var KAP_NOTE = 'Housing-construction occupations on the Australian Apprenticeships Priority List qualify. ' +
    'This trade appears on a KAP occupation list published by an Apprentice Connect Australia provider; ' +
    'DEWR does not publish a plain list we could check, so confirm eligibility with your Apprentice Connect provider.';

  return {
    meta: {
      siteName: 'Apprentice Guide',
      lastChecked: '2026-11-17',
      lastCheckedLabel: '17 November 2026',
      financialYear: '2026–27',
      fyStart: FY_START,
      payGuideCalculatorUrl: SRC.fwPayCalc,
      sources: SRC
    },

    ordinaryHours: fig(38, FY_START, SRC.pgBuilding, PG_B, true,
      'Full-time ordinary hours are 38 per week under all three awards. Pay guide weekly rates assume 38 hours.'),

    // ---- Award minimum rates (weekly hire, apprentices who started on or after 1 Jan 2014) --------
    // Arrays are indexed by apprentice year: [year1, year2, year3, year4].
    trades: {
      carpenter: {
        label: 'Carpenter, joiner or wall & floor tiler',
        short: 'carpenter',
        award: 'Building and Construction General On-site Award 2020 [MA000020]',
        awardShort: 'Building & Construction Award',
        apprenticeJuniorNoY12: fig([pr(654.49, 17.22), pr(766.40, 20.17), pr(934.27, 24.59), pr(1102.13, 29.00)], FY_START, SRC.pgBuilding, PG_B, true,
          '4-year apprentice, started on or after 1 Jan 2014, residential work, carpenter/joiner/tilelayer group. Includes industry and tool allowances. Non-residential (general building) rates are slightly higher.'),
        apprenticeJuniorY12: fig([pr(710.45, 18.70), pr(822.36, 21.64), pr(934.27, 24.59), pr(1102.13, 29.00)], FY_START, SRC.pgBuilding, PG_B, true,
          'As above, for apprentices who completed Year 12. The award only distinguishes Year 12 in years 1 and 2.'),
        apprenticeAdult: fig([pr(1108.44, 29.17), pr(1108.44, 29.17), pr(1108.44, 29.17), pr(1108.44, 29.17)], FY_START, SRC.pgBuilding, PG_B, true,
          'Adult apprentice (21 or over at commencement), residential, carpenter/joiner/tilelayer group. The pay guide lists one rate for all years.'),
        tradesperson: fig(pr(1214.04, 31.95), FY_START, SRC.pgBuilding, PG_B, true,
          'Level 3 (CW/ECW 3) carpenter/joiner/tilelayer, weekly hire, residential. Includes industry and tool allowances.'),
        kapEligible: fig(true, '2025-07-01', SRC.kapOccupationList, 'KAP eligible occupations list (Apprentice Connect provider, Jul 2025)', false, KAP_NOTE)
      },
      bricklayer: {
        label: 'Bricklayer',
        short: 'bricklayer',
        award: 'Building and Construction General On-site Award 2020 [MA000020]',
        awardShort: 'Building & Construction Award',
        apprenticeJuniorNoY12: fig([pr(642.53, 16.91), pr(754.44, 19.85), pr(922.31, 24.27), pr(1090.17, 28.69)], FY_START, SRC.pgBuilding, PG_B, true,
          '4-year apprentice, started on or after 1 Jan 2014, residential, bricklayer/refractory bricklayer group. Includes industry and tool allowances.'),
        apprenticeJuniorY12: fig([pr(698.49, 18.38), pr(810.40, 21.33), pr(922.31, 24.27), pr(1090.17, 28.69)], FY_START, SRC.pgBuilding, PG_B, true,
          'As above, completed Year 12 (distinction applies in years 1 and 2 only).'),
        apprenticeAdult: fig([pr(1096.48, 28.85), pr(1096.48, 28.85), pr(1096.48, 28.85), pr(1096.48, 28.85)], FY_START, SRC.pgBuilding, PG_B, true,
          'Adult apprentice, residential, bricklayer group. One rate for all years.'),
        tradesperson: fig(pr(1202.08, 31.63), FY_START, SRC.pgBuilding, PG_B, true,
          'Level 3 bricklayer, weekly hire, residential. Includes industry and tool allowances.'),
        kapEligible: fig(true, '2025-07-01', SRC.kapOccupationList, 'KAP eligible occupations list (Apprentice Connect provider, Jul 2025)', false, KAP_NOTE)
      },
      electrician: {
        label: 'Electrician',
        short: 'electrician',
        award: 'Electrical, Electronic and Communications Contracting Award 2020 [MA000025]',
        awardShort: 'Electrical Contracting Award',
        apprenticeJuniorNoY12: fig([pr(622.72, 16.39), pr(742.79, 19.55), pr(862.87, 22.71), pr(1006.97, 26.50)], FY_START, SRC.pgElectrical, PG_E, true,
          '4-year apprentice, started on or after 1 Jan 2014, did not complete Year 12. Pay guide states rates include applicable all-purpose allowances.'),
        apprenticeJuniorY12: fig([pr(682.76, 17.97), pr(802.84, 21.13), pr(862.87, 22.71), pr(1006.97, 26.50)], FY_START, SRC.pgElectrical, PG_E, true,
          'As above, completed Year 12 (distinction applies in years 1 and 2 only).'),
        apprenticeAdult: fig([pr(982.95, 25.87), pr(1098.29, 28.90), pr(1098.29, 28.90), pr(1098.29, 28.90)], FY_START, SRC.pgElectrical, PG_E, true,
          'Adult apprentice, started on or after 1 Jan 2014.'),
        tradesperson: fig(pr(1223.11, 32.19), FY_START, SRC.pgElectrical, PG_E, true,
          'Electrical worker grade 5 (licensed electrician). Includes industry, tool and electrician’s licence allowances.'),
        kapEligible: fig(true, '2025-07-01', SRC.kapOccupationList, 'KAP eligible occupations list (Apprentice Connect provider, Jul 2025)', false,
          'Electrician (General) is listed under both the housing construction and new energy streams. ' + KAP_NOTE)
      },
      plumber: {
        label: 'Plumber',
        short: 'plumber',
        award: 'Plumbing and Fire Sprinklers Award 2020 [MA000036]',
        awardShort: 'Plumbing Award',
        apprenticeJuniorNoY12: fig([pr(629.23, 16.56), pr(746.79, 19.65), pr(864.35, 22.75), pr(1099.48, 28.93)], FY_START, SRC.pgPlumbing, PG_P, true,
          '4-year plumbing and mechanical services apprentice, started after 1 Jan 2014, did not complete Year 12. Includes applicable industry, plumbing trade and tool allowances.'),
        apprenticeJuniorY12: fig([pr(688.01, 18.11), pr(805.57, 21.20), pr(864.35, 22.75), pr(1099.48, 28.93)], FY_START, SRC.pgPlumbing, PG_P, true,
          'As above, completed Year 12 (distinction applies in years 1 and 2 only).'),
        apprenticeAdult: fig([pr(1046.31, 27.53), pr(1046.31, 27.53), pr(1046.31, 27.53), pr(1099.48, 28.93)], FY_START, SRC.pgPlumbing, PG_P, true,
          'Adult apprentice, plumbing and mechanical services.'),
        tradesperson: fig(pr(1246.54, 32.80), FY_START, SRC.pgPlumbing, PG_P, true,
          'Plumbing and mechanical services tradesperson Level 1, registered. Includes industry/special allowance and plumbing trade and registration allowance. Not-registered rate is $1,201.78/week.'),
        kapEligible: fig(true, '2025-07-01', SRC.kapOccupationList, 'KAP eligible occupations list (Apprentice Connect provider, Jul 2025)', false,
          'Plumber (General) is listed under both the housing construction and new energy streams. ' + KAP_NOTE)
      }
    },

    // ---- Personal income tax (residents) ----------------------------------
    tax: {
      brackets: fig([
        { from: 0, rate: 0 },
        { from: 18200, rate: 0.15 },
        { from: 45000, rate: 0.30 },
        { from: 135000, rate: 0.37 },
        { from: 190000, rate: 0.45 }
      ], FY_START, SRC.atoTaxRates, 'ATO — Tax rates for Australian residents (2026–27)', true,
        'The 16% rate fell to 15% from 1 July 2026 (and is legislated to fall to 14% from 1 July 2027). Rates exclude the Medicare levy.'),
      lito: fig({ max: 700, taper1From: 37500, taper1Rate: 0.05, taper2From: 45000, taper2Start: 325, taper2Rate: 0.015, cutOut: 66667 },
        FY_START, SRC.atoLito, 'ATO — Low income tax offset', true,
        'Up to $700. Reduces by 5c per $1 from $37,500 to $45,000, then by 1.5c per $1 to zero at $66,667. Non-refundable.'),
      medicareRate: fig(0.02, FY_START, SRC.atoTaxRates, 'ATO — Tax rates for Australian residents', true, 'Medicare levy of 2% of taxable income.'),
      medicareLowIncome: fig({ lower: 28011, upper: 35013, phaseInRate: 0.10 }, '2025-07-01', SRC.atoMedicareLow,
        'ATO — Medicare levy reduction for low-income earners (2025–26 singles thresholds)', false,
        '2026–27 thresholds had not been published when checked, so the 2025–26 single thresholds are used. The 10c-per-$1 phase-in is inferred from the ATO worked example.')
    },

    superGuarantee: fig(0.12, FY_START, SRC.atoSuper, 'ATO — How to work out and pay super (earnings paid from 1 July 2026)', true,
      '12% for 2025–26 and stays at 12% from 1 July 2026. From 1 July 2026 super must be paid each payday (Payday Super) and is calculated on qualifying earnings.'),

    // ---- Government payments ---------------------------------------------
    incentives: {
      kapApprentice: fig({
        fullTime: [{ month: 6, amount: 2000 }, { month: 12, amount: 2000 }, { month: 24, amount: 2000 }, { month: 36, amount: 2000 }, { month: 'completion', amount: 2000 }],
        partTime: [{ month: 6, amount: 1000 }, { month: 12, amount: 1000 }, { month: 24, amount: 1000 }, { month: 36, amount: 1000 }, { month: 'completion', amount: 1000 }]
      }, '2025-07-01', SRC.dewrPayments, 'DEWR — Australian Apprenticeships Incentive System payments overview (effective 1 Jul 2026)', true,
        'Key Apprentice Incentive (KAP): up to $10,000 full-time / $5,000 part-time, for Certificate III+ housing construction or new energy apprenticeships that commenced or recommenced on or after 1 July 2025. Employer must provide meaningful work in the sector and both sign a declaration.'),
      kapEmployer: fig({
        fullTime: [{ month: 6, amount: 2000 }, { month: 12, amount: 3000 }],
        partTime: [{ month: 6, amount: 1000 }, { month: 12, amount: 1500 }]
      }, '2026-01-01', SRC.dewrPayments, 'DEWR — Australian Apprenticeships Incentive System payments overview (effective 1 Jul 2026)', true,
        'KAP Employer Incentive: up to $5,000 (full-time) in the first year, for apprentices commencing or recommencing on or after 1 January 2026. The Minister announced it is available for commencements to December 2026 — check what applies after that.'),
      priorityHiring: fig({
        fullTime: [{ month: 6, amount: 1000 }, { month: 12, amount: 1500 }],
        partTime: [{ month: 6, amount: 500 }, { month: 12, amount: 750 }]
      }, '2026-01-01', SRC.dewrPayments, 'DEWR — Australian Apprenticeships Incentive System payments overview (effective 1 Jul 2026)', true,
        'Priority Hiring Incentive for employers of apprentices in other Priority List occupations (not KAP): up to $2,500 full-time ($1,000 at 6 months, $1,500 at 12 months) or $1,250 part-time ($500 + $750) in the first year.'),
      aatsp: fig({ fullTime: [{ month: 6, amount: 625 }, { month: 12, amount: 625 }, { month: 18, amount: 625 }, { month: 24, amount: 625 }] },
        '2026-01-01', SRC.dewrPayments, 'DEWR — Australian Apprenticeships Incentive System payments overview (effective 1 Jul 2026)', true,
        'Australian Apprentice Training Support Payment: $2,500 over two years for full-time apprentices in Priority List occupations that are not KAP. Not paid on top of KAP.'),
      lafha: fig({ year1: 125.52, year2: 94.14, year3: 47.07 }, '2026-01-01', SRC.dewrPayments, 'DEWR — payments overview', true,
        'Living Away From Home Allowance per week, for eligible apprentices who move out of the family home.'),
      aasl: fig({ maxLoan: 27048, repaymentThreshold: 69528 }, FY_START, SRC.dewrPayments, 'DEWR — payments overview', true,
        'Australian Apprenticeship Support Loan: up to $27,048 (2026–27), repaid like HELP once income reaches $69,528; 20% discount on completion.')
    },

    // ---- HELP (uni loans) -------------------------------------------------
    help: {
      repayment: fig({ minIncome: 69528, band1Top: 129717, band1Rate: 0.15, band2Base: 9028, band2Rate: 0.17, band2Top: 186050, topRate: 0.10 },
        FY_START, SRC.atoHelp, 'ATO — Study and training loan repayment thresholds and rates (2026–27)', true,
        'Marginal system: nil up to $69,528; 15c per $1 over $69,528 to $129,717; $9,028 plus 17c per $1 over $129,717 to $186,050; 10% of total repayment income above that. Based on repayment income.'),
      indexation: fig(0.028, '2026-06-01', SRC.studyAssistIndexation, 'Study Assist — indexation applied 1 June 2026', true,
        '2.8% applied on 1 June 2026. Future rates are unknown — editable in the calculator.'),
      contributions: fig({
        commerce: { label: 'Commerce, business, economics, law, accounting', amount: 17399 },
        engineering: { label: 'Engineering, science, IT, built environment', amount: 9537 },
        maths: { label: 'Maths, education, English, nursing', amount: 4738 }
      }, '2026-01-01', SRC.eduIndexedRates2026, 'Department of Education — 2026 indexed rates (maximum student contribution per full-time year)', true,
        'Maximum annual student contribution for a full-time Commonwealth supported place commencing in 2026. Usually indexed each year.')
    },

    graduates: {
      medianSalary: fig({ all: 77000, business: 74000, engineering: 82500, science: 73100, computing: 80000 }, '2025-01-01', SRC.qiltGos2025,
        'QILT — 2025 Graduate Outcomes Survey National Report (June 2026), domestic undergraduates', true,
        'Median full-time salary about 4–6 months after graduating, 2025 survey. Business and management $74,000; engineering $82,500; science and maths $73,100; all areas $77,000.'),
      fullTimeEmploymentRate: fig(75.4, '2025-01-01', SRC.qiltGos2025, 'QILT — 2025 GOS National Report', true,
        'Domestic undergraduates in full-time work, 2025 (definition changed in 2025; not comparable with earlier years).')
    },

    // ---- Illustrative assumptions (NOT verified — UI must label them) ------
    illustrative: {
      partTimeStudyIncome: fig(15000, FY_START, '', 'Apprentice Guide assumption', false,
        'Gross part-time income per year while studying. Not from a primary source — edit to suit.'),
      payGrowth: fig(0.03, FY_START, '', 'Apprentice Guide assumption', false,
        'Yearly pay rise once qualified or graduated. Not from a primary source — edit to suit.'),
      marketLoading: fig(0, FY_START, '', 'Apprentice Guide assumption', false,
        'Percentage above the award minimum that a qualified tradesperson earns. We default to 0% (award minimum) because we could not find a primary-source market wage. Many qualified tradies earn well above award — edit to suit.'),
      workersCompRate: fig(0.04, FY_START, '', 'Apprentice Guide assumption', false,
        'Workers compensation premium as a % of wages. Real premiums depend on your industry classification, wages and claims history (in NSW, set by icare). Get a quote — edit to suit.'),
      tafeFees: fig(1000, FY_START, '', 'Apprentice Guide assumption', false,
        'Yearly training fees if the employer pays them. In NSW many apprenticeships are fee-free or low-fee — check with your RTO. Edit to suit.'),
      toolsPpe: fig(800, FY_START, '', 'Apprentice Guide assumption', false,
        'Yearly tools, PPE and uniform costs for the employer. Edit to suit.'),
      supervisionHours: fig(0, FY_START, '', 'Apprentice Guide assumption', false,
        'Optional: weekly hours of a qualified worker’s time spent supervising. Default 0. Edit to suit.')
    },

    // ---- Research figures quoted in guides --------------------------------
    research: {
      awardIncrease2026: fig(4.75, FY_START, 'https://www.fwc.gov.au/documents/resources/annual-wage-review-2026-decision-announcement.pdf',
        'Fair Work Commission — Annual Wage Review 2026 decision announcement', true,
        'Modern award minimum wages rose 4.75% from 1 July 2026 (first full pay period on or after). National Minimum Wage $1,004.90 a week.'),
      tradeCompletersEmployed: fig(95, '2025-01-01', SRC.ministerOutcomes, 'Minister for Skills and Training media release citing NCVER Apprentice and trainee outcomes 2025', true,
        'About 95% of trade apprentices who completed were employed after training (NCVER reports 94.8%, confirmed on the NCVER Apprentice and trainee outcomes 2025 page).'),
      nonCompletersEmployed: fig(77, '2025-01-01', SRC.ministerOutcomes, 'Minister for Skills and Training media release citing NCVER Apprentice and trainee outcomes 2025', true,
        '77% of apprentices and trainees who left before completing were employed afterwards.'),
      nonCompleterEmploymentReasons: fig(27.7, '2025-01-01', SRC.ncverOutcomes2025, 'NCVER — Apprentice and trainee outcomes 2025', true,
        'For trade occupations, dissatisfaction with pay, working conditions or the workplace was the most common main reason for not completing (27.7%). The same report puts trade completers in work after training at 94.8%.'),
      tradeFourYearAttrition: fig(42, '2021-01-01', SRC.futureCampusCompletion, 'Future Campus (28 Jul 2026) reporting NCVER Apprentice and trainee completion rates 2025', false,
        'About 42% of trade apprentices who started in 2021 had dropped out within four years. Secondary source — NCVER page blocked our checker.'),
      tradeSixYearCompletion: fig(58.7, '2026-07-01', SRC.futureCampusCompletion, 'Future Campus (28 Jul 2026) reporting NCVER Apprentice and trainee completion rates 2025', false,
        'Six-year completion rate for trade apprentices in the latest cohort NCVER can track over six years (cohort year not stated in the article). Secondary source.'),
      electricianSixYearCompletion: fig(72, '2026-07-01', SRC.futureCampusCompletion, 'Future Campus (28 Jul 2026) reporting NCVER', false,
        'Electricians had the highest six-year completion rate (about 72%). Secondary source.'),
      housingExtraWorkers: fig(116700, '2025-09-01', SRC.buildSkillsAigroup, 'Ai Group summary of BuildSkills Australia 2025 Housing Workforce Capacity Study', false,
        'Extra workers needed (above business-as-usual) to build 1.2 million homes under the National Housing Accord by 2029. Secondary source — BuildSkills report not opened directly.'),
      housingAccordTarget: fig(1200000, '2024-07-01', SRC.hiaBuildSkills, 'HIA (19 Sep 2025) on BuildSkills Australia study', false,
        'National Housing Accord target of 1.2 million new homes by 2029.')
    }
  };
});
