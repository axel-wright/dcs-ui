'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('slider', {
    init: function(el) {
      var slider = el.querySelector('.range-slider');
      if (slider) {
        var updateSlider = function() {
          var min = parseFloat(slider.getAttribute('min')) || 0;
          var max = parseFloat(slider.getAttribute('max')) || 100;
          var val = parseFloat(slider.value);
          var pct = ((val - min) / (max - min)) * 100;

          var fill = el.querySelector('.range-fill');
          if (fill) {
            fill.style.width = pct + '%';
          }

          var badge = el.querySelector('.range-badge');
          if (badge) {
            badge.textContent = val + '%';
          }

          var currentLabel = el.querySelector('.slider-current-label');
          if (currentLabel) {
            currentLabel.textContent = 'Current: ' + val + '%';
          }
        };

        slider.addEventListener('input', updateSlider);
        updateSlider();
      }

      el.addEventListener('click', function(e) {
        var btn = e.target.closest('.jog-btn');
        if (!btn) return;

        var allBtns = el.querySelectorAll('.jog-btn');
        for (var i = 0; i < allBtns.length; i++) {
          allBtns[i].classList.remove('active');
        }
        btn.classList.add('active');

        var display = el.querySelector('.jog-display');
        if (display) {
          var val = btn.getAttribute('data-jog') || '';
          display.textContent = 'Active: ' + val;
        }
      });
    }
  });
}
