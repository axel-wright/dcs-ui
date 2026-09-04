'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('accordion', {
    init: function(el) {
      var mode = el.getAttribute('data-accordion-mode') || 'multi';
      var items = el.querySelectorAll('.accordion-item');
      var triggers = [];
      var uid = 'acc-' + Math.random().toString(36).substr(2, 8);

      // Initialize each item — set up ARIA and pre-open state
      for (var i = 0; i < items.length; i++) {
        (function(item, index) {
          var trigger = item.querySelector('.accordion-trigger');
          var content = item.querySelector('.accordion-content');
          if (!trigger || !content) return;

          // Generate IDs for ARIA linkage
          var triggerId = uid + '-trigger-' + index;
          var contentId = uid + '-content-' + index;
          trigger.id = triggerId;
          content.id = contentId;

          // ARIA attributes
          trigger.setAttribute('aria-expanded', String(item.classList.contains('open')));
          trigger.setAttribute('aria-controls', contentId);
          content.setAttribute('role', 'region');
          content.setAttribute('aria-labelledby', triggerId);

          triggers.push(trigger);

          // Pre-opened items need their maxHeight set on init
          if (item.classList.contains('open')) {
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        })(items[i], i);
      }

      // Click delegation
      el.addEventListener('click', function(e) {
        var trigger = e.target.closest('.accordion-trigger');
        if (!trigger) return;
        toggleItem(trigger, mode);
      });

      // Keyboard navigation
      el.addEventListener('keydown', function(e) {
        var trigger = e.target ? e.target.closest('.accordion-trigger') : null;
        var key = e.key;

        if (!trigger) {
          if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Home' || key === 'End') {
            trigger = document.activeElement && document.activeElement.closest
              ? document.activeElement.closest('.accordion-trigger')
              : null;
          }
        }

        if (!trigger) return;

        var idx = triggers.indexOf(trigger);
        if (idx === -1) return;

        if (key === 'ArrowDown') {
          e.preventDefault();
          triggers[(idx + 1) % triggers.length].focus();
        } else if (key === 'ArrowUp') {
          e.preventDefault();
          triggers[(idx - 1 + triggers.length) % triggers.length].focus();
        } else if (key === 'Home') {
          e.preventDefault();
          triggers[0].focus();
        } else if (key === 'End') {
          e.preventDefault();
          triggers[triggers.length - 1].focus();
        }
      });

      function toggleItem(trigger, mode) {
        var item = trigger.closest('.accordion-item');
        var content = item.querySelector('.accordion-content');
        if (!item || !content) return;

        var isOpen = item.classList.contains('open');

        // Single-select: close all siblings before opening
        if (mode === 'single' && !isOpen) {
          var openItems = el.querySelectorAll('.accordion-item.open');
          for (var i = 0; i < openItems.length; i++) {
            closeItem(openItems[i]);
          }
        }

        if (isOpen) {
          closeItem(item);
        } else {
          openItem(item);
        }
      }

      function openItem(item) {
        var content = item.querySelector('.accordion-content');
        var trigger = item.querySelector('.accordion-trigger');
        item.classList.add('open');
        // Set to scrollHeight first, then clear after transition so dynamic content works
        content.style.maxHeight = content.scrollHeight + 'px';
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
      }

      function closeItem(item) {
        var content = item.querySelector('.accordion-content');
        var trigger = item.querySelector('.accordion-trigger');
        content.style.maxHeight = '0px';
        item.classList.remove('open');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    }
  });
}
