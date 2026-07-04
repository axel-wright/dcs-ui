'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-drawer.js could not register the drawer component.');
} else {
  window.DCS.register('drawer', {
    init: function(el) {
      // el is the trigger area [data-dcs-component="drawer"]. The drawer
      // overlay lives outside the main content, so it is located via document
      // (there is only one).
      var trigger = el.querySelector('[data-action="drawer-open"]');
      if (!trigger) {
        return;
      }

      var drawerId = trigger.getAttribute('data-drawer');
      var overlay = drawerId
        ? document.querySelector('.drawer-overlay[data-drawer="' + drawerId + '"]')
        : document.querySelector('.drawer-overlay');
      if (!overlay) {
        return;
      }

      // Position the drawer/backdrop below any fixed/sticky header at the top
      // of the viewport. A CSS override on the overlay takes priority; only
      // auto-detect when --dcs-header-height has not been set explicitly.
      // Captured once at init so our own inline writes don't look like an
      // override on later resize recalculations.
      var hasCssOverride = overlay.style.getPropertyValue('--dcs-header-height').trim() !== '';

      // The header node is located once (via a single DOM scan) and cached, so
      // that resize handling only re-measures that one element instead of
      // walking every node in the document again.
      var headerEl = null;

      function isHeaderCandidate(node) {
        // Reject elements taller than 30% of the viewport — those are
        // sidebars, full-height panels, etc., not header nav bars.
        var maxHeaderHeight = Math.round(window.innerHeight * 0.3);
        var pos = window.getComputedStyle(node).position;
        if (pos !== 'fixed' && pos !== 'sticky') {
          return false;
        }
        var rect = node.getBoundingClientRect();
        var height = rect.bottom - rect.top;
        if (height > maxHeaderHeight) {
          return false; // too tall to be a header
        }
        return rect.top < 10 && rect.bottom > 0;
      }

      // Find the fixed/sticky element pinned to the top of the viewport whose
      // bottom edge sits lowest — that is the header we offset below.
      function findHeaderEl() {
        var best = null;
        var bestBottom = 0;
        var nodes = document.querySelectorAll('*');
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          if (!isHeaderCandidate(node)) {
            continue;
          }
          var bottom = node.getBoundingClientRect().bottom;
          if (bottom > bestBottom) {
            best = node;
            bestBottom = bottom;
          }
        }
        return best;
      }

      function updateHeaderOffset() {
        if (hasCssOverride) {
          return;
        }
        // Re-scan only when we have no cached header or the cached one is no
        // longer a valid top-pinned header (e.g. it changed at a breakpoint).
        if (!headerEl || !document.contains(headerEl) || !isHeaderCandidate(headerEl)) {
          headerEl = findHeaderEl();
        }
        var offset = headerEl ? headerEl.getBoundingClientRect().bottom : 0;
        overlay.style.setProperty('--dcs-header-height', offset + 'px');
      }

      updateHeaderOffset();

      // Recalculate on resize (debounced) in case the header height changes at
      // mobile breakpoints.
      var resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateHeaderOffset, 150);
      });

      // The focusable dialog is the panel; trap focus within it while open.
      var panel = overlay.querySelector('.drawer-panel') || overlay;
      var release = null;

      function open() {
        overlay.classList.add('open');
        release = window.DCS._trapFocus(panel);
      }

      function close() {
        overlay.classList.remove('open');
        if (release) { release(); release = null; }
      }

      trigger.addEventListener('click', function() {
        open();
      });

      // Backdrop, close button, and footer actions inside the overlay
      overlay.addEventListener('click', function(e) {
        var closer = e.target.closest('[data-action="drawer-close"]');
        if (closer) {
          close();
          return;
        }

        var toastClose = e.target.closest('[data-action="drawer-toast-close"]');
        if (toastClose) {
          var msg = toastClose.getAttribute('data-toast-msg') || '';
          var type = toastClose.getAttribute('data-toast-type') || 'info';
          if (msg && window.DCS._showToast) {
            window.DCS._showToast(msg, type);
          }
          close();
        }
      });

      // Escape closes the drawer when open
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
          close();
        }
      });
    }
  });
}
