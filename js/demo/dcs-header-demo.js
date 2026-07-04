'use strict';
document.addEventListener('click', function(e) {
  var dot = e.target.closest('.header-status-dot');
  if (!dot) return;
  var isGreen = dot.classList.contains('pulse-green');
  if (isGreen) {
    dot.classList.remove('pulse-green');
    dot.classList.add('pulse-amber');
    if (window.DCS && window.DCS._showToast) {
      window.DCS._showToast('STATUS CHANGED TO: WARNING / PENDING', 'warning');
    }
  } else {
    dot.classList.remove('pulse-amber');
    dot.classList.add('pulse-green');
    if (window.DCS && window.DCS._showToast) {
      window.DCS._showToast('STATUS CHANGED TO: ONLINE / ACTIVE', 'success');
    }
  }
});
