/* Tradie Numbers — ui-apprentice-pay.js: wires apprentice-pay.html to calc.apprenticePay(). */
(function () {
  'use strict';
  var R = window.TN_RATES, C = window.TN_CALC, U = window.TN_UI;
  var form = document.getElementById('pay-form');
  var $ = function (id) { return document.getElementById(id); };

  function radio(name) { var el = form.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : null; }
  function setRadio(name, v) { var el = form.querySelector('input[name="' + name + '"][value="' + v + '"]'); if (el) el.checked = true; }

  // Allow deep links such as apprentice-pay.html?trade=electrician&year=1
  (function applyQuery() {
    var q = new URLSearchParams(window.location.search);
    if (q.get('trade') && R.trades[q.get('trade')]) $('trade').value = q.get('trade');
    if (/^[1-4]$/.test(q.get('year') || '')) setRadio('year', q.get('year'));
    if (q.get('type') === 'adult') setRadio('type', 'adult');
    if (q.get('y12') === '1') $('y12').checked = true;
  })();

  var lastTrade = null;

  function render() {
    var trade = $('trade').value, t = R.trades[trade];
    // Default the KAP box to the trade's listed eligibility whenever the trade changes.
    if (trade !== lastTrade) { $('kap').checked = !!t.kapEligible.value; lastTrade = trade; }
    var hours = parseFloat($('hours').value);
    if (!isFinite(hours) || hours <= 0) hours = R.ordinaryHours.value;
    hours = Math.min(R.ordinaryHours.value, hours);
    var type = radio('type'), year = parseInt(radio('year'), 10);
    var inputs = { trade: trade, year: year, type: type, y12: $('y12').checked, hours: hours, kapEligible: $('kap').checked };
    var r = C.apprenticePay(inputs, R);

    $('award-name').textContent = t.award;
    var y12Relevant = type === 'junior' && year <= 2;
    $('y12-hint').textContent = y12Relevant ? 'Year 12 lifts the minimum in years 1 and 2 for junior apprentices.'
      : (type === 'adult' ? 'Doesn’t change adult apprentice rates.' : 'Doesn’t change the rate in years 3 and 4.');

    $('out-week').textContent = U.money(r.takeHomeWeekly);
    $('out-fortnight').textContent = U.money(r.takeHomeFortnightly);
    $('out-year').textContent = U.money(r.takeHomeAnnual);
    $('out-hourly').textContent = U.money(r.hourly, true) + '/hr';
    $('out-gross-week').textContent = U.money(r.weekly, true);
    $('out-gross-year').textContent = U.money(r.annual);
    $('out-tax-week').textContent = U.money(r.tax.total / 52, true);
    $('ps-who').textContent = t.short.charAt(0).toUpperCase() + t.short.slice(1) + ' \u00b7 year ' + year + ' \u00b7 ' + (type === 'adult' ? 'adult' : 'junior') + (r.partTime ? ' \u00b7 ' + r.hours + ' hrs' : '');

    var tx = r.tax;
    $('breakdown').innerHTML =
      '<tr><td>Award minimum ' + U.money(r.weekly, true) + ' × 52 weeks' + (r.partTime ? ' (' + r.hours + ' hrs/week)' : '') + '</td><td>' + U.money(r.annual, true) + '</td></tr>' +
      '<tr><td>Income tax on ' + U.money(tx.taxable) + ' (' + U.money(tx.bracketTax, true) + ' less low income tax offset ' + U.money(tx.lito, true) + ')</td><td>−' + U.money(tx.incomeTax, true) + '</td></tr>' +
      '<tr><td>Medicare levy</td><td>−' + U.money(tx.medicare, true) + '</td></tr>' +
      '<tr class="total"><td>Take-home for the year</td><td>' + U.money(r.takeHomeAnnual, true) + '</td></tr>';

    var tbl = type === 'adult' ? t.apprenticeAdult : (inputs.y12 ? t.apprenticeJuniorY12 : t.apprenticeJuniorNoY12);
    $('rate-src').innerHTML = 'Pay rate: ' + U.srcLine(tbl) + '<br>Tax: ' + U.srcLine(R.tax.brackets) +
      '<br>Medicare low-income thresholds: ' + U.srcLine(R.tax.medicareLowIncome) +
      (R.tax.medicareLowIncome.verified ? '' : '<br><span class="src">' + U.esc(R.tax.medicareLowIncome.note) + '</span>');

    // KAP
    var K = R.incentives.kapApprentice;
    if (r.kapEligible) {
      $('kap-intro').innerHTML = 'If this apprenticeship qualifies, the apprentice can receive up to <strong>' + U.money(r.kapTotal) +
        '</strong> (' + (r.partTime ? 'part-time' : 'full-time') + ' amounts), on top of wages. These payments are shown separately and aren’t included in the tax estimate above. Timing is measured from the start of the apprenticeship.';
      $('kap-list').innerHTML = r.kap.map(function (p) {
        return '<li><span>' + U.esc(p.label) + (p.month !== 'completion' && typeof p.month === 'number' && p.label.indexOf('completion') < 0 ? ' (year ' + (p.yearIndex + 1) + ')' : '') + '</span><b>' + U.money(p.amount) + '</b></li>';
      }).join('');
      $('kap-src').innerHTML = U.srcLine(K) + '<br>Trade eligibility: ' + U.srcLine(t.kapEligible);
    } else {
      $('kap-intro').textContent = 'Not included. If the apprenticeship is on the Priority List but isn’t a KAP occupation, the apprentice may instead get the Australian Apprentice Training Support Payment of up to ' +
        U.money(R.incentives.aatsp.value.fullTime.reduce(function (s, p) { return s + p.amount; }, 0)) + ' (full-time) over two years.';
      $('kap-list').innerHTML = '';
      $('kap-src').innerHTML = U.srcLine(R.incentives.aatsp);
    }
  }

  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('submit', function (e) { e.preventDefault(); render(); });
  render();
})();
