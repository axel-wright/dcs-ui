// Tests for DCS Drawer component
DCS_TEST.suite('drawer', function() {
  var T = DCS_TEST;

  // ── Setup ──────────────────────────────────────────────
  // The drawer component has two parts: the trigger area and the overlay.
  // The overlay lives outside the trigger for real-world positioning reasons.
  var fix = T.fixture(
    '<div>' +
      '<div data-dcs-component="drawer">' +
        '<button data-action="drawer-open" data-drawer="test-drawer">Open Drawer</button>' +
      '</div>' +
      '<div class="drawer-overlay" data-drawer="test-drawer">' +
        '<div class="drawer-panel">' +
          '<div class="drawer-header">' +
            '<h3>Drawer Title</h3>' +
            '<button data-action="drawer-close">Close</button>' +
          '</div>' +
          '<div class="drawer-body">Drawer content</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  // Init the component
  var container = fix.querySelector('[data-dcs-component="drawer"]');
  window.DCS._init(container);

  var overlay = fix.querySelector('.drawer-overlay');
  var openBtn = fix.querySelector('[data-action="drawer-open"]');
  var closeBtn = fix.querySelector('[data-action="drawer-close"]');

  // ── Tests ──────────────────────────────────────────────
  T.assertNotOk(overlay.classList.contains('open'), 'drawer starts closed');

  // Open
  T.click(openBtn);
  T.assertOk(overlay.classList.contains('open'), 'drawer opens via data-action="drawer-open"');

  // Close via close button
  T.click(closeBtn);
  T.assertNotOk(overlay.classList.contains('open'), 'drawer closes via data-action="drawer-close"');

  // Re-open for Escape test
  T.click(openBtn);
  T.assertOk(overlay.classList.contains('open'), 'drawer re-opens for Escape test');

  // Escape key closes
  T.keydown(document, 'Escape');
  T.assertNotOk(overlay.classList.contains('open'), 'drawer closes via Escape key');

  T.cleanup();
});
