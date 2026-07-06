'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('tables', {
    init: function(el) {
      var table = el.tagName === 'TABLE' ? el : el.querySelector('table');
      if (!table) return;

      // ── Sticky header ──────────────────────────────────────
      // Pin the thead below the fixed nav (70px) so column labels stay
      // visible while scrolling long datasets.
      if (table.hasAttribute('data-sticky-header')) {
        var stickyHead = table.querySelector('thead');
        if (stickyHead) {
          stickyHead.style.position = 'sticky';
          stickyHead.style.top = '70px';
        }
      }

      // ── Loading state ──────────────────────────────────────
      // Mirror data-loading onto the tbody so the CSS shimmer overlay
      // (tbody[data-loading]) can render on top of the current rows.
      if (table.hasAttribute('data-loading')) {
        var loadingBody = table.querySelector('tbody');
        if (loadingBody) loadingBody.setAttribute('data-loading', '');
      }

      // ── Empty state ────────────────────────────────────────
      // With zero data rows, show the configured message spanning all columns.
      if (table.hasAttribute('data-empty-message')) {
        var emptyBody = table.querySelector('tbody');
        if (emptyBody && emptyBody.querySelectorAll('tr').length === 0) {
          var colCount = table.querySelectorAll('thead th').length || 1;
          var emptyRow = document.createElement('tr');
          emptyRow.className = 'dcs-empty-row';
          var emptyCell = document.createElement('td');
          emptyCell.className = 'dcs-empty-cell';
          emptyCell.setAttribute('colspan', String(colCount));
          emptyCell.textContent = table.getAttribute('data-empty-message');
          emptyRow.appendChild(emptyCell);
          emptyBody.appendChild(emptyRow);
        }
      }

      // ── Row selection ──────────────────────────────────────
      // Append (not prepend, to keep column indices stable for sorting)
      // a checkbox column plus a select-all in the header, and surface a
      // "N selected" count bar above the table.
      if (table.hasAttribute('data-selectable')) {
        setupSelection(table);
      }

      function setupSelection(tbl) {
        var headRow = tbl.querySelector('thead tr');
        var body = tbl.querySelector('tbody');
        var selectAll = null;

        function selectBar() {
          if (tbl._dcsSelectBar) return tbl._dcsSelectBar;
          var bar = document.createElement('div');
          bar.className = 'dcs-table-select-bar';
          bar.setAttribute('role', 'status');
          bar.setAttribute('aria-live', 'polite');
          // Insert the bar ABOVE the whole table container (outside it), not as
          // a sibling of <table> inside the scroll container. Toggling its
          // visibility then reads as a banner over the table block instead of
          // shoving the table — and its sticky thead — down over the data rows.
          var anchor = tbl.closest('.table-container') || tbl;
          anchor.parentNode.insertBefore(bar, anchor);
          tbl._dcsSelectBar = bar;
          return bar;
        }

        function updateCount() {
          if (!body) return;
          var n = body.querySelectorAll('.dcs-row-select:checked').length;
          var total = body.querySelectorAll('.dcs-row-select').length;
          var bar = selectBar();
          if (n > 0) {
            bar.textContent = n + ' selected';
            bar.classList.add('is-visible');
          } else {
            bar.classList.remove('is-visible');
          }
          if (selectAll) selectAll.checked = total > 0 && n === total;
        }

        function toggleRow(cb) {
          var row = cb.closest('tr');
          if (!row) return;
          if (cb.checked) row.classList.add('selected');
          else row.classList.remove('selected');
        }

        if (headRow && !headRow.querySelector('.dcs-select-cell')) {
          var th = document.createElement('th');
          th.className = 'dcs-select-cell';
          selectAll = document.createElement('input');
          selectAll.type = 'checkbox';
          selectAll.className = 'dcs-select-all';
          selectAll.setAttribute('aria-label', 'Select all rows');
          th.appendChild(selectAll);
          headRow.appendChild(th);

          selectAll.addEventListener('change', function() {
            var boxes = body ? body.querySelectorAll('.dcs-row-select') : [];
            for (var b = 0; b < boxes.length; b++) {
              boxes[b].checked = selectAll.checked;
              toggleRow(boxes[b]);
            }
            updateCount();
          });
        }

        var selRows = body ? body.querySelectorAll('tr') : [];
        for (var s = 0; s < selRows.length; s++) {
          (function(row) {
            if (row.classList.contains('dcs-empty-row')) return;
            if (row.querySelector('.dcs-select-cell')) return;
            var td = document.createElement('td');
            td.className = 'dcs-select-cell';
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'dcs-row-select';
            cb.setAttribute('aria-label', 'Select row');
            td.appendChild(cb);
            row.appendChild(td);
            cb.addEventListener('change', function() {
              toggleRow(cb);
              updateCount();
            });
          })(selRows[s]);
        }
      }

      el.addEventListener('click', function(e) {
        var header = e.target.closest('.sort-header');
        if (!header) return;

        var colIdx = parseInt(header.getAttribute('data-col'), 10);
        if (isNaN(colIdx)) return;

        var rows = [];
        var trs = table.querySelectorAll('tbody tr');
        for (var i = 0; i < trs.length; i++) {
          if (trs[i].classList.contains('dcs-empty-row')) continue;
          rows.push(trs[i]);
        }

        var headers = table.querySelectorAll('thead th');
        var isAscending = !header.classList.contains('sort-asc');

        for (var h = 0; h < headers.length; h++) {
          headers[h].classList.remove('sort-asc', 'sort-desc');
        }

        // Prefer data-sort-value for reliable numeric/date ordering. Only take
        // the numeric path when EVERY cell in the column carries the attribute.
        var allHaveSortValue = rows.length > 0;
        for (var v = 0; v < rows.length; v++) {
          var vc = rows[v].cells[colIdx];
          if (!vc || vc.getAttribute('data-sort-value') === null) {
            allHaveSortValue = false;
            break;
          }
        }

        rows.sort(function(rowA, rowB) {
          var cellElA = rowA.cells[colIdx];
          var cellElB = rowB.cells[colIdx];
          if (!cellElA || !cellElB) return 0;

          if (allHaveSortValue) {
            var svA = cellElA.getAttribute('data-sort-value');
            var svB = cellElB.getAttribute('data-sort-value');
            var nA = parseFloat(svA);
            var nB = parseFloat(svB);
            if (!isNaN(nA) && !isNaN(nB)) {
              return isAscending ? nA - nB : nB - nA;
            }
            return isAscending ? svA.localeCompare(svB) : svB.localeCompare(svA);
          }

          var cellA = cellElA.textContent.trim();
          var cellB = cellElB.textContent.trim();

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
          window._showToast('TABLE SORTED BY: ' + name, 'info');
        }
      });
    }
  });
}
