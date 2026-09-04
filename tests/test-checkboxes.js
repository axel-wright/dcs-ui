DCS_TEST.suite('checkboxes', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="checkboxes">' +
      '<input type="checkbox" id="parent-input">' +
      '<div>' +
        '<input type="checkbox" id="c1">' +
        '<input type="checkbox" id="c2">' +
        '<input type="checkbox" id="c3">' +
      '</div>' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="checkboxes"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'checkboxes component is initialized');

  var parentInput = fix.querySelector('#parent-input');
  var c1 = fix.querySelector('#c1');
  var c2 = fix.querySelector('#c2');
  var c3 = fix.querySelector('#c3');

  T.assertEqual(parentInput.checked, false, 'parent starts unchecked');
  T.assertEqual(parentInput.indeterminate, false, 'parent starts non-indeterminate');

  // Check parent -> checks all children
  parentInput.checked = true;
  parentInput.dispatchEvent(new Event('change', { bubbles: true }));

  T.assertEqual(c1.checked, true, 'child 1 checked');
  T.assertEqual(c2.checked, true, 'child 2 checked');
  T.assertEqual(c3.checked, true, 'child 3 checked');
  T.assertEqual(parentInput.indeterminate, false, 'parent is not indeterminate when all checked');

  // Uncheck one child -> parent becomes indeterminate
  c1.checked = false;
  c1.dispatchEvent(new Event('change', { bubbles: true }));

  T.assertEqual(parentInput.checked, false, 'parent is unchecked when partially checked');
  T.assertEqual(parentInput.indeterminate, true, 'parent becomes indeterminate when partially checked');

  // Uncheck all children -> parent becomes non-indeterminate and unchecked
  c2.checked = false;
  c2.dispatchEvent(new Event('change', { bubbles: true }));
  c3.checked = false;
  c3.dispatchEvent(new Event('change', { bubbles: true }));

  T.assertEqual(parentInput.checked, false, 'parent is unchecked when no children checked');
  T.assertEqual(parentInput.indeterminate, false, 'parent is not indeterminate when no children checked');

  T.cleanup();
});
