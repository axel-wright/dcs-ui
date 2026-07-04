'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-stepper.js could not register the stepper component.');
} else {
  window.DCS.register('stepper', {
    init: function(el) {
      // el is the stepper wrapper [data-dcs-component="stepper"]
      var steps = el.querySelectorAll('[data-stepper-step]');
      var content = el.querySelector('[data-stepper-content]');
      var backBtn = el.querySelector('[data-stepper-back]');
      var nextBtn = el.querySelector('[data-stepper-next]');
      if (!steps.length || !content || !backBtn || !nextBtn) {
        return;
      }

      var total = steps.length;

      // Make step indicators keyboard-focusable so they can be activated like
      // buttons (matching the existing click-to-jump behavior).
      for (var si = 0; si < steps.length; si++) {
        if (!steps[si].getAttribute('role')) steps[si].setAttribute('role', 'button');
        if (!steps[si].hasAttribute('tabindex')) steps[si].setAttribute('tabindex', '0');
      }

      // Determine the starting step from the .active class (defaults to 1)
      var current = 1;
      for (var i = 0; i < steps.length; i++) {
        if (steps[i].classList.contains('active')) {
          current = parseInt(steps[i].getAttribute('data-stepper-step'), 10) || 1;
          break;
        }
      }

      function render() {
        for (var i = 0; i < steps.length; i++) {
          var step = steps[i];
          var num = parseInt(step.getAttribute('data-stepper-step'), 10);
          var circle = step.querySelector('.stepper-circle');
          var label = step.querySelector('.stepper-label');

          step.classList.remove('completed', 'active');
          if (circle) {
            circle.classList.remove('completed', 'active', 'upcoming');
          }
          if (label) {
            label.classList.remove('completed', 'active', 'upcoming');
          }

          var state;
          if (num < current) {
            state = 'completed';
          } else if (num === current) {
            state = 'active';
          } else {
            state = 'upcoming';
          }

          // aria-current marks the step the user is on.
          if (state === 'active') {
            step.setAttribute('aria-current', 'step');
          } else {
            step.removeAttribute('aria-current');
          }

          if (state === 'completed') {
            step.classList.add('completed');
            if (circle) {
              circle.classList.add('completed');
              circle.textContent = '✓';
            }
            if (label) {
              label.classList.add('completed');
            }
          } else if (state === 'active') {
            step.classList.add('active');
            if (circle) {
              circle.classList.add('active');
              circle.textContent = num;
            }
            if (label) {
              label.classList.add('active');
            }
          } else {
            if (circle) {
              circle.classList.add('upcoming');
              circle.textContent = num;
            }
            if (label) {
              label.classList.add('upcoming');
            }
          }
        }

        backBtn.disabled = current <= 1;
        nextBtn.textContent = current >= total ? 'Finish' : 'Next Step →';
      }

      // Allow jumping to a step by clicking its indicator or circle.
      // Only completed steps (num < current) or the immediate next step
      // (current + 1) are reachable.
      el.addEventListener('click', function(e) {
        var stepEl = e.target.closest('.stepper-step');
        if (!stepEl || !el.contains(stepEl)) {
          return;
        }
        var num = parseInt(stepEl.getAttribute('data-stepper-step'), 10);
        if (!num) {
          return;
        }
        if (num < current || num === current + 1) {
          current = num;
          render();
        }
      });

      // Enter/Space activates a focused step indicator (same reachability
      // rules as clicking).
      el.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var stepEl = e.target.closest('.stepper-step');
        if (!stepEl || !el.contains(stepEl)) return;
        var num = parseInt(stepEl.getAttribute('data-stepper-step'), 10);
        if (!num) return;
        e.preventDefault();
        if (num < current || num === current + 1) {
          current = num;
          render();
        }
      });

      backBtn.addEventListener('click', function() {
        if (current > 1) {
          current--;
          render();
        }
      });

      nextBtn.addEventListener('click', function() {
        if (current < total) {
          current++;
          render();
        }
      });

      render();
    }
  });
}
