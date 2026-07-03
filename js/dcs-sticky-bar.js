'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('sticky-bar', {
    init: function(el) {
      // The bar is position: sticky; bottom: -1px. When it is pinned to the
      // bottom of its scroll container, the 1px sliver is clipped and the
      // intersection ratio drops below 1 — that's the "stuck" state.
      if (typeof IntersectionObserver === 'undefined') {
        el.classList.add('is-stuck');
        return;
      }

      var root = el.closest('.dcs-actionbar-scroll') || null;

      var observer = new IntersectionObserver(function(entries) {
        for (var i = 0; i < entries.length; i++) {
          el.classList.toggle('is-stuck', entries[i].intersectionRatio < 1);
        }
      }, {
        root: root,
        threshold: [1],
        rootMargin: '0px 0px -1px 0px'
      });

      observer.observe(el);
    }
  });
}
