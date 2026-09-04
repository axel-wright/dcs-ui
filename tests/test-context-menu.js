// Tests for DCS Context Menu component
DCS_TEST.suite('context-menu', function() {
  var T = DCS_TEST;

  var fix = T.fixture(
    '<div>' +
      '<div data-dcs-component="context-menu" id="trigger-card">Right click here</div>' +
      '<div data-context-menu class="context-menu-dropdown">' +
        '<div class="context-menu-item" data-context-action="copy">Copy</div>' +
        '<div class="context-menu-item" data-context-action="paste">Paste</div>' +
        '<div class="context-menu-item" data-context-action="delete">Delete</div>' +
      '</div>' +
    '</div>'
  );

  var container = fix.querySelector('[data-dcs-component="context-menu"]');
  window.DCS._init(container);

  var menu = fix.querySelector('[data-context-menu]');
  var items = fix.querySelectorAll('.context-menu-item');

  // Initial state & ARIA
  T.assertOk(container.hasAttribute('data-dcs-initialized'), 'context-menu initialized');
  T.assertAttr(menu, 'role', 'menu', 'menu has role="menu"');
  T.assertAttr(menu, 'tabindex', '-1', 'menu has tabindex="-1"');
  T.assertAttr(items[0], 'role', 'menuitem', 'item has role="menuitem"');
  T.assertNotHasClass(menu, 'open', 'menu starts closed');

  // Right-click (contextmenu event) opens menu
  var ctxEvent = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    clientX: 100,
    clientY: 150
  });
  container.dispatchEvent(ctxEvent);

  T.assertHasClass(menu, 'open', 'menu opens on right-click');
  T.assertEqual(menu.style.left, '100px', 'menu left set to clientX');
  T.assertEqual(menu.style.top, '150px', 'menu top set to clientY');

  // Keyboard navigation on open menu: ArrowDown moves focus
  items[0].focus();
  T.keydown(document, 'ArrowDown');
  T.assertOk(document.activeElement === items[1], 'ArrowDown moves focus to second item');

  // ArrowUp moves focus back
  T.keydown(document, 'ArrowUp');
  T.assertOk(document.activeElement === items[0], 'ArrowUp moves focus back to first item');

  // Home moves to first item
  items[1].focus();
  T.keydown(document, 'Home');
  T.assertOk(document.activeElement === items[0], 'Home moves focus to first item');

  // End moves to last item
  T.keydown(document, 'End');
  T.assertOk(document.activeElement === items[2], 'End moves focus to last item');

  // Enter triggers action and closes menu
  T.keydown(document, 'Enter');
  T.assertNotHasClass(menu, 'open', 'Enter activates item and closes menu');

  // Click action closes menu
  container.dispatchEvent(ctxEvent); // reopen
  T.assertHasClass(menu, 'open', 'menu re-opened');
  T.click(items[0]);
  T.assertNotHasClass(menu, 'open', 'click action closes menu');

  // Escape closes menu
  container.dispatchEvent(ctxEvent); // reopen
  T.assertHasClass(menu, 'open', 'menu re-opened for Escape test');
  T.keydown(document, 'Escape');
  T.assertNotHasClass(menu, 'open', 'Escape closes menu');

  // Outside click closes menu
  container.dispatchEvent(ctxEvent); // reopen
  T.assertHasClass(menu, 'open', 'menu re-opened for outside click test');
  T.click(document.body);
  T.assertNotHasClass(menu, 'open', 'outside click closes menu');

  T.cleanup();
});
