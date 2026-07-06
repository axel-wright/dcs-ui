'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('bottom-sheet', {
    init: function(el) {
      el.addEventListener('click', function(e) {
        if (e.target.closest('[data-action="sheet-open"]')) {
          el.classList.add('open');
          return;
        }
        if (e.target.closest('[data-action="sheet-close"]')) {
          el.classList.remove('open');
          return;
        }
      });
    }
  });
}
