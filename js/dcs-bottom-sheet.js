'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('bottom-sheet', {
    init: function(el) {
      var sheet = el.querySelector('.bottom-sheet');
      var handle = el.querySelector('.bottom-sheet-drag-handle');

      if (sheet && sheet.getAttribute('role') === 'dialog' && !sheet.getAttribute('aria-label') && !sheet.getAttribute('aria-labelledby')) {
        var title = sheet.querySelector('.bottom-sheet-title');
        if (title) {
          if (!title.id) {
            title.id = 'bottom-sheet-title-' + Math.random().toString(36).substring(2, 9);
          }
          sheet.setAttribute('aria-labelledby', title.id);
        } else {
          sheet.setAttribute('aria-label', 'Bottom Sheet');
        }
      }

      // --- open / close ---
      function open() { el.classList.add('open'); }
      function close() { el.classList.remove('open'); }

      // --- drag-to-dismiss ---
      var drag = { on: false, moved: false, startY: 0, offset: 0, height: 0, skip: false };

      function dragStart(e) {
        if (!el.classList.contains('open')) return;
        drag.on = true; drag.moved = false;
        drag.startY = e.clientY; drag.offset = 0;
        drag.height = sheet.offsetHeight;
        sheet.style.transition = 'none';
        if (handle.setPointerCapture) handle.setPointerCapture(e.pointerId);
      }

      function dragMove(e) {
        if (!drag.on) return;
        var dy = e.clientY - drag.startY;
        if (!drag.moved && Math.abs(dy) > 3) drag.moved = true;
        if (dy < 0) dy = Math.max(dy * 0.3, -50);
        dy = Math.min(dy * 0.85, drag.height);
        drag.offset = dy;
        sheet.style.transform = 'translateY(' + dy + 'px)';
      }

      function dragEnd(e) {
        if (!drag.on) return;
        drag.on = false;
        if (handle.releasePointerCapture && e.pointerId !== undefined) {
          try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
        }
        if (!drag.moved) { sheet.style.transition = ''; sheet.style.transform = ''; return; }
        drag.skip = true;
        if (drag.offset > Math.min(drag.height * 0.3, 100)) {
          close();
          sheet.offsetHeight; // force layout flush
        }
        sheet.style.transition = '';
        sheet.style.transform = '';
      }

      function dragCancel() {
        if (!drag.on) return;
        drag.on = false;
        sheet.style.transition = '';
        sheet.style.transform = '';
      }

      if (handle) {
        handle.addEventListener('pointerdown', dragStart);
        handle.addEventListener('pointermove', dragMove);
        handle.addEventListener('pointerup', dragEnd);
        handle.addEventListener('pointercancel', dragCancel);
      }

      // --- click delegation ---
      el.addEventListener('click', function(e) {
        if (drag.skip) { drag.skip = false; return; }
        if (e.target.closest('[data-action="sheet-open"]')) { open(); return; }
        if (e.target.closest('[data-action="sheet-close"]')) { close(); return; }
      });

      // --- escape key ---
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && el.classList.contains('open')) close();
      });
    }
  });
}
