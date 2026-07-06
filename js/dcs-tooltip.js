'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-tooltip.js could not register the tooltip component.');
} else {
  window.DCS.register('tooltip', {
    init: function(el) {
      // The component element scopes the triggers; when placed on <body> or a
      // wrapper it enhances every [data-tooltip] inside it.
      var triggers = el.hasAttribute('data-tooltip')
        ? [el]
        : Array.prototype.slice.call(el.querySelectorAll('[data-tooltip]'));

      var GAP = 8;         // Distance between trigger and tooltip.
      var tipEl = null;    // The single shared floating tooltip element.
      var touchTimer = null;

      function ensureTip() {
        if (tipEl) return tipEl;
        tipEl = document.createElement('div');
        tipEl.className = 'dcs-tooltip-js';
        tipEl.setAttribute('role', 'tooltip');
        tipEl.style.position = 'absolute';
        tipEl.style.visibility = 'hidden';
        document.body.appendChild(tipEl);
        return tipEl;
      }

      function show(trigger) {
        var text = trigger.getAttribute('data-tooltip');
        if (!text) return;
        var tip = ensureTip();
        tip.textContent = text;

        // Accessibility: link the tooltip to the trigger if it opts in.
        var described = trigger.getAttribute('aria-describedby');
        if (described) tip.setAttribute('id', described);
        else tip.removeAttribute('id');

        tip.style.visibility = 'hidden';
        tip.style.display = 'block';
        position(trigger, tip);
        tip.style.visibility = 'visible';
        tip.classList.add('is-visible');
      }

      function hide() {
        if (!tipEl) return;
        tipEl.classList.remove('is-visible');
        tipEl.style.visibility = 'hidden';
        tipEl.style.display = 'none';
      }

      function position(trigger, tip) {
        var r = trigger.getBoundingClientRect();
        var tw = tip.offsetWidth;
        var th = tip.offsetHeight;
        var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        var vw = document.documentElement.clientWidth;
        var vh = document.documentElement.clientHeight;

        // Default: centered above the trigger. Flip below if it would clip the
        // top edge of the viewport.
        var top = r.top - th - GAP;
        if (top < 0) top = r.bottom + GAP;
        // If it now clips the bottom, keep it above regardless.
        if (top + th > vh && r.top - th - GAP >= 0) top = r.top - th - GAP;

        var left = r.left + (r.width - tw) / 2;
        // Nudge horizontally into view.
        if (left < GAP) left = GAP;
        if (left + tw > vw - GAP) left = vw - GAP - tw;

        tip.style.top = (top + scrollY) + 'px';
        tip.style.left = (left + scrollX) + 'px';
      }

      for (var i = 0; i < triggers.length; i++) {
        (function(trigger) {
          trigger.addEventListener('mouseenter', function() { show(trigger); });
          trigger.addEventListener('mouseleave', hide);
          trigger.addEventListener('focus', function() { show(trigger); });
          trigger.addEventListener('blur', hide);

          trigger.addEventListener('touchstart', function() {
            show(trigger);
            if (touchTimer) clearTimeout(touchTimer);
            touchTimer = setTimeout(hide, 3000);
          }, { passive: true });
          trigger.addEventListener('touchend', function() {
            if (touchTimer) clearTimeout(touchTimer);
            touchTimer = setTimeout(hide, 200);
          });
        })(triggers[i]);
      }
    }
  });
}
