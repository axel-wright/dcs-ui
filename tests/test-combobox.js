// Tests for DCS Combobox component
DCS_TEST.suite('combobox', function() {
  var T = DCS_TEST;

  var fix = T.fixture(
    '<div class="combobox-container" data-dcs-component="combobox">' +
      '<input type="text" class="combobox-input" placeholder="Search...">' +
      '<button class="combobox-clear-btn" type="button">×</button>' +
      '<div class="combobox-dropdown">' +
        '<div class="combobox-item" data-value="Apple">Apple</div>' +
        '<div class="combobox-item" data-value="Banana">Banana</div>' +
        '<div class="combobox-item" data-value="Cherry">Cherry</div>' +
      '</div>' +
    '</div>'
  );

  var container = fix.querySelector('[data-dcs-component="combobox"]');
  window.DCS._init(container);

  var input = fix.querySelector('.combobox-input');
  var dropdown = fix.querySelector('.combobox-dropdown');
  var clearBtn = fix.querySelector('.combobox-clear-btn');
  var items = fix.querySelectorAll('.combobox-item');

  // Initial state & ARIA wiring
  T.assertOk(container.hasAttribute('data-dcs-initialized'), 'combobox is initialized');
  T.assertAttr(input, 'role', 'combobox', 'input has role="combobox"');
  T.assertAttr(dropdown, 'role', 'listbox', 'dropdown has role="listbox"');
  T.assertAttr(input, 'aria-expanded', 'false', 'starts aria-expanded="false"');
  T.assertAttr(input, 'aria-controls', dropdown.id, 'aria-controls matches dropdown id');
  T.assertAttr(items[0], 'role', 'option', 'item has role="option"');

  // Focus opens combobox
  input.focus();
  T.assertHasClass(container, 'open', 'focusing input opens container');
  T.assertAttr(input, 'aria-expanded', 'true', 'aria-expanded="true" on focus');

  // ArrowDown highlights first item
  T.keydown(input, 'ArrowDown');
  T.assertHasClass(items[0], 'kbd-active', 'ArrowDown highlights first item with kbd-active');
  T.assertAttr(items[0], 'aria-selected', 'true', 'highlighted item has aria-selected="true"');
  T.assertAttr(input, 'aria-activedescendant', items[0].id, 'aria-activedescendant set to item id');

  // ArrowDown moves highlight to second item
  T.keydown(input, 'ArrowDown');
  T.assertHasClass(items[1], 'kbd-active', 'ArrowDown moves highlight to second item');

  // Enter selects highlighted item
  T.keydown(input, 'Enter');
  T.assertEqual(input.value, 'Banana', 'Enter selects Banana');
  T.assertNotHasClass(container, 'open', 'container closes on select');

  // Filtering: input event filters items
  input.blur();
  input.focus();
  input.value = 'Che';
  var evt = new Event('input', { bubbles: true });
  input.dispatchEvent(evt);

  T.assertEqual(items[0].style.display, 'none', 'Apple is hidden when searching Che');
  T.assertEqual(items[1].style.display, 'none', 'Banana is hidden when searching Che');
  T.assertEqual(items[2].style.display, '', 'Cherry remains visible');

  // Selection via click
  T.click(items[2]);
  T.assertEqual(input.value, 'Cherry', 'click selects Cherry');
  T.assertNotHasClass(container, 'open', 'container closes on click selection');

  // Clear button clears input and resets filter
  T.click(clearBtn);
  T.assertEqual(input.value, '', 'clear button clears input value');
  T.assertEqual(items[0].style.display, '', 'items reset filter after clear');

  // Escape closes combobox
  input.blur();
  input.focus();
  T.assertHasClass(container, 'open', 'container open after focus');
  T.keydown(input, 'Escape');
  T.assertNotHasClass(container, 'open', 'Escape closes container');

  // Click outside closes
  input.blur();
  input.focus();
  T.assertHasClass(container, 'open', 'container open before outside click');
  T.click(document.body);
  T.assertNotHasClass(container, 'open', 'outside click closes container');

  T.cleanup();
});
