/* Apprentice Guide — ui-pay-check.js: "How does your pay stack up?"
 * Compares the user's pay with (1) all full-time workers (ABS EEH May 2025 quartiles),
 * (2) the median for their job (JSA occupation profiles, May 2025), (3) the award minimum for
 * trades (rates.js), and shows take-home pay. Nothing typed here leaves the browser. */
(function () {
  'use strict';
  var R = window.TN_RATES, C = window.TN_CALC, U = window.TN_UI;
  var $ = function (id) { return document.getElementById(id); };
  var form = $('pc-form');
  var OCC = R.occupations.value.slice().sort(function (a, b) { return b.median - a.median; });
  var BY = {}; OCC.forEach(function (o) { BY[o.key] = o; });
  var Q = R.earnings.fullTimeQuartiles.value;
  var JSA_ALL = R.earnings.jsaAllOccupations.value;
  var FULL = R.ordinaryHours.value; // 38
  var WEEKS = C.WEEKS;               // 52

  /* ---------- job select, grouped ---------- */
  (function fillJobs() {
    var order = ['trade', 'office', 'people', 'service', 'machines', 'managers'];
    var html = '<option value="other">Something else / not listed</option>';
    order.forEach(function (g) {
      var list = OCC.filter(function (o) { return o.group === g; }).sort(function (a, b) { return a.label.localeCompare(b.label); });
      if (!list.length) return;
      html += '<optgroup label="' + U.esc(list[0].groupLabel) + '">' + list.map(function (o) {
        return '<option value="' + o.key + '">' + U.esc(o.label) + '</option>';
      }).join('') + '</optgroup>';
    });
    $('job').innerHTML = html;
  })();

  // Prefill from the URL, e.g. pay-check.html?job=plumber&pay=1990&per=week
  (function prefill() {
    var p = new URLSearchParams(location.search);
    if (p.get('job') && (BY[p.get('job')] || p.get('job') === 'other')) $('job').value = p.get('job');
    else $('job').value = 'plumber';
    var per = p.get('per');
    if (per && /^(hour|week|fortnight|year)$/.test(per)) form.querySelector('input[name="period"][value="' + per + '"]').checked = true;
    if (p.get('pay') && isFinite(+p.get('pay'))) $('pay').value = +p.get('pay');
    if (p.get('hours') && isFinite(+p.get('hours'))) $('hours').value = +p.get('hours');
  })();

  /* ---------- maths ---------- */
  function percentile(weekly) { return C.fullTimePercentile(weekly, R); }
  function pctText(p) {
    if (p < 0.01) return 'under 1%';
    if (p > 0.99) return '99%+';
    return Math.round(p * 100) + '%';
  }
  function band(p) {
    if (p >= 0.9) return 'top 10%';
    if (p >= 0.75) return 'top quarter';
    if (p >= 0.5) return 'upper middle';
    if (p >= 0.25) return 'lower middle';
    return 'bottom quarter';
  }
  function signed(n) { return (n >= 0 ? '+' : '−') + U.money(Math.abs(n)); }
  function pctDiff(a, b) { return (a - b) / b; }
  function rel(a, b) {
    if (!(a > 0)) return 'nothing compared with';
    var d = pctDiff(a, b);
    if (Math.abs(d) < 0.03) return 'about the same as';
    return Math.round(Math.abs(d) * 100) + '% ' + (d > 0 ? 'more than' : 'less than');
  }

  function read() {
    var period = (form.querySelector('input[name="period"]:checked') || {}).value || 'year';
    var pay = Math.max(0, parseFloat($('pay').value) || 0);
    var hv = parseFloat($('hours').value); var hours = Math.min(80, isFinite(hv) && hv > 0 ? hv : FULL);
    $('hours-warn').hidden = isFinite(hv) && hv > 0 || $('hours').value === '';
    var weeklyActual = period === 'hour' ? pay * hours : period === 'week' ? pay : period === 'fortnight' ? pay / 2 : pay / WEEKS;
    var hourly = weeklyActual / hours;
    var partTime = hours < 35;
    var job = $('job').value;
    var occ = BY[job] || null;
    var trade = occ && occ.trade ? R.trades[occ.trade] : null;
    $('appr-field').hidden = !trade;
    var appr = !!trade && $('appr').checked;
    $('appr-more').hidden = !appr;
    return {
      period: period, pay: pay, hours: hours, hourly: hourly, partTime: partTime,
      weeklyActual: weeklyActual,
      weekly: partTime ? hourly * FULL : weeklyActual, // compare full-time equivalents
      job: job, occ: occ, trade: trade, tradeKey: occ && occ.trade,
      appr: appr, apprYear: parseInt($('appr-year').value, 10) || 1, apprType: $('appr-type').value
    };
  }

  // CSP-safe geometry: widths/positions are set from data attributes, not inline style attributes.
  function geom(root) {
    Array.prototype.forEach.call(root.querySelectorAll('[data-w]'), function (el) { el.style.width = el.getAttribute('data-w') + '%'; });
    Array.prototype.forEach.call(root.querySelectorAll('[data-l]'), function (el) { el.style.left = el.getAttribute('data-l') + '%'; });
  }

  /* ---------- distribution strip ---------- */
  function drawDist(p) {
    var x = Math.max(0.5, Math.min(99.5, p * 100));
    $('dist').innerHTML =
      '<div class="pc-strip">' +
        '<span class="pc-seg pc-seg-lo" data-w="25"></span><span class="pc-seg pc-seg-mid" data-w="50"></span><span class="pc-seg pc-seg-hi" data-w="25"></span>' +
        '<span class="pc-you" data-l="' + x + '\"><b>You</b></span>' +
      '</div>' +
      '<div class="pc-ticks"><span data-l="25">' + U.money(Q.q1) + '</span><span data-l="50">' + U.money(Q.median) + '<br><i>median</i></span><span data-l="75">' + U.money(Q.q3) + '</span></div>' +
      '<div class="pc-bands"><span>Bottom quarter</span><span>Middle half</span><span>Top quarter</span></div>';
    geom($('dist'));
  }

  /* ---------- rank chart (nearby jobs) ---------- */
  function drawRank(inp) {
    var you = inp.weekly;
    var idx = inp.occ ? OCC.indexOf(inp.occ) : -1;
    var rows;
    if (idx >= 0) {
      var lo = Math.max(0, idx - 3), hi = Math.min(OCC.length, idx + 4);
      rows = OCC.slice(lo, hi);
      if (lo > 0) rows.unshift(OCC[0]);
      if (hi < OCC.length) rows.push(OCC[OCC.length - 1]);
    } else {
      // No job picked: show a spread from top to bottom.
      rows = OCC.filter(function (o, i) { return i % 6 === 0 || i === OCC.length - 1; });
    }
    var max = Math.max(OCC[0].median, you) * 1.04;
    var yx = Math.min(100, you / max * 100);
    var html = rows.map(function (o, i) {
      var gap = i > 0 && OCC.indexOf(o) - OCC.indexOf(rows[i - 1]) > 1;
      var mine = inp.occ === o;
      return (gap ? '<li class="pc-gap" aria-hidden="true">⋯</li>' : '') +
        '<li class="' + (mine ? 'mine' : '') + (o.group === 'trade' ? ' trade' : '') + '">' +
          '<span class="pc-name">' + U.esc(o.label) + (mine ? ' <em>(your job)</em>' : '') + '</span>' +
          '<span class="pc-bar"><i data-w="' + (o.median / max * 100).toFixed(1) + '\"></i><b>' + U.money(o.median) + '</b><s class="pc-youline" data-l="' + yx.toFixed(1) + '\"></s></span>' +
        '</li>';
    }).join('');
    $('rank').innerHTML = '<ul class="pc-ranklist">' + html + '</ul>' +
      '<p class="pc-legend"><span class="pc-key trade"></span>Trade <span class="pc-key"></span>Other job <span class="pc-key you"></span>You: ' + U.money(you) + ' a week' + (inp.partTime ? ' (full-time equivalent)' : '') + '</p>';
    geom($('rank'));
    $('rank-count').textContent = OCC.length;
    $('rank-table').innerHTML = OCC.map(function (o, i) {
      return '<tr' + (inp.occ === o ? ' class="mine"' : '') + '><td>' + (i + 1) + '. ' + U.esc(o.label) + (o.group === 'trade' ? ' <span class="pc-tag">trade</span>' : '') + '</td><td>' + U.money(o.median) +
        '</td><td>' + U.money(o.median * WEEKS) + '</td><td>' + signed(you - o.median) + '</td></tr>';
    }).join('');
  }

  /* ---------- render ---------- */
  function render() {
    var inp = read();
    var w = inp.weekly, p = percentile(w);
    var annual = inp.weeklyActual * WEEKS;
    var tax = C.incomeTax(annual, R);
    var netAnnual = annual - tax.total;
    var superAnnual = annual * R.superGuarantee.value;

    // Hero
    var occ = inp.occ;
    var floorW = inp.trade ? inp.trade.tradesperson.value.weekly : 0;
    var ptNote = inp.partTime ? ' <span class="hint">You work ' + inp.hours + ' hours a week (' + U.money(inp.weeklyActual) + '), so this compares your hourly rate at full-time hours: ' + U.money(w) + ' a week.</span>' : '';
    if (inp.appr && occ) {
      $('hero-label').textContent = 'Once you qualify, the legal minimum for your trade jumps to';
      $('hero-figure').textContent = U.money(floorW * WEEKS);
      $('sticky-num').textContent = U.money(floorW * WEEKS);
      $('sticky-label').textContent = 'a year, qualified minimum';
      $('hero-text').innerHTML = 'a year (' + U.money(floorW, true) + ' a week, award minimum)' + (inp.weeklyActual > 0 ? ' — <b>' + (floorW / inp.weeklyActual).toFixed(1) + '×</b> what you’re on now' : '') + '. ' +
        'Across all ages and experience levels, the typical full-time ' + U.esc(occ.one) + ' earns ' + U.money(occ.median * WEEKS) + ' a year. ' +
        (p < 0.01 ? 'Right now your pay is in the bottom 1% of full-time workers' : 'Right now you earn more than about ' + pctText(p) + ' of full-time workers') + ', which is normal while you’re training.' + ptNote;
    } else {
      var ext = p < 0.01 ? 'bottom 1%' : p > 0.99 ? 'top 1%' : '';
      $('hero-label').textContent = ext ? (inp.partTime ? 'At full-time hours, your pay rate is in the' : 'You’re in the') : (inp.partTime ? 'At full-time hours, your pay rate beats about' : 'You earn more than about');
      $('hero-figure').textContent = ext || pctText(p);
      $('sticky-num').textContent = ext || pctText(p);
      $('sticky-label').textContent = ext ? 'of full-time workers' : (inp.partTime ? 'of full-time workers, at full-time hours' : 'of full-time workers earn less');
      $('hero-text').innerHTML = 'of full-time workers in Australia' + (inp.partTime || ext ? '' : '. You’re in the <b>' + band(p) + '</b>') + '. ' +
        'The typical full-time worker earns ' + U.money(Q.median) + ' a week (' + U.money(Q.median * WEEKS) + ' a year).' + ptNote;
    }
    drawDist(p);
    $('hero-src').innerHTML = 'Estimate based on ' + U.esc(R.earnings.fullTimeQuartiles.sourceName) + '. Exact at the quartiles; estimated in between.';

    // Stats
    if (occ) {
      $('s-job-k').textContent = occ.label + ': typical pay';
      $('s-job').textContent = U.money(occ.median * WEEKS);
      $('s-gap').textContent = signed((w - occ.median) * WEEKS);
    } else {
      $('s-job-k').textContent = 'Typical full-time pay';
      $('s-job').textContent = U.money(Q.median * WEEKS);
      $('s-gap').textContent = signed((w - Q.median) * WEEKS);
    }
    $('s-gap-k').textContent = inp.partTime ? 'You vs typical, at full-time hours' : 'You vs typical';
    $('s-net').textContent = U.money(netAnnual / WEEKS) + '/wk';

    // You vs your job
    var jb = '';
    if (occ) {
      var rank = OCC.indexOf(occ) + 1;
      $('job-title').textContent = 'You vs other ' + occ.many;
      var belowFloor = inp.trade && inp.hourly < (inp.appr ? C.apprenticeRate(inp.tradeKey, inp.apprYear, inp.apprType, false, R).hourly : inp.trade.tradesperson.value.hourly) * 0.995;
      jb += '<p class="pc-line"><b>' + U.money(occ.median) + ' a week</b> (' + U.money(occ.median * WEEKS) + ' a year) is the typical (median) full-time pay for this job, across all ages and experience levels. ' +
        'You earn <b>' + rel(w, occ.median) + '</b> that' + (inp.partTime ? ' at full-time hours' : '') + '.</p>';
      if (belowFloor) {
        jb += '<p><b>Check the legal minimum below first</b> — your pay looks lower than it.</p>';
      } else if (w >= occ.median) {
        jb += '<p>You’re out-earning at least half of full-time ' + U.esc(occ.many) + '.</p>';
      } else if (w >= occ.median * 0.97) {
        jb += '<p>You’re right around the middle for this job.</p>';
      } else {
        jb += '<p>Being under the median is normal early on: it covers everyone from new starters to people with decades in the job. ' +
          (inp.appr ? 'As an apprentice, you’re paid a share of the qualified rate until you finish.' : 'Experience, tickets and licences, overtime, and moving employer are the usual ways pay climbs.') + '</p>';
      }
      jb += '<p class="pc-line">Of the ' + OCC.length + ' jobs on our list (a selection, not every job), this one ranks <b>#' + rank + '</b>. It typically pays <b>' + rel(occ.median, JSA_ALL) + '</b> the median across all jobs in Jobs and Skills Australia’s data (' + U.money(JSA_ALL) + ' a week).</p>' +
        '<p class="src">ANZSCO ' + occ.anzsco + (occ.note ? ' · ' + U.esc(occ.note) : '') + ' · ' + U.srcLine(R.occupations) + '</p>';
    } else {
      $('job-title').textContent = 'You vs other full-time workers';
      jb += '<p>Pick your job above to compare with people who do the same work. For now: ' + (inp.partTime ? 'at full-time hours, ' : '') + 'you earn <b>' + rel(w, Q.median) + '</b> the typical full-time worker (' + U.money(Q.median) + ' a week), and ' +
        rel(w, R.earnings.fullTimeAverage.value) + ' the full-time average (' + U.money(R.earnings.fullTimeAverage.value) + ').</p>' +
        '<p class="hint">The average is higher than the median because a small number of very high earners pull it up. The median is the better “typical”.</p>';
    }
    $('job-body').innerHTML = jb;

    // Legal minimum (trades)
    var t = inp.trade;
    $('floor-card').hidden = !t;
    if (t) {
      var fb = '', q = t.tradesperson.value;
      var floorH = q.hourly, label = 'a qualified ' + t.short;
      if (inp.appr) {
        var ar = C.apprenticeRate(inp.tradeKey, inp.apprYear, inp.apprType, false, R);
        floorH = ar.hourly;
        label = 'a ' + ['1st', '2nd', '3rd', '4th'][inp.apprYear - 1] + '-year ' + (inp.apprType === 'adult' ? 'adult ' : '') + 'apprentice';
        fb += '<p class="pc-line">The award minimum for ' + label + ' is <b>' + U.money(ar.weekly, true) + ' a week</b> (' + U.money(ar.hourly, true) + ' an hour, 38 hours)' +
          (inp.apprType === 'junior' ? ', for someone who didn’t finish Year 12 — it can be higher if you did' : '') + '.</p>';
      } else {
        fb += '<p class="pc-line">The award minimum for ' + label + ' is <b>' + U.money(q.weekly, true) + ' a week</b> (' + U.money(q.hourly, true) + ' an hour, 38 hours).</p>';
      }
      var over = inp.hourly / floorH - 1;
      if (over < -0.005) {
        fb += '<p class="note note-warn"><strong>Your hourly rate (' + U.money(inp.hourly, true) + ') is below this minimum.</strong> ' +
          (inp.appr ? 'Double-check your year and start age above. ' : 'If you’re still an apprentice, tick “I’m an apprentice” above. ') +
          'If it’s right, check your pay with the <a href="' + R.meta.payGuideCalculatorUrl + '" target="_blank" rel="noopener">Fair Work Pay Calculator</a> or call the Fair Work Ombudsman on 13 13 94.</p>';
      } else {
        fb += '<p>You’re on <b>' + (over < 0.03 ? 'about the minimum' : Math.round(over * 100) + '% above the minimum') + '</b> (' + U.money(inp.hourly, true) + ' an hour).</p>';
      }
      if (inp.appr) {
        fb += '<p class="pc-line">Once you’re qualified, the minimum rises to <b>' + U.money(q.weekly, true) + ' a week</b>. Typical full-time pay across all ages in this job is ' + U.money(occ.median) + ' a week.</p>';
      }
      fb += '<p class="hint">We compare your average hourly rate with the base minimum. If your pay includes overtime or penalty rates, your base rate could be lower than it looks.</p>';
      fb += '<p class="src">' + U.esc(t.awardShort) + '. ' + U.srcLine(inp.appr ? t.apprenticeJuniorNoY12 : t.tradesperson) + ' Award minimums exclude overtime, penalty rates and most allowances.</p>';
      if (R.waNotice) fb += '<p class="hint">' + U.esc(R.waNotice.note) + '</p>';
      $('floor-body').innerHTML = fb;
    }

    drawRank(inp);

    // Breakdown
    $('breakdown').innerHTML =
      '<thead><tr><th>Your pay</th><th>A week</th><th>A year</th></tr></thead><tbody>' +
      '<tr><td>Before tax' + (inp.partTime ? ' (' + inp.hours + ' hours)' : '') + '</td><td>' + U.money(inp.weeklyActual) + '</td><td>' + U.money(annual) + '</td></tr>' +
      '<tr class="minus"><td>Income tax and Medicare levy (estimate)</td><td>−' + U.money(tax.total / WEEKS) + '</td><td>−' + U.money(tax.total) + '</td></tr>' +
      '<tr class="total"><td>Take-home</td><td>' + U.money(netAnnual / WEEKS) + '</td><td>' + U.money(netAnnual) + '</td></tr>' +
      '<tr><td>Plus super from your employer (' + Math.round(R.superGuarantee.value * 100) + '%, on top; less if your pay includes overtime)</td><td>' + U.money(superAnnual / WEEKS) + '</td><td>' + U.money(superAnnual) + '</td></tr>' +
      '<tr><td>Your hourly rate</td><td colspan="2">' + U.money(inp.hourly, true) + '</td></tr></tbody>';

    // Want to earn more?
    var nb = '';
    if (occ) {
      var sameGroupUp = OCC.filter(function (o) { return o.group === occ.group && o.median > occ.median; }).slice(-3).reverse();
      if (inp.appr) {
        nb += '<p><b>Finish your apprenticeship.</b> It’s the single biggest pay rise you’ll get: from the apprentice minimum to the qualified rate, and towards the ' + U.money(occ.median) + ' a week typical for your trade.</p>';
      } else if (occ.group === 'trade' && !(inp.trade && inp.hourly < inp.trade.tradesperson.value.hourly * 0.995)) {
        nb += '<p><b>Qualified tradies can also work for themselves.</b> Running your own business means you set your rate and keep the profit — and carry the costs and risks. <a href="guides/index.html">Read our guides</a>.</p>';
      }
      if (sameGroupUp.length) {
        nb += '<p>Other jobs in the same group with higher typical pay (most need different training):</p><ul class="pc-up">' + sameGroupUp.map(function (o) {
          return '<li><span>' + U.esc(o.label) + '</span><b>' + U.money(o.median * WEEKS) + '</b><i>' + U.money((o.median - occ.median) * WEEKS) + ' a year higher typical pay</i></li>';
        }).join('') + '</ul>';
      } else {
        nb += '<p>Your job is the top payer in its group on our list. Nice.</p>';
      }
    } else {
      var trades = OCC.filter(function (o) { return o.group === 'trade'; }).slice(0, 4);
      nb += '<p>Trades that typically pay more than the typical full-time job — no degree needed:</p><ul class="pc-up">' + trades.map(function (o) {
        return '<li><span>' + U.esc(o.label) + '</span><b>' + U.money(o.median * WEEKS) + '</b><i>a year</i></li>';
      }).join('') + '</ul><p><a href="apprentice-pay.html">See what apprentices earn while they train →</a></p>';
    }
    $('next-body').innerHTML = nb;

    // Share
    var who = occ ? occ.one : '';
    var extS = p < 0.01 ? 'is in the bottom 1%' : p > 0.99 ? 'is in the top 1%' : 'beats ' + pctText(p);
    var shareTxt = (inp.partTime ? 'At full-time hours, my pay rate ' + extS : (p > 0.99 ? 'I’m in the top 1%' : p < 0.01 ? 'I’m in the bottom 1%' : 'I earn more than ' + pctText(p))) + ' of full-time workers in Australia' +
      (occ && !inp.appr && !inp.partTime && w > 0 ? ' and earn ' + rel(w, occ.median) + ' the typical ' + who : '') + '. Check yours: ' + location.origin + location.pathname;
    if (inp.appr && occ) shareTxt = 'Once I qualify as ' + (/^[aeiou]/.test(who) ? 'an ' : 'a ') + who + ', the minimum jumps to ' + U.money(floorW * WEEKS) + ' a year — and typical full-time ' + occ.many + ' earn ' + U.money(occ.median * WEEKS) + '. Check yours: ' + location.origin + location.pathname;
    $('share-text').textContent = shareTxt;

    // Assumptions
    $('assumptions').innerHTML = [
      'All-worker comparison: ' + U.esc(R.earnings.fullTimeQuartiles.note) + ' We place you between those points assuming a smooth (log-normal) spread, so treat in-between and very high or low percentiles as estimates. ' + U.srcLine(R.earnings.fullTimeQuartiles),
      'Job comparison: ' + U.esc(R.occupations.note) + ' ' + U.srcLine(R.occupations),
      'The comparison figures are from May 2025, and pay has generally risen since (award minimums alone rose 4.75% from 1 July 2026). Comparing today’s pay with 2025 figures can make you look slightly better placed than you are.',
      'Part-time: under 35 hours a week, we compare your hourly rate × 38 hours, because the official figures are for full-time workers.',
      'Take-home: 2026–27 resident tax rates, low income tax offset and Medicare levy; no HELP repayments, deductions, salary sacrifice or tax-free threshold changes. Super of ' + Math.round(R.superGuarantee.value * 100) + '% is paid on top of your pay. ' + U.srcLine(R.tax.brackets),
      'Nothing you type is sent anywhere: the maths runs in your browser.'
    ].map(function (x) { return '<li>' + x + '</li>'; }).join('');
  }

  $('share-btn').addEventListener('click', function () {
    var txt = $('share-text').textContent;
    function done(ok) { $('share-done').textContent = ok ? 'Copied — paste it anywhere.' : 'Select the text above and copy it.'; }
    if (navigator.share) { navigator.share({ text: txt }).then(function () { done(true); }, function () {}); return; }
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { done(true); }, function () { done(false); });
    else done(false);
  });

  // Sensible defaults when switching period, so the number makes sense.
  var lastPeriod = (form.querySelector('input[name="period"]:checked') || {}).value;
  form.addEventListener('change', function (e) {
    if (e.target.name === 'period') {
      var np = e.target.value, pay = Math.max(0, parseFloat($('pay').value) || 0);
      var hrs = Math.min(80, Math.max(1, parseFloat($('hours').value) || FULL));
      var wk = lastPeriod === 'hour' ? pay * hrs : lastPeriod === 'week' ? pay : lastPeriod === 'fortnight' ? pay / 2 : pay / WEEKS;
      var v = np === 'hour' ? wk / hrs : np === 'week' ? wk : np === 'fortnight' ? wk * 2 : wk * WEEKS;
      $('pay').value = np === 'hour' ? v.toFixed(2) : Math.round(v);
      lastPeriod = np;
    }
    render();
  });
  form.addEventListener('input', function (e) { if (e.target.name !== 'period') render(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); render(); });
  render();
})();
