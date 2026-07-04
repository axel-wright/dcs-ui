'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-context-menu.js could not register the context-menu component.');
} else {
  window.DCS.register('context-menu', {
    init: function(el) {
      // el is the trigger card [data-dcs-component="context-menu"].
      // The floating menu is a single element at the top of the page, so it
      // must be located via document (there is only one).
      var menu = document.querySelector('[data-context-menu]');
      if (!menu) {
        return;
      }

      // ── ARIA menu roles (idempotent — one shared menu for all triggers) ──
      if (menu.getAttribute('role') !== 'menu') {
        menu.setAttribute('role', 'menu');
        menu.setAttribute('tabindex', '-1');
        var mItems = menu.querySelectorAll('.context-menu-item');
        for (var mi = 0; mi < mItems.length; mi++) {
          mItems[mi].setAttribute('role', 'menuitem');
          mItems[mi].setAttribute('tabindex', '-1');
        }
      }

      function menuItems() {
        return menu.querySelectorAll('.context-menu-item');
      }

      var restoreFocus = null;

      function showMenu(x, y) {
        restoreFocus = document.activeElement;
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.classList.add('open');
        // Move focus to the first item so the menu is keyboard-operable.
        var first = menu.querySelector('.context-menu-item');
        if (first) first.focus();
      }

      function hideMenu() {
        menu.classList.remove('open');
        if (restoreFocus && typeof restoreFocus.focus === 'function') {
          restoreFocus.focus();
          restoreFocus = null;
        }
      }

      function isOpen() {
        return menu.classList.contains('open');
      }

      // Right-click on the trigger card opens the menu at the cursor
      el.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showMenu(e.clientX, e.clientY);
      });

      // Click a menu action: fire toast, then hide
      menu.addEventListener('click', function(e) {
        var item = e.target.closest('[data-context-action]');
        if (!item || !menu.contains(item)) {
          return;
        }
        var action = item.getAttribute('data-context-action');
        if (window.DCS._showToast) {
          window.DCS._showToast(action, 'info');
        }
        hideMenu();
      });

      // Click anywhere else hides the menu
      document.addEventListener('click', function(e) {
        if (isOpen() && !menu.contains(e.target)) {
          hideMenu();
        }
      });

      // A right-click outside the menu also dismisses it
      document.addEventListener('contextmenu', function(e) {
        if (isOpen() && !el.contains(e.target) && !menu.contains(e.target)) {
          hideMenu();
        }
      });

      // Keyboard: Escape closes, Up/Down move between items, Enter activates.
      document.addEventListener('keydown', function(e) {
        if (!isOpen()) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          hideMenu();
          return;
        }

        var items = menuItems();
        if (!items.length) return;
        var list = Array.prototype.slice.call(items);
        var idx = list.indexOf(document.activeElement);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          list[(idx + 1) % list.length].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          list[(idx - 1 + list.length) % list.length].focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          list[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          list[list.length - 1].focus();
        } else if ((e.key === 'Enter' || e.key === ' ') && idx !== -1) {
          e.preventDefault();
          list[idx].click();
        }
      });
    }
  });
}
