/* Apprentice Guide — ui-employer-cost.js: wires employer-cost.html to calc.employerCost(). */
(function () {
  'use strict';
  var R = window.TN_RATES, C = window.TN_CALC, U = window.TN_UI;
  var $ = function (id) { return document.getElementById(id); };
  var form = $('emp-form');
  function radio(name) { var el = form.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : null; }
  function n(id, d) { var v = parseFloat($(id).value); return isFinite(v) ? v : d; }

  $('comp').value = +(R.illustrative.workersCompRate.value * 100).toFixed(2);
  $('fees').value = R.illustrative.tafeFees.value;
  $('tools').value = R.illustrative.toolsPpe.value;

  // Ordinary hours: 1 to 38. Out-of-range entries are corrected in the field (on change) with a hint.
  function clampHours() {
    var el = $('hours'), full = R.ordinaryHours.value, v = parseFloat(el.value), h = v;
    if (!isFinite(v) || v < 1) h = isFinite(v) ? 1 : full; else if (v > full) h = full;
    $('hours-hint').textContent = h !== v && el.value !== '' ? (v > full ? 'Max ' + full + ' ordinary hours a week — using ' + full + '.' : 'Enter at least 1 hour — using ' + h + '.') : 'Full time is ' + full + '. Fewer hours = part-time.';
    return h;
  }
  $('hours').addEventListener('change', function () {
    var h = clampHours(), msg = $('hours-hint').textContent;
    $('hours').value = h;
    setTimeout(function () { $('hours-hint').textContent = msg; }, 0); // keep the correction message after the re-render
  });

  var lastTrade = null;
  function render() {
    var trade = $('trade').value, t = R.trades[trade];
    if (trade !== lastTrade) { $('incentive').value = t.kapEligible.value ? 'kap' : 'phi'; lastTrade = trade; }
    var inputs = {
      trade: trade, year: parseInt(radio('year'), 10), type: radio('type'), y12: $('y12').checked,
      hours: clampHours(),
      workersCompRate: Math.max(0, n('comp', 0)) / 100, tafeFees: Math.max(0, n('fees', 0)), toolsPpe: Math.max(0, n('tools', 0)),
      incentive: $('incentive').value
    };
    var r = C.employerCost(inputs, R);

    $('hero-label').textContent = 'Net cost, year ' + r.year;
    $('out-week').textContent = U.money(r.netWeekly);
    $('sticky-num').textContent = U.money(r.netWeekly);
    $('sticky-label').textContent = 'a week, net cost in year ' + r.year;
    $('out-year').textContent = U.money(r.netCost);
    $('out-hourly').textContent = U.money(r.hourly, true) + '/hr';
    $('out-gross').textContent = U.money(r.grossCost);
    $('out-inc').textContent = r.incentive ? '−' + U.money(r.incentive) : U.money(0);

    var inc = $('incentive').value, hint = '';
    var ftpt = r.partTime ? ' (part-time amount)' : ' (full-time amount)';
    if (inc === 'kap') hint = 'Key Apprenticeship Program employer incentive: up to ' + U.money(r.incentiveAvailable) + ftpt + ' in the first year, paid at 6 and 12 months, for KAP apprentices who commence by the end of December 2026. ';
    else if (inc === 'phi') hint = 'Priority Hiring Incentive: up to ' + U.money(r.incentiveAvailable) + ftpt + ' in the first year, paid at 6 and 12 months, for other Priority List occupations. ';
    if (r.year > 1 && inc !== 'none') hint += 'Incentives are first-year only, so none is deducted in year ' + r.year + '.';
    $('incentive-hint').textContent = hint;

    function row(label, v, cls) { return '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td>' + label + '</td><td>' + v + '</td></tr>'; }
    $('breakdown').innerHTML =
      row('Wages: ' + U.money(r.weekly, true) + ' a week × 52' + (r.partTime ? ' (' + r.hours + ' hrs/week)' : ''), U.money(r.wages, true)) +
      row('Super guarantee (' + U.pct(R.superGuarantee.value) + ')', U.money(r.super, true)) +
      row('Workers comp (' + (r.workersCompRate * 100).toFixed(1).replace(/\.0$/, '') + '% of wages) <span class="badge-ill">illustrative — edit to suit</span>', U.money(r.workersComp, true)) +
      row('Training fees <span class="badge-ill">illustrative — edit to suit</span>', U.money(r.tafeFees, true)) +
      row('Tools, PPE and uniform <span class="badge-ill">illustrative — edit to suit</span>', U.money(r.toolsPpe, true)) +
      row('<strong>Total cost</strong>', '<strong>' + U.money(r.grossCost, true) + '</strong>') +
      row('Less first-year incentive', '−' + U.money(r.incentive, true), 'minus') +
      row('Net cost for the year', U.money(r.netCost, true), 'total');

    var tbl = inputs.type === 'adult' ? t.apprenticeAdult : (inputs.y12 ? t.apprenticeJuniorY12 : t.apprenticeJuniorNoY12);
    var incFig = inc === 'kap' ? R.incentives.kapEmployer : (inc === 'phi' ? R.incentives.priorityHiring : null);
    $('emp-src').innerHTML = 'Wage: ' + U.srcLine(tbl) + '<br>Super: ' + U.srcLine(R.superGuarantee) +
      (incFig ? '<br>Incentive: ' + U.srcLine(incFig) : '') + '<br>Workers comp, fees and tools: ' + U.srcLine(R.illustrative.workersCompRate);
  }

  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('submit', function (e) { e.preventDefault(); render(); });
  render();
})();
