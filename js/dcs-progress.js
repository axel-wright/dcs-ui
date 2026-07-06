'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-progress.js could not register the progress component.');
} else {
  window.DCS.register('progress', {
    init: function(el) {
      // Circular variant: the component element is itself the ring. Drive the
      // conic-gradient (see progress-ring.css) from data-* attributes rather
      // than from a child fill's width.
      if (el.classList.contains('dcs-progress-ring')) {
        var value = parseFloat(el.getAttribute('data-progress-value')) || 0;
        var max = parseFloat(el.getAttribute('data-progress-max')) || 100;
        var pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
        var size = parseFloat(el.getAttribute('data-progress-size')) || 80;
        var strokeAttr = el.getAttribute('data-progress-stroke');
        var strokePx = (parseFloat(strokeAttr) || 6) + 'px';
        var ringColor = el.getAttribute('data-progress-color');

        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.setProperty('--ring-pct', String(Math.round(pct)));
        el.style.setProperty('--ring-stroke', strokePx);
        if (ringColor) el.style.setProperty('--ring-color', ringColor);

        // Keep ARIA in step with the rendered value.
        el.setAttribute('aria-valuenow', String(Math.round(value)));
        if (!el.getAttribute('aria-valuemin')) el.setAttribute('aria-valuemin', '0');
        if (!el.getAttribute('aria-valuemax')) el.setAttribute('aria-valuemax', String(Math.round(max)));
        if (!el.getAttribute('role')) el.setAttribute('role', 'progressbar');
        return;
      }

      // Expose each determinate bar as a progressbar. The visible fill width
      // (set inline as a percentage) is the source of truth for aria-valuenow.
      var bars = el.querySelectorAll('.progress-bar-container');
      for (var i = 0; i < bars.length; i++) {
        (function(bar) {
          var fill = bar.querySelector('.progress-bar-fill');
          if (!fill) return;

          bar.setAttribute('role', 'progressbar');
          bar.setAttribute('aria-valuemin', '0');
          bar.setAttribute('aria-valuemax', '100');
          if (!bar.getAttribute('aria-label')) bar.setAttribute('aria-label', 'Progress');

          // Indeterminate mode: no value, just a continuous CSS animation.
          if (bar.hasAttribute('data-progress-indeterminate')) {
            bar.classList.add('is-indeterminate');
            bar.removeAttribute('aria-valuenow');
            return;
          }

          // Optional textual label ("3/8 · 42%") rendered into a sibling
          // .dcs-progress-label within the bar's parent wrapper.
          var label = null;
          if (bar.hasAttribute('data-progress-label') && bar.parentNode) {
            label = bar.parentNode.querySelector('.dcs-progress-label');
          }

          function sync() {
            var pct = Math.round(parseFloat(fill.style.width) || 0);
            bar.setAttribute('aria-valuenow', String(pct));
            if (label) {
              var value = bar.getAttribute('data-progress-value');
              var max = bar.getAttribute('data-progress-max');
              if (value !== null && max !== null) {
                label.textContent = value + '/' + max + ' · ' + pct + '%';
              } else {
                label.textContent = pct + '%';
              }
            }
          }
          sync();

          // Keep aria-valuenow in step with any animated width changes.
          if (window.MutationObserver) {
            var mo = new MutationObserver(sync);
            mo.observe(fill, { attributes: true, attributeFilter: ['style'] });
          }
        })(bars[i]);
      }
    }
  });
}
