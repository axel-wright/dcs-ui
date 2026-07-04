'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('search', {
    init: function(el) {
      var input = el.querySelector('.dcs-search-input');
      var clear = el.querySelector('.dcs-search-clear');
      if (!input) return;

      // Expose the search landmark + name the input for screen readers.
      if (!el.getAttribute('role')) el.setAttribute('role', 'search');
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        input.setAttribute('aria-label', input.getAttribute('placeholder') || 'Search');
      }

      function sync() {
        if (input.value.length > 0) {
          el.classList.add('has-value');
        } else {
          el.classList.remove('has-value');
        }
      }

      input.addEventListener('input', sync);
      sync();

      if (clear) {
        clear.addEventListener('click', function() {
          input.value = '';
          sync();
          input.focus();
        });
      }
    }
  });
}
