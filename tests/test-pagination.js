// Tests for DCS Pagination component
DCS_TEST.suite('pagination', function() {
  var T = DCS_TEST;

  var fix = T.fixture(
    '<div>' +
      '<div class="pagination-info-label"></div>' +
      '<div data-dcs-component="pagination" class="pagination-bar">' +
        '<div class="page-prev disabled" tabindex="0">Prev</div>' +
        '<div class="page-item page-num active" data-pg="1" tabindex="0">1</div>' +
        '<div class="page-item page-num" data-pg="2" tabindex="0">2</div>' +
        '<div class="page-item page-num" data-pg="3" tabindex="0">3</div>' +
        '<div class="page-next" tabindex="0">Next</div>' +
      '</div>' +
    '</div>'
  );

  var container = fix.querySelector('[data-dcs-component="pagination"]');
  window.DCS._init(container);

  var label = fix.querySelector('.pagination-info-label');
  var prevBtn = fix.querySelector('.page-prev');
  var nextBtn = fix.querySelector('.page-next');
  var p1 = fix.querySelector('[data-pg="1"]');
  var p2 = fix.querySelector('[data-pg="2"]');

  // Initial state & ARIA setup
  T.assertOk(container.hasAttribute('data-dcs-initialized'), 'pagination initialized');
  T.assertAttr(container, 'role', 'navigation', 'pagination container has role="navigation"');
  T.assertAttr(p1, 'aria-current', 'page', 'active page has aria-current="page"');
  T.assertAttr(p2, 'aria-current', null, 'inactive page has no aria-current');
  T.assertAttr(prevBtn, 'aria-disabled', 'true', 'disabled prev button has aria-disabled="true"');
  T.assertEqual(label.textContent, 'Showing 1–10 of 247 tools', 'initial label text formatted correctly');

  // Click page 2
  T.click(p2);
  T.assertHasClass(p2, 'active', 'page 2 becomes active on click');
  T.assertNotHasClass(p1, 'active', 'page 1 is no longer active');
  T.assertAttr(p2, 'aria-current', 'page', 'page 2 has aria-current="page"');
  T.assertAttr(prevBtn, 'aria-disabled', 'false', 'prev button enabled when currentPage > 1');
  T.assertEqual(label.textContent, 'Showing 11–20 of 247 tools', 'label text updated for page 2');

  // Click Prev
  T.click(prevBtn);
  T.assertHasClass(p1, 'active', 'clicking Prev returns to page 1');
  T.assertAttr(prevBtn, 'aria-disabled', 'true', 'prev button disabled on page 1');

  // Click Next
  T.click(nextBtn);
  T.assertHasClass(p2, 'active', 'clicking Next moves to page 2');

  // Keyboard navigation: Enter on page 1
  T.keydown(p1, 'Enter');
  T.assertHasClass(p1, 'active', 'Enter key on page 1 button activates page 1');

  T.cleanup();
});
