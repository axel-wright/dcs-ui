DCS_TEST.suite('clipboard', function () {
  var T = DCS_TEST;

  var html =
    '<button data-dcs-component="clipboard" data-clipboard-text="Copied Value" id="clip-btn">' +
      'Copy Me' +
    '</button>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="clipboard"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'clipboard component is initialized');

  T.click(el);

  return T.wait(50).then(function () {
    T.assertEqual(el.textContent, 'Copied!', 'text content updated to Copied! after click');
    T.assertHasClass(el, 'copied', 'copied class added to button');

    T.cleanup();
  });
});
