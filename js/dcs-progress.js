'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-progress.js could not register the progress component.');
} else {
  window.DCS.register('progress', {
    init: function(el) {
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

          function sync() {
            var pct = Math.round(parseFloat(fill.style.width) || 0);
            bar.setAttribute('aria-valuenow', String(pct));
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
