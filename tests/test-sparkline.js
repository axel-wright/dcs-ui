DCS_TEST.suite('sparkline', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="sparkline" data-sparkline-values="10,20,15,30,25" data-sparkline-width="120" data-sparkline-height="32" data-sparkline-trend="1" aria-label="Sales Sparkline" id="spark"></div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="sparkline"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'sparkline component is initialized');
  T.assertHasClass(el, 'dcs-sparkline', 'sparkline gets dcs-sparkline class');

  var svg = el.querySelector('svg');
  T.assertOk(svg !== null, 'SVG element rendered');
  T.assertAttr(svg, 'role', 'img', 'SVG has role="img"');
  T.assertAttr(svg, 'aria-label', 'Sales Sparkline', 'SVG aria-label matches attribute');

  var polygon = svg.querySelector('polygon');
  var polyline = svg.querySelector('polyline');

  T.assertOk(polygon !== null, 'SVG contains polygon for filled area');
  T.assertOk(polyline !== null, 'SVG contains polyline for data trend');
  T.assertEqual(polygon.getAttribute('fill'), 'var(--color-success)', 'positive trend sets success color');

  T.cleanup();
});
