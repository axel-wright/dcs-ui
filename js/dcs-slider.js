'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('slider', {
    init: function(el) {
      var slider = el.querySelector('.range-slider');
      if (slider) {
        // Native <input type="range"> already exposes role="slider" plus
        // aria-valuemin/max/now. Give it an accessible name from the visible
        // label if it doesn't already have one.
        if (!slider.getAttribute('aria-label') && !slider.getAttribute('aria-labelledby')) {
          var lbl = el.querySelector('.slider-label');
          if (lbl) slider.setAttribute('aria-label', lbl.textContent.trim());
        }

        var updateSlider = function() {
          var min = parseFloat(slider.getAttribute('min')) || 0;
          var max = parseFloat(slider.getAttribute('max')) || 100;
          var val = parseFloat(slider.value);
          var pct = ((val - min) / (max - min)) * 100;

          // Announce the human-friendly percentage value.
          slider.setAttribute('aria-valuetext', val + '%');

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

      // Jog buttons are <div>s acting as a single-select control. Expose them
      // as a radiogroup so keyboard + screen-reader users can operate them.
      var jogBtns = el.querySelectorAll('.jog-btn');
      if (jogBtns.length) {
        var jogGroup = jogBtns[0].parentNode;
        if (jogGroup) jogGroup.setAttribute('role', 'radiogroup');
        for (var jb = 0; jb < jogBtns.length; jb++) {
          var active = jogBtns[jb].classList.contains('active');
          jogBtns[jb].setAttribute('role', 'radio');
          jogBtns[jb].setAttribute('aria-checked', active ? 'true' : 'false');
          jogBtns[jb].setAttribute('tabindex', active ? '0' : '-1');
        }
      }

      function selectJog(btn) {
        var allBtns = el.querySelectorAll('.jog-btn');
        for (var i = 0; i < allBtns.length; i++) {
          allBtns[i].classList.remove('active');
          allBtns[i].setAttribute('aria-checked', 'false');
          allBtns[i].setAttribute('tabindex', '-1');
        }
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        btn.setAttribute('tabindex', '0');

        var display = el.querySelector('.jog-display');
        if (display) {
          var val = btn.getAttribute('data-jog') || '';
          display.textContent = 'Active: ' + val;
        }
      }

      el.addEventListener('click', function(e) {
        var btn = e.target.closest('.jog-btn');
        if (!btn) return;
        selectJog(btn);
      });

      // Keyboard: arrows move between jog notches, Enter/Space activates.
      el.addEventListener('keydown', function(e) {
        var btn = e.target.closest('.jog-btn');
        if (!btn) return;
        var all = el.querySelectorAll('.jog-btn');
        var list = Array.prototype.slice.call(all);
        var idx = list.indexOf(btn);
        if (idx === -1) return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          var nx = list[(idx + 1) % list.length];
          selectJog(nx); nx.focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          var pv = list[(idx - 1 + list.length) % list.length];
          selectJog(pv); pv.focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectJog(btn);
        }
      });
    }
  });
}
