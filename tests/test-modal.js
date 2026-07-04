// Tests for DCS Modal component
DCS_TEST.suite('modal', function() {
  var T = DCS_TEST;

  // ── Setup ──────────────────────────────────────────────
  var fix = T.fixture(
    '<div data-dcs-component="modal">' +
      '<button data-action="modal-open" data-modal="test-modal">Open</button>' +
      '<div class="modal-overlay" data-modal-name="test-modal">' +
        '<div class="modal-box" role="dialog" aria-modal="true">' +
          '<div class="modal-title">Test Modal</div>' +
          '<div class="modal-body">Content</div>' +
          '<div class="modal-footer">' +
            '<button data-action="modal-close">Close</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  // Init the component
  var container = fix.querySelector('[data-dcs-component="modal"]');
  window.DCS._init(container);

  var overlay = fix.querySelector('.modal-overlay');
  var openBtn = fix.querySelector('[data-action="modal-open"]');
  var closeBtn = fix.querySelector('[data-action="modal-close"]');

  // ── Tests ──────────────────────────────────────────────
  T.assertNotOk(overlay.classList.contains('open'), 'modal starts closed');

  // Open via action button
  T.click(openBtn);
  T.assertOk(overlay.classList.contains('open'), 'modal opens via data-action="modal-open"');
  T.assertAttr(overlay.querySelector('.modal-box'), 'role', 'dialog', 'modal-box has role="dialog"');
  T.assertAttr(overlay.querySelector('.modal-box'), 'aria-modal', 'true', 'modal-box has aria-modal="true"');

  // ARIA labelledby should be linked to title
  var labelledby = overlay.querySelector('.modal-box').getAttribute('aria-labelledby');
  var titleEl = overlay.querySelector('.modal-title');
  T.assertOk(labelledby && titleEl && labelledby === titleEl.id, 'aria-labelledby links to modal-title');

  // Close via close button
  T.click(closeBtn);
  T.assertNotOk(overlay.classList.contains('open'), 'modal closes via data-action="modal-close"');

  // Open via action button again for backdrop test
  T.click(openBtn);
  T.assertOk(overlay.classList.contains('open'), 'modal re-opens');

  // Close via backdrop click
  T.click(overlay);
  T.assertNotOk(overlay.classList.contains('open'), 'modal closes via backdrop click');

  // Escape key closes
  T.click(openBtn);
  T.assertOk(overlay.classList.contains('open'), 'modal opens for Escape test');
  T.keydown(document, 'Escape');
  T.assertNotOk(overlay.classList.contains('open'), 'modal closes via Escape key');

  T.cleanup();
});
