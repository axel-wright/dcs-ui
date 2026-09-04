DCS_TEST.suite('image-compare', function () {
  var T = DCS_TEST;

  var html =
    '<div class="compare-container" data-dcs-component="image-compare">' +
      '<div class="compare-before" id="before"></div>' +
      '<div class="compare-handle" id="handle"></div>' +
      '<input type="range" class="compare-slider" id="slider" min="0" max="100" value="50">' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="image-compare"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'image-compare component is initialized');

  var before = fix.querySelector('#before');
  var handle = fix.querySelector('#handle');
  var slider = fix.querySelector('#slider');

  T.assertOk(before.style.clipPath.indexOf('50%') !== -1, 'clipPath includes 50% on init');
  T.assertEqual(handle.style.left, '50%', 'handle left set to 50% on init');

  // Change slider value
  slider.value = '75';
  slider.dispatchEvent(new Event('input', { bubbles: true }));

  T.assertOk(before.style.clipPath.indexOf('25%') !== -1, 'clipPath updated for 75% slider value (25% inset)');
  T.assertEqual(handle.style.left, '75%', 'handle left updated to 75%');

  T.cleanup();
});
