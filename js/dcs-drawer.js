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
