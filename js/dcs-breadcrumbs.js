'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('breadcrumbs', {
    init: function(el) {
      el.addEventListener('click', function(e) {
        var link = e.target.closest('.breadcrumb-link');
        if (!link) return;

        var dest = link.getAttribute('title') || link.textContent || link.innerText || '';
        dest = dest.trim();
        if (dest.indexOf('🏠') === 0) {
          dest = dest.replace('🏠', '').trim();
        }

        if (window.DCS._showToast) {
          window.DCS._showToast('NAVIGATING: ' + dest, 'info');
        } else if (window._showToast) {
          window.DCS._showToast('NAVIGATING: ' + dest, 'info');
        }
      });
    }
  });
}
