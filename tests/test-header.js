DCS_TEST.suite('header', function () {
  var T = DCS_TEST;

  var html =
    '<header data-dcs-component="header">' +
      '<nav class="nav-links" id="links">' +
        '<button class="mobile-menu-toggle" id="toggle" aria-expanded="false">☰</button>' +
        '<a href="#">Home</a>' +
        '<a href="#">Docs</a>' +
      '</nav>' +
    '</header>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="header"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'header component is initialized');

  var toggle = fix.querySelector('#toggle');
  var links = fix.querySelector('#links');
  var nav = fix.querySelector('nav');

  T.assertAttr(nav, 'aria-label', 'Header Navigation', 'nav receives aria-label');
  T.assertNotHasClass(links, 'open', 'nav-links starts closed');
  T.assertAttr(toggle, 'aria-expanded', 'false', 'toggle starts aria-expanded="false"');

  // Toggle mobile menu open
  T.click(toggle);
  T.assertHasClass(links, 'open', 'nav-links receives open class');
  T.assertAttr(toggle, 'aria-expanded', 'true', 'aria-expanded becomes "true" when open');
  T.assertEqual(toggle.textContent, '✕', 'toggle text changes to ✕');

  // Toggle mobile menu closed
  T.click(toggle);
  T.assertNotHasClass(links, 'open', 'nav-links closes on second click');
  T.assertAttr(toggle, 'aria-expanded', 'false', 'aria-expanded becomes "false" when closed');
  T.assertEqual(toggle.textContent, '☰', 'toggle text changes back to ☰');

  T.cleanup();
});
