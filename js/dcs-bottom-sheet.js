'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-bottom-sheet.js could not register the bottom-sheet component.');
} else {
  window.DCS.register('bottom-sheet', {
    init: function(el) {
      // el is the bottom-sheet viewport [data-dcs-component="bottom-sheet"]
      var sheet = el.querySelector('.bottom-sheet');
      var handle = el.querySelector('.bottom-sheet-drag-handle');
      var releaseTrap = null;

      // Label the dialog from its title if it isn't already labelled.
      if (sheet && !sheet.getAttribute('aria-label') && !sheet.getAttribute('aria-labelledby')) {
        var title = sheet.querySelector('.bottom-sheet-title');
        if (title) {
          if (!title.id) title.id = 'dcs-sheet-title-' + Math.floor(Math.random() * 1e6);
          sheet.setAttribute('aria-labelledby', title.id);
        }
      }

      // CSS owns all animation timing; JS only toggles the class.
      function open() {
        el.classList.add('open');
        if (sheet) releaseTrap = window.DCS._trapFocus(sheet);
      }

      function close() {
        el.classList.remove('open');
        if (releaseTrap) { releaseTrap(); releaseTrap = null; }
      }

      // ---- Drag-to-dismiss ----
      var dragging = false;      // pointer is down on the handle
      var moved = false;         // travel exceeded the tap tolerance
      var startY = 0;            // pointer y at drag start
      var dragOffset = 0;        // current applied translateY in px
      var sheetHeight = 0;       // measured at drag start
      var suppressClick = false; // swallow the click synthesized after a drag

      var DOWN_RESIST = 0.85; // sticky feel when pulling down
      var UP_RESIST = 0.3;    // strong resistance pulling up
      var MAX_UP = 50;        // px the sheet may rise above its rest position
      var MOVE_TOLERANCE = 3; // px of travel before a press counts as a drag

      function offsetFor(delta) {
        if (delta < 0) {
          return Math.max(delta * UP_RESIST, -MAX_UP);
        }
        // Never translate past the fully-hidden position.
        return Math.min(delta * DOWN_RESIST, sheetHeight);
      }

      function clearDragStyles() {
        // Hand control back to the stylesheet transitions.
        sheet.style.transition = '';
        sheet.style.transform = '';
      }

      function onPointerDown(e) {
        if (!el.classList.contains('open')) return;
        dragging = true;
        moved = false;
        startY = e.clientY;
        dragOffset = 0;
        sheetHeight = sheet.offsetHeight;
        // The pointer drives the sheet directly; no transition while dragging.
        sheet.style.transition = 'none';
        if (handle.setPointerCapture) {
          handle.setPointerCapture(e.pointerId);
        }
      }

      function onPointerMove(e) {
        if (!dragging) return;
        var delta = e.clientY - startY;
        if (!moved && Math.abs(delta) > MOVE_TOLERANCE) moved = true;
        dragOffset = offsetFor(delta);
        sheet.style.transform = 'translateY(' + dragOffset + 'px)';
      }

      function onPointerUp(e) {
        if (!dragging) return;
        dragging = false;
        if (handle.releasePointerCapture && e.pointerId !== undefined) {
          try { handle.releasePointerCapture(e.pointerId); } catch (err) {}
        }

        if (!moved) {
          // A plain tap: fall through to the handle's click-to-close action.
          clearDragStyles();
          return;
        }

        // A real drag happened — swallow the trailing synthetic click.
        suppressClick = true;

        var threshold = Math.min(sheetHeight * 0.3, 100);
        if (dragOffset > threshold) {
          close();
        }
        // Clearing inline styles either springs back to the open position or,
        // after close(), animates out from the dragged position.
        clearDragStyles();
      }

      function onPointerCancel() {
        if (!dragging) return;
        dragging = false;
        clearDragStyles();
      }

      if (handle && sheet) {
        handle.addEventListener('pointerdown', onPointerDown);
        handle.addEventListener('pointermove', onPointerMove);
        handle.addEventListener('pointerup', onPointerUp);
        handle.addEventListener('pointercancel', onPointerCancel);
      }

      el.addEventListener('click', function(e) {
        if (suppressClick) {
          suppressClick = false;
          return;
        }

        if (e.target.closest('[data-action="sheet-open"]')) {
          open();
          return;
        }

        // Backdrop and drag handle both close.
        if (e.target.closest('[data-action="sheet-close"]')) {
          close();
          return;
        }

        // Multi-select chip: toggle active.
        var toggleChip = e.target.closest('[data-action="sheet-chip-toggle"]');
        if (toggleChip) {
          toggleChip.classList.toggle('active');
          return;
        }

        // Single-select chip: exclusive within its group.
        var singleChip = e.target.closest('[data-action="sheet-chip-single"]');
        if (singleChip) {
          var siblings = singleChip.parentNode.querySelectorAll('[data-action="sheet-chip-single"]');
          for (var i = 0; i < siblings.length; i++) {
            siblings[i].classList.remove('active');
          }
          singleChip.classList.add('active');
          return;
        }

        // Apply: summarize active chips in a toast, then close.
        if (e.target.closest('[data-action="sheet-apply"]')) {
          var active = el.querySelectorAll('.sheet-chip.active');
          var labels = [];
          for (var j = 0; j < active.length; j++) {
            labels.push(active[j].textContent.trim());
          }
          var summary = labels.length
            ? 'Filters applied: ' + labels.join(', ')
            : 'Filters cleared';
          if (window.DCS._showToast) {
            window.DCS._showToast(summary, 'success');
          }
          close();
        }
      });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && el.classList.contains('open')) {
          close();
        }
      });
    }
  });
}
