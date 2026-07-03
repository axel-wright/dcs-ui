'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-segmented-control.js could not register the segmented-control component.');
} else {
  window.DCS.register('segmented-control', {
    init: function(el) {
      // el is the interactive demo wrapper [data-dcs-component="segmented-control"]
      var feedback = el.querySelector('.segmented-feedback');

      el.addEventListener('click', function(e) {
        var btn = e.target.closest('.segment-btn');
        if (!btn || !el.contains(btn)) {
          return;
        }

        var group = btn.closest('.segmented-control');
        if (!group) {
          return;
        }

        var siblings = group.querySelectorAll('.segment-btn');
        for (var i = 0; i < siblings.length; i++) {
          siblings[i].classList.remove('active');
        }
        btn.classList.add('active');

        if (feedback) {
          var value = btn.getAttribute('data-filter') || btn.textContent;
          feedback.textContent = 'ACTIVE FILTER: ' + value.toUpperCase();
        }
      });
    }
  });
}
