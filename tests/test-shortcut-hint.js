DCS_TEST.suite('shortcut-hint', function () {
  var T = DCS_TEST;

  var html =
    '<button data-dcs-component="shortcut-hint" data-shortcut="Ctrl+K" id="btn">' +
      'Search' +
    '</button>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="shortcut-hint"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'shortcut-hint is initialized');

  var hint = el.querySelector('.dcs-shortcut-hint');
  T.assertOk(hint !== null, 'dcs-shortcut-hint span injected');
  T.assertEqual(hint.textContent, 'Ctrl+K', 'shortcut hint text matches data-shortcut attribute');

  T.cleanup();
});
