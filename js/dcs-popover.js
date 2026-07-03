'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('popover', {
    init: function(el) {
      var trigger = el.querySelector('.popover-trigger');
      var card = el.querySelector('.popover-card');

      if (!trigger || !card) return;

      var toggle = function(show) {
        var isVisible = card.classList.contains('visible');
        var shouldShow = typeof show === 'boolean' ? show : !isVisible;

        if (shouldShow) {
          card.classList.add('visible');
        } else {
          card.classList.remove('visible');
        }
      };

      trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggle();
      });

      document.addEventListener('click', function(e) {
        if (!el.contains(e.target)) {
          toggle(false);
        }
      });

      var detailLink = el.querySelector('.popover-link');
      if (detailLink) {
        detailLink.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          var title = el.querySelector('.popover-machine-name');
          var name = title ? title.textContent.trim() : 'machine';
          if (window.DCS._showToast) {
            window.DCS._showToast('Opening ' + name + ' details…', 'info');
          } else if (window._showToast) {
            window.DCS._showToast('Opening ' + name + ' details…', 'info');
          }
        });
      }
    }
  });
}
