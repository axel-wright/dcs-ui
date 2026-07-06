'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-radio.js could not register the radio-group component.');
} else {
  window.DCS.register('radio-group', {
    init: function(el) {
      // A group may share a `name` across sibling containers (segmented
      // layouts). When data-radio-name is present, gather every matching
      // input; otherwise fall back to the inputs inside this container.
      var name = el.getAttribute('data-radio-name');
      var inputs;
      if (name) {
        inputs = Array.prototype.slice.call(
          el.querySelectorAll('input[type="radio"][name="' + name + '"]')
        );
      } else {
        inputs = Array.prototype.slice.call(el.querySelectorAll('input[type="radio"]'));
      }
      if (!inputs.length) return;

      function labelFor(input) {
        var label = input.closest ? input.closest('.dcs-radio') : null;
        var text = label ? label.querySelector('.dcs-radio-label') : null;
        return text ? text.textContent.trim() : input.value;
      }

      function emit(input) {
        el.dispatchEvent(new CustomEvent('dcs-radio-change', {
          bubbles: true,
          detail: { value: input.value, label: labelFor(input), input: input }
        }));
      }

      function focusByOffset(current, delta) {
        var idx = inputs.indexOf(current);
        if (idx === -1) return;
        var next = inputs[(idx + delta + inputs.length) % inputs.length];
        if (next.disabled) return;
        next.checked = true;
        next.focus();
        emit(next);
      }

      el.addEventListener('change', function(e) {
        var input = e.target;
        if (input && input.type === 'radio' && inputs.indexOf(input) !== -1) {
          emit(input);
        }
      });

      el.addEventListener('keydown', function(e) {
        var input = e.target;
        if (!input || input.type !== 'radio' || inputs.indexOf(input) === -1) return;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          focusByOffset(input, 1);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          focusByOffset(input, -1);
        }
      });
    }
  });
}
