/* Tradie Numbers — ui-home.js: home-page hook figure, computed live from rates.js. */
  (function () {
    var R = window.TN_RATES, C = window.TN_CALC, U = window.TN_UI;
    var r = C.apprenticePay({ trade: 'electrician', year: 1, type: 'junior', y12: false, hours: 38 }, R);
    var r12 = C.apprenticePay({ trade: 'electrician', year: 1, type: 'junior', y12: true, hours: 38 }, R);
    document.getElementById('hook-figure').innerHTML = U.money(r.takeHomeWeekly) + '<small> a week</small>';
    document.getElementById('hook-detail').textContent =
      'A first-year electrical apprentice on the award minimum (' + U.money(r.weekly, true) + ' a week before tax, ' +
      'not finished Year 12) keeps about ' + U.money(r.takeHomeWeekly) + ' after estimated tax and Medicare levy — or about ' +
      U.money(r12.takeHomeWeekly) + ' with Year 12. Plus up to ' + U.money(r.kapTotal) + ' in Key Apprenticeship Program payments over the apprenticeship.';
  })();
