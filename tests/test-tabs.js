// Tests for DCS Tabs component
DCS_TEST.suite('tabs', function() {
  var T = DCS_TEST;

  // ── Setup ──────────────────────────────────────────────
  var fix = T.fixture(
    '<div data-dcs-component="tabs">' +
      '<div class="tab-nav">' +
        '<button class="tab-btn active" data-tab="tab1">Tab 1</button>' +
        '<button class="tab-btn" data-tab="tab2">Tab 2</button>' +
        '<button class="tab-btn" data-tab="tab3">Tab 3</button>' +
        '<div class="tab-indicator"></div>' +
      '</div>' +
      '<div class="tab-panel active" data-tab="tab1">Content 1</div>' +
      '<div class="tab-panel" data-tab="tab2">Content 2</div>' +
      '<div class="tab-panel" data-tab="tab3">Content 3</div>' +
    '</div>'
  );

  // Init
  var container = fix.querySelector('[data-dcs-component="tabs"]');
  window.DCS._init(container);

  var tab1 = fix.querySelector('[data-tab="tab1"]');
  var tab2 = fix.querySelector('[data-tab="tab2"]');
  var tab3 = fix.querySelector('[data-tab="tab3"]');
  var panel1 = fix.querySelector('.tab-panel[data-tab="tab1"]');
  var panel2 = fix.querySelector('.tab-panel[data-tab="tab2"]');

  // ── Tests ──────────────────────────────────────────────

  // Initial state: tab1 active
  T.assertHasClass(tab1, 'active', 'tab1 starts active');
  T.assertAttr(tab1, 'aria-selected', 'true', 'tab1 has aria-selected="true"');
  T.assertHasClass(panel1, 'active', 'panel1 is active');
  T.assertNotHasClass(panel2, 'active', 'panel2 is hidden');

  // ARIA linkage
  var controlsVal = tab1.getAttribute('aria-controls');
  var labelledbyVal = panel1.getAttribute('aria-labelledby');
  T.assertOk(controlsVal && labelledbyVal && controlsVal === panel1.id && labelledbyVal === tab1.id,
    'tab1 aria-controls linked to panel1, panel1 aria-labelledby linked to tab1');

  // Switch to tab2 via click
  T.click(tab2);
  T.assertHasClass(tab2, 'active', 'tab2 becomes active after click');
  T.assertAttr(tab2, 'aria-selected', 'true', 'tab2 has aria-selected="true"');
  T.assertNotHasClass(tab1, 'active', 'tab1 is no longer active');
  T.assertAttr(tab1, 'aria-selected', 'false', 'tab1 has aria-selected="false"');
  T.assertHasClass(panel2, 'active', 'panel2 becomes active');
  T.assertNotHasClass(panel1, 'active', 'panel1 is hidden');

  // Keyboard: ArrowRight to tab3
  T.keydown(container, 'ArrowRight');
  T.assertHasClass(tab3, 'active', 'ArrowRight moves to tab3');

  // Keyboard: ArrowLeft back to tab2
  T.keydown(container, 'ArrowLeft');
  T.assertHasClass(tab2, 'active', 'ArrowLeft moves back to tab2');

  // Keyboard: Home goes to first
  T.keydown(container, 'Home');
  T.assertHasClass(tab1, 'active', 'Home moves to tab1');

  // Keyboard: End goes to last
  T.keydown(container, 'End');
  T.assertHasClass(tab3, 'active', 'End moves to tab3');

  T.cleanup();
});
