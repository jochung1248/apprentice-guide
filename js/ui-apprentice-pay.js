/* Apprentice Guide — ui-apprentice-pay.js: wires apprentice-pay.html to calc.apprenticePay(). */
(function () {
  'use strict';
  var R = window.TN_RATES, C = window.TN_CALC, U = window.TN_UI;
  var form = document.getElementById('pay-form');
  var $ = function (id) { return document.getElementById(id); };

  function radio(name) { var el = form.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : null; }
  function setRadio(name, v) { var el = form.querySelector('input[name="' + name + '"][value="' + v + '"]'); if (el) el.checked = true; }

  // Deep links such as apprentice-pay.html?trade=electrician&year=1&age=22&state=QLD
  var q = new URLSearchParams(window.location.search);
  U.fillTradeSelect($('trade'), R.trades[q.get('trade')] ? q.get('trade') : 'carpenter');
  U.fillStateSelect($('state'), R.states[q.get('state')] ? q.get('state') : 'NSW');
  if (/^[1-4]$/.test(q.get('year') || '')) setRadio('year', q.get('year'));
  if (/^\d{2}$/.test(q.get('age') || '')) $('age').value = q.get('age');
  if (q.get('y12') === '1') $('y12').checked = true;
  if (q.get('location') === 'regional') setRadio('location', 'regional');

  // Ordinary hours: 1 to 38. Out-of-range entries are corrected in the field (on change) with a hint.
  function clampHours() {
    var el = $('hours'), full = R.ordinaryHours.value, v = parseFloat(el.value), h = v;
    if (!isFinite(v) || v < 1) h = isFinite(v) ? 1 : full; else if (v > full) h = full;
    $('hours-hint').textContent = h !== v && el.value !== '' ? (v > full ? 'Max ' + full + ' ordinary hours a week — using ' + full + '.' : 'Enter at least 1 hour — using ' + h + '.') : 'Full time is ' + full + '. Fewer hours = part-time pay (and part-time incentive amounts).';
    return h;
  }
  $('hours').addEventListener('change', function () {
    var h = clampHours(), msg = $('hours-hint').textContent;
    $('hours').value = h;
    setTimeout(function () { $('hours-hint').textContent = msg; }, 0); // keep the correction message after the re-render
  });
  // Age: whole years 15 to 60, corrected on change.
  function readAge() {
    var v = parseFloat($('age').value);
    return isFinite(v) ? Math.min(60, Math.max(15, Math.floor(v))) : 17; // completed years
  }
  $('age').addEventListener('change', function () { $('age').value = readAge(); });

  var lastTrade = null;

  function render() {
    var trade = $('trade').value, t = R.trades[trade], opt = C.incentiveOptions(trade, R);
    // Default the KAP box to the trade's listed eligibility whenever the trade changes.
    if (trade !== lastTrade) { $('kap').checked = opt.kapDefault; lastTrade = trade; }
    $('kap').disabled = !opt.kapPossible;
    if (!opt.kapPossible) $('kap').checked = false;
    var hours = clampHours(), age = readAge(), year = parseInt(radio('year'), 10);
    var inputs = { trade: trade, year: year, age: age, y12: $('y12').checked, hours: hours, kapEligible: $('kap').checked };
    var r = C.apprenticePay(inputs, R);
    var type = r.type;

    $('award-name').textContent = t.award;
    $('age-note').textContent = U.ageExplain(age, type);
    $('y12-hint').textContent = r.y12Applies ? 'Finishing Year 12 lifts the minimum in this year for junior apprentices.'
      : (type === 'adult' ? 'Doesn’t change adult apprentice rates.' : 'Doesn’t change the rate for this trade and year.');
    $('kap-hint').innerHTML = U.esc(t.kapEligible.note) + ' <a href="guides/key-apprenticeship-program-10000.html">How KAP works</a>.';

    var u18 = $('u18-note');
    if (age < 18) { u18.hidden = false; u18.innerHTML = '<p>' + U.under18Html() + '</p>'; } else { u18.hidden = true; u18.innerHTML = ''; }

    $('out-week').textContent = U.money(r.takeHomeWeekly);
    $('sticky-num').textContent = U.money(r.takeHomeWeekly);
    $('out-fortnight').textContent = U.money(r.takeHomeFortnightly);
    $('out-year').textContent = U.money(r.takeHomeAnnual);
    $('out-hourly').textContent = U.money(r.hourly, true) + '/hr';
    $('out-gross-week').textContent = U.money(r.weekly, true);
    $('out-gross-year').textContent = U.money(r.annual);
    $('out-tax-week').textContent = U.money(r.tax.total / 52, true);
    $('ps-who').textContent = t.label + ' · year ' + year + ' · ' + type + ' (age ' + age + ')' + (r.partTime ? ' · ' + r.hours + ' hrs' : '');

    var tx = r.tax;
    $('breakdown').innerHTML =
      '<tr><td>Award minimum ' + U.money(r.weekly, true) + ' × 52 weeks' + (r.partTime ? ' (' + r.hours + ' hrs/week)' : '') + '</td><td>' + U.money(r.annual, true) + '</td></tr>' +
      '<tr><td>Income tax on ' + U.money(tx.taxable) + ' (' + U.money(tx.bracketTax, true) + ' less low income tax offset ' + U.money(tx.lito, true) + ')</td><td>−' + U.money(tx.incomeTax, true) + '</td></tr>' +
      '<tr><td>Medicare levy</td><td>−' + U.money(tx.medicare, true) + '</td></tr>' +
      '<tr class="total"><td>Take-home for the year</td><td>' + U.money(r.takeHomeAnnual, true) + '</td></tr>';

    var tbl = type === 'adult' ? t.apprenticeAdult : (inputs.y12 ? t.apprenticeJuniorY12 : t.apprenticeJuniorNoY12);
    $('rate-src').innerHTML = 'Pay rate: ' + U.srcLine(tbl) + '<br><span class="src">' + U.esc(tbl.note) + '</span><br>Tax: ' + U.srcLine(R.tax.brackets) +
      '<br>Medicare low-income thresholds: ' + U.srcLine(R.tax.medicareLowIncome) +
      (R.tax.medicareLowIncome.verified ? '' : '<br><span class="src">' + U.esc(R.tax.medicareLowIncome.note) + '</span>');

    // Government payments for the apprentice
    var K = R.incentives.kapApprentice;
    if (r.kapEligible) {
      $('kap-title').textContent = 'Key Apprenticeship Program payments';
      $('kap-intro').innerHTML = 'If this apprenticeship qualifies, the apprentice can receive up to <strong>' + U.money(r.kapTotal) +
        '</strong> (' + (r.partTime ? 'part-time' : 'full-time') + ' amounts), on top of wages. These payments are shown separately and aren’t included in the tax estimate above. Timing is measured from the start of the apprenticeship.';
      $('kap-list').innerHTML = r.kap.map(function (p) {
        return '<li><span>' + U.esc(p.label) + (p.label.indexOf('completion') < 0 ? ' (year ' + (p.yearIndex + 1) + ')' : '') + '</span><b>' + U.money(p.amount) + '</b></li>';
      }).join('');
      $('kap-src').innerHTML = U.srcLine(K) + '<br>Occupation: ' + U.srcLine(t.kapStream) + '<br><span class="src">' + U.esc(t.kapStream.note) + '</span>';
    } else if (opt.apprenticeFallback === 'aatsp') {
      var A = R.incentives.aatsp;
      $('kap-title').textContent = 'Training support payment';
      $('kap-intro').textContent = (opt.kapPossible ? 'Not counting KAP. ' : 'This trade isn’t a Key Apprenticeship Program occupation. ') +
        'It is on the Australian Apprenticeships Priority List, so a full-time apprentice may get the Australian Apprentice Training Support Payment instead:';
      $('kap-list').innerHTML = A.value.fullTime.map(function (p) { return '<li><span>After ' + p.month + ' months</span><b>' + U.money(p.amount) + '</b></li>'; }).join('');
      $('kap-src').innerHTML = U.srcLine(A) + '<br>Occupation: ' + U.srcLine(t.priorityList);
    } else {
      $('kap-title').textContent = 'Government payments';
      $('kap-intro').textContent = 'We couldn’t find this occupation on the Australian Apprenticeships Priority List, so the Key Apprenticeship Program and training support payments may not apply. Check eligibility with your Apprentice Connect Australia provider.';
      $('kap-list').innerHTML = '';
      $('kap-src').innerHTML = U.srcLine(t.priorityList);
    }

    var st = $('state').value;
    $('state-name').textContent = R.states[st].name;
    U.waCaveat($('wa-caveat'), st);
    $('state-panel').innerHTML = U.statePanelHtml(st, { trade: trade, regional: radio('location') === 'regional', audience: 'apprentice' });
  }

  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('submit', function (e) { e.preventDefault(); render(); });
  render();
})();
