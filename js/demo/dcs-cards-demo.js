'use strict';
document.addEventListener('click', function(e) {
  var card = e.target.closest('.card-interactive');
  if (!card) return;
  if (window.DCS && window.DCS._showToast) {
    window.DCS._showToast('Calibration Swiped / Hover Active', 'info');
  }
});
