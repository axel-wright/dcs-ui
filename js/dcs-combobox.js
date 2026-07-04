'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-combobox.js could not register the combobox component.');
} else {
  window.DCS.register('combobox', {
    init: function(el) {
      // el is the .combobox-container [data-dcs-component="combobox"]
      var input = el.querySelector('.combobox-input');
      var dropdown = el.querySelector('.combobox-dropdown');
      var clearBtn = el.querySelector('.combobox-clear-btn');
      if (!input || !dropdown) {
        return;
      }

      var items = dropdown.querySelectorAll('.combobox-item');

      // ── ARIA: combobox + listbox pattern ──
      var uid = Math.floor(Math.random() * 1e6);
      if (!dropdown.id) dropdown.id = 'dcs-combobox-list-' + uid;
      dropdown.setAttribute('role', 'listbox');
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('aria-expanded', 'false');
      input.setAttribute('aria-controls', dropdown.id);
      for (var ci = 0; ci < items.length; ci++) {
        items[ci].setAttribute('role', 'option');
        items[ci].setAttribute('aria-selected', 'false');
        if (!items[ci].id) items[ci].id = 'dcs-combobox-opt-' + uid + '-' + ci;
      }

      function syncActive() {
        var current = dropdown.querySelector('.combobox-item.kbd-active');
        for (var i = 0; i < items.length; i++) {
          items[i].setAttribute('aria-selected', items[i] === current ? 'true' : 'false');
        }
        if (current) input.setAttribute('aria-activedescendant', current.id);
        else input.removeAttribute('aria-activedescendant');
      }

      function open() {
        el.classList.add('open');
        input.setAttribute('aria-expanded', 'true');
      }

      function close() {
        el.classList.remove('open');
        input.setAttribute('aria-expanded', 'false');
        clearHighlight();
        syncActive();
      }

      function clearHighlight() {
        for (var i = 0; i < items.length; i++) {
          items[i].classList.remove('kbd-active');
        }
      }

      function visibleItems() {
        var out = [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].style.display !== 'none') {
            out.push(items[i]);
          }
        }
        return out;
      }

      function filter(query) {
        query = (query || '').toLowerCase().trim();
        for (var i = 0; i < items.length; i++) {
          var text = items[i].textContent.toLowerCase();
          items[i].style.display = (!query || text.indexOf(query) !== -1) ? '' : 'none';
        }
        clearHighlight();
      }

      function selectItem(item) {
        if (!item) {
          return;
        }
        input.value = item.getAttribute('data-value') || item.textContent;
        filter('');
        close();
        if (window.DCS._showToast) {
          window.DCS._showToast('Tool selected: ' + input.value, 'success');
        }
      }

      input.addEventListener('focus', function() {
        open();
      });

      input.addEventListener('input', function() {
        open();
        filter(input.value);
      });

      input.addEventListener('keydown', function(e) {
        var vis = visibleItems();
        var current = -1;
        for (var i = 0; i < vis.length; i++) {
          if (vis[i].classList.contains('kbd-active')) {
            current = i;
            break;
          }
        }

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          open();
          if (!vis.length) return;
          if (current >= 0) vis[current].classList.remove('kbd-active');
          current = (current + 1) % vis.length;
          vis[current].classList.add('kbd-active');
          vis[current].scrollIntoView({ block: 'nearest' });
          syncActive();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          open();
          if (!vis.length) return;
          if (current >= 0) vis[current].classList.remove('kbd-active');
          current = (current - 1 + vis.length) % vis.length;
          vis[current].classList.add('kbd-active');
          vis[current].scrollIntoView({ block: 'nearest' });
          syncActive();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (current >= 0 && current < vis.length) {
            selectItem(vis[current]);
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          close();
        }
      });

      dropdown.addEventListener('click', function(e) {
        var item = e.target.closest('.combobox-item');
        if (item && dropdown.contains(item)) {
          selectItem(item);
        }
      });

      if (clearBtn) {
        clearBtn.addEventListener('click', function() {
          input.value = '';
          filter('');
          input.focus();
          open();
        });
      }

      // Click outside closes the dropdown.
      document.addEventListener('click', function(e) {
        if (!el.contains(e.target)) {
          close();
        }
      });
    }
  });
}
