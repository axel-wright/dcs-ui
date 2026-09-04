DCS_TEST.suite('split-pane', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="split-pane" style="width: 500px;" id="split">' +
      '<div class="dcs-split-left" id="left" style="flex: 0 0 50%;">Left</div>' +
      '<div class="dcs-split-handle" id="handle"></div>' +
      '<div class="dcs-split-right" id="right">Right</div>' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="split-pane"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'split-pane is initialized');

  var handle = fix.querySelector('#handle');
  var left = fix.querySelector('#left');

  // Mousedown on handle
  var downEvt = new MouseEvent('mousedown', { clientX: 250, bubbles: true });
  handle.dispatchEvent(downEvt);

  T.assertHasClass(handle, 'active', 'handle receives active class on mousedown');

  // Mousemove on document
  var moveEvt = new MouseEvent('mousemove', { clientX: 300, bubbles: true });
  document.dispatchEvent(moveEvt);

  T.assertOk(left.style.flex.indexOf('%') !== -1, 'left pane flex percentage updated on drag');

  // Mouseup on document
  var upEvt = new MouseEvent('mouseup', { bubbles: true });
  document.dispatchEvent(upEvt);

  T.assertNotHasClass(handle, 'active', 'handle active class removed on mouseup');

  T.cleanup();
});
