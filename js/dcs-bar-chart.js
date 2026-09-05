'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-bar-chart.js could not register the bar-chart component.');
} else {
  window.DCS.register('bar-chart', {
    init: function(el) {
      if (!el) return;
      el.classList.add('dcs-bar-chart');

      var rawValues = el.getAttribute('data-values') || '';
      var values = [];
      var valParts = rawValues.split(',');
      for (var i = 0; i < valParts.length; i++) {
        var n = parseFloat(valParts[i].trim());
        if (!isNaN(n)) {
          values.push(n);
        }
      }
      if (values.length === 0) return;

      var rawLabels = el.getAttribute('data-labels') || '';
      var labels = [];
      if (rawLabels) {
        var labelParts = rawLabels.split(',');
        for (var j = 0; j < labelParts.length; j++) {
          labels.push(labelParts[j].trim());
        }
      }
      var hasLabels = labels.length > 0;

      var color = el.getAttribute('data-color') || 'var(--accent-primary)';
      var reqHeight = parseFloat(el.getAttribute('data-height')) || 220;

      var viewWidth = Math.max(400, values.length * 50);
      var viewHeight = reqHeight;

      var topPad = 28;
      var bottomPad = hasLabels ? 32 : 16;
      var leftPad = 24;
      var rightPad = 24;

      var baselineY = viewHeight - bottomPad;
      var drawableHeight = baselineY - topPad;

      var maxVal = 0;
      for (var k = 0; k < values.length; k++) {
        if (values[k] > maxVal) maxVal = values[k];
      }
      if (maxVal <= 0) maxVal = 1;

      var drawableWidth = viewWidth - leftPad - rightPad;
      var stepWidth = drawableWidth / values.length;
      var barWidth = Math.min(44, Math.max(12, stepWidth * 0.55));

      var svgContent = '';

      // Baseline
      svgContent += '<line x1="' + (leftPad - 8) + '" y1="' + round(baselineY) +
        '" x2="' + (viewWidth - rightPad + 8) + '" y2="' + round(baselineY) +
        '" class="chart-axis" />';

      var summaryItems = [];

      for (var idx = 0; idx < values.length; idx++) {
        var val = values[idx];
        var lbl = (hasLabels && labels[idx] !== undefined) ? labels[idx] : '';

        if (lbl) {
          summaryItems.push(lbl + ' ' + val);
        } else {
          summaryItems.push(val);
        }

        var barH = (val / maxVal) * drawableHeight;
        var barX = leftPad + idx * stepWidth + (stepWidth - barWidth) / 2;
        var barY = baselineY - barH;

        var tooltip = lbl ? escapeAttr(lbl + ': ' + val) : escapeAttr(String(val));

        // Bar rect
        svgContent += '<rect x="' + round(barX) + '" y="' + round(barY) +
          '" width="' + round(barWidth) + '" height="' + round(barH) +
          '" rx="3" ry="3" fill="' + color + '"><title>' + tooltip + '</title></rect>';

        // Value label above bar
        svgContent += '<text x="' + round(barX + barWidth / 2) + '" y="' + round(barY - 6) +
          '" class="chart-value-label">' + val + '</text>';

        // Category label below baseline
        if (hasLabels && lbl) {
          svgContent += '<text x="' + round(barX + barWidth / 2) + '" y="' + round(baselineY + 18) +
            '" class="chart-category-label">' + escapeAttr(lbl) + '</text>';
        }
      }

      var defaultAria = 'Bar chart: ' + summaryItems.join(', ');
      var ariaLabel = el.getAttribute('aria-label') || defaultAria;

      el.innerHTML =
        '<svg role="img" aria-label="' + escapeAttr(ariaLabel) +
        '" viewBox="0 0 ' + viewWidth + ' ' + viewHeight +
        '" width="100%" height="' + viewHeight +
        '" preserveAspectRatio="xMidYMid meet">' +
        svgContent +
        '</svg>';

      function round(v) {
        return Math.round(v * 100) / 100;
      }
    }
  });

  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
