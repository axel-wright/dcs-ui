'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('pagination', {
    init: function(el) {
      var parent = el.parentNode;
      var label = parent ? parent.querySelector('.pagination-info-label') : null;
      var prevBtn = el.querySelector('.page-prev');
      var nextBtn = el.querySelector('.page-next');
      var totalPages = 25;
      var perPage = 10;
      var totalItems = 247;

      // Expose the bar as a labelled navigation landmark, and make the
      // <div>-based controls keyboard operable.
      if (!el.getAttribute('role')) el.setAttribute('role', 'navigation');
      if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', 'Pagination');
      var interactive = el.querySelectorAll('.page-num, .page-prev, .page-next');
      for (var q = 0; q < interactive.length; q++) {
        if (!interactive[q].getAttribute('role')) interactive[q].setAttribute('role', 'button');
        if (!interactive[q].hasAttribute('tabindex')) interactive[q].setAttribute('tabindex', '0');
      }

      var activeItem = el.querySelector('.page-item.active');
      var currentPage = activeItem ? parseInt(activeItem.getAttribute('data-pg'), 10) : 1;

      var render = function() {
        var items = el.querySelectorAll('.page-item[data-pg]');
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var pg = parseInt(item.getAttribute('data-pg'), 10);
          if (pg === currentPage) {
            item.classList.add('active');
            item.setAttribute('aria-current', 'page');
          } else {
            item.classList.remove('active');
            item.removeAttribute('aria-current');
          }
        }

        if (prevBtn) {
          var prevDisabled = currentPage <= 1;
          prevBtn.classList.toggle('disabled', prevDisabled);
          prevBtn.setAttribute('aria-disabled', prevDisabled ? 'true' : 'false');
        }
        if (nextBtn) {
          var nextDisabled = currentPage >= totalPages;
          nextBtn.classList.toggle('disabled', nextDisabled);
          nextBtn.setAttribute('aria-disabled', nextDisabled ? 'true' : 'false');
        }

        if (label) {
          var start = (currentPage - 1) * perPage + 1;
          var end = Math.min(currentPage * perPage, totalItems);
          label.textContent = 'Showing ' + start + '–' + end + ' of ' + totalItems + ' tools';
        }
      };

      el.addEventListener('click', function(e) {
        var numBtn = e.target.closest('.page-num');
        if (numBtn) {
          var pg = parseInt(numBtn.getAttribute('data-pg'), 10);
          if (!isNaN(pg)) {
            currentPage = pg;
            render();
          }
          return;
        }

        var prev = e.target.closest('.page-prev');
        if (prev && !prev.classList.contains('disabled')) {
          if (currentPage > 1) {
            currentPage--;
            render();
          }
          return;
        }

        var next = e.target.closest('.page-next');
        if (next && !next.classList.contains('disabled')) {
          if (currentPage < totalPages) {
            currentPage++;
            render();
          }
          return;
        }
      });

      // Keyboard: Enter/Space activate the focused page control.
      el.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var target = e.target.closest('.page-num, .page-prev, .page-next');
        if (!target) return;
        e.preventDefault();
        target.click();
      });

      render();
    }
  });
}
