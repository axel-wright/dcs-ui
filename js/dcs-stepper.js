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
      var stepContent = {
        1: 'Select your workpiece material from the dropdown.',
        2: 'Load your G-code toolpath file for machining.',
        3: 'Jog the machine to your zero point and set origin.',
        4: 'Review settings and confirm to begin the job run.'
      };

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

        content.textContent = stepContent[current] || '';

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
        } else if (window.DCS._showToast) {
          window.DCS._showToast('Job setup complete — starting run.', 'success');
        }
      });

      render();
    }
  });
}
