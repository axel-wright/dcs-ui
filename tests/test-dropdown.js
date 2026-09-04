// Tests for DCS Dropdown component
DCS_TEST.suite('dropdown', function() {
  var T = DCS_TEST;

  var fix = T.fixture(
    '<div data-dcs-component="dropdown">' +
      '<button data-dropdown-trigger aria-expanded="false">' +
        '<span data-dropdown-label>Select</span>' +
      '</button>' +
      '<div data-dropdown-panel>' +
        '<div class="dropdown-option" data-value="Opt 1">Opt 1</div>' +
        '<div class="dropdown-option" data-value="Opt 2">Opt 2</div>' +
        '<div class="dropdown-option" data-value="Opt 3">Opt 3</div>' +
      '</div>' +
    '</div>'
  );

  var container = fix.querySelector('[data-dcs-component="dropdown"]');
  window.DCS._init(container);

  var trigger = fix.querySelector('[data-dropdown-trigger]');
  var panel = fix.querySelector('[data-dropdown-panel]');
  var label = fix.querySelector('[data-dropdown-label]');
  var opts = fix.querySelectorAll('.dropdown-option');

  // Initial state
  T.assertOk(container.hasAttribute('data-dcs-initialized'), 'dropdown is initialized');
  T.assertNotHasClass(panel, 'open', 'panel starts closed');
  T.assertAttr(trigger, 'aria-expanded', 'false', 'trigger starts aria-expanded="false"');

  // Open via click
  T.click(trigger);
  T.assertHasClass(panel, 'open', 'panel opens on trigger click');
  T.assertHasClass(trigger, 'open', 'trigger has class open when expanded');
  T.assertAttr(trigger, 'aria-expanded', 'true', 'trigger aria-expanded="true" when open');

  // Close via click
  T.click(trigger);
  T.assertNotHasClass(panel, 'open', 'panel closes on second click');
  T.assertAttr(trigger, 'aria-expanded', 'false', 'trigger aria-expanded="false" when closed');

  // ArrowDown on trigger opens panel and focuses selected/first option
  T.keydown(trigger, 'ArrowDown');
  T.assertHasClass(panel, 'open', 'ArrowDown on trigger opens panel');

  // Keyboard navigation inside panel: ArrowDown
  T.keydown(opts[0], 'ArrowDown');
  T.assertOk(document.activeElement === opts[1], 'ArrowDown moves focus to second option');

  // Keyboard navigation inside panel: ArrowUp
  T.keydown(opts[1], 'ArrowUp');
  T.assertOk(document.activeElement === opts[0], 'ArrowUp moves focus back to first option');

  // Keyboard select via Enter
  T.keydown(opts[0], 'ArrowDown'); // move to opts[1]
  T.keydown(opts[1], 'Enter');
  T.assertHasClass(opts[1], 'selected', 'second option selected via Enter');
  T.assertAttr(opts[1], 'aria-selected', 'true', 'second option has aria-selected="true"');
  T.assertNotHasClass(panel, 'open', 'panel closes on selection');
  T.assertEqual(label.textContent, 'Opt 2', 'label text updated to selected value');

  // Select via click on option
  T.click(trigger); // reopen
  T.click(opts[2]);
  T.assertHasClass(opts[2], 'selected', 'third option selected via click');
  T.assertEqual(label.textContent, 'Opt 3', 'label updated to Opt 3');

  // Escape key closes
  T.click(trigger);
  T.assertHasClass(panel, 'open', 'panel re-opened');
  T.keydown(container, 'Escape');
  T.assertNotHasClass(panel, 'open', 'Escape closes panel');

  // Click outside closes panel
  T.click(trigger);
  T.assertHasClass(panel, 'open', 'panel re-opened for outside click test');
  T.click(document.body);
  T.assertNotHasClass(panel, 'open', 'clicking outside closes panel');

  T.cleanup();
});
