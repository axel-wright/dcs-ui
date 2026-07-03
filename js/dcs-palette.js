'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('palette', {
    init: function(el) {
      var backdrop = el.querySelector('.palette-backdrop');
      var input = el.querySelector('.palette-input');
      var resultsContainer = el.querySelector('.palette-results');

      var openPalette = function() {
        if (backdrop) backdrop.classList.add('active');
        if (input) {
          input.value = '';
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
      };

      var closePalette = function() {
        if (backdrop) backdrop.classList.remove('active');
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
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!visibleItems.length) return;
            if (selectedIndex >= 0) visibleItems[selectedIndex].classList.remove('selected');
            selectedIndex = (selectedIndex - 1 + visibleItems.length) % visibleItems.length;
            visibleItems[selectedIndex].classList.add('selected');
            visibleItems[selectedIndex].scrollIntoView({ block: 'nearest' });
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
