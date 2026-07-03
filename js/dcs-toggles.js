'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('toggles', {
    init: function(el) {
      el.addEventListener('change', function(e) {
        var input = e.target.closest('input[type="checkbox"]');
        if (!input) return;

        var labelSpan = input.parentNode.querySelector('.toggle-switch-text');
        var elementName = labelSpan ? labelSpan.textContent.trim() : 'Switch';

        var stateStr = input.checked ? 'ENABLED' : 'DISABLED';
        var type = input.checked ? 'success' : 'warning';

        if (window.DCS._showToast) {
          window.DCS._showToast(elementName.toUpperCase() + ': Switched to ' + stateStr, type);
        } else if (window._showToast) {
          window.DCS._showToast(elementName.toUpperCase() + ': Switched to ' + stateStr, type);
        }

        var badge = input.parentNode.querySelector('.toggle-badge');
        if (badge) {
          badge.textContent = stateStr;
          if (input.checked) {
            badge.className = 'toggle-badge active';
          } else {
            badge.className = 'toggle-badge';
          }
        }
      });
    }
  });
}
