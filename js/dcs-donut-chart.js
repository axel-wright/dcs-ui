'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-donut-chart.js could not register the donut-chart component.');
} else {
  var DEFAULT_PALETTE = [
    'var(--accent-primary)',
    'var(--accent-sage)',
    'var(--color-info)',
    'var(--accent-terracotta)',
    'var(--accent-gold)',
    'var(--accent-rose)'
  ];

  window.DCS.register('donut-chart', {
    init: function(el) {
      if (!el) return;
      el.classList.add('dcs-donut-chart');

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

      var customColors = el.getAttribute('data-colors') || '';
      var colors = [];
      if (customColors) {
        var colorParts = customColors.split(',');
        for (var c = 0; c < colorParts.length; c++) {
          colors.push(colorParts[c].trim());
        }
      }
      if (colors.length === 0) {
        colors = DEFAULT_PALETTE;
      }

      var centerLabel = el.getAttribute('data-center-label') || '';
      var reqHeight = parseFloat(el.getAttribute('data-height')) || 180;

      var viewWidth = reqHeight;
      var viewHeight = reqHeight;
      var cx = viewWidth / 2;
      var cy = viewHeight / 2;

      var strokeWidth = 18;
      var pad = 12;
      var outerRadius = Math.min(viewWidth, viewHeight) / 2 - pad;
      var r = outerRadius - strokeWidth / 2;
      var C = 2 * Math.PI * r;

      var sum = 0;
      for (var k = 0; k < values.length; k++) {
        sum += values[k];
      }
      if (sum <= 0) return;

      var accumulatedLen = 0;
      var circlesHtml = '';
      var summaryItems = [];
      var legendHtml = '';

      for (var idx = 0; idx < values.length; idx++) {
        var val = values[idx];
        var lbl = (hasLabels && labels[idx] !== undefined) ? labels[idx] : '';
        var color = colors[idx % colors.length];

        if (lbl) {
          summaryItems.push(lbl + ' ' + val);
        } else {
          summaryItems.push(val);
        }

        var frac = val / sum;
        var dashLen = frac * C;
        var offset = -accumulatedLen;

        var title = lbl ? escapeAttr(lbl + ': ' + val) : escapeAttr(String(val));

        circlesHtml += '<circle cx="' + round(cx) + '" cy="' + round(cy) +
          '" r="' + round(r) + '" fill="none" stroke="' + color +
          '" stroke-width="' + strokeWidth +
          '" stroke-dasharray="' + round(dashLen) + ' ' + round(C) +
          '" stroke-dashoffset="' + round(offset) +
          '"><title>' + title + '</title></circle>';

        accumulatedLen += dashLen;

        if (hasLabels && lbl) {
          legendHtml += '<div class="dcs-donut-chart-legend-item">' +
            '<span class="dcs-donut-chart-legend-swatch" style="background:' + color + ';"></span>' +
            '<span class="dcs-donut-chart-legend-text">' + escapeAttr(lbl) + '</span>' +
            '<span class="dcs-donut-chart-legend-val">' + val + '</span>' +
            '</div>';
        }
      }

      var formattedTotal = Math.round(sum * 100) / 100;
      var totalFontSize = Math.min(28, Math.max(16, viewHeight / 6));

      var centerTextHtml = '';
      if (centerLabel) {
        centerTextHtml += '<text x="' + round(cx) + '" y="' + round(cy - 8) +
          '" class="chart-center-total" font-size="' + totalFontSize + '">' + formattedTotal + '</text>';
        centerTextHtml += '<text x="' + round(cx) + '" y="' + round(cy + 14) +
          '" class="chart-center-label">' + escapeAttr(centerLabel) + '</text>';
      } else {
        centerTextHtml += '<text x="' + round(cx) + '" y="' + round(cy) +
          '" class="chart-center-total" font-size="' + totalFontSize + '">' + formattedTotal + '</text>';
      }

      var defaultAria = 'Donut chart: ' + summaryItems.join(', ');
      var ariaLabel = el.getAttribute('aria-label') || defaultAria;

      var svgHtml = '<svg role="img" aria-label="' + escapeAttr(ariaLabel) +
        '" viewBox="0 0 ' + viewWidth + ' ' + viewHeight +
        '" width="100%" height="' + viewHeight +
        '" preserveAspectRatio="xMidYMid meet">' +
        '<g transform="rotate(-90 ' + round(cx) + ' ' + round(cy) + ')">' +
        circlesHtml +
        '</g>' +
        centerTextHtml +
        '</svg>';

      if (hasLabels && legendHtml) {
        legendHtml = '<div class="dcs-donut-chart-legend">' + legendHtml + '</div>';
      }

      el.innerHTML = svgHtml + legendHtml;

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
