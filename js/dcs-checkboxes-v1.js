'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('checkboxes', {
    init: function(el) {
      // Find parent-child checkbox groups
      var parentInput = el.querySelector('#parent-input');
      if (!parentInput) return;

      var childCheckboxes = el.querySelectorAll('input[type="checkbox"]:not(#parent-input)');

      function updateParentState() {
        var checkedCount = 0;
        var total = 0;
        childCheckboxes.forEach(function(cb) {
          if (!cb.disabled) total++;
          if (cb.checked) checkedCount++;
        });

        if (checkedCount === 0) {
          parentInput.indeterminate = false;
          parentInput.checked = false;
        } else if (checkedCount === total) {
          parentInput.indeterminate = false;
          parentInput.checked = true;
        } else {
          parentInput.indeterminate = true;
          parentInput.checked = false;
        }
      }

      // Initialize indeterminate state
      updateParentState();

      // Parent toggles all children
      parentInput.addEventListener('change', function() {
        var newState = parentInput.checked;
        childCheckboxes.forEach(function(cb) {
          if (!cb.disabled) {
            cb.checked = newState;
          }
        });
        parentInput.indeterminate = false;
      });

      // Child changes update parent
      childCheckboxes.forEach(function(cb) {
        cb.addEventListener('change', updateParentState);
      });
    }
  });
}
