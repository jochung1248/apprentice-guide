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

  /* ---------------- Award pay tables (FY 2026–27) ----------------
   * One table per pay-guide group; several trades can share a table. Arrays are [year1..year4],
   * each {weekly, hourly} for a 38-hour week, apprentices who started on or after 1 Jan 2014.
   */
  var SRC2 = {
    pgHair: 'https://calculate.fairwork.gov.au/Download/AwardSummary?awardCode=ma000005&fileType=pdf',
    pgVehicle: 'https://calculate.fairwork.gov.au/Download/AwardSummary?awardCode=ma000089&fileType=pdf',
    pgHosp: 'https://calculate.fairwork.gov.au/Download/AwardSummary?awardCode=ma000009&fileType=pdf',
    pgManuf: 'https://calculate.fairwork.gov.au/Download/AwardSummary?awardCode=ma000010&fileType=pdf',
    pgJoinery: 'https://calculate.fairwork.gov.au/Download/AwardSummary?awardCode=ma000029&fileType=pdf',
    pgGarden: 'https://calculate.fairwork.gov.au/Download/AwardSummary?awardCode=ma000101&fileType=pdf',
    priorityList: 'https://www.dewr.gov.au/it/download/17559/australian-apprenticeships-priority-list-1-april-2026/42585/australian-apprenticeships-priority-list-1-april-2026/pdf',
    fwoAdult: 'https://www.fairwork.gov.au/starting-employment/types-of-employees/apprentices-and-trainees/hairdressing-apprentices'
  };
  var PG_H = 'Fair Work Ombudsman pay guide — Hair and Beauty Industry Award [MA000005], published 24 Jun 2026';
  var PG_V = 'Fair Work Ombudsman pay guide — Vehicle Repair, Services and Retail Award [MA000089], published 4 Nov 2026';
  var PG_HO = 'Fair Work Ombudsman pay guide — Hospitality Industry (General) Award [MA000009], published 24 Jun 2026';
  var PG_M = 'Fair Work Ombudsman pay guide — Manufacturing and Associated Industries and Occupations Award [MA000010], published 29 Jul 2026';
  var PG_J = 'Fair Work Ombudsman pay guide — Joinery and Building Trades Award [MA000029], published 24 Jun 2026';
  var PG_G = 'Fair Work Ombudsman pay guide — Gardening and Landscaping Services Award [MA000101], published 28 Aug 2026';
  var PL_NAME = 'DEWR — Australian Apprenticeships Priority List (1 April 2026)';

  function prH(h) { return pr(Math.round(h * 38 * 100) / 100, h); } // weekly = hourly x 38 where the guide gives hourly only

  function tbl(id, award, awardShort, src, srcName, noY12, y12, adult, trade, tradeLabel, notes) {
    return {
      id: id, award: award, awardShort: awardShort,
      apprenticeJuniorNoY12: fig(noY12, FY_START, src, srcName, true, notes.junior),
      apprenticeJuniorY12: fig(y12, FY_START, src, srcName, true, notes.y12 || 'Completed Year 12.'),
      apprenticeAdult: fig(adult, FY_START, src, srcName, true, notes.adult),
      tradesperson: fig(trade, FY_START, src, srcName, notes.tradeVerified !== false, tradeLabel)
    };
  }
  var A20 = 'Building and Construction General On-site Award 2020 [MA000020]';
  var RES = ' Residential work, weekly hire; includes industry and tool allowances. Non-residential (commercial) rates are slightly higher.';
  var T = {
    bCarp: tbl('bCarp', A20, 'Building & Construction Award', SRC.pgBuilding, PG_B,
      [pr(654.49, 17.22), pr(766.40, 20.17), pr(934.27, 24.59), pr(1102.13, 29.00)],
      [pr(710.45, 18.70), pr(822.36, 21.64), pr(934.27, 24.59), pr(1102.13, 29.00)],
      [pr(1108.44, 29.17), pr(1108.44, 29.17), pr(1108.44, 29.17), pr(1108.44, 29.17)],
      pr(1214.04, 31.95), 'Level 3 (CW/ECW 3) carpenter/joiner/tilelayer group.' + RES,
      { junior: 'Carpenter/joiner/tilelayer group, did not complete Year 12.' + RES, y12: 'Completed Year 12 (years 1–2 only).', adult: 'Adult apprentice (21+ at start); one rate for all years.' }),
    bBrick: tbl('bBrick', A20, 'Building & Construction Award', SRC.pgBuilding, PG_B,
      [pr(642.53, 16.91), pr(754.44, 19.85), pr(922.31, 24.27), pr(1090.17, 28.69)],
      [pr(698.49, 18.38), pr(810.40, 21.33), pr(922.31, 24.27), pr(1090.17, 28.69)],
      [pr(1096.48, 28.85), pr(1096.48, 28.85), pr(1096.48, 28.85), pr(1096.48, 28.85)],
      pr(1202.08, 31.63), 'Level 3 bricklayer.' + RES,
      { junior: 'Bricklayer group, did not complete Year 12.' + RES, adult: 'Adult apprentice; one rate for all years.' }),
    bPlaster: tbl('bPlaster', A20, 'Building & Construction Award', SRC.pgBuilding, PG_B,
      [pr(647.37, 17.04), pr(759.28, 19.98), pr(927.15, 24.40), pr(1095.01, 28.82)],
      [pr(703.33, 18.51), pr(815.24, 21.45), pr(927.15, 24.40), pr(1095.01, 28.82)],
      [pr(1101.32, 28.98), pr(1101.32, 28.98), pr(1101.32, 28.98), pr(1101.32, 28.98)],
      pr(1206.92, 31.76), 'Level 3 caster, fixer, floorlayer specialist or plasterer.' + RES,
      { junior: 'Caster/fixer/plasterer group, did not complete Year 12.' + RES, adult: 'Adult apprentice; one rate for all years.' }),
    bRoof: tbl('bRoof', A20, 'Building & Construction Award', SRC.pgBuilding, PG_B,
      [pr(634.86, 16.71), pr(746.77, 19.65), pr(914.64, 24.07), pr(1082.50, 28.49)],
      [pr(690.82, 18.18), pr(802.73, 21.12), pr(914.64, 24.07), pr(1082.50, 28.49)],
      [pr(1088.81, 28.65), pr(1088.81, 28.65), pr(1088.81, 28.65), pr(1088.81, 28.65)],
      pr(1194.41, 31.43), 'Level 3 roof tiler, slateridger or roof fixer.' + RES,
      { junior: 'Roof tiler group, did not complete Year 12.' + RES, adult: 'Adult apprentice; one rate for all years.' }),
    bPaint: tbl('bPaint', A20, 'Building & Construction Award', SRC.pgBuilding, PG_B,
      [pr(623.16, 16.40), pr(735.07, 19.34), pr(902.94, 23.76), pr(1070.80, 28.18)],
      [pr(679.12, 17.87), pr(791.03, 20.82), pr(902.94, 23.76), pr(1070.80, 28.18)],
      [pr(1077.11, 28.35), pr(1077.11, 28.35), pr(1077.11, 28.35), pr(1077.11, 28.35)],
      pr(1182.71, 31.12), 'Level 3 painter or glazier.' + RES,
      { junior: 'Glazier/painter/signwriter group, did not complete Year 12.' + RES, adult: 'Adult apprentice; one rate for all years.' }),
    bOther: tbl('bOther', A20, 'Building & Construction Award', SRC.pgBuilding, PG_B,
      [pr(613.27, 16.14), pr(725.18, 19.08), pr(893.05, 23.50), pr(1060.91, 27.92)],
      [pr(669.23, 17.61), pr(781.14, 20.56), pr(893.05, 23.50), pr(1060.91, 27.92)],
      [pr(1067.22, 28.08), pr(1067.22, 28.08), pr(1067.22, 28.08), pr(1067.22, 28.08)],
      pr(1172.82, 30.86), 'Level 3, not entitled to a tool allowance. We use this row for concreters — our reading of the award, not a named row; check with Fair Work.' + RES,
      { junior: '"All others" apprentice group, did not complete Year 12. Used for concreting, which the pay guide does not name — check with Fair Work.' + RES, adult: 'Adult apprentice, "all others" group; one rate for all years.', tradeVerified: false }),
    elec: tbl('elec', 'Electrical, Electronic and Communications Contracting Award 2020 [MA000025]', 'Electrical Contracting Award', SRC.pgElectrical, PG_E,
      [pr(622.72, 16.39), pr(742.79, 19.55), pr(862.87, 22.71), pr(1006.97, 26.50)],
      [pr(682.76, 17.97), pr(802.84, 21.13), pr(862.87, 22.71), pr(1006.97, 26.50)],
      [pr(982.95, 25.87), pr(1098.29, 28.90), pr(1098.29, 28.90), pr(1098.29, 28.90)],
      pr(1223.11, 32.19), 'Electrical worker grade 5 (licensed electrician). Includes industry, tool and electrician’s licence allowances.',
      { junior: '4-year apprentice, did not complete Year 12. Pay guide states rates include applicable all-purpose allowances.', adult: 'Adult apprentice.' }),
    plumb: tbl('plumb', 'Plumbing and Fire Sprinklers Award 2020 [MA000036]', 'Plumbing Award', SRC.pgPlumbing, PG_P,
      [pr(629.23, 16.56), pr(746.79, 19.65), pr(864.35, 22.75), pr(1099.48, 28.93)],
      [pr(688.01, 18.11), pr(805.57, 21.20), pr(864.35, 22.75), pr(1099.48, 28.93)],
      [pr(1046.31, 27.53), pr(1046.31, 27.53), pr(1046.31, 27.53), pr(1099.48, 28.93)],
      pr(1246.54, 32.80), 'Plumbing and mechanical services tradesperson Level 1, registered. Not-registered rate is $1,201.78/week.',
      { junior: 'Plumbing and mechanical services, did not complete Year 12. Includes applicable industry, plumbing trade and tool allowances.', adult: 'Adult apprentice, plumbing and mechanical services.' }),
    hair: tbl('hair', 'Hair and Beauty Industry Award 2020 [MA000005]', 'Hair & Beauty Award', SRC2.pgHair, PG_H,
      [pr(559.55, 14.73), pr(671.46, 17.67), pr(861.71, 22.68), pr(1007.19, 26.51)],
      [pr(615.51, 16.20), pr(727.42, 19.14), pr(861.71, 22.68), pr(1007.19, 26.51)],
      [pr(895.28, 23.56), pr(1056.80, 27.81), pr(1056.80, 27.81), pr(1056.80, 27.81)],
      pr(1119.10, 29.45), 'Hair and beauty employee level 3 (qualified hairdresser or barber).',
      { junior: 'Hairdressing apprentice, did not complete Year 12 (50%, 60%, 77%, 90% of the level 3 rate). Most hairdressing apprenticeships run 3 years; the 4th-year rate applies only where relevant.', adult: 'Adult apprentice: year 1 is the greater of 80% of the standard rate or the table rate; later years the greater of the level 1 rate ($1,056.80) or the table rate (award cl. 18.4).' }),
    vehicle: tbl('vehicle', 'Vehicle Repair, Services and Retail Award 2020 [MA000089]', 'Vehicle Repair Award', SRC2.pgVehicle, PG_V,
      [pr(559.55, 14.73), pr(671.46, 17.67), pr(839.33, 22.09), pr(984.81, 25.92)],
      [pr(615.51, 16.20), pr(727.42, 19.14), pr(839.33, 22.09), pr(984.81, 25.92)],
      [pr(895.28, 23.56), pr(978.10, 25.74), pr(1004.90, 26.44), pr(1029.10, 27.08)],
      pr(1119.10, 29.45), 'Vehicle industry RS&R tradesperson or equivalent level 1. The pay guide does not map specific trades to levels — check the award classifications.',
      { junior: 'Vehicle industry RS&R apprentice, did not complete Year 12. One table covers all vehicle trades.', adult: 'Adult apprentice.' }),
    cook: tbl('cook', 'Hospitality Industry (General) Award 2020 [MA000009]', 'Hospitality Award', SRC2.pgHosp, PG_HO,
      [pr(615.51, 16.20), pr(727.42, 19.14), pr(895.28, 23.56), pr(1063.15, 27.98)],
      [pr(615.51, 16.20), pr(727.42, 19.14), pr(895.28, 23.56), pr(1063.15, 27.98)],
      [pr(895.28, 23.56), pr(978.10, 25.74), pr(978.10, 25.74), pr(1063.15, 27.98)],
      pr(1119.10, 29.45), 'Level 4 cook (tradesperson) grade 3. Restaurants use the Restaurant Industry Award [MA000119]; we use the Hospitality (General) Award.',
      { junior: 'Apprentice cook. The pay guide has no Year 12 distinction for cooking apprentices.', y12: 'Same as without Year 12 (no distinction for cooking apprentices).', adult: 'Adult apprentice cook.' }),
    manuf: tbl('manuf', 'Manufacturing and Associated Industries and Occupations Award 2020 [MA000010]', 'Manufacturing Award', SRC2.pgManuf, PG_M,
      [pr(559.55, 14.73), pr(671.46, 17.67), pr(839.33, 22.09), pr(984.81, 25.92)],
      [pr(615.51, 16.20), pr(727.42, 19.14), pr(839.33, 22.09), pr(1029.10, 27.08)],
      [pr(895.28, 23.56), pr(978.10, 25.74), pr(1004.90, 26.44), pr(1029.10, 27.08)],
      pr(1119.10, 29.45), 'C10 engineering/manufacturing tradesperson level I.',
      { junior: 'General manufacturing apprentice (4-year), did not complete Year 12.', y12: 'Completed Year 12 (the pay guide also lifts the 4th-year rate).', adult: 'Adult apprentice, general manufacturing.' }),
    joinery: tbl('joinery', 'Joinery and Building Trades Award 2020 [MA000029]', 'Joinery Award', SRC2.pgJoinery, PG_J,
      [pr(601.54, 15.83), pr(713.44, 18.77), pr(881.24, 23.19), pr(1049.14, 27.61)],
      [pr(657.44, 17.30), pr(769.34, 20.24), pr(881.24, 23.19), pr(1049.14, 27.61)],
      [pr(948.44, 24.96), pr(993.14, 26.13), pr(1026.74, 27.02), pr(1093.94, 28.78)],
      pr(1161.04, 30.55), 'Level 5 (all others), joinery/shopfitting work. Excludes the all-purpose tool allowance ($1.08/hr for qualified joiners).',
      { junior: '4-year apprentice (joinery, shopfitting, stonemasonry or outside work), did not complete Year 12. Includes industry allowance; excludes tool allowance.', adult: 'Adult apprentice.' }),
    garden: tbl('garden', 'Gardening and Landscaping Services Award 2020 [MA000101]', 'Gardening & Landscaping Award', SRC2.pgGarden, PG_G,
      [prH(14.73), prH(17.67), prH(22.09), prH(27.98)],
      [prH(16.20), prH(19.14), prH(22.09), prH(27.98)],
      [prH(23.56), prH(25.74), prH(25.74), prH(27.98)],
      pr(1119.10, 29.45), 'Level 4 (adult). The pay guide does not label a landscape tradesperson level — check the award.',
      { junior: 'Apprentice, did not complete Year 12. The pay guide lists hourly rates only; weekly = hourly × 38.', y12: 'Completed Year 12 (hourly × 38).', adult: 'Adult apprentice (hourly × 38).' })
  };

  /* ---------------- Trades ----------------
   * stream: KAP eligibility stream from the Priority List — 'housing' (HCA), 'newEnergy' (NEA), 'both', or 'none'.
   * priorityList: on the Australian Apprenticeships Priority List (1 April 2026).
   * licence: 'electrical' | 'plumbing' | null (state licensing note).
   */
  var INDUSTRIES = [
    ['building', 'Building and construction'], ['electrical', 'Electrical and plumbing'], ['automotive', 'Automotive'],
    ['engineering', 'Engineering and manufacturing'], ['hospitality', 'Hospitality'], ['hair', 'Hair and barbering'], ['outdoor', 'Landscaping']
  ];
  function trade(key, label, industry, table, osca, stream, onList, licence, extraNote, kapMaybe) {
    var t = T[table];
    var streamText = { housing: 'Housing Construction stream', newEnergy: 'New Energy stream', both: 'both the Housing Construction and New Energy streams', none: 'no KAP stream' }[stream];
    return {
      key: key, label: label, short: label.toLowerCase(), industry: industry, table: table,
      award: t.award, awardShort: t.awardShort,
      apprenticeJuniorNoY12: t.apprenticeJuniorNoY12, apprenticeJuniorY12: t.apprenticeJuniorY12,
      apprenticeAdult: t.apprenticeAdult, tradesperson: t.tradesperson,
      licence: licence || null,
      kapMaybe: !!kapMaybe, // not a KAP occupation, but some of its qualifications sit under a KAP occupation on the list
      priorityList: fig(onList, '2026-04-01', SRC2.priorityList, PL_NAME, true,
        onList ? 'Listed as ' + osca + ' on the Priority List; marked for ' + streamText + '.' : 'Not found on the 1 April 2026 Priority List.'),
      kapStream: fig(stream, '2026-04-01', SRC2.priorityList, PL_NAME, true,
        (stream === 'none' ? (kapMaybe ? 'Usually not a KAP occupation — eligibility depends on the qualification; check with your Apprentice Connect provider.' : 'Not a Key Apprenticeship Program occupation.') : 'Eligible for KAP under ' + streamText + ' if the employer provides meaningful work in that sector.') + (extraNote ? ' ' + extraNote : '')),
      // Default for the "qualifies for KAP" checkbox: on for housing-construction occupations only.
      kapEligible: fig(stream === 'housing' || stream === 'both', '2026-04-01', SRC2.priorityList, PL_NAME, true,
        stream === 'newEnergy' ? 'KAP only if the employer works in new energy (e.g. EV or renewable work).' :
        (stream === 'both' ? 'Eligible if the employer works in housing construction or new energy.' : (stream === 'housing' ? 'Eligible with a housing-construction employer.' : (kapMaybe ? 'Usually not a KAP occupation — eligibility depends on the qualification; check with your Apprentice Connect provider.' : 'Not a KAP occupation.'))))
    };
  }
  var TRADES = {};
  [
    trade('carpenter', 'Carpenter or carpenter and joiner', 'building', 'bCarp', '372132 Carpenter / 372131 Carpenter and Joiner', 'housing', true),
    trade('tiler', 'Wall and floor tiler', 'building', 'bCarp', '362431 Wall and Floor Tiler', 'housing', true),
    trade('bricklayer', 'Bricklayer', 'building', 'bBrick', '371131 Bricklayer', 'housing', true),
    trade('plasterer', 'Plasterer (wall and ceiling)', 'building', 'bPlaster', '362231 Plasterer (Wall and Ceiling)', 'housing', true),
    trade('rooftiler', 'Roof tiler', 'building', 'bRoof', '362331 Roof Tiler', 'housing', true),
    trade('painter', 'Painter and decorator', 'building', 'bPaint', '361231 Painter', 'housing', true),
    trade('glazier', 'Glazier', 'building', 'bPaint', '362131 Glazier', 'both', true),
    trade('concreter', 'Concreter', 'building', 'bOther', '', 'none', false, null, 'Concreter is not on the Priority List, so KAP, the Priority Hiring Incentive and the training support payment are unlikely to apply — check with your Apprentice Connect provider.'),
    trade('cabinetmaker', 'Cabinetmaker or joiner (shopfitting)', 'building', 'joinery', '369131 Cabinet Maker / 372133 Joiner', 'housing', true),
    trade('electrician', 'Electrician', 'electrical', 'elec', '381231 Electrician (General)', 'both', true, 'electrical'),
    trade('plumber', 'Plumber', 'electrical', 'plumb', '363131 Plumber (General)', 'both', true, 'plumbing'),
    trade('lightvehicle', 'Light vehicle mechanic', 'automotive', 'vehicle', '351131 Automotive Technician (General)', 'newEnergy', true),
    trade('diesel', 'Heavy vehicle / diesel mechanic', 'automotive', 'vehicle', '351433 Diesel Technician', 'none', true, null, 'The heavy vehicle qualification (AUR31120) is also listed under Automotive Technician (General), which is New Energy-eligible.', true),
    trade('autoelec', 'Auto electrician', 'automotive', 'vehicle', '351231 Automotive Electrician', 'newEnergy', true),
    trade('panelbeater', 'Panel beater', 'automotive', 'vehicle', '351331 Panelbeater', 'none', true),
    trade('vehiclepainter', 'Vehicle painter', 'automotive', 'vehicle', '351631 Vehicle Painter', 'none', true, null, 'The automotive refinishing qualification (AUR32420) is also listed under Painter, which is Housing Construction-eligible.', true),
    trade('fitter', 'Fitter and turner / mechanical fitter', 'engineering', 'manuf', '332232 Fitter and Turner / 332231 Fitter (General)', 'both', true, null, 'A factory or mining employer usually won’t qualify.'),
    trade('boilermaker', 'Boilermaker / welder (metal fabrication)', 'engineering', 'manuf', '331131 Metal Fabricator / 331133 Welder (First Class)', 'both', true, null, 'A factory or mining employer usually won’t qualify.'),
    trade('cook', 'Chef / commercial cook', 'hospitality', 'cook', '322331 Cook', 'none', true),
    trade('hairdresser', 'Hairdresser', 'hair', 'hair', '392132 Hairdresser', 'none', true),
    trade('barber', 'Barber', 'hair', 'hair', '392131 Barber', 'none', true),
    trade('landscaper', 'Landscaper (landscape construction)', 'outdoor', 'garden', '342432 Landscape Gardener', 'housing', true)
  ].forEach(function (t) { TRADES[t.key] = t; });
  // The fitter/boilermaker defaults: on the list for both streams, but a manufacturing employer is usually not in housing or new energy.
  TRADES.fitter.kapEligible.value = false; TRADES.boilermaker.kapEligible.value = false;
  TRADES.fitter.kapEligible.note = TRADES.boilermaker.kapEligible.note = 'Eligible only if the employer works in housing construction or new energy; most manufacturing employers don’t.';

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
      'Full-time ordinary hours are 38 per week under all nine awards used here. Pay guide weekly rates assume 38 hours.'),

    // ---- Award minimum rates and trades (see TRADES / T above) ----
    industries: INDUSTRIES,
    payTables: T,
    trades: TRADES,
    adultAge: fig(21, FY_START, SRC2.fwoAdult, 'Fair Work Ombudsman — apprentice pay (adult apprentices are 21 or older when they start)', true,
      'Adult apprentice rates apply if you are 21 or older when the apprenticeship starts.'),

    // ---- States and territories: extra help, licensing, notices (verified items only; unverifiable items left out) ----
    // Each item: fig({ kind, title, text, regional }, dateOnSource, url, sourceName, true, note)
    //   kind: 'training' (free/fee-free training), 'travel' (travel/accommodation help), 'employer' (employer payments/payroll tax)
    //   regional: true if mainly relevant to apprentices far from training (highlighted when "Regional or remote" is chosen)
    under18: {
      tax: fig('excepted', FY_START, 'https://www.ato.gov.au/tax-rates-and-codes/tax-rates-if-you-re-under-18-years-old', 'ATO — Tax rates if you’re under 18', true,
        'Employment income of under-18s is "excepted income" taxed at the normal adult resident rates; higher minor rates apply to some other income.'),
      consent: fig('parent-signs', '2026-11-17', 'https://www.apprenticeships.vic.gov.au/your-training-contract', 'Apprenticeships Victoria — Your training contract', true,
        'A parent or guardian usually needs to sign the training contract for an apprentice under 18 (in Victoria, for example, they must sign it and any changes). Check your state\u2019s rules with your Apprentice Connect provider.')
    },
    waNotice: fig('state-system', '2026-10-27', 'https://www.wa.gov.au/organisation/private-sector-labour-relations/which-system-of-employment-laws-applies', 'WA Government — Which system of employment laws applies (updated 27 Oct 2026)', true,
      'In WA, sole traders, partnerships and trusts that are not constitutional corporations are covered by the WA state system (WA awards), not the national awards shown here.'),
    lafhaNote: fig('lafha', '2026-07-01', SRC.dewrPayments, 'DEWR — Australian Apprenticeships Incentive System payments overview (effective 1 Jul 2026)', true,
      'Living Away From Home Allowance: for apprentices who must move out of a parent’s or guardian’s home for the first time to take up or stay in the apprenticeship, within 36 months of starting. Not available to those getting Youth Allowance, Austudy, ABSTUDY or Centrelink rent assistance, or free/subsidised board from the employer.'),
    states: {
      NSW: { name: 'New South Wales',
        items: [
          fig({ kind: 'training', title: 'Fee-free apprenticeships', text: 'NSW apprentices whose Smart and Skilled-funded training starts before 30 June 2027 pay no student fee (normally up to $2,000).' },
            '2026-05-19', 'https://education.nsw.gov.au/skills-nsw/students-and-job-seekers/low-cost-and-free-training-options/fee-free-apprenticeships', 'NSW Department of Education — Fee-free apprenticeships (updated 19 May 2026)', true, ''),
          fig({ kind: 'travel', regional: true, title: 'Travel and accommodation allowance (VTAS)', text: 'If you travel more than 110 km return to day or block release training: $0.52 per km and $70 per night for accommodation (rates from 1 November 2025). Claim through your local Training Services NSW office.' },
            '2025-11-01', 'https://education.nsw.gov.au/skills-nsw/apprentices-and-trainees/support-with-your-apprenticeship-or-traineeship/financial-assistance/travel--accommodation-and-relocation-assistance-package', 'NSW Department of Education — Travel, accommodation and relocation assistance', true, ''),
          fig({ kind: 'employer', title: 'Payroll tax rebate', text: 'Employers can claim a payroll tax rebate on wages paid to apprentices approved by Training Services NSW (not an exemption).' },
            '2025-07-14', 'https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax/taxable-wages/apprentice-and-trainee-wages', 'Revenue NSW — Payroll tax for apprentice and trainee wages (updated 14 Jul 2025)', true, '')
        ],
        licensing: { electrical: { name: 'NSW Fair Trading', url: 'https://www.fairtrading.nsw.gov.au/trades-and-businesses/licensing-and-qualifications/electrical-licences' },
                     plumbing: { name: 'NSW Fair Trading', url: 'https://www.fairtrading.nsw.gov.au/trades-and-businesses/licensing-and-qualifications/plumbing,-draining-and-gasfitting-licences' } } },
      VIC: { name: 'Victoria',
        items: [
          fig({ kind: 'training', title: 'Free TAFE for priority apprenticeships (from 2027)', text: 'From 2027, six priority apprenticeships (including home building, renewable energy, hair styling and baking) join Free TAFE: first-year tuition fees are covered for apprentices who start one at TAFE.' },
            '2026-10-29', 'https://www.premier.vic.gov.au/free-tafe-apprenticeships-power-victorias-economy', 'Premier of Victoria — Free TAFE apprenticeships (29 Oct 2026)', true, ''),
          fig({ kind: 'employer', title: 'Payroll tax: re-employed apprentices', text: 'Wages are exempt from payroll tax when an out-of-trade apprentice is hired by a new employer to continue the same training (not the same employer or group).' },
            '2026-10-22', 'https://www.sro.vic.gov.au/businesses-and-organisations/payroll-tax/exempt-wages-and-organisations/wages-exempt-payroll-tax', 'State Revenue Office Victoria — Wages exempt from payroll tax (updated 22 Oct 2026)', true, '')
        ],
        licensing: { electrical: { name: 'Energy Safe Victoria', url: 'https://www.energysafe.vic.gov.au/licensing/electrical-licences' },
                     plumbing: { name: 'Building and Plumbing Commission', url: 'https://www.bpc.vic.gov.au/plumbers/registration-and-licensing/which-registration-or-licence-do-i-need' } } },
      QLD: { name: 'Queensland',
        items: [
          fig({ kind: 'training', title: 'Free Apprenticeships for Under 25s', text: 'Course fees are covered for apprentices under 25 in a high-priority apprenticeship who start by 30 June 2027 with an approved Skills Assure Supplier. Uniforms, resources and travel may still cost.' },
            '2025-08-08', 'https://www.qld.gov.au/education/training/subsidies/freeapprenticeships', 'Queensland Government — Free Apprenticeships for Under 25s (updated 8 Aug 2025)', true, ''),
          fig({ kind: 'travel', regional: true, title: 'Travel and accommodation allowance', text: 'If your closest training provider is at least 100 km return: up to 34 cents per km (from 1 July 2025) and $58 a night intrastate or $112 interstate.' },
            '2025-08-11', 'https://www.qld.gov.au/education/apprenticeships/for-apprentices/support/financial', 'Queensland Government — Financial help for apprentices and trainees (updated 11 Aug 2025)', true, ''),
          fig({ kind: 'employer', title: 'Payroll tax exemption and rebate', text: 'Wages paid to apprentices under a registered training contract may be exempt from payroll tax, and employers may also claim a rebate.' },
            '2026-09-16', 'https://qro.qld.gov.au/payroll-tax/exemptions/wages/', 'Queensland Revenue Office — Exempt wages for payroll tax (updated 16 Sep 2026)', true, '')
        ],
        licensing: { electrical: { name: 'Electrical Safety Office (WorkSafe Queensland)', url: 'https://www.worksafe.qld.gov.au/licensing-and-registrations/electrical-licences/classes-of-licences' },
                     plumbing: { name: 'Queensland Building and Construction Commission (QBCC)', url: 'https://www.qbcc.qld.gov.au/licences/start-your-career/when-you-need-licence' } } },
      WA: { name: 'Western Australia',
        items: [
          fig({ kind: 'training', title: 'Fee-free apprenticeship courses', text: 'From January 2026 five more apprenticeship qualifications were added to WA\u2019s fee-free list: plumbing, bricklaying and blocklaying, wall and ceiling lining, and solid plastering.' },
            '2025-11-04', 'https://www.wa.gov.au/government/media-statements/Cook%20Labor%20Government/Housing-made-possible-thanks-to-fee-free,-low-fee-TAFE-training-20251104', 'WA Government media statement (4 Nov 2025)', true, ''),
          fig({ kind: 'travel', regional: true, title: 'Travel and Accommodation Allowance', text: 'For WA-resident apprentices who travel more than 70 km round trip to the closest funded training provider. Claim through WAAMS within 60 days.' },
            '2025-12-22', 'https://www.wa.gov.au/service/education-and-training/vocational-education/travel-and-accommodation-allowance-apprentices-and-trainees', 'WA Government — Travel and Accommodation Allowance (updated 22 Dec 2025)', true, ''),
          fig({ kind: 'training', industries: ['building'], title: 'Construction Training Fund: apprentice support', text: 'Building and construction apprentices can get an Apprentice Support Bonus of $1,000 a year (up to $3,000) and up to $2,000 towards tools and safety gear.' },
            '2025-06-01', 'https://www.jobsandskills.wa.gov.au/sites/default/files/uploads/documents/TRAINING_section/jswa-sd-state-government-incentives-and-allowances-for-apprentices-trainees-v3-jun2025.pdf', 'Jobs and Skills WA — State incentives and allowances for apprentices (June 2025)', true, ''),
          fig({ kind: 'employer', title: 'Employer incentives and payroll tax', text: 'Jobs and Skills WA Employer Incentive: base payment up to $8,500, with loadings (including regional WA) — employers with payroll above $1 million get the payroll tax exemption instead. Adult Apprentice Employer Incentive: up to $26,800 for apprentices 21+ who live and work in WA, in a Priority Start occupation. Apprentice wages under a registered training contract are exempt from payroll tax.' },
            '2026-10-05', 'https://www.jobsandskills.wa.gov.au/employer-incentives', 'Jobs and Skills WA — Incentives for employers (updated 5 Oct 2026)', true, ''),
          fig({ kind: 'employer', industries: ['building'], title: 'Construction Training Fund employer grant', text: 'Up to $15,000 for employers of building and construction apprentices, with loadings (including regional).' },
            '2026-10-05', 'https://www.jobsandskills.wa.gov.au/employer-incentives', 'Jobs and Skills WA — Incentives for employers (updated 5 Oct 2026)', true, '')
        ],
        licensing: { electrical: { name: 'Building and Energy (WA)', url: 'https://www.wa.gov.au/organisation/service-delivery/building-and-energy-licensing-and-registration' },
                     plumbing: { name: 'Plumbers Licensing Board (Building and Energy)', url: 'https://www.wa.gov.au/government/multi-step-guides/plumbers-licensing' } } },
      SA: { name: 'South Australia',
        items: [
          fig({ kind: 'travel', regional: true, title: 'Travel and Accommodation Allowance', text: 'A part-payment towards travel and accommodation for apprentices, usually in rural or regional areas, who live a long way from their nearest training location. Your employer checks eligibility and applies.' },
            '2026-04-02', 'https://mytraining.skills.sa.gov.au/trainees-apprentices/get-started/travel-and-accommodation-allowance', 'Skills SA — Travel and accommodation allowance', true, 'sa.gov.au support page updated 2 Apr 2026.')
        ],
        licensing: { electrical: { name: 'Consumer and Business Services (CBS)', url: 'https://www.sa.gov.au/topics/business-and-trade/licensing/building-and-trades/licensing' },
                     plumbing: { name: 'Consumer and Business Services (CBS)', url: 'https://www.sa.gov.au/topics/business-and-trade/licensing/building-and-trades/licensing' } } },
      TAS: { name: 'Tasmania',
        items: [
          fig({ kind: 'travel', regional: true, title: 'Travel and Accommodation Contribution', text: 'Help with travel over 21 km each way within Tasmania, accommodation if training is more than 61 km from home, and interstate airfares and overnight stays.' },
            '2026-11-17', 'https://www.skills.tas.gov.au/apprenticeships_and_traineeships/information_for_learners_about_apprenticeships', 'Skills Tasmania — Information for apprentices (checked 17 Nov 2026)', true, 'Page shows no date.')
        ],
        licensing: { electrical: { name: 'Consumer, Building and Occupational Services (CBOS)', url: 'https://www.cbos.tas.gov.au/' },
                     plumbing: { name: 'Consumer, Building and Occupational Services (CBOS)', url: 'https://www.cbos.tas.gov.au/topics/licensing-and-registration/licensed-occupations/plumbing/practitioner' } } },
      ACT: { name: 'Australian Capital Territory',
        items: [
          fig({ kind: 'travel', title: 'Interstate block-release travel', text: 'A payment towards travel for eligible apprentices who must attend interstate block-release training.' },
            '2026-11-17', 'https://www.act.gov.au/skills/students/australian-apprenticeships', 'ACT Government — Australian Apprenticeships (checked 17 Nov 2026)', true, 'Page shows no date.'),
          fig({ kind: 'employer', title: 'Payroll tax: group training', text: 'Wages paid by approved not-for-profit group training organisations to their apprentices are exempt from ACT payroll tax.' },
            '2011-07-01', 'https://www.revenue.act.gov.au/__data/assets/pdf_file/0008/2944601/PTA070.pdf', 'ACT Revenue Office — Circular PTA070', true, '')
        ],
        licensing: { electrical: { name: 'Access Canberra (Construction Occupations Registrar)', url: 'https://www.planning.act.gov.au/professionals/regulation-and-responsibilities/construction-licences' },
                     plumbing: { name: 'Access Canberra (Construction Occupations Registrar)', url: 'https://www.planning.act.gov.au/professionals/regulation-and-responsibilities/construction-licences' } } },
      NT: { name: 'Northern Territory',
        items: [
          fig({ kind: 'travel', regional: true, title: 'Apprenticeship travel and accommodation subsidy', text: 'A partial contribution to travel and accommodation when your training provider is more than 50 km away (one way). Claim through the Apprentice Connect provider in the NT.' },
            '2016-03-31', 'https://nt.gov.au/employ/apprenticeships-and-traineeships/support-for-apprentices/apprenticeship-travel-and-accommodation-help', 'NT Government — Apprenticeship travel and accommodation subsidy (page updated 31 Mar 2016)', true, 'The page is old; check current rates before relying on them.')
        ],
        licensing: { electrical: { name: 'Electrical Workers and Contractors Licensing Board (NT WorkSafe)', url: 'https://worksafe.nt.gov.au/licensing-and-registration/electrical-licensing/electrical-licenses-and-endorsements' },
                     plumbing: { name: 'Plumbers and Drainers Licensing Board', url: 'https://plumberslicensing.nt.gov.au/licensing' } } }
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
