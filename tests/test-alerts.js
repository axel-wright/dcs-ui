DCS_TEST.suite('alerts', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="alerts">' +
      '<div class="alert-banner" id="b1">' +
        '<span>Alert 1</span>' +
        '<button class="alert-dismiss" id="d1">Dismiss</button>' +
      '</div>' +
      '<div class="alert-banner" id="b2">' +
        '<span>Alert 2</span>' +
        '<button class="alert-banner-dismiss" id="d2">Dismiss</button>' +
      '</div>' +
      '<button data-action="restore-alerts" id="restore">Restore All</button>' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="alerts"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'alerts component is initialized');

  var b1 = fix.querySelector('#b1');
  var b2 = fix.querySelector('#b2');
  var d1 = fix.querySelector('#d1');
  var d2 = fix.querySelector('#d2');
  var restore = fix.querySelector('#restore');

  // Dismiss banner 1
  T.click(d1);
  T.assertHasClass(b1, 'dismissing', 'banner 1 gets dismissing class on dismiss click');

  // Dismiss banner 2
  T.click(d2);
  T.assertHasClass(b2, 'dismissing', 'banner 2 gets dismissing class on dismiss click');

  return T.wait(400).then(function () {
    T.assertEqual(b1.style.display, 'none', 'banner 1 display set to none after timeout');
    T.assertEqual(b2.style.display, 'none', 'banner 2 display set to none after timeout');

    // Restore banners
    T.click(restore);
    T.assertEqual(b1.style.display, '', 'banner 1 display restored');
    T.assertEqual(b2.style.display, '', 'banner 2 display restored');
    T.assertNotHasClass(b1, 'dismissing', 'banner 1 dismissing class removed');
    T.assertNotHasClass(b2, 'dismissing', 'banner 2 dismissing class removed');

    T.cleanup();
  });
});
