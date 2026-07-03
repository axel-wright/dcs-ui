'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('empty', {
    init: function(el) {
      el.addEventListener('click', function(e) {
        var action = e.target.closest('.empty-action');
        if (!action) return;

        e.preventDefault();
        var msg = action.getAttribute('data-toast-msg') || 'Action triggered';
        var type = action.getAttribute('data-toast-type') || 'info';

        if (window.DCS._showToast) {
          window.DCS._showToast(msg, type);
        } else if (window._showToast) {
          window.DCS._showToast(msg, type);
        }
      });
    }
  });
}
