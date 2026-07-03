'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('tables', {
    init: function(el) {
      var table = el.tagName === 'TABLE' ? el : el.querySelector('table');
      if (!table) return;

      el.addEventListener('click', function(e) {
        var header = e.target.closest('.sort-header');
        if (!header) return;

        var colIdx = parseInt(header.getAttribute('data-col'), 10);
        if (isNaN(colIdx)) return;

        var rows = [];
        var trs = table.querySelectorAll('tbody tr');
        for (var i = 0; i < trs.length; i++) {
          rows.push(trs[i]);
        }

        var headers = table.querySelectorAll('thead th');
        var isAscending = !header.classList.contains('sort-asc');

        for (var h = 0; h < headers.length; h++) {
          headers[h].classList.remove('sort-asc', 'sort-desc');
        }

        rows.sort(function(rowA, rowB) {
          var cellA = rowA.cells[colIdx].textContent.trim();
          var cellB = rowB.cells[colIdx].textContent.trim();

          var numA = parseFloat(cellA.replace(/[^0-9.-]/g, ''));
          var numB = parseFloat(cellB.replace(/[^0-9.-]/g, ''));

          if (!isNaN(numA) && !isNaN(numB)) {
            return isAscending ? numA - numB : numB - numA;
          }

          return isAscending
            ? cellA.localeCompare(cellB)
            : cellB.localeCompare(cellA);
        });

        var tbody = table.querySelector('tbody');
        if (tbody) {
          tbody.innerHTML = '';
          for (var r = 0; r < rows.length; r++) {
            tbody.appendChild(rows[r]);
          }
        }

        header.classList.add(isAscending ? 'sort-asc' : 'sort-desc');

        var name = header.textContent.trim().toUpperCase();
        if (window.DCS._showToast) {
          window.DCS._showToast('TABLE SORTED BY: ' + name, 'info');
        } else if (window._showToast) {
          window.DCS._showToast('TABLE SORTED BY: ' + name, 'info');
        }
      });
    }
  });
}
