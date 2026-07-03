'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-dropdown.js could not register the dropdown component.');
} else {
  window.DCS.register('dropdown', {
    init: function(el) {
      // el is the dropdown container [data-dcs-component="dropdown"]
      var trigger = el.querySelector('[data-dropdown-trigger]');
      var panel = el.querySelector('[data-dropdown-panel]');
      var label = el.querySelector('[data-dropdown-label]');
      if (!trigger || !panel) {
        return;
      }

      function isOpen() {
        return panel.classList.contains('open');
      }

      function open() {
        panel.classList.add('open');
        trigger.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }

      function close() {
        panel.classList.remove('open');
        trigger.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }

      function options() {
        return panel.querySelectorAll('.dropdown-option');
      }

      function selectOption(option) {
        if (!option) {
          return;
        }
        var all = options();
        for (var i = 0; i < all.length; i++) {
          all[i].classList.remove('selected');
          all[i].setAttribute('aria-selected', 'false');
          all[i].setAttribute('tabindex', '-1');
        }
        option.classList.add('selected');
        option.setAttribute('aria-selected', 'true');
        option.setAttribute('tabindex', '0');
        if (label) {
          label.textContent = option.getAttribute('data-value') || '';
        }
      }

      trigger.addEventListener('click', function() {
        if (isOpen()) {
          close();
        } else {
          open();
        }
      });

      panel.addEventListener('click', function(e) {
        var option = e.target.closest('.dropdown-option');
        if (!option || !panel.contains(option)) {
          return;
        }
        selectOption(option);
        close();
        trigger.focus();
      });

      // Keyboard navigation on options
      panel.addEventListener('keydown', function(e) {
        var all = options();
        if (!all.length) {
          return;
        }
        var current = e.target.closest('.dropdown-option');
        var index = -1;
        for (var i = 0; i < all.length; i++) {
          if (all[i] === current) {
            index = i;
            break;
          }
        }

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          var next = all[index + 1 >= all.length ? 0 : index + 1];
          next.setAttribute('tabindex', '0');
          next.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          var prev = all[index - 1 < 0 ? all.length - 1 : index - 1];
          prev.setAttribute('tabindex', '0');
          prev.focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (current) {
            selectOption(current);
            close();
            trigger.focus();
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          close();
          trigger.focus();
        }
      });

      // Arrow keys from the trigger open the panel and focus first option
      trigger.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          if (!isOpen()) {
            open();
          }
          var selected = panel.querySelector('.dropdown-option.selected') || panel.querySelector('.dropdown-option');
          if (selected) {
            selected.setAttribute('tabindex', '0');
            selected.focus();
          }
        }
      });

      // Escape closes the panel
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOpen()) {
          close();
          trigger.focus();
        }
      });

      // Click outside closes the panel
      document.addEventListener('click', function(e) {
        if (isOpen() && !el.contains(e.target)) {
          close();
        }
      });
    }
  });
}
