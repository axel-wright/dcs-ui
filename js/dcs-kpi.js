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
      });
    }
  });
}
