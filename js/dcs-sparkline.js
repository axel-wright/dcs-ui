'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-sparkline.js could not register the sparkline component.');
} else {
  window.DCS.register('sparkline', {
    init: function(el) {
      el.classList.add('dcs-sparkline');

      // Parse the comma-separated values into numbers, ignoring blanks/NaN.
      var raw = el.getAttribute('data-sparkline-values') || '';
      var values = [];
      var parts = raw.split(',');
      for (var i = 0; i < parts.length; i++) {
        var n = parseFloat(parts[i]);
        if (!isNaN(n)) values.push(n);
      }
      if (values.length < 2) return; // Nothing meaningful to draw.

      var width = parseFloat(el.getAttribute('data-sparkline-width')) || 120;
      var height = parseFloat(el.getAttribute('data-sparkline-height')) || 32;
      var stroke = parseFloat(el.getAttribute('data-sparkline-stroke')) || 2;

      // Colour resolution: an explicit trend wins over an explicit colour.
      var color = el.getAttribute('data-sparkline-color') || 'var(--accent-primary)';
      var trend = el.getAttribute('data-sparkline-trend');
      if (trend !== null && trend !== '') {
        var t = parseFloat(trend);
        if (!isNaN(t)) {
          if (t > 0) color = 'var(--color-success)';
          else if (t < 0) color = 'var(--color-error)';
          // Flat (0): keep the provided/default colour.
        }
      }

      // Scale values into the drawable box. Leave a stroke-width of padding
      // top and bottom so the line/points never clip at the edges.
      var min = Math.min.apply(null, values);
      var max = Math.max.apply(null, values);
      var range = max - min || 1;
      var pad = stroke;
      var innerH = height - pad * 2;
      var stepX = width / (values.length - 1);

      var pts = [];
      for (var j = 0; j < values.length; j++) {
        var x = j * stepX;
        // Y axis inverted: higher value → smaller y (higher on screen).
        var y = pad + innerH - ((values[j] - min) / range) * innerH;
        pts.push(round(x) + ',' + round(y));
      }
      var linePoints = pts.join(' ');

      // Filled area: the line, then down to the baseline and back to the start.
      var areaPoints = linePoints + ' ' + round(width) + ',' + round(height) +
        ' 0,' + round(height);

      var label = el.getAttribute('aria-label') || 'Sparkline';

      el.innerHTML =
        '<svg role="img" aria-label="' + escapeAttr(label) + '" viewBox="0 0 ' +
          width + ' ' + height + '" width="' + width + '" height="' + height +
          '" preserveAspectRatio="none">' +
          '<polygon points="' + areaPoints + '" fill="' + color +
            '" fill-opacity="0.12" stroke="none"></polygon>' +
          '<polyline points="' + linePoints + '" fill="none" stroke="' + color +
            '" stroke-width="' + stroke +
            '" stroke-linecap="round" stroke-linejoin="round"></polyline>' +
        '</svg>';

      function round(v) {
        return Math.round(v * 100) / 100;
      }
    }
  });

  // Local helper — escape double quotes for safe attribute interpolation.
  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
