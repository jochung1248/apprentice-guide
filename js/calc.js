/*
 * Tradie Numbers — calc.js
 * Pure calculation functions. No DOM access. UMD: window.TN_CALC in the browser,
 * require('./calc.js') in Node (see tests/calc.test.js).
 *
 * All rates come in through the `R` argument (the object exported by rates.js), so the
 * functions never hold figures of their own.
 *
 * Simplifications (also stated on about-data.html):
 *  - Tax is the end-of-year resident liability on annualised ordinary-time pay (weekly x 52).
 *    It is not PAYG withholding, so weekly pay slips can differ slightly.
 *  - Taxable income is rounded down to whole dollars (as the ATO does).
 *  - No deductions, other income, allowances outside the pay guide rates, overtime or penalties.
 *  - Government incentive payments are shown separately and are NOT added to taxable income.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.TN_CALC = factory(); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var WEEKS = 52;

  function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }
  function num(v, fallback) { var n = Number(v); return isFinite(n) ? n : fallback; }

  /* ---------------- Tax ---------------- */

  // Tax on taxable income from the resident brackets (before offsets and Medicare levy).
  function bracketTax(taxable, R) {
    var b = R.tax.brackets.value, tax = 0;
    for (var i = 0; i < b.length; i++) {
      var lo = b[i].from, hi = i + 1 < b.length ? b[i + 1].from : Infinity;
      if (taxable > lo) tax += (Math.min(taxable, hi) - lo) * b[i].rate;
    }
    return tax;
  }

  function lowIncomeTaxOffset(taxable, R) {
    var L = R.tax.lito.value;
    if (taxable <= L.taper1From) return L.max;
    if (taxable <= L.taper2From) return L.max - (taxable - L.taper1From) * L.taper1Rate;
    if (taxable < L.cutOut) return Math.max(0, L.taper2Start - (taxable - L.taper2From) * L.taper2Rate);
    return 0;
  }

  function medicareLevy(taxable, R) {
    var rate = R.tax.medicareRate.value, M = R.tax.medicareLowIncome.value;
    if (taxable <= M.lower) return 0;
    return Math.min(rate * taxable, (taxable - M.lower) * M.phaseInRate);
  }

  // Full resident tax estimate for one year of income.
  function incomeTax(annualIncome, R) {
    var taxable = Math.floor(Math.max(0, num(annualIncome, 0)));
    var gross = bracketTax(taxable, R);
    var lito = Math.min(gross, lowIncomeTaxOffset(taxable, R)); // non-refundable
    var incomeTaxNet = gross - lito;
    var medicare = medicareLevy(taxable, R);
    return {
      taxable: taxable,
      bracketTax: round2(gross),
      lito: round2(lito),
      incomeTax: round2(incomeTaxNet),
      medicare: round2(medicare),
      total: round2(incomeTaxNet + medicare)
    };
  }

  /* ---------------- HELP ---------------- */

  function helpRepayment(repaymentIncome, R) {
    var H = R.help.repayment.value, inc = Math.max(0, num(repaymentIncome, 0));
    if (inc <= H.minIncome) return 0;
    if (inc <= H.band1Top) return round2((inc - H.minIncome) * H.band1Rate);
    if (inc <= H.band2Top) return round2(H.band2Base + (inc - H.band1Top) * H.band2Rate);
    return round2(inc * H.topRate);
  }

  /* ---------------- Award rates ---------------- */

  // Returns {weekly, hourly} for a 38-hour week straight from the pay guide.
  function apprenticeRate(tradeKey, year, type, y12, R) {
    var t = R.trades[tradeKey];
    if (!t) throw new Error('Unknown trade: ' + tradeKey);
    var y = clamp(Math.round(num(year, 1)), 1, 4) - 1;
    var table = type === 'adult' ? t.apprenticeAdult : (y12 ? t.apprenticeJuniorY12 : t.apprenticeJuniorNoY12);
    return { weekly: table.value[y].weekly, hourly: table.value[y].hourly, source: table };
  }

  // Weekly pay for a given number of ordinary hours. At the full 38 hours we use the pay
  // guide's weekly figure exactly; otherwise weekly/38 x hours (more precise than the
  // rounded hourly figure).
  function weeklyForHours(weekly38, hours, R) {
    var full = R.ordinaryHours.value;
    var h = clamp(num(hours, full), 0, full);
    return h === full ? weekly38 : round2(weekly38 / full * h);
  }

  function kapSchedule(partTime, R, totalYears) {
    var s = R.incentives.kapApprentice.value[partTime ? 'partTime' : 'fullTime'];
    var yrs = totalYears || 4;
    return s.map(function (p) {
      var m = p.month === 'completion' ? yrs * 12 : p.month;
      return {
        month: m,
        amount: p.amount,
        label: p.month === 'completion' ? 'On completion' : ('After ' + p.month + ' months'),
        // which apprenticeship year (0-based) the payment lands in
        yearIndex: Math.min(yrs - 1, Math.floor((m - 1) / 12))
      };
    });
  }

  /* ---------------- Calculator 1: apprentice pay ---------------- */
  /*
   * inputs: { trade, year (1-4), type ('junior'|'adult'), y12 (bool), hours (<=38), kapEligible (bool, optional) }
   */
  function apprenticePay(inputs, R) {
    var full = R.ordinaryHours.value;
    var hours = clamp(num(inputs.hours, full), 1, full);
    var rate = apprenticeRate(inputs.trade, inputs.year, inputs.type, !!inputs.y12, R);
    var weekly = weeklyForHours(rate.weekly, hours, R);
    var annual = round2(weekly * WEEKS);
    var tax = incomeTax(annual, R);
    var takeHomeAnnual = round2(annual - tax.total);
    var eligible = inputs.kapEligible !== undefined ? !!inputs.kapEligible : !!R.trades[inputs.trade].kapEligible.value;
    var partTime = hours < full;
    var kap = eligible ? kapSchedule(partTime, R, 4) : [];
    return {
      hours: hours,
      partTime: partTime,
      hourly: rate.hourly,
      weekly38: rate.weekly,
      weekly: weekly,
      annual: annual,
      tax: tax,
      takeHomeAnnual: takeHomeAnnual,
      takeHomeWeekly: round2(takeHomeAnnual / WEEKS),
      takeHomeFortnightly: round2(takeHomeAnnual / WEEKS * 2),
      kapEligible: eligible,
      kap: kap,
      kapTotal: kap.reduce(function (s, p) { return s + p.amount; }, 0)
    };
  }

  /* ---------------- Calculator 2: trade vs uni ---------------- */
  /*
   * inputs: {
   *   trade, startAge (16-30), targetAge (start+5..40), y12 (bool), kapEligible (bool),
   *   marketLoading (0.10 = 10% above award once qualified), payGrowth (0.03 = 3%/yr after qualifying/graduating),
   *   uniStartAge, degreeYears (3|4), contribution ($/yr), partTimeIncome ($/yr while studying or before uni),
   *   gradSalary ($/yr first full year), indexation (0.028)
   * }
   * Both paths begin at startAge. Each row is one year of life: from `age` to `age+1`.
   * Uni path: before uniStartAge and while studying, income = partTimeIncome.
   * HELP: contribution added at the start of each study year; each year the compulsory
   * repayment (on that year's income) is deducted, then the remaining balance is indexed.
   * Simplification: in reality debt less than 11 months old isn't indexed on the next 1 June,
   * so this slightly overstates the HELP balance (stated on about-data.html and in the guide).
   * Everything is in 2026–27 rules and thresholds (no bracket indexation).
   */
  function tradeVsUni(inputs, R) {
    var startAge = clamp(Math.round(num(inputs.startAge, 17)), 15, 40);
    var targetAge = clamp(Math.round(num(inputs.targetAge, 25)), startAge + 1, 60);
    var uniStart = Math.max(startAge, Math.round(num(inputs.uniStartAge, startAge)));
    var degreeYears = clamp(Math.round(num(inputs.degreeYears, 3)), 1, 6);
    var contribution = Math.max(0, num(inputs.contribution, 0));
    var ptIncome = Math.max(0, num(inputs.partTimeIncome, 0));
    var grad = Math.max(0, num(inputs.gradSalary, 0));
    var g = num(inputs.payGrowth, 0);
    var loading = num(inputs.marketLoading, 0);
    var idx = num(inputs.indexation, 0);
    var t = R.trades[inputs.trade];
    if (!t) throw new Error('Unknown trade: ' + inputs.trade);
    var adult = startAge >= 21;
    var kapOn = inputs.kapEligible !== undefined ? !!inputs.kapEligible : !!t.kapEligible.value;
    var kap = kapOn ? kapSchedule(false, R, 4) : [];
    var qualifiedBase = t.tradesperson.value.weekly * WEEKS * (1 + loading);

    var rows = [], cumT = 0, cumU = 0, debt = 0, breakEven = null, uniAhead = false;
    for (var age = startAge; age < targetAge; age++) {
      var i = age - startAge;
      // ---- trade path
      var tGross, tStage, tKap = 0;
      if (i < 4) {
        var rate = apprenticeRate(inputs.trade, i + 1, adult ? 'adult' : 'junior', !!inputs.y12, R);
        tGross = round2(rate.weekly * WEEKS);
        tStage = 'Apprentice year ' + (i + 1);
        kap.forEach(function (p) { if (p.yearIndex === i) tKap += p.amount; });
      } else {
        tGross = round2(qualifiedBase * Math.pow(1 + g, i - 4));
        tStage = 'Qualified';
      }
      var tTax = incomeTax(tGross, R).total;
      var tNet = round2(tGross - tTax + tKap);
      cumT = round2(cumT + tNet);

      // ---- uni path
      var u = age - uniStart, uGross, uStage, added = 0;
      if (u < 0) { uGross = ptIncome; uStage = 'Finishing school'; }
      else if (u < degreeYears) { uGross = ptIncome; uStage = 'Uni year ' + (u + 1); added = contribution; }
      else { uGross = round2(grad * Math.pow(1 + g, u - degreeYears)); uStage = 'Graduate'; }
      debt = round2(debt + added);
      var uTax = incomeTax(uGross, R).total;
      var repaid = Math.min(debt, helpRepayment(uGross, R));
      debt = round2((debt - repaid) * (1 + idx));
      var uNet = round2(uGross - uTax - repaid);
      cumU = round2(cumU + uNet);

      var uniPos = round2(cumU - debt);
      if (uniPos >= cumT && !uniAhead) { uniAhead = true; breakEven = age + 1; }
      if (uniPos < cumT) { uniAhead = false; breakEven = null; }

      rows.push({
        age: age, endAge: age + 1,
        trade: { stage: tStage, gross: tGross, tax: tTax, kap: tKap, net: tNet, cumulative: cumT, position: cumT },
        uni: { stage: uStage, gross: uGross, tax: uTax, helpAdded: added, helpRepaid: round2(repaid), helpBalance: debt, net: uNet, cumulative: cumU, position: uniPos }
      });
    }
    var last = rows[rows.length - 1];
    return {
      rows: rows,
      targetAge: targetAge,
      summary: {
        tradeCumulative: last.trade.cumulative,
        uniCumulative: last.uni.cumulative,
        uniHelpBalance: last.uni.helpBalance,
        uniPosition: last.uni.position,
        tradePosition: last.trade.position,
        difference: round2(last.trade.position - last.uni.position), // + = trade ahead
        breakEvenAge: breakEven, // age by which uni net position catches up and stays ahead (null if not by target)
        kapTotal: kap.reduce(function (s, p) { return s + p.amount; }, 0)
      }
    };
  }

  /* ---------------- Calculator 3: employer cost ---------------- */
  /*
   * inputs: { trade, year, type, y12, hours, workersCompRate (0.04), tafeFees, toolsPpe,
   *           incentive ('kap'|'phi'|'none'), incentiveAmount (optional override) }
   * Incentives are first-year only, so they are only deducted when year === 1.
   */
  function employerCost(inputs, R) {
    var full = R.ordinaryHours.value;
    var hours = clamp(num(inputs.hours, full), 1, full);
    var year = clamp(Math.round(num(inputs.year, 1)), 1, 4);
    var rate = apprenticeRate(inputs.trade, year, inputs.type, !!inputs.y12, R);
    var weekly = weeklyForHours(rate.weekly, hours, R);
    var wages = round2(weekly * WEEKS);
    var superAmt = round2(wages * R.superGuarantee.value);
    var compRate = Math.max(0, num(inputs.workersCompRate, R.illustrative.workersCompRate.value));
    var comp = round2(wages * compRate);
    var fees = Math.max(0, num(inputs.tafeFees, 0));
    var tools = Math.max(0, num(inputs.toolsPpe, 0));
    var gross = round2(wages + superAmt + comp + fees + tools);
    var partTime = hours < full;
    var defaultIncentive = 0;
    if (inputs.incentive === 'kap') {
      defaultIncentive = R.incentives.kapEmployer.value[partTime ? 'partTime' : 'fullTime'].reduce(function (s, p) { return s + p.amount; }, 0);
    } else if (inputs.incentive === 'phi') {
      defaultIncentive = R.incentives.priorityHiring.value[partTime ? 'partTime' : 'fullTime'].reduce(function (s, p) { return s + p.amount; }, 0);
    }
    var incentive = year === 1 ? Math.max(0, num(inputs.incentiveAmount, defaultIncentive)) : 0;
    var net = round2(gross - incentive);
    return {
      hours: hours, partTime: partTime, year: year,
      hourly: rate.hourly, weekly: weekly,
      wages: wages, super: superAmt, workersComp: comp, workersCompRate: compRate,
      tafeFees: fees, toolsPpe: tools,
      grossCost: gross,
      incentive: incentive,
      incentiveAvailable: defaultIncentive,
      netCost: net,
      netWeekly: round2(net / WEEKS)
    };
  }

  return {
    WEEKS: WEEKS,
    round2: round2,
    bracketTax: bracketTax,
    lowIncomeTaxOffset: lowIncomeTaxOffset,
    medicareLevy: medicareLevy,
    incomeTax: incomeTax,
    helpRepayment: helpRepayment,
    apprenticeRate: apprenticeRate,
    weeklyForHours: weeklyForHours,
    kapSchedule: kapSchedule,
    apprenticePay: apprenticePay,
    tradeVsUni: tradeVsUni,
    employerCost: employerCost
  };
});
