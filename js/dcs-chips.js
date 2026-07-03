'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-chips.js could not register the chips component.');
} else {
  window.DCS.register('chips', {
    init: function(el) {
      // el is the chips container [data-dcs-component="chips"]
      var input = el.querySelector('[data-chip-input]');

      // Remove a chip when its close button is clicked
      el.addEventListener('click', function(e) {
        var close = e.target.closest('.chip-close');
        if (!close) {
          return;
        }
        var chip = close.closest('.chip');
        if (chip && chip.parentNode) {
          chip.parentNode.removeChild(chip);
        }
      });

      if (!input) {
        return;
      }

      // Create a new chip on Enter
      input.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter') {
          return;
        }
        e.preventDefault();
        var value = input.value.trim();
        if (!value) {
          return;
        }

        var chip = document.createElement('div');
        chip.className = 'chip';

        var text = document.createElement('span');
        text.textContent = value;

        var close = document.createElement('span');
        close.className = 'chip-close';
        close.innerHTML = '&times;';

        chip.appendChild(text);
        chip.appendChild(close);

        el.insertBefore(chip, input);
        input.value = '';
      });
    }
  });
}
