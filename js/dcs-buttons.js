'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('buttons', {
    init: function(el) {
      el.addEventListener('click', function(e) {
        var btn = e.target.closest('.btn');
        if (!btn || btn.hasAttribute('disabled')) return;

        var label = btn.textContent.trim();

        if (window.DCS.triggerButtonToast) {
          var type = 'info';
          if (label === 'Start Job') {
            type = 'success';
          } else if (label === 'Export G-Code') {
            type = 'info';
          } else if (label === 'Cancel') {
            type = 'warning';
          }
          window.DCS.triggerButtonToast(label, type);
        } else if (window.DCS._showToast) {
          window.DCS._showToast('Action Triggered: ' + label, 'info');
        } else if (window._showToast) {
          window.DCS._showToast('Action Triggered: ' + label, 'info');
        }
      });
    }
  });
}
