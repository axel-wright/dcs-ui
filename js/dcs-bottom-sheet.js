'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-bottom-sheet.js could not register the bottom-sheet component.');
} else {
  window.DCS.register('bottom-sheet', {
    init: function(el) {
      // el is the bottom-sheet viewport [data-dcs-component="bottom-sheet"]
      var sheet = el.querySelector('.bottom-sheet');
      var handle = el.querySelector('.bottom-sheet-drag-handle');

      function open() {
        el.classList.add('open');
      }

      function close() {
        el.classList.remove('open');
      }

      // ---- Drag-to-dismiss (pointer events: unified mouse + touch) ----
      var dragging = false;   // pointer is down on the handle
      var moved = false;      // pointer moved enough to count as a drag
      var startY = 0;         // pointer y at drag start
      var sheetHeight = 0;    // measured sheet height at drag start
      var suppressNextClick = false; // swallow the click synthesized after a real drag

      // Resistance factor gives the sheet a "sticky" feel when pulled down.
      var RESIST = 0.85;
      // Minimum pointer travel (px) before we treat the gesture as a drag.
      var MOVE_TOLERANCE = 3;

      function resist(delta) {
        // Allow a little upward pull (negative delta) to peek underneath.
        // Strong resistance going up; snaps back on release.
        if (delta < 0) {
          return Math.max(delta * 0.3, -50);
        }
        return delta * RESIST;
      }

      function onPointerDown(e) {
        // Only drive drags while the sheet is actually open.
        if (!el.classList.contains('open')) {
          return;
        }
        dragging = true;
        moved = false;
        startY = e.clientY;
        sheetHeight = sheet.offsetHeight;
        // No transition while the finger/mouse is driving the sheet directly.
        sheet.style.transition = 'none';
        handle.style.cursor = 'grabbing';
        if (handle.setPointerCapture) {
          handle.setPointerCapture(e.pointerId);
        }
      }

      function onPointerMove(e) {
        if (!dragging) {
          return;
        }
        var delta = e.clientY - startY;
        if (!moved && Math.abs(delta) > MOVE_TOLERANCE) {
          moved = true;
        }
        var offset = resist(delta);
        sheet.style.transform = 'translateY(' + offset + 'px)';
      }

      function onPointerUp(e) {
        if (!dragging) {
          return;
        }
        dragging = false;
        handle.style.cursor = 'grab';
        if (handle.releasePointerCapture && e.pointerId !== undefined) {
          try { handle.releasePointerCapture(e.pointerId); } catch (err) {}
        }

        // Hand control back to the CSS spring transitions.
        sheet.style.transition = '';

        if (!moved) {
          // A plain tap on the handle: fall through to the click-to-close path.
          sheet.style.transform = '';
          return;
        }

        // A real drag occurred — swallow the trailing synthetic click.
        suppressNextClick = true;

        var offset = resist(e.clientY - startY);
        var threshold = Math.min(sheetHeight * 0.3, 100);

        if (offset > threshold) {
          // Past the threshold: close, animating from the dragged position.
          close();
          sheet.style.transform = '';
        } else {
          // Not far enough: spring back to the open position.
          sheet.style.transform = '';
        }
      }

      function onPointerCancel() {
        if (!dragging) {
          return;
        }
        dragging = false;
        handle.style.cursor = 'grab';
        sheet.style.transition = '';
        sheet.style.transform = '';
      }

      if (handle) {
        // Prevent the page from scrolling while dragging the handle on touch.
        handle.style.touchAction = 'none';
        handle.addEventListener('pointerdown', onPointerDown);
        handle.addEventListener('pointermove', onPointerMove);
        handle.addEventListener('pointerup', onPointerUp);
        handle.addEventListener('pointercancel', onPointerCancel);
      }

      el.addEventListener('click', function(e) {
        // Swallow the click that a drag gesture synthesizes on release.
        if (suppressNextClick) {
          suppressNextClick = false;
          return;
        }

        // Open the sheet
        if (e.target.closest('[data-action="sheet-open"]')) {
          open();
          return;
        }

        // Backdrop or drag handle closes the sheet
        if (e.target.closest('[data-action="sheet-close"]')) {
          close();
          return;
        }

        // Multi-select chip: toggle active
        var toggleChip = e.target.closest('[data-action="sheet-chip-toggle"]');
        if (toggleChip) {
          toggleChip.classList.toggle('active');
          return;
        }

        // Single-select chip: activate only the clicked one within its group
        var singleChip = e.target.closest('[data-action="sheet-chip-single"]');
        if (singleChip) {
          var group = singleChip.parentNode;
          var siblings = group ? group.querySelectorAll('[data-action="sheet-chip-single"]') : [];
          for (var i = 0; i < siblings.length; i++) {
            siblings[i].classList.remove('active');
          }
          singleChip.classList.add('active');
          return;
        }

        // Apply filters: fire toast summary, then close
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

      // Escape closes the sheet when open
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && el.classList.contains('open')) {
          close();
        }
      });
    }
  });
}
