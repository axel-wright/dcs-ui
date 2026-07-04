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

      function updateHeaderOffset() {
        if (hasCssOverride) {
          return;
        }
        var offset = 0;
        // Reject elements taller than 30% of the viewport — those are
        // sidebars, full-height panels, etc., not header nav bars.
        var maxHeaderHeight = Math.round(window.innerHeight * 0.3);
        var nodes = document.querySelectorAll('*');
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          var pos = window.getComputedStyle(node).position;
          if (pos !== 'fixed' && pos !== 'sticky') {
            continue;
          }
          var rect = node.getBoundingClientRect();
          var height = rect.bottom - rect.top;
          if (height > maxHeaderHeight) {
            continue; // too tall to be a header
          }
          if (rect.top < 10 && rect.bottom > 0 && rect.bottom > offset) {
            offset = rect.bottom;
          }
        }
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

      function open() {
        overlay.classList.add('open');
      }

      function close() {
        overlay.classList.remove('open');
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
