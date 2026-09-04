// Tests for DCS Tables component
DCS_TEST.suite('tables', function() {
  var T = DCS_TEST;

  // 1. Sortable + Selectable table
  var fix = T.fixture(
    '<div data-dcs-component="tables">' +
      '<table data-selectable data-sticky-header data-empty-message="No rows available">' +
        '<thead>' +
          '<tr>' +
            '<th class="sort-header" data-col="0">Name</th>' +
            '<th class="sort-header" data-col="1">Score</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          '<tr><td>Bob</td><td data-sort-value="20">20</td></tr>' +
          '<tr><td>Alice</td><td data-sort-value="50">50</td></tr>' +
          '<tr><td>Charlie</td><td data-sort-value="10">10</td></tr>' +
        '</tbody>' +
      '</table>' +
    '</div>'
  );

  var container = fix.querySelector('[data-dcs-component="tables"]');
  window.DCS._init(container);

  var ths = fix.querySelectorAll('thead th');
  var tbody = fix.querySelector('tbody');

  T.assertOk(container.hasAttribute('data-dcs-initialized'), 'tables component initialized');

  // Sticky header check
  var thead = fix.querySelector('thead');
  T.assertEqual(thead.style.position, 'sticky', 'thead position set to sticky');

  // Row selection setup check: checkbox column added
  var selectAllCb = fix.querySelector('.dcs-select-all');
  T.assertOk(selectAllCb, 'select all checkbox injected into header');

  var rowCbs = fix.querySelectorAll('.dcs-row-select');
  T.assertEqual(rowCbs.length, 3, '3 row select checkboxes injected');

  // Select single row
  T.click(rowCbs[0]);
  var row1 = rowCbs[0].closest('tr');
  T.assertHasClass(row1, 'selected', 'selected class added to row 1 on check');

  var selectBar = fix.querySelector('.dcs-table-select-bar');
  T.assertOk(selectBar, 'selection bar created');
  T.assertHasClass(selectBar, 'is-visible', 'selection bar is visible when rows are selected');
  T.assertEqual(selectBar.textContent, '1 selected', 'selection bar text displays 1 selected');

  // Select all rows
  T.click(selectAllCb);
  T.assertOk(rowCbs[0].checked && rowCbs[1].checked && rowCbs[2].checked, 'all row checkboxes checked');
  T.assertEqual(selectBar.textContent, '3 selected', 'selection bar displays 3 selected');

  // Deselect all
  T.click(selectAllCb);
  T.assertNotHasClass(selectBar, 'is-visible', 'selection bar hidden when 0 selected');

  // Sorting by Name (Column 0, text sort)
  T.click(ths[0]); // asc
  T.assertHasClass(ths[0], 'sort-asc', 'Column 0 has sort-asc class');
  var rows = tbody.querySelectorAll('tr');
  T.assertEqual(rows[0].cells[0].textContent, 'Alice', 'First sorted row is Alice');
  T.assertEqual(rows[1].cells[0].textContent, 'Bob', 'Second sorted row is Bob');
  T.assertEqual(rows[2].cells[0].textContent, 'Charlie', 'Third sorted row is Charlie');

  T.click(ths[0]); // desc
  T.assertHasClass(ths[0], 'sort-desc', 'Column 0 has sort-desc class');
  rows = tbody.querySelectorAll('tr');
  T.assertEqual(rows[0].cells[0].textContent, 'Charlie', 'First sorted row descending is Charlie');

  // Sorting by Score (Column 1, numeric data-sort-value)
  T.click(ths[1]); // asc: 10, 20, 50
  rows = tbody.querySelectorAll('tr');
  T.assertEqual(rows[0].cells[1].textContent, '10', 'First row by score asc is 10');
  T.assertEqual(rows[2].cells[1].textContent, '50', 'Last row by score asc is 50');

  T.cleanup();

  // 2. Empty state table
  var fixEmpty = T.fixture(
    '<div data-dcs-component="tables">' +
      '<table data-empty-message="No records found">' +
        '<thead><tr><th>Name</th><th>Status</th></tr></thead>' +
        '<tbody></tbody>' +
      '</table>' +
    '</div>'
  );
  var emptyContainer = fixEmpty.querySelector('[data-dcs-component="tables"]');
  window.DCS._init(emptyContainer);

  var emptyRow = fixEmpty.querySelector('.dcs-empty-row');
  T.assertOk(emptyRow, 'empty state row generated');
  var emptyCell = fixEmpty.querySelector('.dcs-empty-cell');
  T.assertEqual(emptyCell.textContent, 'No records found', 'empty cell message matches attribute');
  T.assertEqual(emptyCell.getAttribute('colspan'), '2', 'empty cell spans all 2 columns');

  T.cleanup();
});
