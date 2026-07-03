'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('toasts', {
    init: function(el) {
      el.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action="show-toast"]');
        if (!btn) return;

        var msg = btn.getAttribute('data-toast-msg');
        var type = btn.getAttribute('data-toast-type') || 'info';

        if (window.DCS._showToast) {
          window.DCS._showToast(msg, type);
        } else {
          console.warn('DCS toast function not found', msg, type);
        }
      });
    }
  });
}
