'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-bottom-sheet.js could not register the bottom-sheet component.');
} else {
  window.DCS.register('bottom-sheet', {
    init: function(el) {
      var sheet = el.querySelector('.bottom-sheet');
      var handle = el.querySelector('.bottom-sheet-drag-handle');
      var releaseTrap = null;

      // --- aria labelling ---
      if (sheet && !sheet.getAttribute('aria-labelledby')) {
        var title = sheet.querySelector('.bottom-sheet-title');
        if (title) {
          if (!title.id) title.id = 'dcs-sht-' + Math.floor(Math.random() * 1e6);
          sheet.setAttribute('aria-labelledby', title.id);
        }
      }

      // --- open / close ---
      function open() {
        el.classList.add('open');
        if (sheet) releaseTrap = window.DCS._trapFocus(sheet);
      }

      function close() {
        el.classList.remove('open');
        if (releaseTrap) { releaseTrap(); releaseTrap = null; }
      }

      // --- drag to dismiss ---
      var drag = {
        active: false,
        moved: false,
        startY: 0,
        offset: 0,
        height: 0,
        supress: false
      };

      function dragStart(e) {
        if (!el.classList.contains('open')) return;
        drag.active = true;
        drag.moved = false;
        drag.startY = e.clientY;
        drag.offset = 0;
        drag.height = sheet.offsetHeight;
        sheet.style.transition = 'none';
        if (handle.setPointerCapture) handle.setPointerCapture(e.pointerId);
      }

      function dragMove(e) {
        if (!drag.active) return;
        var dy = e.clientY - drag.startY;
        if (!drag.moved && Math.abs(dy) > 3) drag.moved = true;
        // Clamp: no higher than 0, no lower than fully closed
        if (dy < 0) dy = Math.max(dy * 0.3, -50); // stiff upward resistance
        dy = Math.min(dy * 0.85, drag.height);     // sticky downward
        drag.offset = dy;
        sheet.style.transform = 'translateY(' + dy + 'px)';
      }

      function dragEnd(e) {
        if (!drag.active) return;
        drag.active = false;
        if (handle.releasePointerCapture && e.pointerId !== undefined) {
          try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
        }

        if (!drag.moved) {
          // Tap — let click handler close
          sheet.style.transition = '';
          sheet.style.transform = '';
          return;
        }

        // Real drag — suppress the synthetic click
        drag.supress = true;

        var threshold = Math.min(drag.height * 0.3, 100);
        if (drag.offset > threshold) {
          // Dismiss: animate out from current drag position
          el.classList.remove('open');
          if (releaseTrap) { releaseTrap(); releaseTrap = null; }
          // Force layout flush so the browser sees the drag offset as starting point
          sheet.offsetHeight;
          sheet.style.transition = '';
          sheet.style.transform = '';
        } else {
          // Spring back to open
          sheet.style.transition = '';
          sheet.style.transform = '';
        }
      }

      function dragCancel() {
        if (!drag.active) return;
        drag.active = false;
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
        if (drag.supress) { drag.supress = false; return; }

        if (e.target.closest('[data-action="sheet-open"]')) { open(); return; }
        if (e.target.closest('[data-action="sheet-close"]')) { close(); return; }

        var tc = e.target.closest('[data-action="sheet-chip-toggle"]');
        if (tc) { tc.classList.toggle('active'); return; }

        var sc = e.target.closest('[data-action="sheet-chip-single"]');
        if (sc) {
          var sibs = sc.parentNode.querySelectorAll('[data-action="sheet-chip-single"]');
          for (var i = 0; i < sibs.length; i++) sibs[i].classList.remove('active');
          sc.classList.add('active');
          return;
        }

        if (e.target.closest('[data-action="sheet-apply"]')) {
          var chips = el.querySelectorAll('.sheet-chip.active');
          var names = [];
          for (var j = 0; j < chips.length; j++) names.push(chips[j].textContent.trim());
          var msg = names.length ? 'Filters applied: ' + names.join(', ') : 'Filters cleared';
          if (window.DCS._showToast) window.DCS._showToast(msg, 'success');
          close();
        }
      });

      // --- escape key ---
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && el.classList.contains('open')) close();
      });
    }
  });
}
