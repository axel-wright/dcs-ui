'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-area-chart.js could not register the area-chart component.');
} else {
  var areaChartCounter = 0;

  window.DCS.register('area-chart', {
    init: function(el) {
      if (!el) return;
      el.classList.add('dcs-area-chart');

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
      var leftPad = 24;
      var rightPad = 24;

      var baselineY = viewHeight - bottomPad;
      var drawableHeight = baselineY - topPad;
      var drawableWidth = viewWidth - leftPad - rightPad;

      var minVal = Math.min.apply(null, values);
      var maxVal = Math.max.apply(null, values);
      var baseVal = minVal >= 0 ? 0 : minVal;
      var range = (maxVal - baseVal) || 1;

      var stepX = values.length > 1 ? drawableWidth / (values.length - 1) : drawableWidth / 2;

      areaChartCounter++;
      var gradId = 'dcs-area-grad-' + areaChartCounter;

      var svgContent = '';

      // Defs with linear gradient
      svgContent += '<defs>' +
        '<linearGradient id="' + gradId + '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="' + color + '" stop-opacity="0.35" />' +
        '<stop offset="100%" stop-color="' + color + '" stop-opacity="0.0" />' +
        '</linearGradient>' +
        '</defs>';

      // Grid lines (25%, 50%, 75%)
      for (var g = 1; g <= 3; g++) {
        var gridY = baselineY - (drawableHeight * (g / 4));
        svgContent += '<line x1="' + leftPad + '" y1="' + round(gridY) +
          '" x2="' + (viewWidth - rightPad) + '" y2="' + round(gridY) +
          '" class="chart-grid-line" />';
      }

      // Baseline
      svgContent += '<line x1="' + (leftPad - 8) + '" y1="' + round(baselineY) +
        '" x2="' + (viewWidth - rightPad + 8) + '" y2="' + round(baselineY) +
        '" class="chart-axis" />';

      var points = [];
      var summaryItems = [];

      for (var idx = 0; idx < values.length; idx++) {
        var val = values[idx];
        var lbl = (hasLabels && labels[idx] !== undefined) ? labels[idx] : '';

        if (lbl) {
          summaryItems.push(lbl + ' ' + val);
        } else {
          summaryItems.push(val);
        }

        var px = leftPad + (values.length > 1 ? idx * stepX : drawableWidth / 2);
        var py = baselineY - ((val - baseVal) / range) * drawableHeight;

        points.push({ x: px, y: py, val: val, lbl: lbl });
      }

      if (points.length > 0) {
        // Line path
        var lineD = 'M ' + round(points[0].x) + ',' + round(points[0].y);
        for (var p = 1; p < points.length; p++) {
          lineD += ' L ' + round(points[p].x) + ',' + round(points[p].y);
        }

        // Area path (closed to baseline)
        var areaD = lineD +
          ' L ' + round(points[points.length - 1].x) + ',' + round(baselineY) +
          ' L ' + round(points[0].x) + ',' + round(baselineY) + ' Z';

        // Fill area
        svgContent += '<path d="' + areaD + '" fill="url(#' + gradId + ')" stroke="none" />';

        // Stroke line
        svgContent += '<path d="' + lineD + '" fill="none" stroke="' + color +
          '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />';

        // Data points and labels
        for (var ptIdx = 0; ptIdx < points.length; ptIdx++) {
          var pt = points[ptIdx];
          var title = pt.lbl ? escapeAttr(pt.lbl + ': ' + pt.val) : escapeAttr(String(pt.val));

          svgContent += '<circle cx="' + round(pt.x) + '" cy="' + round(pt.y) +
            '" r="4" fill="' + color + '" stroke="var(--surface-default)" stroke-width="2"' +
            ' class="chart-data-point"><title>' + title + '</title></circle>';

          if (hasLabels && pt.lbl) {
            svgContent += '<text x="' + round(pt.x) + '" y="' + round(baselineY + 18) +
              '" class="chart-tick-label">' + escapeAttr(pt.lbl) + '</text>';
          }
        }
      }

      var defaultAria = 'Area chart: ' + summaryItems.join(', ');
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
