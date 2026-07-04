'use strict';
document.addEventListener('click', function(e) {
  var btn = e.target.closest('[data-action="confirm-delete"]');
  if (!btn) return;
  if (window.DCS && window.DCS._showToast) {
    window.DCS._showToast('G-CODE ACTION: Profile successfully purged.', 'error');
  }
});
