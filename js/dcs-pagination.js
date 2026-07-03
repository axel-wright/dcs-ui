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

      var activeItem = el.querySelector('.page-item.active');
      var currentPage = activeItem ? parseInt(activeItem.getAttribute('data-pg'), 10) : 1;

      var render = function() {
        var items = el.querySelectorAll('.page-item[data-pg]');
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var pg = parseInt(item.getAttribute('data-pg'), 10);
          if (pg === currentPage) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        }

        if (prevBtn) {
          if (currentPage <= 1) {
            prevBtn.classList.add('disabled');
          } else {
            prevBtn.classList.remove('disabled');
          }
        }
        if (nextBtn) {
          if (currentPage >= totalPages) {
            nextBtn.classList.add('disabled');
          } else {
            nextBtn.classList.remove('disabled');
          }
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

      render();
    }
  });
}
