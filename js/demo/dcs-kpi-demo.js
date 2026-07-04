'use strict';
// Demo enhancement: show toast when KPI cards are clicked
document.addEventListener('click', function(e) {
  var card = e.target.closest('.kpi-card');
  if (!card) return;
  var labelEl = card.querySelector('.kpi-label');
  var label = labelEl ? labelEl.textContent.trim() : 'KPI Card';
  if (window.DCS && window.DCS._showToast) {
    window.DCS._showToast('Metric expanded: ' + label, 'info');
  }
});
