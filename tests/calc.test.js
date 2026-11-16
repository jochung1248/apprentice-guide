// Run with: node --test tests/
// Hand-worked examples: the arithmetic is shown in comments so a reviewer can check it with a calculator.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const R = require(path.join(__dirname, '..', 'site', 'js', 'rates.js'));
const C = require(path.join(__dirname, '..', 'site', 'js', 'calc.js'));

const near = (actual, expected, msg) => assert.ok(Math.abs(actual - expected) < 0.006, `${msg || ''} expected ${expected}, got ${actual}`);

/* ------------------------------------------------------------------ */
/* rates.js integrity                                                  */
/* ------------------------------------------------------------------ */
test('every figure in rates.js has the required metadata', () => {
  const walk = (o, p) => {
    if (o && typeof o === 'object' && 'value' in o && 'verified' in o) {
      for (const k of ['effectiveFrom', 'sourceUrl', 'sourceName', 'note']) assert.ok(k in o, `${p} missing ${k}`);
      assert.equal(typeof o.verified, 'boolean', `${p}.verified`);
      if (o.verified) assert.match(o.sourceUrl, /^https:\/\//, `${p} verified figures need a source URL`);
      return 1;
    }
    let n = 0;
    if (o && typeof o === 'object') for (const k of Object.keys(o)) if (k !== 'meta') n += walk(o[k], p + '.' + k);
    return n;
  };
  assert.ok(walk(R, 'R') > 40);
});

test('pay guide hourly figures are consistent with weekly / 38', () => {
  // Tolerance 1 cent: the Fair Work pay guides truncate some hourly figures (e.g. joinery adult yr 4: $1,093.94 -> $28.78).
  for (const [key, t] of Object.entries(R.trades)) {
    for (const tbl of ['apprenticeJuniorNoY12', 'apprenticeJuniorY12', 'apprenticeAdult']) {
      t[tbl].value.forEach((r, i) => assert.ok(Math.abs(r.weekly / 38 - r.hourly) < 0.01, `${key}.${tbl}[${i}]`));
    }
    assert.ok(Math.abs(t.tradesperson.value.weekly / 38 - t.tradesperson.value.hourly) < 0.01, key + ' tradesperson');
  }
});

/* ------------------------------------------------------------------ */
/* Tax                                                                 */
/* ------------------------------------------------------------------ */
test('income tax: hand-worked examples (2026–27 resident)', () => {
  // $18,200: tax-free threshold -> 0
  assert.equal(C.incomeTax(18200, R).total, 0);

  // $20,000: bracket (20,000-18,200) x 15% = 270; LITO 700 caps at 270 -> 0; Medicare 0 (below 28,011)
  let t = C.incomeTax(20000, R);
  near(t.bracketTax, 270); near(t.lito, 270); near(t.total, 0);

  // $30,000: bracket 11,800 x 15% = 1,770; LITO 700 -> 1,070
  // Medicare phase-in: (30,000-28,011) x 10% = 198.90 (less than 2% = 600) -> total 1,268.90
  t = C.incomeTax(30000, R);
  near(t.incomeTax, 1070); near(t.medicare, 198.90); near(t.total, 1268.90);

  // $70,000: 4,020 + 25,000 x 30% = 11,520; LITO 0 (above 66,667); Medicare 2% = 1,400 -> 12,920
  near(C.incomeTax(70000, R).total, 12920);

  // $150,000: 31,020 + 15,000 x 37% = 36,570; Medicare 3,000 -> 39,570
  near(C.incomeTax(150000, R).total, 39570);
});

test('LITO tapers correctly', () => {
  near(C.lowIncomeTaxOffset(37500, R), 700);
  near(C.lowIncomeTaxOffset(45000, R), 325);          // 700 - 7,500 x 5%
  near(C.lowIncomeTaxOffset(55000, R), 175);          // 325 - 10,000 x 1.5%
  near(C.lowIncomeTaxOffset(66667, R), 0);
});

/* ------------------------------------------------------------------ */
/* HELP                                                                */
/* ------------------------------------------------------------------ */
test('HELP compulsory repayment, 2026–27 marginal system', () => {
  assert.equal(C.helpRepayment(69528, R), 0);
  near(C.helpRepayment(80000, R), 1570.80);   // (80,000-69,528) x 15% = 10,472 x 0.15
  near(C.helpRepayment(140000, R), 10776.11); // 9,028 + (140,000-129,717) x 17% = 9,028 + 1,748.11
  near(C.helpRepayment(200000, R), 20000);    // above 186,050: 10% of total
});

/* ------------------------------------------------------------------ */
/* Calculator 1: apprentice pay                                        */
/* ------------------------------------------------------------------ */
test('apprenticePay example 1: carpenter, 1st year, junior, no Year 12, 38h', () => {
  // weekly 654.49 (pay guide); annual 654.49 x 52 = 34,033.48; taxable 34,033
  // bracket (34,033-18,200) x 15% = 2,374.95; LITO 700 -> 1,674.95
  // Medicare: min(2% = 680.66, (34,033-28,011) x 10% = 602.20) = 602.20; total tax 2,277.15
  // take-home 34,033.48 - 2,277.15 = 31,756.33 -> 610.70/wk, 1,221.40/fortnight
  const r = C.apprenticePay({ trade: 'carpenter', year: 1, type: 'junior', y12: false, hours: 38 }, R);
  assert.equal(r.hourly, 17.22);
  near(r.weekly, 654.49); near(r.annual, 34033.48);
  near(r.tax.incomeTax, 1674.95); near(r.tax.medicare, 602.20); near(r.tax.total, 2277.15);
  near(r.takeHomeAnnual, 31756.33); near(r.takeHomeWeekly, 610.70); near(r.takeHomeFortnightly, 1221.40);
  assert.equal(r.kapTotal, 10000);
  assert.deepEqual(r.kap.map(p => p.month), [6, 12, 24, 36, 48]);
});

test('apprenticePay example 2: electrician, 4th year, junior, Year 12, 38h', () => {
  // weekly 1,006.97; annual 52,362.44; taxable 52,362
  // bracket 4,020 + (52,362-45,000) x 30% = 4,020 + 2,208.60 = 6,228.60
  // LITO 325 - 7,362 x 1.5% = 325 - 110.43 = 214.57 -> income tax 6,014.03
  // Medicare 2% x 52,362 = 1,047.24; total 7,061.27; take-home 45,301.17 -> 871.18/wk
  const r = C.apprenticePay({ trade: 'electrician', year: 4, type: 'junior', y12: true, hours: 38 }, R);
  near(r.annual, 52362.44); near(r.tax.lito, 214.57); near(r.tax.incomeTax, 6014.03);
  near(r.tax.medicare, 1047.24); near(r.tax.total, 7061.27);
  near(r.takeHomeAnnual, 45301.17); near(r.takeHomeWeekly, 871.18);
});

test('apprenticePay example 3: plumber, adult, 2nd year, 30 hours (part-time)', () => {
  // weekly at 38h 1,046.31 -> 1,046.31 / 38 x 30 = 826.03; annual 826.03 x 52 = 42,953.56
  // bracket (42,953-18,200) x 15% = 3,712.95; LITO 700 - (42,953-37,500) x 5% = 427.35 -> 3,285.60
  // Medicare 2% x 42,953 = 859.06; total 4,144.66; take-home 38,808.90
  // part-time KAP schedule: 5 x $1,000
  const r = C.apprenticePay({ trade: 'plumber', year: 2, type: 'adult', y12: false, hours: 30 }, R);
  near(r.weekly, 826.03); near(r.annual, 42953.56);
  near(r.tax.incomeTax, 3285.60); near(r.tax.medicare, 859.06); near(r.tax.total, 4144.66);
  near(r.takeHomeAnnual, 38808.90);
  assert.equal(r.partTime, true); assert.equal(r.kapTotal, 5000);
});

test('apprenticePay: KAP can be switched off', () => {
  const r = C.apprenticePay({ trade: 'bricklayer', year: 1, type: 'junior', y12: true, hours: 38, kapEligible: false }, R);
  assert.equal(r.kap.length, 0); assert.equal(r.kapTotal, 0);
});

/* ------------------------------------------------------------------ */
/* Calculator 2: trade vs uni                                          */
/* ------------------------------------------------------------------ */
test('tradeVsUni example 1: carpenter vs science degree, two years (17 -> 19)', () => {
  // TRADE age 17: 34,033.48 gross - 2,277.15 tax + KAP (6 & 12 months) 4,000 = 35,756.33
  // TRADE age 18: 766.40 x 52 = 39,852.80; taxable 39,852: bracket 21,652 x 15% = 3,247.80;
  //   LITO 700 - 2,352 x 5% = 582.40 -> 2,665.40; Medicare 2% = 797.04; tax 3,462.44
  //   net 39,852.80 - 3,462.44 + 2,000 (24-month KAP) = 38,390.36; cumulative 74,146.69
  // UNI age 17 (study yr 1): income 15,000 (no tax); debt 9,537 -> indexed x 1.028 = 9,804.04
  // UNI age 18 (study yr 2): debt 9,804.04 + 9,537 = 19,341.04 -> x 1.028 = 19,882.59
  //   cumulative take-home 30,000; position 30,000 - 19,882.59 = 10,117.41
  // difference (trade - uni position) = 74,146.69 - 10,117.41 = 64,029.28
  const r = C.tradeVsUni({ trade: 'carpenter', startAge: 17, targetAge: 19, y12: false, kapEligible: true,
    marketLoading: 0, payGrowth: 0, uniStartAge: 17, degreeYears: 3, contribution: 9537,
    partTimeIncome: 15000, gradSalary: 77000, indexation: 0.028 }, R);
  assert.equal(r.rows.length, 2);
  near(r.rows[0].trade.net, 35756.33); near(r.rows[1].trade.tax, 3462.44); near(r.rows[1].trade.net, 38390.36);
  near(r.rows[0].uni.helpBalance, 9804.04); near(r.rows[1].uni.helpBalance, 19882.59);
  near(r.summary.tradeCumulative, 74146.69); near(r.summary.uniPosition, 10117.41);
  near(r.summary.difference, 64029.28);
  assert.equal(r.summary.breakEvenAge, null);
});

test('tradeVsUni example 2: graduate makes a compulsory HELP repayment', () => {
  // UNI age 18: 1-year course, contribution 10,000, no income, idx 0 -> debt 10,000, position -10,000
  // UNI age 19: salary 80,000; tax 4,020 + 35,000 x 30% = 14,520 + Medicare 1,600 = 16,120
  //   HELP (80,000-69,528) x 15% = 1,570.80; debt 8,429.20; net 62,309.20; position 62,309.20 - 8,429.20 = 53,880
  // TRADE (electrician, Year 12): age 18: 682.76 x 52 = 35,503.52; taxable 35,503: bracket 17,303 x 15% = 2,595.45
  //   - LITO 700 = 1,895.45; Medicare min(710.06, 749.20) = 710.06 -> tax 2,605.51; net 32,898.01
  //   age 19: 802.84 x 52 = 41,747.68; taxable 41,747: bracket 3,532.05 - LITO (700 - 212.35 = 487.65) = 3,044.40
  //   + Medicare 834.94 = 3,879.34; net 37,868.34; cumulative 70,766.35
  //   difference 70,766.35 - 53,880 = 16,886.35
  const r = C.tradeVsUni({ trade: 'electrician', startAge: 18, targetAge: 20, y12: true, kapEligible: false,
    marketLoading: 0, payGrowth: 0, uniStartAge: 18, degreeYears: 1, contribution: 10000,
    partTimeIncome: 0, gradSalary: 80000, indexation: 0 }, R);
  near(r.rows[0].uni.position, -10000);
  near(r.rows[1].uni.tax, 16120); near(r.rows[1].uni.helpRepaid, 1570.80); near(r.rows[1].uni.helpBalance, 8429.20);
  near(r.rows[1].uni.position, 53880);
  near(r.rows[0].trade.tax, 2605.51); near(r.rows[1].trade.tax, 3879.34);
  near(r.summary.tradeCumulative, 70766.35); near(r.summary.difference, 16886.35);
});

test('tradeVsUni example 3: qualified wage uses loading and growth; KAP totals $10,000', () => {
  // Age 22 (6th row, i = 5, one year after qualifying): 1,214.04 x 52 = 63,130.08
  //   x 1.10 loading = 69,443.088 x 1.03 growth = 71,526.38
  const r = C.tradeVsUni({ trade: 'carpenter', startAge: 17, targetAge: 25, y12: true, kapEligible: true,
    marketLoading: 0.10, payGrowth: 0.03, uniStartAge: 18, degreeYears: 3, contribution: 9537,
    partTimeIncome: 15000, gradSalary: 77000, indexation: 0.028 }, R);
  assert.equal(r.rows.length, 8);
  near(r.rows[4].trade.gross, 69443.09);
  near(r.rows[5].trade.gross, 71526.38);
  assert.equal(r.rows.reduce((s, x) => s + x.trade.kap, 0), 10000);
  assert.equal(r.rows[3].trade.kap, 2000); // completion payment in 4th year
  assert.equal(r.rows[0].uni.stage, 'Finishing school');
  assert.equal(r.rows[1].uni.stage, 'Uni year 1');
  assert.equal(r.rows[4].uni.stage, 'Graduate');
});

test('tradeVsUni: adult apprentice rates are used when starting at 21+', () => {
  const r = C.tradeVsUni({ trade: 'carpenter', startAge: 28, targetAge: 30, y12: true, kapEligible: false,
    marketLoading: 0, payGrowth: 0, uniStartAge: 28, degreeYears: 3, contribution: 0, partTimeIncome: 0, gradSalary: 0, indexation: 0 }, R);
  near(r.rows[0].trade.gross, 1108.44 * 52); // 57,638.88
});

/* ------------------------------------------------------------------ */
/* Calculator 3: employer cost                                         */
/* ------------------------------------------------------------------ */
test('employerCost example 1: carpenter 1st year junior, KAP employer incentive', () => {
  // wages 654.49 x 52 = 34,033.48; super 12% = 4,084.02; workers comp 4% = 1,361.34
  // + fees 1,000 + tools 800 = 41,278.84; less KAP 5,000 = 36,278.84 -> 697.67/wk
  const r = C.employerCost({ trade: 'carpenter', year: 1, type: 'junior', y12: false, hours: 38,
    workersCompRate: 0.04, tafeFees: 1000, toolsPpe: 800, incentive: 'kap' }, R);
  near(r.wages, 34033.48); near(r.super, 4084.02); near(r.workersComp, 1361.34);
  near(r.grossCost, 41278.84); assert.equal(r.incentive, 5000);
  near(r.netCost, 36278.84); near(r.netWeekly, 697.67);
});

test('employerCost example 2: electrician 2nd year, no incentive after year 1', () => {
  // wages 802.84 x 52 = 41,747.68; super 5,009.72; comp 3% = 1,252.43; tools 500 -> 48,509.83
  // incentive not applied in year 2 -> net 48,509.83 -> 932.88/wk
  const r = C.employerCost({ trade: 'electrician', year: 2, type: 'junior', y12: true, hours: 38,
    workersCompRate: 0.03, tafeFees: 0, toolsPpe: 500, incentive: 'kap' }, R);
  near(r.grossCost, 48509.83); assert.equal(r.incentive, 0); near(r.netWeekly, 932.88);
});

test('employerCost example 3: adult bricklayer, Priority Hiring Incentive', () => {
  // wages 1,096.48 x 52 = 57,016.96; super 6,842.04; comp 5% = 2,850.85 -> 66,709.85
  // less PHI 2,500 = 64,209.85 -> 1,234.80/wk
  const r = C.employerCost({ trade: 'bricklayer', year: 1, type: 'adult', y12: false, hours: 38,
    workersCompRate: 0.05, tafeFees: 0, toolsPpe: 0, incentive: 'phi' }, R);
  near(r.grossCost, 66709.85); assert.equal(r.incentive, 2500);
  near(r.netCost, 64209.85); near(r.netWeekly, 1234.80);
});

test('employerCost: part-time Priority Hiring Incentive is $1,250 ($500 + $750)', () => {
  const r = C.employerCost({ trade: 'bricklayer', year: 1, type: 'adult', y12: false, hours: 20,
    workersCompRate: 0.04, tafeFees: 0, toolsPpe: 0, incentive: 'phi' }, R);
  assert.equal(r.partTime, true); assert.equal(r.incentive, 1250);
  const ft = C.employerCost({ trade: 'bricklayer', year: 1, type: 'adult', y12: false, hours: 38,
    workersCompRate: 0.04, tafeFees: 0, toolsPpe: 0, incentive: 'phi' }, R);
  assert.equal(ft.incentive, 2500);
});

test('employerCost: part-time KAP employer incentive is $2,500', () => {
  const r = C.employerCost({ trade: 'carpenter', year: 1, type: 'junior', y12: false, hours: 30,
    workersCompRate: 0.04, tafeFees: 0, toolsPpe: 0, incentive: 'kap' }, R);
  assert.equal(r.partTime, true); assert.equal(r.incentive, 2500);
});

/* ------------------------------------------------------------------ */
/* v1.1: more awards, age -> adult derivation, incentives by trade     */
/* ------------------------------------------------------------------ */
test('new award example 1: hairdresser (MA000005), 1st year, age 17, no Year 12', () => {
  // weekly 559.55 (50% of level 3 $1,119.10); annual x 52 = 29,096.60; taxable 29,096
  // bracket (29,096-18,200) x 15% = 10,896 x 0.15 = 1,634.40; LITO 700 -> income tax 934.40
  // Medicare phase-in (29,096-28,011) x 10% = 108.50 (< 2% = 581.92); total 1,042.90
  // take-home 29,096.60 - 1,042.90 = 28,053.70 -> 539.49/wk. Not a KAP occupation -> no KAP.
  const r = C.apprenticePay({ trade: 'hairdresser', year: 1, age: 17, y12: false, hours: 38 }, R);
  assert.equal(r.type, 'junior');
  near(r.weekly, 559.55); near(r.annual, 29096.60); near(r.tax.incomeTax, 934.40); near(r.tax.medicare, 108.50);
  near(r.takeHomeAnnual, 28053.70); near(r.takeHomeWeekly, 539.49); assert.equal(r.kapTotal, 0);
});

test('new award example 2: light vehicle mechanic (MA000089), 2nd year, age 22 -> adult', () => {
  // adult yr 2 weekly 978.10; annual 50,861.20; taxable 50,861
  // bracket 4,020 + (50,861-45,000) x 30% = 4,020 + 1,758.30 = 5,778.30
  // LITO 325 - 5,861 x 1.5% = 325 - 87.915 = 237.085 (~237.09) -> income tax 5,541.215 (~5,541.22)
  // Medicare 2% x 50,861 = 1,017.22; total ~6,558.44; take-home ~44,302.76
  const r = C.apprenticePay({ trade: 'lightvehicle', year: 2, age: 22, y12: false, hours: 38 }, R);
  assert.equal(r.type, 'adult');
  near(r.annual, 50861.20); near(r.tax.lito, 237.09); near(r.tax.medicare, 1017.22); near(r.tax.total, 6558.44);
  near(r.takeHomeAnnual, 44302.76);
});

test('new award example 3: apprentice cook (MA000009), 3rd year, age 19', () => {
  // weekly 895.28 (80% of $1,119.10); annual 46,554.56; taxable 46,554
  // bracket 4,020 + 1,554 x 30% = 4,486.20; LITO 325 - 1,554 x 1.5% = 301.69 -> 4,184.51
  // Medicare 2% x 46,554 = 931.08; total 5,115.59; take-home 41,438.97 -> 796.90/wk
  const r = C.apprenticePay({ trade: 'cook', year: 3, age: 19, y12: true, hours: 38 }, R);
  near(r.tax.incomeTax, 4184.51); near(r.tax.medicare, 931.08); near(r.takeHomeAnnual, 41438.97); near(r.takeHomeWeekly, 796.90);
  assert.equal(r.y12Applies, false); // cooking apprentices have no Year 12 distinction
});

test('new award example 4: cabinetmaker (MA000029), adult 1st year, age 30', () => {
  // adult yr 1 weekly 948.44; annual 49,318.88; taxable 49,318
  // bracket 4,020 + 4,318 x 30% = 5,315.40; LITO 325 - 4,318 x 1.5% = 260.23 -> 5,055.17
  // Medicare 986.36; total 6,041.53; take-home 43,277.35. Housing-construction occupation -> KAP $10,000.
  const r = C.apprenticePay({ trade: 'cabinetmaker', year: 1, age: 30, y12: false, hours: 38 }, R);
  near(r.tax.incomeTax, 5055.17); near(r.tax.total, 6041.53); near(r.takeHomeAnnual, 43277.35); assert.equal(r.kapTotal, 10000);
});

test('age -> adult derivation (21+ at start), with clamping to 15-60', () => {
  assert.equal(C.apprenticeTypeForAge(20, R), 'junior');
  assert.equal(C.apprenticeTypeForAge(21, R), 'adult');
  assert.equal(C.apprenticeTypeForAge(15, R), 'junior');
  assert.equal(C.apprenticeTypeForAge(14, R), 'junior'); // clamped to 15
  assert.equal(C.apprenticeTypeForAge(60, R), 'adult');
  assert.equal(C.apprenticeTypeForAge(75, R), 'adult');  // clamped to 60
  assert.equal(C.apprenticeTypeForAge(20.6, R), 'junior'); // completed years: 20.6 -> 20
  assert.equal(C.apprenticeTypeForAge(21.0, R), 'adult');
});

test('under-21 edge cases: Year 12 counts at 20, is ignored at 21', () => {
  // plumber yr 1: age 20 + Year 12 -> junior Y12 rate 688.01; age 21 -> adult 1,046.31 (Year 12 irrelevant)
  const a20 = C.apprenticePay({ trade: 'plumber', year: 1, age: 20, y12: true, hours: 38 }, R);
  const a21 = C.apprenticePay({ trade: 'plumber', year: 1, age: 21, y12: true, hours: 38 }, R);
  near(a20.weekly, 688.01); assert.equal(a20.type, 'junior'); assert.equal(a20.y12Applies, true);
  near(a21.weekly, 1046.31); assert.equal(a21.type, 'adult'); assert.equal(a21.y12Applies, false);
  // Year 12 only matters in years 1-2 for building trades
  assert.equal(C.y12Matters('carpenter', 'junior', 1, R), true);
  assert.equal(C.y12Matters('carpenter', 'junior', 3, R), false);
  // employer cost derives the same type from age
  const e = C.employerCost({ trade: 'bricklayer', year: 1, age: 25, hours: 38, workersCompRate: 0.05, tafeFees: 0, toolsPpe: 0, incentive: 'phi' }, R);
  near(e.wages, 57016.96); assert.equal(e.type, 'adult');
});

test('incentive options follow the Priority List streams', () => {
  const o = (k) => C.incentiveOptions(k, R);
  assert.deepEqual([o('carpenter').employerDefault, o('carpenter').kapDefault], ['kap', true]);
  assert.deepEqual([o('hairdresser').employerDefault, o('hairdresser').kapPossible, o('hairdresser').apprenticeFallback], ['phi', false, 'aatsp']);
  assert.deepEqual([o('concreter').employerDefault, o('concreter').onPriorityList, o('concreter').apprenticeFallback], ['none', false, 'check']);
  assert.deepEqual([o('lightvehicle').stream, o('lightvehicle').kapDefault], ['newEnergy', false]);
  assert.equal(o('fitter').employerDefault, 'phi');
  // edge cases: diesel / vehicle painter qualifications also sit under KAP occupations -> KAP possible but not default
  assert.deepEqual([o('diesel').kapPossible, o('diesel').kapDefault], [true, false]);
  assert.deepEqual([o('hairdresser').kapPossible, o('cook').kapPossible, o('concreter').kapPossible], [false, false, false]);
  for (const k of Object.keys(R.trades)) {
    const t = R.trades[k];
    if (t.kapStream.value === 'none') assert.equal(t.kapEligible.value, false, k + ' non-KAP trade must not default to KAP');
  }
});

test('every state has a name, licensing bodies and only verified, linked items', () => {
  for (const [code, st] of Object.entries(R.states)) {
    assert.ok(st.name && st.licensing.electrical.url.startsWith('https://') && st.licensing.plumbing.url.startsWith('https://'), code);
    for (const it of st.items) { assert.equal(it.verified, true, code + ' ' + it.value.title); assert.match(it.sourceUrl, /^https:\/\//); }
  }
  assert.deepEqual(Object.keys(R.states), ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']);
});
