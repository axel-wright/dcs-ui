DCS_TEST.suite('scrollspy', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="scrollspy" id="spy">' +
      '<div class="toc">' +
        '<a href="#" class="toc-item" data-target="s1" id="toc1">Section 1</a>' +
        '<a href="#" class="toc-item" data-target="s2" id="toc2">Section 2</a>' +
      '</div>' +
      '<div data-scrollspy-content id="content" style="height: 200px; overflow: auto;">' +
        '<section data-spy-target="s1" id="s1" style="height: 300px;">Section 1</section>' +
        '<section data-spy-target="s2" id="s2" style="height: 300px;">Section 2</section>' +
      '</div>' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="scrollspy"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'scrollspy is initialized');

  var toc1 = fix.querySelector('#toc1');
  var toc2 = fix.querySelector('#toc2');

  // Click toc2
  T.click(toc2);
  T.assertHasClass(toc2, 'active', 'toc2 gets active class on click');
  T.assertNotHasClass(toc1, 'active', 'toc1 loses active class');

  // Click toc1
  T.click(toc1);
  T.assertHasClass(toc1, 'active', 'toc1 gets active class on click');

  T.cleanup();
});
