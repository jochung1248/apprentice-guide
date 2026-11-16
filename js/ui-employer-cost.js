/* Tradie Numbers — ui-employer-cost.js: wires employer-cost.html to calc.employerCost(). */
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

  var lastTrade = null;
  function render() {
    var trade = $('trade').value, t = R.trades[trade];
    if (trade !== lastTrade) { $('incentive').value = t.kapEligible.value ? 'kap' : 'phi'; lastTrade = trade; }
    var inputs = {
      trade: trade, year: parseInt(radio('year'), 10), type: radio('type'), y12: $('y12').checked,
      hours: Math.min(R.ordinaryHours.value, Math.max(1, n('hours', R.ordinaryHours.value))),
      workersCompRate: Math.max(0, n('comp', 0)) / 100, tafeFees: Math.max(0, n('fees', 0)), toolsPpe: Math.max(0, n('tools', 0)),
      incentive: $('incentive').value
    };
    var r = C.employerCost(inputs, R);

    $('hero-label').textContent = 'Net cost, year ' + r.year;
    $('out-week').textContent = U.money(r.netWeekly);
    $('out-year').textContent = U.money(r.netCost);
    $('out-hourly').textContent = U.money(r.hourly, true) + '/hr';
    $('out-gross').textContent = U.money(r.grossCost);
    $('out-inc').textContent = r.incentive ? '−' + U.money(r.incentive) : U.money(0);

    var inc = $('incentive').value, hint = '';
    if (inc === 'kap') hint = 'Up to ' + U.money(r.incentiveAvailable) + ' in the first year (paid at 6 and 12 months) for KAP apprentices who commence by the end of December 2026. ';
    else if (inc === 'phi') hint = 'Up to ' + U.money(r.incentiveAvailable) + ' in the first year (paid at 6 and 12 months) for other Priority List occupations. Part-time amounts are lower. ';
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
