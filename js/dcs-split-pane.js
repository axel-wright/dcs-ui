'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('split-pane', {
    init: function(el) {
      var handle = el.querySelector('.dcs-split-handle');
      var left = el.querySelector('.dcs-split-left');
      var right = el.querySelector('.dcs-split-right');
      if (!handle || !left || !right) return;

      var isDragging = false;
      var startX = 0;
      var startWidth = 0;

      handle.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startWidth = left.offsetWidth;
        handle.classList.add('active');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
      });

      document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        var dx = e.clientX - startX;
        var containerWidth = el.offsetWidth;
        var newWidth = startWidth + dx;
        var minWidth = 120;
        var maxWidth = containerWidth - minWidth - 6;
        newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
        var pct = (newWidth / containerWidth) * 100;
        left.style.flex = '0 0 ' + pct + '%';
        right.style.flex = '1 1 auto';
      });

      document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        isDragging = false;
        handle.classList.remove('active');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      });
    }
  });
}
