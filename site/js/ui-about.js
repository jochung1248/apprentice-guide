/* Apprentice Guide — ui-about.js: renders the sources table on about-data.html straight from rates.js. */
(function () {
  'use strict';
  var R = window.TN_RATES, U = window.TN_UI;

  var LABELS = {
    ordinaryHours: 'Full-time ordinary hours per week',
    apprenticeJuniorNoY12: 'apprentice minimum — junior, did not finish Year 12 (years 1–4)',
    apprenticeJuniorY12: 'apprentice minimum — junior, finished Year 12 (years 1–4)',
    apprenticeAdult: 'apprentice minimum — adult (years 1–4)',
    tradesperson: 'qualified tradesperson minimum',
    kapEligible: 'listed as a Key Apprenticeship Program occupation',
    brackets: 'Resident income tax rates',
    lito: 'Low income tax offset',
    medicareRate: 'Medicare levy rate',
    medicareLowIncome: 'Medicare levy low-income thresholds (singles)',
    superGuarantee: 'Super guarantee rate',
    kapApprentice: 'Key Apprentice Incentive (apprentice) schedule',
    kapEmployer: 'KAP Employer Incentive schedule',
    priorityHiring: 'Priority Hiring Incentive (employer)',
    aatsp: 'Australian Apprentice Training Support Payment',
    lafha: 'Living Away From Home Allowance (per week)',
    aasl: 'Australian Apprenticeship Support Loan',
    repayment: 'HELP compulsory repayment system',
    indexation: 'HELP indexation rate',
    contributions: 'Maximum student contribution per full-time year',
    medianSalary: 'Graduate median full-time salary',
    fullTimeEmploymentRate: 'Graduates in full-time work (%)',
    partTimeStudyIncome: 'Part-time income while studying',
    payGrowth: 'Pay rise per year after qualifying',
    marketLoading: 'Qualified pay above award',
    workersCompRate: 'Workers comp premium (% of wages)',
    tafeFees: 'Training fees per year (employer)',
    toolsPpe: 'Tools, PPE and uniform per year (employer)',
    supervisionHours: 'Supervision hours per week'
  };

  function fmtVal(v, key) {
    if (key === 'stateItem') return U.esc(v.text);
    if (key === 'text') return U.esc(String(v));
    if (key === 'adultAgeYears') return v + ' or older';
    if (key === 'priorityList') return v ? 'Yes' : 'No';
    if (key === 'kapStream') return { housing: 'Housing Construction', newEnergy: 'New Energy', both: 'Housing Construction and New Energy', none: 'None' }[v];
    if (typeof v === 'boolean') return v ? 'Yes' : 'No';
    if (typeof v === 'number') {
      if (/Rate|indexation|payGrowth|marketLoading|superGuarantee/.test(key) && v < 1) return U.pct(v, 1);
      if (key === 'ordinaryHours' || key === 'supervisionHours') return v + ' hours';
      if (key === 'fullTimeEmploymentRate') return v + '%';
      return U.money(v, v % 1 !== 0);
    }
    if (Array.isArray(v)) {
      if (v.length && v[0].weekly !== undefined) return v.map(function (r, i) { return 'Yr ' + (i + 1) + ': ' + U.money(r.weekly, true) + '/wk (' + U.money(r.hourly, true) + '/hr)'; }).join('<br>');
      if (v.length && v[0].rate !== undefined) return v.map(function (b) { return 'from ' + U.money(b.from) + ': ' + U.pct(b.rate); }).join('<br>');
    }
    if (v && v.weekly !== undefined) return U.money(v.weekly, true) + '/wk (' + U.money(v.hourly, true) + '/hr)';
    if (v && typeof v === 'object') {
      return Object.keys(v).map(function (k) {
        var x = v[k];
        if (Array.isArray(x)) return k + ': ' + x.map(function (p) { return U.money(p.amount) + ' at ' + (p.month === 'completion' ? 'completion' : p.month + ' months'); }).join(', ');
        if (x && typeof x === 'object' && x.amount !== undefined) return U.esc(x.label) + ': ' + U.money(x.amount);
        if (typeof x === 'number') return k + ': ' + (x < 1 && x > 0 ? U.pct(x, 1) : U.money(x, x % 1 !== 0));
        return k + ': ' + U.esc(String(x));
      }).join('<br>');
    }
    return U.esc(String(v));
  }

  var rows = [];
  function add(label, f, key) {
    rows.push('<tr><td>' + U.esc(label) + (f.note ? '<span class="hint">' + U.esc(f.note) + '</span>' : '') + '</td><td>' + fmtVal(f.value, key) + '</td><td>' + U.esc(f.effectiveFrom) + '</td><td>' +
      (f.verified ? '<span class="badge-ok">verified</span>' : '<span class="badge-ill">illustrative — edit to suit</span>') + '</td><td>' +
      (f.sourceUrl ? '<a href="' + U.esc(f.sourceUrl) + '" target="_blank" rel="noopener">' + U.esc(f.sourceName) + '</a>' : U.esc(f.sourceName)) + '</td></tr>');
  }

  add(LABELS.ordinaryHours, R.ordinaryHours, 'ordinaryHours');
  add('Adult apprentice age (at start)', R.adultAge, 'adultAgeYears');
  // One set of rows per pay table (several trades can share a table)
  Object.keys(R.payTables).forEach(function (id) {
    var tb = R.payTables[id];
    var users = Object.keys(R.trades).filter(function (k) { return R.trades[k].table === id; }).map(function (k) { return R.trades[k].label; }).join(', ');
    ['apprenticeJuniorNoY12', 'apprenticeJuniorY12', 'apprenticeAdult', 'tradesperson'].forEach(function (f) {
      add(users + ' (' + tb.awardShort + '): ' + LABELS[f], tb[f], f);
    });
  });
  // Priority List / KAP status per trade
  Object.keys(R.trades).forEach(function (k) {
    var t = R.trades[k];
    add(t.label + ': on the Priority List', t.priorityList, 'priorityList');
    add(t.label + ': Key Apprenticeship Program stream', t.kapStream, 'kapStream');
  });
  ['tax', 'incentives', 'help', 'graduates', 'illustrative'].forEach(function (grp) {
    Object.keys(R[grp]).forEach(function (k) { add(LABELS[k] || k, R[grp][k], k); });
    if (grp === 'tax') add(LABELS.superGuarantee, R.superGuarantee, 'superGuarantee');
  });
  add('Under-18s: tax on wages', R.under18.tax, 'text');
  add('Under-18s: training contract consent', R.under18.consent, 'text');
  add('WA: state system employers', R.waNotice, 'text');
  add('Living Away From Home Allowance eligibility', R.lafhaNote, 'text');
  Object.keys(R.states).forEach(function (code) {
    var st = R.states[code];
    st.items.forEach(function (it) { add(st.name + ': ' + it.value.title, it, 'stateItem'); });
    ['electrical', 'plumbing'].forEach(function (lic) {
      var L = st.licensing[lic];
      rows.push('<tr><td>' + U.esc(st.name + ': ' + lic + ' licensing body') + '</td><td>' + U.esc(L.name) + '</td><td>—</td><td><span class="badge-ok">verified</span></td><td><a href="' + U.esc(L.url) + '" target="_blank" rel="noopener">' + U.esc(L.name) + '</a></td></tr>');
    });
  });
  document.getElementById('sources-body').innerHTML = rows.join('');

  var RL = {
    awardIncrease2026: 'Increase to award minimum wages from 1 July 2026 (%)',
    tradeCompletersEmployed: 'Trade apprentices employed after completing (%)',
    nonCompletersEmployed: 'Apprentices and trainees employed after leaving early (%)',
    nonCompleterEmploymentReasons: 'Trade non-completers who left mainly over pay, conditions or the workplace (%)',
    tradeFourYearAttrition: 'Trade apprentices (2021 starters) who dropped out within four years (%)',
    tradeSixYearCompletion: 'Trade apprentices completing within six years, latest cohort (%)',
    electricianSixYearCompletion: 'Electrical apprentices completing within six years (%)',
    housingExtraWorkers: 'Extra workers needed to build 1.2 million homes by 2029',
    housingAccordTarget: 'National Housing Accord target (homes by 2029)'
  };
  document.getElementById('research-list').innerHTML = Object.keys(R.research).map(function (k) {
    var f = R.research[k];
    var v = f.value >= 1000 ? f.value.toLocaleString('en-AU') : f.value + '%';
    return '<li><strong>' + U.esc(RL[k] || k) + ': ' + v + '</strong>' + (f.verified ? '' : ' †') + ' — ' + U.esc(f.note) +
      ' <span class="src">Source: <a href="' + U.esc(f.sourceUrl) + '" target="_blank" rel="noopener">' + U.esc(f.sourceName) + '</a></span>' +
      (f.verified ? '' : ' <span class="badge-ill">not re-checked against primary source</span>') + '</li>';
  }).join('');
})();
