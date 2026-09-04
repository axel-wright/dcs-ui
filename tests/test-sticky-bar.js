DCS_TEST.suite('sticky-bar', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="sticky-bar" id="sticky">' +
      'Sticky Action Bar' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="sticky-bar"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'sticky-bar is initialized');

  return T.wait(100).then(function () {
    T.assertHasClass(el, 'is-stuck', 'sticky-bar receives is-stuck class');
    T.cleanup();
  });
});
