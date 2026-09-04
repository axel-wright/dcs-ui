DCS_TEST.suite('bottom-sheet', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="bottom-sheet">' +
      '<button data-action="sheet-open" id="open-btn">Open Sheet</button>' +
      '<div class="bottom-sheet">' +
        '<div class="bottom-sheet-drag-handle" id="handle"></div>' +
        '<p>Sheet content</p>' +
        '<button data-action="sheet-close" id="close-btn">Close Sheet</button>' +
      '</div>' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="bottom-sheet"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'bottom-sheet is initialized');
  T.assertNotHasClass(el, 'open', 'bottom-sheet starts closed');

  var openBtn = fix.querySelector('#open-btn');
  var closeBtn = fix.querySelector('#close-btn');
  var handle = fix.querySelector('#handle');

  // Open sheet
  T.click(openBtn);
  T.assertHasClass(el, 'open', 'bottom-sheet opens on sheet-open click');

  // Close sheet via button
  T.click(closeBtn);
  T.assertNotHasClass(el, 'open', 'bottom-sheet closes on sheet-close click');

  // Re-open sheet
  T.click(openBtn);
  T.assertHasClass(el, 'open', 'bottom-sheet re-opened');

  // Escape key closes sheet
  T.keydown(document.body, 'Escape');
  T.assertNotHasClass(el, 'open', 'Escape key closes open bottom-sheet');

  // Drag-to-dismiss simulation
  T.click(openBtn);
  T.assertHasClass(el, 'open', 'sheet open for drag test');

  var downEvt = new MouseEvent('pointerdown', { clientY: 100, bubbles: true });
  downEvt.pointerId = 1;
  handle.dispatchEvent(downEvt);

  var moveEvt = new MouseEvent('pointermove', { clientY: 250, bubbles: true });
  moveEvt.pointerId = 1;
  handle.dispatchEvent(moveEvt);

  var upEvt = new MouseEvent('pointerup', { clientY: 250, bubbles: true });
  upEvt.pointerId = 1;
  handle.dispatchEvent(upEvt);

  T.assertNotHasClass(el, 'open', 'drag down past threshold dismisses sheet');

  T.cleanup();
});
