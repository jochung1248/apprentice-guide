/* Apprentice Guide — ui-trade-vs-uni.js: wires trade-vs-uni.html to calc.tradeVsUni() and draws an inline SVG chart. */
(function () {
  'use strict';
  var R = window.TN_RATES, C = window.TN_CALC, U = window.TN_UI;
  var $ = function (id) { return document.getElementById(id); };
  var form = $('tvu-form');
  // Brand: orange = trade path (hivis-deep), blueprint blue = uni path. Pair validated with the dataviz palette checker (all checks pass on white).
  var COLORS = { trade: '#C2410C', uni: '#2F5BEA' };

  U.fillTradeSelect($('trade'), 'electrician');
  var contrib = R.help.contributions.value, sal = R.graduates.medianSalary.value;
  var FIELDS = {
    business:    { contribution: contrib.commerce.amount,    salary: sal.business,    years: 3, band: contrib.commerce.label },
    engineering: { contribution: contrib.engineering.amount, salary: sal.engineering, years: 4, band: contrib.engineering.label },
    science:     { contribution: contrib.engineering.amount, salary: sal.science,     years: 3, band: contrib.engineering.label },
    computing:   { contribution: contrib.engineering.amount, salary: sal.computing,   years: 3, band: contrib.engineering.label }
  };

  function applyField() {
    var f = FIELDS[$('field').value];
    $('contribution').value = f.contribution;
    $('grad').value = f.salary;
    $('degree-years').value = String(f.years);
  }
  $('pt-income').value = R.illustrative.partTimeStudyIncome.value;
  $('growth').value = R.illustrative.payGrowth.value * 100;
  $('loading').value = R.illustrative.marketLoading.value * 100;
  $('indexation').value = +(R.help.indexation.value * 100).toFixed(2);
  applyField();

  function n(id, d) { var v = parseFloat($(id).value); return isFinite(v) ? v : d; }

  var lastTrade = null;
  function read() {
    var trade = $('trade').value;
    var opt = C.incentiveOptions(trade, R);
    if (trade !== lastTrade) { $('kap').checked = opt.kapDefault; lastTrade = trade; }
    $('kap').disabled = !opt.kapPossible;            // review 3 m5: no KAP for non-KAP trades
    if (!opt.kapPossible) $('kap').checked = false;
    $('kap-hint').textContent = R.trades[trade].kapEligible.note;
    var startAge = Math.floor(Math.min(30, Math.max(15, n('start-age', 17))));
    // Keep the age slider consistent with the start age (at least two years of comparison).
    var tgtEl = $('target');
    tgtEl.min = Math.max(21, startAge + 2);
    var target = Math.round(n('target', 25));
    if (target < +tgtEl.min) { target = +tgtEl.min; tgtEl.value = target; }
    return {
      trade: trade, startAge: startAge, targetAge: target, y12: $('y12').checked, kapEligible: $('kap').checked,
      marketLoading: Math.max(0, n('loading', 0)) / 100, payGrowth: Math.max(0, n('growth', 0)) / 100,
      uniStartAge: Math.max(startAge, Math.round(n('uni-start', 18))), degreeYears: parseInt($('degree-years').value, 10),
      contribution: Math.max(0, n('contribution', 0)), partTimeIncome: Math.max(0, n('pt-income', 0)),
      gradSalary: Math.max(0, n('grad', 0)), indexation: Math.max(0, n('indexation', 0)) / 100
    };
  }

  /* ---------------- chart ---------------- */
  function niceStep(range, ticks) {
    var raw = range / ticks, mag = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / mag;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * mag;
  }
  function kfmt(v) {
    var a = Math.abs(v), s = v < 0 ? '−' : '';
    if (a >= 1e6) return s + '$' + (a / 1e6).toFixed(a % 1e6 === 0 ? 0 : 1) + 'm';
    if (a >= 1000) return s + '$' + Math.round(a / 1000) + 'k';
    return s + '$' + Math.round(a);
  }

  var lastResult = null;
  function draw(res) {
    lastResult = res;
    var host = $('chart'), tip = $('chart-tip');
    var old = host.querySelector('svg'); if (old) old.remove();
    var W = Math.max(300, Math.round(host.clientWidth || 600));
    var mobile = W < 520;
    var H = mobile ? 280 : 340, padL = 52, padR = mobile ? 70 : 96, padT = 16, padB = 34;
    var rows = res.rows;
    var xs = rows.map(function (r) { return r.endAge; });
    var vals = [];
    rows.forEach(function (r) { vals.push(r.trade.position, r.uni.position); });
    var minV = Math.min(0, Math.min.apply(null, vals)), maxV = Math.max.apply(null, vals);
    var step = niceStep(maxV - minV || 1, 5);
    minV = Math.floor(minV / step) * step; maxV = Math.ceil(maxV / step) * step;
    var x0 = xs[0], x1 = xs[xs.length - 1];
    function X(a) { return padL + (x1 === x0 ? 0 : (a - x0) / (x1 - x0)) * (W - padL - padR); }
    function Y(v) { return padT + (1 - (v - minV) / (maxV - minV)) * (H - padT - padB); }

    var NS = 'http://www.w3.org/2000/svg';
    function el(name, attrs, text) {
      var e = document.createElementNS(NS, name);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      if (text !== undefined) e.textContent = text;
      return e;
    }
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img', 'aria-labelledby': 'chart-title chart-desc' });
    var s = res.summary;
    svg.appendChild(el('desc', { id: 'chart-desc' }, 'Line chart. By age ' + res.targetAge + ', trade path net position ' + U.money(s.tradePosition) +
      '; uni path net position ' + U.money(s.uniPosition) + '. Full numbers are in the table below.'));

    // grid + y labels
    for (var v = minV; v <= maxV + 1e-6; v += step) {
      svg.appendChild(el('line', { x1: padL, x2: W - padR, y1: Y(v), y2: Y(v), stroke: v === 0 ? '#8F8A7E' : '#E2DDD2', 'stroke-width': v === 0 ? 1.5 : 1 }));
      svg.appendChild(el('text', { x: padL - 8, y: Y(v) + 4, 'text-anchor': 'end', 'font-size': 12, fill: '#5B616A' }, kfmt(v)));
    }
    // x labels
    var every = xs.length > 12 ? 2 : 1;
    xs.forEach(function (a, i) {
      if (i % every === 0 || i === xs.length - 1) svg.appendChild(el('text', { x: X(a), y: H - padB + 20, 'text-anchor': 'middle', 'font-size': 12, fill: '#5B616A' }, a));
    });
    svg.appendChild(el('text', { x: W - padR + 9, y: H - padB + 20, 'font-size': 11, fill: '#5B616A' }, 'age'));

    function path(key) {
      return rows.map(function (r, i) { return (i ? 'L' : 'M') + X(r.endAge).toFixed(1) + ' ' + Y(r[key].position).toFixed(1); }).join(' ');
    }
    ['uni', 'trade'].forEach(function (k) {
      svg.appendChild(el('path', { d: path(k), fill: 'none', stroke: COLORS[k], 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
    });
    // end markers + direct labels (text in ink colour, mark carries identity)
    var lt = rows[rows.length - 1];
    var yT = Y(lt.trade.position), yU = Y(lt.uni.position);
    if (Math.abs(yT - yU) < 30) { var mid = (yT + yU) / 2; if (yT <= yU) { yT = mid - 15; yU = mid + 15; } else { yT = mid + 15; yU = mid - 15; } }
    [['trade', 'Trade', yT], ['uni', 'Uni', yU]].forEach(function (d) {
      var cx = X(lt.endAge), cy = Y(lt[d[0]].position);
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: 4.5, fill: COLORS[d[0]], stroke: '#fff', 'stroke-width': 2 }));
      svg.appendChild(el('text', { x: cx + 9, y: d[2] - 2, 'font-size': 12.5, 'font-weight': 800, fill: '#16181D' }, d[1]));
      svg.appendChild(el('text', { x: cx + 9, y: d[2] + 13, 'font-size': 12, fill: '#5B616A' }, kfmt(lt[d[0]].position)));
    });

    // hover layer: crosshair + tooltip
    var cross = el('line', { y1: padT, y2: H - padB, stroke: '#16181D', 'stroke-width': 1, 'stroke-dasharray': '3 3', opacity: 0 });
    var dT = el('circle', { r: 5, fill: COLORS.trade, stroke: '#fff', 'stroke-width': 2, opacity: 0 });
    var dU = el('circle', { r: 5, fill: COLORS.uni, stroke: '#fff', 'stroke-width': 2, opacity: 0 });
    svg.appendChild(cross); svg.appendChild(dT); svg.appendChild(dU);
    var hit = el('rect', { x: padL, y: padT, width: W - padL - padR, height: H - padT - padB, fill: 'transparent' });
    svg.appendChild(hit);
    function show(clientX) {
      var box = svg.getBoundingClientRect();
      var px = (clientX - box.left) * (W / box.width);
      var best = 0, bd = Infinity;
      rows.forEach(function (r, i) { var d = Math.abs(X(r.endAge) - px); if (d < bd) { bd = d; best = i; } });
      var r = rows[best], cx = X(r.endAge);
      cross.setAttribute('x1', cx); cross.setAttribute('x2', cx); cross.setAttribute('opacity', 0.6);
      dT.setAttribute('cx', cx); dT.setAttribute('cy', Y(r.trade.position)); dT.setAttribute('opacity', 1);
      dU.setAttribute('cx', cx); dU.setAttribute('cy', Y(r.uni.position)); dU.setAttribute('opacity', 1);
      tip.innerHTML = '<b>By age ' + r.endAge + '</b><br>' +
        '<i data-series="trade"></i>Trade (' + U.esc(r.trade.stage) + '): ' + U.money(r.trade.position) + '<br>' +
        '<i data-series="uni"></i>Uni (' + U.esc(r.uni.stage) + '): ' + U.money(r.uni.position) +
        (r.uni.helpBalance > 0 ? '<br><span>HELP owed: ' + U.money(r.uni.helpBalance) + '</span>' : '');
      tip.querySelectorAll('i').forEach(function (i) { i.style.background = COLORS[i.getAttribute('data-series')]; });
      var left = cx * (box.width / W);
      var tw = tip.offsetWidth || 180;
      tip.style.left = Math.max(0, Math.min(box.width - tw, left + 12 > box.width - tw ? left - tw - 12 : left + 12)) + 'px';
      tip.style.top = '8px';
      tip.classList.add('on');
    }
    function hide() { tip.classList.remove('on'); cross.setAttribute('opacity', 0); dT.setAttribute('opacity', 0); dU.setAttribute('opacity', 0); }
    hit.addEventListener('mousemove', function (e) { show(e.clientX); });
    hit.addEventListener('mouseleave', hide);
    hit.addEventListener('touchstart', function (e) { show(e.touches[0].clientX); }, { passive: true });
    hit.addEventListener('touchmove', function (e) { show(e.touches[0].clientX); }, { passive: true });
    hit.addEventListener('touchend', function () { setTimeout(hide, 1500); });
    host.insertBefore(svg, tip);
  }

  /* ---------------- render ---------------- */
  function render() {
    var inp = read();
    $('target-out').textContent = inp.targetAge;
    var res = C.tradeVsUni(inp, R), s = res.summary;
    $('hero-label').textContent = 'By age ' + res.targetAge;
    var ahead = s.difference >= 0 ? 'trade' : 'uni';
    $('hero-figure').textContent = U.money(Math.abs(s.difference));
    $('sticky-num').textContent = U.money(Math.abs(s.difference));
    $('sticky-label').textContent = (ahead === 'trade' ? 'trade' : 'uni') + ' ahead by age ' + res.targetAge;
    $('hero-text').textContent = (ahead === 'trade' ? 'The trade path is ahead' : 'The uni path is ahead') +
      ' on these assumptions (total take-home pay, minus any HELP debt still owing).' +
      (ahead === 'trade' ? ' The uni path hasn’t caught up by ' + res.targetAge + '.' : (s.breakEvenAge ? ' Uni pulled ahead by age ' + s.breakEvenAge + '.' : ''));
    $('s-trade').textContent = U.money(s.tradeCumulative);
    $('s-uni').textContent = U.money(s.uniCumulative);
    $('s-help').textContent = U.money(s.uniHelpBalance);

    $('tvu-table').innerHTML = res.rows.map(function (r) {
      return '<tr><td>' + r.endAge + '</td><td>' + U.esc(r.trade.stage) + '</td><td>' + U.money(r.trade.net) + '</td><td>' + U.money(r.trade.cumulative) +
        '</td><td>' + U.esc(r.uni.stage) + '</td><td>' + U.money(r.uni.net) + '</td><td>' + U.money(r.uni.helpBalance) + '</td><td>' + U.money(r.uni.position) + '</td></tr>';
    }).join('');

    var t = R.trades[inp.trade], f = FIELDS[$('field').value];
    $('contribution-src').innerHTML = (+$('contribution').value === f.contribution ? 'Maximum for ' + U.esc(f.band) + '. ' + U.srcLine(R.help.contributions) : 'Your figure.');
    $('grad-src').innerHTML = (+$('grad').value === f.salary ? 'Median full-time graduate salary. ' + U.srcLine(R.graduates.medianSalary) : 'Your figure.');

    var tw = t.tradesperson.value.weekly;
    var occ = (R.occupations ? R.occupations.value : []).filter(function (o) { return o.trade === inp.trade; })[0];
    $('loading-typical').innerHTML = occ ? 'For comparison: typical full-time pay for ' + U.esc(occ.label.toLowerCase()) + 's is ' + U.money(occ.median) + ' a week (median across all ages, May 2025, includes overtime), about ' +
      Math.round((occ.median / tw - 1) * 100) + '% above the award minimum. New starters usually earn less than that. <a href="pay-check.html?job=' + occ.key + '">Pay check →</a>' : '';
    var li = [
      'Apprentice wages: ' + U.esc(t.award) + ' minimum rates for ' + (inp.startAge >= 21 ? 'adult' : 'junior') + ' apprentices, 4-year apprenticeship, 52 paid weeks a year. ' + U.srcLine(t.apprenticeJuniorNoY12),
      'Qualified wage: award minimum ' + U.money(tw, true) + ' a week (' + U.money(tw * 52) + ' a year)' + (inp.marketLoading ? ' plus ' + Math.round(inp.marketLoading * 100) + '%' : '') + ', rising ' + (inp.payGrowth * 100).toFixed(1).replace(/\.0$/, '') + '% a year. ' + U.srcLine(t.tradesperson),
      'Key Apprenticeship Program: ' + (inp.kapEligible ? U.money(s.kapTotal) + ' paid at 6, 12, 24 and 36 months and on completion; not taxed in this model. ' + U.srcLine(R.incentives.kapApprentice) : 'not included.'),
      'Tax: 2026–27 resident rates, low income tax offset and Medicare levy, held at today’s levels. ' + U.srcLine(R.tax.brackets),
      'HELP: student contribution added each study year; compulsory repayments use the 2026–27 marginal system; remaining debt indexed at ' + (inp.indexation * 100).toFixed(1) + '% a year. ' + U.srcLine(R.help.repayment),
      'Part-time income while studying: ' + U.money(inp.partTimeIncome) + ' a year. ' + U.srcLine(R.illustrative.partTimeStudyIncome),
      'Pay rises after qualifying or graduating: ' + (inp.payGrowth * 100).toFixed(1).replace(/\.0$/, '') + '% a year, same for both paths. ' + U.srcLine(R.illustrative.payGrowth),
      'Not included: living costs, super, overtime, career breaks, TAFE fees, the cost of tools, or the value of a degree or licence beyond pay.'
    ];
    $('assumptions').innerHTML = li.map(function (x) { return '<li>' + x + '</li>'; }).join('');
    draw(res);
  }

  $('field').addEventListener('change', function () { applyField(); });
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('submit', function (e) { e.preventDefault(); render(); });
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (lastResult) draw(lastResult); }, 120); });
  render();
})();
