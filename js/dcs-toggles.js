'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('toggles', {
    init: function(el) {
      // Expose each checkbox-backed switch as role="switch" with a synced
      // aria-checked so assistive tech announces on/off rather than checked.
      var switches = el.querySelectorAll('input[type="checkbox"]');
      for (var s = 0; s < switches.length; s++) {
        switches[s].setAttribute('role', 'switch');
        switches[s].setAttribute('aria-checked', switches[s].checked ? 'true' : 'false');
      }

      el.addEventListener('change', function(e) {
        var input = e.target.closest('input[type="checkbox"]');
        if (!input) return;

        input.setAttribute('aria-checked', input.checked ? 'true' : 'false');

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
