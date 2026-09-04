DCS_TEST.suite('radio', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="radio-group" id="rg">' +
      '<label class="dcs-radio">' +
        '<input type="radio" name="opt" value="r1" id="r1" checked>' +
        '<span class="dcs-radio-label">Option 1</span>' +
      '</label>' +
      '<label class="dcs-radio">' +
        '<input type="radio" name="opt" value="r2" id="r2">' +
        '<span class="dcs-radio-label">Option 2</span>' +
      '</label>' +
      '<label class="dcs-radio">' +
        '<input type="radio" name="opt" value="r3" id="r3">' +
        '<span class="dcs-radio-label">Option 3</span>' +
      '</label>' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="radio-group"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'radio-group is initialized');

  var r1 = fix.querySelector('#r1');
  var r2 = fix.querySelector('#r2');
  var r3 = fix.querySelector('#r3');

  var lastEventDetail = null;
  el.addEventListener('dcs-radio-change', function (e) {
    lastEventDetail = e.detail;
  });

  // Change input r2
  r2.checked = true;
  r2.dispatchEvent(new Event('change', { bubbles: true }));

  T.assertOk(lastEventDetail !== null, 'dcs-radio-change event was dispatched');
  T.assertEqual(lastEventDetail.value, 'r2', 'event detail value matches selected radio');
  T.assertEqual(lastEventDetail.label, 'Option 2', 'event detail label matches radio label text');

  // Keyboard navigation: ArrowDown on r2 moves to r3
  T.keydown(r2, 'ArrowDown');
  T.assertEqual(r3.checked, true, 'ArrowDown moves selection to option 3');
  T.assertEqual(lastEventDetail.value, 'r3', 'event detail value updated to r3');

  // ArrowDown on r3 wraps back to r1
  T.keydown(r3, 'ArrowDown');
  T.assertEqual(r1.checked, true, 'ArrowDown wraps selection back to option 1');

  T.cleanup();
});
