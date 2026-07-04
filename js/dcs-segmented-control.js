'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-segmented-control.js could not register the segmented-control component.');
} else {
  window.DCS.register('segmented-control', {
    init: function(el) {
      // el is the interactive demo wrapper [data-dcs-component="segmented-control"]
      var feedback = el.querySelector('.segmented-feedback');

      // ── ARIA: expose each control as a radiogroup of radios ──
      var groups = el.querySelectorAll('.segmented-control');
      for (var g = 0; g < groups.length; g++) {
        groups[g].setAttribute('role', 'radiogroup');
        var btns = groups[g].querySelectorAll('.segment-btn');
        for (var b = 0; b < btns.length; b++) {
          var isActive = btns[b].classList.contains('active');
          btns[b].setAttribute('role', 'radio');
          btns[b].setAttribute('aria-checked', isActive ? 'true' : 'false');
          btns[b].setAttribute('tabindex', isActive ? '0' : '-1');
        }
      }

      function activate(btn, group) {
        var siblings = group.querySelectorAll('.segment-btn');
        for (var i = 0; i < siblings.length; i++) {
          siblings[i].classList.remove('active');
          siblings[i].setAttribute('aria-checked', 'false');
          siblings[i].setAttribute('tabindex', '-1');
        }
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        btn.setAttribute('tabindex', '0');

        if (feedback) {
          var value = btn.getAttribute('data-filter') || btn.textContent;
          feedback.textContent = 'ACTIVE FILTER: ' + value.toUpperCase();
        }
      }

      el.addEventListener('click', function(e) {
        var btn = e.target.closest('.segment-btn');
        if (!btn || !el.contains(btn)) {
          return;
        }
        var group = btn.closest('.segmented-control');
        if (!group) {
          return;
        }
        activate(btn, group);
      });

      // Keyboard: arrow keys move selection within the group.
      el.addEventListener('keydown', function(e) {
        var btn = e.target.closest('.segment-btn');
        if (!btn || !el.contains(btn)) return;
        var group = btn.closest('.segmented-control');
        if (!group) return;

        var list = Array.prototype.slice.call(group.querySelectorAll('.segment-btn'));
        var idx = list.indexOf(btn);
        if (idx === -1) return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          var nx = list[(idx + 1) % list.length];
          activate(nx, group); nx.focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          var pv = list[(idx - 1 + list.length) % list.length];
          activate(pv, group); pv.focus();
        }
      });
    }
  });
}
