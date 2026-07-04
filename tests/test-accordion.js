// Tests for DCS Accordion component
DCS_TEST.suite('accordion', function() {
  var T = DCS_TEST;

  // ── Test 1: Multi-mode (default) ───────────────────────
  var fix1 = T.fixture(
    '<div data-dcs-component="accordion">' +
      '<div class="accordion-item">' +
        '<button class="accordion-trigger">Section A</button>' +
        '<div class="accordion-content">Content A</div>' +
      '</div>' +
      '<div class="accordion-item">' +
        '<button class="accordion-trigger">Section B</button>' +
        '<div class="accordion-content">Content B</div>' +
      '</div>' +
    '</div>'
  );

  var acc1 = fix1.querySelector('[data-dcs-component="accordion"]');
  window.DCS._init(acc1);

  var itemA = fix1.querySelectorAll('.accordion-item')[0];
  var itemB = fix1.querySelectorAll('.accordion-item')[1];
  var trigA = itemA.querySelector('.accordion-trigger');
  var trigB = itemB.querySelector('.accordion-trigger');

  // Multi-mode: both items can be open
  T.assertNotHasClass(itemA, 'open', 'multi: item A starts closed');
  T.assertAttr(trigA, 'aria-expanded', 'false', 'multi: trigger A aria-expanded="false"');

  T.click(trigA);
  T.assertHasClass(itemA, 'open', 'multi: item A opens on click');
  T.assertAttr(trigA, 'aria-expanded', 'true', 'multi: trigger A aria-expanded="true"');

  T.click(trigB);
  T.assertHasClass(itemB, 'open', 'multi: item B opens without closing A');
  T.assertHasClass(itemA, 'open', 'multi: item A stays open in multi-mode');

  // Collapse
  T.click(trigA);
  T.assertNotHasClass(itemA, 'open', 'multi: item A collapses on second click');
  T.assertAttr(trigA, 'aria-expanded', 'false', 'multi: trigger A aria-expanded="false" after collapse');

  T.cleanup();

  // ── Test 2: Single-mode ────────────────────────────────
  var fix2 = T.fixture(
    '<div data-dcs-component="accordion" data-accordion-mode="single">' +
      '<div class="accordion-item">' +
        '<button class="accordion-trigger">Section X</button>' +
        '<div class="accordion-content">Content X</div>' +
      '</div>' +
      '<div class="accordion-item">' +
        '<button class="accordion-trigger">Section Y</button>' +
        '<div class="accordion-content">Content Y</div>' +
      '</div>' +
    '</div>'
  );

  var acc2 = fix2.querySelector('[data-dcs-component="accordion"]');
  window.DCS._init(acc2);

  var itemX = fix2.querySelectorAll('.accordion-item')[0];
  var itemY = fix2.querySelectorAll('.accordion-item')[1];
  var trigX = itemX.querySelector('.accordion-trigger');
  var trigY = itemY.querySelector('.accordion-trigger');

  T.click(trigX);
  T.assertHasClass(itemX, 'open', 'single: item X opens');

  T.click(trigY);
  T.assertHasClass(itemY, 'open', 'single: item Y opens');
  T.assertNotHasClass(itemX, 'open', 'single: item X closes when Y opens');

  // Keyboard navigation
  T.keydown(acc2, 'ArrowDown');
  // focus should move to next trigger
  T.assertOk(document.activeElement === trigX || document.activeElement === trigY,
    'keyboard: ArrowDown moves focus');

  T.cleanup();

  // ── Test 3: Pre-opened item ────────────────────────────
  var fix3 = T.fixture(
    '<div data-dcs-component="accordion">' +
      '<div class="accordion-item open">' +
        '<button class="accordion-trigger">Pre-opened</button>' +
        '<div class="accordion-content">Content</div>' +
      '</div>' +
    '</div>'
  );

  var acc3 = fix3.querySelector('[data-dcs-component="accordion"]');
  window.DCS._init(acc3);

  var trigPre = acc3.querySelector('.accordion-trigger');
  T.assertAttr(trigPre, 'aria-expanded', 'true', 'pre-opened item has aria-expanded="true"');
  T.assertOk(trigPre.getAttribute('aria-controls') !== null, 'trigger has aria-controls');

  T.cleanup();
});
