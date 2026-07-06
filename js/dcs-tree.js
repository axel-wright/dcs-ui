'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-tree.js could not register the tree component.');
} else {
  window.DCS.register('tree', {
    init: function(el) {
      var multiselect = el.hasAttribute('data-tree-multiselect');
      var lastSelected = null; // Anchor for shift-range selection.

      function items() {
        return Array.prototype.slice.call(el.querySelectorAll('.dcs-tree-item'));
      }

      // Items reachable by keyboard: an item is visible when none of its
      // ancestor groups belong to a collapsed (aria-expanded="false") item.
      function visibleItems() {
        return items().filter(function(item) {
          var group = item.parentNode;
          while (group && group !== el) {
            if (group.classList && group.classList.contains('dcs-tree-group')) {
              var owner = group.parentNode;
              if (owner && owner.getAttribute('aria-expanded') === 'false') return false;
            }
            group = group.parentNode;
          }
          return true;
        });
      }

      function ownGroup(item) {
        for (var i = 0; i < item.children.length; i++) {
          if (item.children[i].classList.contains('dcs-tree-group')) return item.children[i];
        }
        return null;
      }

      function isExpandable(item) {
        return item.hasAttribute('aria-expanded');
      }

      function isLeaf(item) {
        return !ownGroup(item);
      }

      // Roving tabindex: exactly one item is tabbable at a time.
      function setActive(item, focus) {
        var all = items();
        for (var i = 0; i < all.length; i++) {
          all[i].setAttribute('tabindex', all[i] === item ? '0' : '-1');
        }
        if (focus && item) item.focus();
      }

      function clearSelection() {
        var all = items();
        for (var i = 0; i < all.length; i++) {
          all[i].classList.remove('is-selected');
          all[i].setAttribute('aria-selected', 'false');
        }
      }

      function selectOnly(item) {
        clearSelection();
        item.classList.add('is-selected');
        item.setAttribute('aria-selected', 'true');
        lastSelected = item;
      }

      function toggleSelection(item) {
        var on = !item.classList.contains('is-selected');
        item.classList.toggle('is-selected', on);
        item.setAttribute('aria-selected', on ? 'true' : 'false');
        lastSelected = item;
      }

      function selectRange(to) {
        var visible = visibleItems();
        var a = visible.indexOf(lastSelected);
        var b = visible.indexOf(to);
        if (a === -1 || b === -1) { selectOnly(to); return; }
        clearSelection();
        var lo = Math.min(a, b), hi = Math.max(a, b);
        for (var i = lo; i <= hi; i++) {
          visible[i].classList.add('is-selected');
          visible[i].setAttribute('aria-selected', 'true');
        }
      }

      function expand(item) {
        if (isExpandable(item)) item.setAttribute('aria-expanded', 'true');
      }

      function collapse(item) {
        if (isExpandable(item)) item.setAttribute('aria-expanded', 'false');
      }

      function toggle(item) {
        if (!isExpandable(item)) return;
        if (item.getAttribute('aria-expanded') === 'true') collapse(item);
        else expand(item);
      }

      function parentItem(item) {
        var group = item.parentNode;
        while (group && group !== el) {
          if (group.classList && group.classList.contains('dcs-tree-group')) {
            var owner = group.parentNode;
            if (owner && owner.classList.contains('dcs-tree-item')) return owner;
          }
          group = group.parentNode;
        }
        return null;
      }

      // ── ARIA + initial roving tabindex ──────────────────────
      var all = items();
      for (var i = 0; i < all.length; i++) {
        all[i].setAttribute('tabindex', i === 0 ? '0' : '-1');
        if (!all[i].hasAttribute('aria-selected')) all[i].setAttribute('aria-selected', 'false');
      }

      // ── Click / double-click ────────────────────────────────
      el.addEventListener('click', function(e) {
        var toggleEl = e.target.closest ? e.target.closest('.dcs-tree-toggle') : null;
        if (toggleEl && el.contains(toggleEl)) {
          var owner = toggleEl.closest('.dcs-tree-item');
          if (owner) { toggle(owner); setActive(owner, true); }
          return;
        }

        var labelEl = e.target.closest ? e.target.closest('.dcs-tree-label') : null;
        if (!labelEl || !el.contains(labelEl)) return;
        var item = labelEl.closest('.dcs-tree-item');
        if (!item) return;

        setActive(item, false);
        if (multiselect && (e.ctrlKey || e.metaKey)) {
          toggleSelection(item);
        } else if (multiselect && e.shiftKey && lastSelected) {
          selectRange(item);
        } else {
          selectOnly(item);
        }
      });

      el.addEventListener('dblclick', function(e) {
        var labelEl = e.target.closest ? e.target.closest('.dcs-tree-label') : null;
        if (!labelEl || !el.contains(labelEl)) return;
        var item = labelEl.closest('.dcs-tree-item');
        if (!item || !isLeaf(item)) return;
        el.dispatchEvent(new CustomEvent('dcs-tree-activate', {
          bubbles: true,
          detail: { item: item, label: labelEl.textContent.trim() }
        }));
      });

      // ── Keyboard ────────────────────────────────────────────
      el.addEventListener('keydown', function(e) {
        var item = e.target.closest ? e.target.closest('.dcs-tree-item') : null;
        if (!item || !el.contains(item)) return;

        var visible = visibleItems();
        var idx = visible.indexOf(item);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (idx > -1 && idx < visible.length - 1) setActive(visible[idx + 1], true);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (idx > 0) setActive(visible[idx - 1], true);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          if (isExpandable(item) && item.getAttribute('aria-expanded') === 'false') {
            expand(item);
          } else if (isExpandable(item)) {
            var child = ownGroup(item) && ownGroup(item).querySelector('.dcs-tree-item');
            if (child) setActive(child, true);
          }
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          if (isExpandable(item) && item.getAttribute('aria-expanded') === 'true') {
            collapse(item);
          } else {
            var parent = parentItem(item);
            if (parent) setActive(parent, true);
          }
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActive(item, false);
          selectOnly(item);
        }
      });
    }
  });
}
