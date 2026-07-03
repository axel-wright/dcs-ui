'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('alerts', {
    init: function(el) {
      // el wraps both the banner stack and the "Restore All Banners" button.
      el.addEventListener('click', function(e) {
        // ── Restore all dismissed banners ──────────────────
        var restoreBtn = e.target.closest('[data-action="restore-alerts"]');
        if (restoreBtn) {
          var banners = el.querySelectorAll('.alert-banner');
          for (var i = 0; i < banners.length; i++) {
            if (banners[i].style.display === 'none') {
              banners[i].style.display = '';
              banners[i].classList.remove('dismissing');
            }
          }
          if (window.DCS._showToast) {
            window.DCS._showToast('All banners restored', 'info');
          }
          return;
        }

        // ── Dismiss a single banner ────────────────────────
        var dismissBtn = e.target.closest('.alert-dismiss') || e.target.closest('.alert-banner-dismiss');
        if (!dismissBtn) return;

        var banner = dismissBtn.closest('.alert-banner');
        if (!banner) return;

        banner.classList.add('dismissing');
        setTimeout(function() {
          banner.style.display = 'none';
        }, 360);

        if (window.DCS._showToast) {
          window.DCS._showToast('Alert dismissed', 'info');
        }
      });
    }
  });
}
