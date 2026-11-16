/*
 * Apprentice Guide — ui-common.js
 * Shared helpers for every page: money formatting, "last checked" date, illustrative badges,
 * and the three demo forms (newsletter, pre-apprenticeship enquiry, employer waitlist).
 * Requires rates.js to be loaded first.
 */
(function () {
  'use strict';
  var R = window.TN_RATES;

  var fmt0 = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 });
  var fmt2 = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function money(n, cents) { return (cents ? fmt2 : fmt0).format(n || 0); }
  function pct(n, dp) { return (n * 100).toFixed(dp === undefined ? 0 : dp).replace(/\.0+$/, '') + '%'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // Small "source" line for a rates.js figure, with the illustrative label where needed.
  function srcLine(f) {
    var badge = f.verified ? '' : ' <span class="badge-ill">illustrative — edit to suit</span>';
    var link = f.sourceUrl ? '<a href="' + esc(f.sourceUrl) + '" target="_blank" rel="noopener">' + esc(f.sourceName) + '</a>' : esc(f.sourceName);
    return '<span class="src">Source: ' + link + (f.effectiveFrom ? ' (effective ' + esc(f.effectiveFrom) + ')' : '') + '</span>' + badge;
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function fillMeta() {
    if (!R) return;
    $all('[data-last-checked]').forEach(function (el) { el.textContent = R.meta.lastCheckedLabel; });
    $all('[data-fy]').forEach(function (el) { el.textContent = R.meta.financialYear; });
    $all('[data-fw-calc]').forEach(function (el) { el.setAttribute('href', R.meta.payGuideCalculatorUrl); });
  }

  /* -------- Demo forms --------
   * All forms with [data-demo-form] are FRONT-END ONLY for the MVP.
   * BACKEND PLUG-IN POINT: replace the body of `submitToBackend` with a real call
   * (e.g. Beehiiv/ConvertKit for the newsletter, Tally/Formspree or an RTO/GTO lead API for the
   * enquiry form, and a waitlist endpoint for the employer dashboard). Until then nothing is sent
   * or stored anywhere — the data stays in the visitor's browser and is discarded.
   */
  function submitToBackend(formName, data) {
    // BACKEND PLUG-IN POINT (see comment above). Intentionally does nothing in the MVP.
    void formName; void data;
    return true;
  }

  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  function wireForm(form) {
    var confirmEl = document.getElementById(form.getAttribute('data-confirm'));
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      $all('.error', form).forEach(function (el) { el.remove(); });
      $all('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); });
      var firstBad = null;
      function flag(el, msg) {
        var p = document.createElement('p');
        p.className = 'error';
        p.id = (el.id || el.name) + '-err';
        p.textContent = msg;
        var host = el.closest('.field') || el.parentNode;
        host.appendChild(p);
        el.setAttribute('aria-invalid', 'true');
        el.setAttribute('aria-describedby', p.id);
        if (!firstBad) firstBad = el;
      }
      $all('[required]', form).forEach(function (el) {
        if (el.type === 'checkbox') { if (!el.checked) flag(el, 'Please tick this box to continue.'); }
        else if (!el.value.trim()) flag(el, 'Please fill this in.');
        else if (el.type === 'email' && !validEmail(el.value.trim())) flag(el, 'Please enter a valid email address.');
      });
      var pc = form.querySelector('[data-postcode]');
      if (pc && pc.value.trim() && !/^[A-Za-z .'-]{2,}$|^\d{4}$/.test(pc.value.trim())) flag(pc, 'Enter a suburb name or a 4-digit postcode.');
      if (firstBad) { firstBad.focus(); return; }

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      submitToBackend(form.getAttribute('data-demo-form'), data);

      form.hidden = true;
      if (confirmEl) {
        var nameEl = form.querySelector('[name="name"]');
        var slot = confirmEl.querySelector('[data-name]');
        if (slot) slot.textContent = nameEl && nameEl.value.trim() ? ', ' + nameEl.value.trim().split(' ')[0] : '';
        confirmEl.classList.add('on');
        confirmEl.setAttribute('tabindex', '-1');
        confirmEl.focus();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    fillMeta();
    $all('form[data-demo-form]').forEach(wireForm);
  });

  /* -------- Trades, states and extra-help panels (v1.1) -------- */

  // Fill a <select> with every trade, grouped by industry (optgroups).
  function fillTradeSelect(sel, selected) {
    var html = '';
    R.industries.forEach(function (ind) {
      var opts = Object.keys(R.trades).filter(function (k) { return R.trades[k].industry === ind[0]; });
      if (!opts.length) return;
      html += '<optgroup label="' + esc(ind[1]) + '">' + opts.map(function (k) {
        return '<option value="' + k + '"' + (k === selected ? ' selected' : '') + '>' + esc(R.trades[k].label) + '</option>';
      }).join('') + '</optgroup>';
    });
    sel.innerHTML = html;
    if (selected && R.trades[selected]) sel.value = selected;
  }

  function fillStateSelect(sel, selected) {
    sel.innerHTML = Object.keys(R.states).map(function (k) {
      return '<option value="' + k + '"' + (k === (selected || 'NSW') ? ' selected' : '') + '>' + esc(R.states[k].name) + '</option>';
    }).join('');
  }

  function dated(f, withNote) {
    return '<span class="src">Source: <a href="' + esc(f.sourceUrl) + '" target="_blank" rel="noopener">' + esc(f.sourceName) + '</a>' +
      (withNote !== false && f.note ? ' · ' + esc(f.note) : '') + '</span>';
  }

  // HTML for the "Extra help in your state" panel.
  // opts: { trade: key, regional: bool, audience: 'apprentice' | 'employer' }
  function statePanelHtml(stateKey, opts) {
    var st = R.states[stateKey], t = R.trades[opts.trade], html = '';
    if (stateKey === 'WA') {
      html += '<div class="note note-warn"><p><strong>WA employers:</strong> ' + esc(R.waNotice.note) +
        ' The rates on this page are national (Fair Work) award rates. ' + dated(R.waNotice, false) + '</p></div>';
    }
    var kinds = opts.audience === 'employer' ? ['employer', 'training', 'travel'] : ['training', 'travel', 'employer'];
    var titles = { training: 'Training costs', travel: 'Travel and accommodation', employer: 'For employers' };
    var any = false;
    kinds.forEach(function (k) {
      var items = st.items.filter(function (it) { return it.value.kind === k; });
      if (!items.length) return;
      any = true;
      html += '<h3 class="h4-size">' + titles[k] + '</h3><ul class="help-list">' + items.map(function (it) {
        var hi = opts.regional && it.value.regional;
        return '<li' + (hi ? ' class="hl-item"' : '') + '><strong>' + esc(it.value.title) + (hi ? ' <span class="badge-ok">relevant if you’re regional</span>' : '') +
          '.</strong> ' + esc(it.value.text) + '<br>' + dated(it) + '</li>';
      }).join('') + '</ul>';
    });
    if (!any) html += '<p>We couldn’t verify any extra state programs for ' + esc(st.name) + ' yet, so we’ve left this blank rather than guess.</p>';
    html += '<p class="hint">We only list programs we could check on an official government site. Others may exist — ask your Apprentice Connect provider.</p>';
    if (opts.regional) {
      html += '<h3 class="h4-size">Regional or remote</h3><p>' + esc(R.lafhaNote.note) + ' Year 1 amount: ' + money(R.incentives.lafha.value.year1, true) +
        ' a week. ' + dated(R.lafhaNote, false) + '</p><p class="hint">Award pay is the same in the city and the regions. Travel allowances above depend on distance to training.</p>';
    }
    if (t && t.licence) {
      var L = st.licensing[t.licence];
      html += '<h3 class="h4-size">Licensing in ' + esc(st.name) + '</h3><p>' + (t.licence === 'electrical' ? 'Electricians' : 'Plumbers') +
        ' need a licence to work unsupervised once qualified. In ' + esc(st.name) + ' that’s handled by <a href="' + esc(L.url) + '" target="_blank" rel="noopener">' + esc(L.name) + '</a>.</p>';
    }
    return html;
  }

  // Short text explaining which apprentice rate applies for an age.
  function ageExplain(age, type) {
    var lim = R.adultAge.value;
    return type === 'adult'
      ? 'Adult apprentice rate: you’re ' + lim + ' or older when you start, so the higher adult minimum applies.'
      : 'Junior apprentice rate: you’re under ' + lim + ' when you start. (At ' + lim + ' or older you’d get the adult rate.)';
  }

  function under18Html() {
    return '<strong>Under 18?</strong> Wages are taxed at normal resident rates (the tax-free threshold applies). ' + esc(R.under18.consent.note) +
      ' ' + dated(R.under18.consent, false);
  }

  window.TN_UI = { money: money, pct: pct, esc: esc, srcLine: srcLine, $: $, $all: $all,
    fillTradeSelect: fillTradeSelect, fillStateSelect: fillStateSelect, statePanelHtml: statePanelHtml,
    ageExplain: ageExplain, under18Html: under18Html, dated: dated };
})();
