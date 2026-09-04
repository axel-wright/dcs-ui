DCS_TEST.suite('fab', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="fab">' +
      '<div class="fab-menu" id="menu">' +
        '<button class="fab-action" id="act1" data-toast-msg="Action 1">Action 1</button>' +
      '</div>' +
      '<button class="fab-main" id="main-btn" data-toast-msg="Menu Toggled">Main FAB</button>' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="fab"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'fab component is initialized');

  var menu = fix.querySelector('#menu');
  var mainBtn = fix.querySelector('#main-btn');
  var act1 = fix.querySelector('#act1');

  T.assertNotHasClass(menu, 'visible', 'fab menu starts hidden');

  // Toggle main button -> opens menu
  T.click(mainBtn);
  T.assertHasClass(menu, 'visible', 'fab menu becomes visible after main button click');

  // Toggle main button again -> closes menu
  T.click(mainBtn);
  T.assertNotHasClass(menu, 'visible', 'fab menu closes on second main button click');

  // Click action button
  T.click(act1);

  T.cleanup();
});
