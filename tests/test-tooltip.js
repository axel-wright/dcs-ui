// Tests for DCS Tooltip component
DCS_TEST.suite('tooltip', function() {
  var T = DCS_TEST;

  var fix = T.fixture(
    '<div data-dcs-component="tooltip">' +
      '<button id="btn1" data-tooltip="Help info" aria-describedby="tip-1">Hover me</button>' +
      '<button id="btn2" data-tooltip="Second tip">Focus me</button>' +
    '</div>'
  );

  var container = fix.querySelector('[data-dcs-component="tooltip"]');
  window.DCS._init(container);

  var btn1 = fix.querySelector('#btn1');
  var btn2 = fix.querySelector('#btn2');

  T.assertOk(container.hasAttribute('data-dcs-initialized'), 'tooltip component initialized');

  // Hover btn1 shows tooltip
  var enterEvt = new Event('mouseenter');
  btn1.dispatchEvent(enterEvt);

  var tipEl = document.querySelector('.dcs-tooltip-js');
  T.assertOk(tipEl, 'tooltip element created in DOM');
  T.assertHasClass(tipEl, 'is-visible', 'tooltip is visible on mouseenter');
  T.assertEqual(tipEl.textContent, 'Help info', 'tooltip text matches data-tooltip');
  T.assertAttr(tipEl, 'id', 'tip-1', 'tooltip element id linked via aria-describedby');
  T.assertAttr(tipEl, 'role', 'tooltip', 'tooltip has role="tooltip"');

  // Mouseleave hides tooltip
  var leaveEvt = new Event('mouseleave');
  btn1.dispatchEvent(leaveEvt);
  T.assertNotHasClass(tipEl, 'is-visible', 'tooltip hidden on mouseleave');

  // Focus btn2 shows tooltip with new text
  var focusEvt = new Event('focus');
  btn2.dispatchEvent(focusEvt);
  T.assertHasClass(tipEl, 'is-visible', 'tooltip visible on focus');
  T.assertEqual(tipEl.textContent, 'Second tip', 'tooltip text updated for btn2');
  T.assertNotHasClass(tipEl, 'id', 'tooltip id removed when no aria-describedby on trigger');

  // Blur hides tooltip
  var blurEvt = new Event('blur');
  btn2.dispatchEvent(blurEvt);
  T.assertNotHasClass(tipEl, 'is-visible', 'tooltip hidden on blur');

  T.cleanup();
});
