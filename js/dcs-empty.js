'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  var EMPTY_ERROR_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="10"></circle>' +
    '<line x1="15" y1="9" x2="9" y2="15"></line>' +
    '<line x1="9" y1="9" x2="15" y2="15"></line>' +
    '</svg>';

  window.DCS.register('empty', {
    init: function(el) {
      // Error state: render an error icon and, when requested, a Retry button.
      // Leaves the "no data" / "no results" states untouched.
      if (el.getAttribute('data-empty-state') === 'error') {
        el.classList.add('dcs-empty--error');

        if (!el.querySelector('.dcs-empty-icon')) {
          var icon = document.createElement('div');
          icon.className = 'empty-state-icon dcs-empty-icon';
          icon.innerHTML = EMPTY_ERROR_ICON;
          el.insertBefore(icon, el.firstChild);
        }

        if (el.getAttribute('data-empty-retry') === 'true' &&
            !el.querySelector('.dcs-empty-retry')) {
          var retry = document.createElement('button');
          retry.type = 'button';
          retry.className = 'btn-outline dcs-empty-retry';
          retry.textContent = 'Retry';
          retry.addEventListener('click', function() {
            el.dispatchEvent(new CustomEvent('dcs-empty-retry', { bubbles: true }));
          });
          el.appendChild(retry);
        }
      }

      el.addEventListener('click', function(e) {
        var action = e.target.closest('.empty-action');
        if (!action) return;

        e.preventDefault();
        var msg = action.getAttribute('data-toast-msg') || 'Action triggered';
        var type = action.getAttribute('data-toast-type') || 'info';

        if (window.DCS._showToast) {
          window.DCS._showToast(msg, type);
        } else if (window._showToast) {
          window._showToast(msg, type);
        }
      });
    }
  });
}
