'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('inputs', {
    init: function(el) {
      var updateCalcFeed = function(container) {
        var getVal = function(key) {
          var input = container.querySelector('[data-calc-input="' + key + '"]');
          return input ? parseFloat(input.value) || 0 : 0;
        };
        var rpm = getVal('rpm');
        var flutes = getVal('flutes');
        var chipload = getVal('chipload');

        var feedrate = Math.round(rpm * flutes * chipload);
        var resultLabel = container.querySelector('[data-calc-output]');
        if (resultLabel) {
          resultLabel.innerHTML = feedrate + ' <span style="font-size: var(--type-sm); color: var(--text-secondary);">IPM</span>';
        }
      };

      el.addEventListener('input', function(e) {
        var input = e.target.closest('[data-calc-input]');
        if (input) {
          var container = input.closest('.calc-container');
          if (container) {
            updateCalcFeed(container);
          }
        }
      });

      var calcContainer = el.querySelector('.calc-container');
      if (calcContainer) {
        updateCalcFeed(calcContainer);
      }
    }
  });
}
