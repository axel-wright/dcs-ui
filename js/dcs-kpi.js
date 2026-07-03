'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('kpi', {
    init: function(el) {
      el.addEventListener('click', function(e) {
        var card = e.target.closest('.kpi-card');
        if (!card) return;

        card.classList.toggle('expanded');

        var labelEl = card.querySelector('.kpi-label');
        var label = labelEl ? labelEl.textContent.trim() : 'KPI Card';

        if (window.DCS._showToast) {
          window.DCS._showToast('Metric expanded: ' + label, 'info');
        } else if (window._showToast) {
          window.DCS._showToast('Metric expanded: ' + label, 'info');
        }
      });
    }
  });
}
