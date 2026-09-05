'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('number', {
    init: function(el) {
      var input = el.querySelector('.number-input-field');
      var decBtn = el.querySelector('[data-action="decrement"]');
      var incBtn = el.querySelector('[data-action="increment"]');

      if (!input) return;

      function parseAttrFloat(attrName, fallback) {
        var val = el.getAttribute(attrName);
        if (val === null || val === '') return fallback;
        var parsed = parseFloat(val);
        return isNaN(parsed) ? fallback : parsed;
      }

      function getMin() {
        return parseAttrFloat('data-min', null);
      }

      function getMax() {
        return parseAttrFloat('data-max', null);
      }

      function getStep() {
        return parseAttrFloat('data-step', 1);
      }

      function roundToStep(num, step) {
        var stepStr = step.toString();
        var decimals = stepStr.indexOf('.') >= 0 ? stepStr.split('.')[1].length : 0;
        return parseFloat(num.toFixed(Math.min(decimals, 10)));
      }

      function clampValue(val) {
        var min = getMin();
        var max = getMax();
        if (min !== null && val < min) val = min;
        if (max !== null && val > max) val = max;
        return val;
      }

      var initialAttrVal = parseAttrFloat('data-value', null);
      var initialInputVal = parseFloat(input.value);
      var currentVal = initialAttrVal !== null ? initialAttrVal : (!isNaN(initialInputVal) ? initialInputVal : 0);
      currentVal = clampValue(currentVal);

      input.setAttribute('role', 'spinbutton');
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        var labelEl = el.querySelector('label') || (el.parentNode ? el.parentNode.querySelector('label') : null);
        if (labelEl && labelEl.textContent) {
          input.setAttribute('aria-label', labelEl.textContent.trim());
        } else {
          input.setAttribute('aria-label', 'Numeric input');
        }
      }

      function syncUI() {
        var min = getMin();
        var max = getMax();

        input.value = currentVal.toString();
        el.setAttribute('data-value', currentVal.toString());

        input.setAttribute('aria-valuenow', currentVal.toString());
        if (min !== null) {
          input.setAttribute('aria-valuemin', min.toString());
        } else {
          input.removeAttribute('aria-valuemin');
        }
        if (max !== null) {
          input.setAttribute('aria-valuemax', max.toString());
        } else {
          input.removeAttribute('aria-valuemax');
        }

        var isDisabled = el.hasAttribute('data-disabled') ||
                         el.classList.contains('number-input--disabled') ||
                         el.classList.contains('disabled') ||
                         input.disabled;

        if (isDisabled) {
          input.disabled = true;
          if (decBtn) decBtn.disabled = true;
          if (incBtn) incBtn.disabled = true;
        } else {
          input.disabled = false;
          if (decBtn) decBtn.disabled = (min !== null && currentVal <= min);
          if (incBtn) incBtn.disabled = (max !== null && currentVal >= max);
        }
      }

      function setValue(val) {
        var clamped = clampValue(val);
        var step = getStep();
        clamped = roundToStep(clamped, step);
        currentVal = clamped;
        syncUI();
      }

      function increment() {
        var step = getStep();
        setValue(currentVal + step);
      }

      function decrement() {
        var step = getStep();
        setValue(currentVal - step);
      }

      el.addEventListener('click', function(e) {
        var isDisabled = el.hasAttribute('data-disabled') ||
                         el.classList.contains('number-input--disabled') ||
                         el.classList.contains('disabled') ||
                         input.disabled;
        if (isDisabled) return;

        var decTarget = e.target.closest('[data-action="decrement"]');
        if (decTarget) {
          e.preventDefault();
          decrement();
          return;
        }

        var incTarget = e.target.closest('[data-action="increment"]');
        if (incTarget) {
          e.preventDefault();
          increment();
          return;
        }
      });

      function handleDirectInput() {
        var parsed = parseFloat(input.value);
        if (isNaN(parsed)) {
          syncUI();
        } else {
          setValue(parsed);
        }
      }

      input.addEventListener('change', handleDirectInput);
      input.addEventListener('blur', handleDirectInput);

      input.addEventListener('keydown', function(e) {
        var isDisabled = el.hasAttribute('data-disabled') ||
                         el.classList.contains('number-input--disabled') ||
                         el.classList.contains('disabled') ||
                         input.disabled;
        if (isDisabled) return;

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          increment();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          decrement();
        }
      });

      syncUI();
    }
  });
}
