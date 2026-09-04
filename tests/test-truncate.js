DCS_TEST.suite('truncate', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="truncate" data-truncate-lines="2" id="trunc">' +
      '<p>Long paragraph content that will be clamped and truncated after line limit.</p>' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="truncate"]');

  // Simulate content overflow by setting scrollHeight > clientHeight on HTMLElement prototype
  window.HTMLElement.prototype._scrollHeight = 200;
  window.HTMLElement.prototype._clientHeight = 100;

  window.DCS._init(el);

  delete window.HTMLElement.prototype._scrollHeight;
  delete window.HTMLElement.prototype._clientHeight;

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'truncate component is initialized');

  var btn = el.querySelector('button');
  T.assertOk(btn !== null, 'toggle button appended when content overflows');
  T.assertEqual(btn.textContent, 'Show more', 'toggle button initially says Show more');

  // Click button to expand
  T.click(btn);
  T.assertEqual(btn.textContent, 'Show less', 'toggle button text changes to Show less on expand');

  // Click button to collapse
  T.click(btn);
  T.assertEqual(btn.textContent, 'Show more', 'toggle button text reverts to Show more on collapse');

  T.cleanup();
});
