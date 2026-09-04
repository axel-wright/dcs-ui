DCS_TEST.suite('popover', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="popover">' +
      '<button class="popover-trigger" id="trigger">Machine Info</button>' +
      '<div class="popover-card" id="card">' +
        '<span class="popover-machine-name">CNC Mill</span>' +
        '<a href="#" class="popover-link" id="link">View details</a>' +
      '</div>' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="popover"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'popover component is initialized');

  var trigger = fix.querySelector('#trigger');
  var card = fix.querySelector('#card');
  var link = fix.querySelector('#link');

  T.assertNotHasClass(card, 'visible', 'popover card starts hidden');

  // Click trigger -> opens card
  T.click(trigger);
  T.assertHasClass(card, 'visible', 'popover card opens on trigger click');

  // Click link inside
  T.click(link);

  // Click outside -> closes card
  T.click(document.body);
  T.assertNotHasClass(card, 'visible', 'popover card closes on outside click');

  T.cleanup();
});
