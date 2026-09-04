// Tests for DCS Tree component
DCS_TEST.suite('tree', function() {
  var T = DCS_TEST;

  var fix = T.fixture(
    '<div data-dcs-component="tree">' +
      '<div class="dcs-tree-item" id="node1" aria-expanded="true">' +
        '<span class="dcs-tree-toggle">▼</span>' +
        '<span class="dcs-tree-label">Folder 1</span>' +
        '<div class="dcs-tree-group">' +
          '<div class="dcs-tree-item" id="node1-1">' +
            '<span class="dcs-tree-label">File 1-1</span>' +
          '</div>' +
          '<div class="dcs-tree-item" id="node1-2">' +
            '<span class="dcs-tree-label">File 1-2</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="dcs-tree-item" id="node2" aria-expanded="false">' +
        '<span class="dcs-tree-toggle">▶</span>' +
        '<span class="dcs-tree-label">Folder 2</span>' +
        '<div class="dcs-tree-group">' +
          '<div class="dcs-tree-item" id="node2-1">' +
            '<span class="dcs-tree-label">File 2-1</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  var container = fix.querySelector('[data-dcs-component="tree"]');
  window.DCS._init(container);

  var node1 = fix.querySelector('#node1');
  var node11 = fix.querySelector('#node1-1');

  var toggle1 = node1.querySelector('.dcs-tree-toggle');
  var label11 = node11.querySelector('.dcs-tree-label');

  // Initial state & ARIA attributes
  T.assertOk(container.hasAttribute('data-dcs-initialized'), 'tree is initialized');
  T.assertAttr(node1, 'tabindex', '0', 'first tree item starts with tabindex="0"');
  T.assertAttr(node11, 'tabindex', '-1', 'other tree items have tabindex="-1"');
  T.assertAttr(node1, 'aria-selected', 'false', 'aria-selected starts false');

  // Click label selects item
  T.click(label11);
  T.assertHasClass(node11, 'is-selected', 'clicking label adds is-selected');
  T.assertAttr(node11, 'aria-selected', 'true', 'aria-selected="true" on selected item');
  T.assertNotHasClass(node1, 'is-selected', 'previously unselected item remains unselected');

  // Toggle collapse/expand on toggle click
  T.click(toggle1);
  T.assertAttr(node1, 'aria-expanded', 'false', 'clicking toggle collapses node1');
  T.click(toggle1);
  T.assertAttr(node1, 'aria-expanded', 'true', 'clicking toggle again expands node1');

  // Keyboard navigation: ArrowDown
  node1.focus();
  T.keydown(node1, 'ArrowDown');
  T.assertAttr(node11, 'tabindex', '0', 'ArrowDown moves roving tabindex to node1-1');

  // Keyboard navigation: ArrowLeft on expanded item collapses it
  node1.focus();
  T.keydown(node1, 'ArrowLeft');
  T.assertAttr(node1, 'aria-expanded', 'false', 'ArrowLeft on expanded node collapses it');

  // Keyboard navigation: ArrowRight on collapsed item expands it
  T.keydown(node1, 'ArrowRight');
  T.assertAttr(node1, 'aria-expanded', 'true', 'ArrowRight on collapsed node expands it');

  // Keyboard select: Enter / Space selects focused item
  T.keydown(node1, 'Enter');
  T.assertHasClass(node1, 'is-selected', 'Enter selects focused item');

  // Double click event emission
  var dblEventFired = false;
  container.addEventListener('dcs-tree-activate', function(e) {
    dblEventFired = true;
    T.assertEqual(e.detail.label, 'File 1-1', 'event detail label matches leaf item');
  });

  var dblEvt = new MouseEvent('dblclick', { bubbles: true, cancelable: true });
  label11.dispatchEvent(dblEvt);
  T.assertOk(dblEventFired, 'dcs-tree-activate event fired on double click');

  T.cleanup();
});
