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

      function showMenu(x, y) {
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.classList.add('open');
      }

      function hideMenu() {
        menu.classList.remove('open');
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

      // Escape hides the menu
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOpen()) {
          hideMenu();
        }
      });
    }
  });
}
