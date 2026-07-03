'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-image-compare.js could not register the image-compare component.');
} else {
  window.DCS.register('image-compare', {
    init: function(el) {
      // el is the .compare-container [data-dcs-component="image-compare"]
      var before = el.querySelector('.compare-before');
      var handle = el.querySelector('.compare-handle');
      var slider = el.querySelector('.compare-slider');
      if (!before || !slider) {
        return;
      }

      function update(value) {
        var v = Math.max(0, Math.min(100, value));
        // Clip the before layer from the right so only 0..v% remains visible.
        before.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
        before.style.webkitClipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
        if (handle) {
          handle.style.left = v + '%';
        }
      }

      slider.addEventListener('input', function() {
        update(parseFloat(slider.value));
      });

      update(parseFloat(slider.value) || 50);
    }
  });
}
