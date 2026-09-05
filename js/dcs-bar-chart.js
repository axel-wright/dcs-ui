'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-bar-chart.js could not register the bar-chart component.');
} else {
  var barChartCounter = 0;

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

      var topPad = 24;
      var bottomPad = hasLabels ? 32 : 20;
      var leftPad = 36;
      var rightPad = 20;

      var baselineY = viewHeight - bottomPad;
      var drawableHeight = baselineY - topPad;

      var maxVal = 0;
      for (var k = 0; k < values.length; k++) {
        if (values[k] > maxVal) maxVal = values[k];
      }
      if (maxVal <= 0) maxVal = 1;

      var drawableWidth = viewWidth - leftPad - rightPad;
      var stepWidth = drawableWidth / values.length;
      var barWidth = Math.min(30, stepWidth * 0.4);

      barChartCounter++;
      var gradId = 'dcs-bar-grad-' + barChartCounter;

      var svgContent = '';

      // Shared vertical linear gradient definition
      svgContent += '<defs>' +
        '<linearGradient id="' + gradId + '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="' + color + '" stop-opacity="0.9" />' +
        '<stop offset="100%" stop-color="' + color + '" stop-opacity="0.45" />' +
        '</linearGradient>' +
        '</defs>';

      // Horizontal grid lines and Y-axis tick labels (~4 steps)
      for (var g = 1; g <= 4; g++) {
        var gridY = baselineY - (drawableHeight * (g / 4));
        var tickVal = Math.round((maxVal * (g / 4)) * 10) / 10;
        svgContent += '<line x1="' + leftPad + '" y1="' + round(gridY) +
          '" x2="' + (viewWidth - rightPad) + '" y2="' + round(gridY) +
          '" class="chart-grid-line" />';
        svgContent += '<text x="' + (leftPad - 6) + '" y="' + round(gridY) +
          '" class="chart-tick-label">' + tickVal + '</text>';
      }

      // Baseline and zero tick
      svgContent += '<line x1="' + (leftPad - 4) + '" y1="' + round(baselineY) +
        '" x2="' + (viewWidth - rightPad + 4) + '" y2="' + round(baselineY) +
        '" class="chart-axis" />';
      svgContent += '<text x="' + (leftPad - 6) + '" y="' + round(baselineY) +
        '" class="chart-tick-label">0</text>';

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

        // Bar rect with gradient fill and subtle radius
        svgContent += '<rect x="' + round(barX) + '" y="' + round(barY) +
          '" width="' + round(barWidth) + '" height="' + round(barH) +
          '" rx="2" ry="2" fill="url(#' + gradId + ')"><title>' + tooltip + '</title></rect>';

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
