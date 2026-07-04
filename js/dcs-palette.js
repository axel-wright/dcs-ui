'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('palette', {
    init: function(el) {
      var backdrop = el.querySelector('.palette-backdrop');
      var input = el.querySelector('.palette-input');
      var resultsContainer = el.querySelector('.palette-results');
      var dialog = el.querySelector('.command-palette-dialog');

      // ── ARIA: combobox + listbox pattern ──
      var uid = Math.floor(Math.random() * 1e6);
      if (dialog) {
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        if (!dialog.getAttribute('aria-label')) dialog.setAttribute('aria-label', 'Command palette');
      }
      if (resultsContainer) {
        resultsContainer.setAttribute('role', 'listbox');
        if (!resultsContainer.id) resultsContainer.id = 'dcs-palette-list-' + uid;
      }
      if (input) {
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('aria-expanded', 'false');
        if (resultsContainer) input.setAttribute('aria-controls', resultsContainer.id);
      }
      var paletteItems = el.querySelectorAll('.palette-item');
      for (var pi = 0; pi < paletteItems.length; pi++) {
        paletteItems[pi].setAttribute('role', 'option');
        if (!paletteItems[pi].id) paletteItems[pi].id = 'dcs-palette-opt-' + uid + '-' + pi;
      }

      // Keep aria-selected + aria-activedescendant in sync with .selected.
      var syncActiveDescendant = function() {
        if (!input) return;
        var current = el.querySelector('.palette-item.selected');
        for (var i = 0; i < paletteItems.length; i++) {
          paletteItems[i].setAttribute('aria-selected', paletteItems[i] === current ? 'true' : 'false');
        }
        if (current) input.setAttribute('aria-activedescendant', current.id);
        else input.removeAttribute('aria-activedescendant');
      };

      var restoreFocus = null;

      var openPalette = function() {
        restoreFocus = document.activeElement;
        if (backdrop) backdrop.classList.add('active');
        if (input) {
          input.value = '';
          input.setAttribute('aria-expanded', 'true');
          input.focus();
        }

        var items = el.querySelectorAll('.palette-item');
        for (var i = 0; i < items.length; i++) {
          items[i].style.display = 'flex';
          if (i === 0) {
            items[i].classList.add('selected');
          } else {
            items[i].classList.remove('selected');
          }
        }

        var sections = el.querySelectorAll('.palette-results-section');
        for (var j = 0; j < sections.length; j++) {
          sections[j].style.display = 'block';
        }

        var empty = el.querySelector('.palette-empty-state');
        if (empty) empty.parentNode.removeChild(empty);
        syncActiveDescendant();
      };

      var closePalette = function() {
        if (backdrop) backdrop.classList.remove('active');
        if (input) input.setAttribute('aria-expanded', 'false');
        // Restore focus to whatever opened the palette.
        if (restoreFocus && typeof restoreFocus.focus === 'function') {
          restoreFocus.focus();
          restoreFocus = null;
        }
      };

      el.addEventListener('click', function(e) {
        if (e.target.closest('.palette-open-btn')) {
          openPalette();
        }
      });

      if (backdrop) {
        backdrop.addEventListener('click', function(e) {
          if (e.target === backdrop || e.target.closest('.palette-close')) {
            closePalette();
          }
        });
      }

      if (input) {
        input.addEventListener('keydown', function(e) {
          var visibleItems = [];
          var allItems = el.querySelectorAll('.palette-item');
          for (var i = 0; i < allItems.length; i++) {
            if (allItems[i].style.display !== 'none') {
              visibleItems.push(allItems[i]);
            }
          }

          var selectedIndex = -1;
          for (var j = 0; j < visibleItems.length; j++) {
            if (visibleItems[j].classList.contains('selected')) {
              selectedIndex = j;
              break;
            }
          }

          if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!visibleItems.length) return;
            if (selectedIndex >= 0) visibleItems[selectedIndex].classList.remove('selected');
            selectedIndex = (selectedIndex + 1) % visibleItems.length;
            visibleItems[selectedIndex].classList.add('selected');
            visibleItems[selectedIndex].scrollIntoView({ block: 'nearest' });
            syncActiveDescendant();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!visibleItems.length) return;
            if (selectedIndex >= 0) visibleItems[selectedIndex].classList.remove('selected');
            selectedIndex = (selectedIndex - 1 + visibleItems.length) % visibleItems.length;
            visibleItems[selectedIndex].classList.add('selected');
            visibleItems[selectedIndex].scrollIntoView({ block: 'nearest' });
            syncActiveDescendant();
          } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < visibleItems.length) {
              var action = visibleItems[selectedIndex].getAttribute('data-action');
              if (window.DCS._showToast) {
                window.DCS._showToast('Launching: ' + action, 'success');
              }
              closePalette();
            }
          } else if (e.key === 'Escape') {
            e.preventDefault();
            closePalette();
          }
        });

        input.addEventListener('input', function(e) {
          var query = e.target.value.toLowerCase().trim();
          var sections = el.querySelectorAll('.palette-results-section');
          var firstMatch = null;
          var matchCount = 0;

          for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var items = section.querySelectorAll('.palette-item');
            var sectionHasMatch = false;

            for (var j = 0; j < items.length; j++) {
              var item = items[j];
              var nameEl = item.querySelector('.palette-item-name');
              var name = nameEl ? nameEl.textContent.toLowerCase() : '';
              var match = !query || name.indexOf(query) !== -1;
              item.style.display = match ? 'flex' : 'none';
              if (match) {
                sectionHasMatch = true;
                matchCount++;
                if (!firstMatch) firstMatch = item;
              } else {
                item.classList.remove('selected');
              }
            }

            section.style.display = sectionHasMatch ? 'block' : 'none';
          }

          var emptyState = el.querySelector('.palette-empty-state');
          if (matchCount === 0) {
            if (!emptyState && resultsContainer) {
              emptyState = document.createElement('div');
              emptyState.className = 'palette-empty-state';
              emptyState.textContent = 'No matching workshop tools found';
              resultsContainer.appendChild(emptyState);
            }
          } else {
            if (emptyState) emptyState.parentNode.removeChild(emptyState);
          }

          var allItemsToClear = el.querySelectorAll('.palette-item');
          for (var k = 0; k < allItemsToClear.length; k++) {
            allItemsToClear[k].classList.remove('selected');
          }
          if (firstMatch) firstMatch.classList.add('selected');
          syncActiveDescendant();
        });
      }

      el.addEventListener('click', function(e) {
        var item = e.target.closest('.palette-item');
        if (item) {
          var action = item.getAttribute('data-action');
          if (window.DCS._showToast) {
            window.DCS._showToast('Launching: ' + action, 'success');
          }
          closePalette();
        }
      });

      document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          openPalette();
        }
        if (e.key === 'Escape') {
          closePalette();
        }
      });
    }
  });
}
