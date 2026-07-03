/* DCS Blog Post — Scripts */
(function() {
  'use strict';

  // IntersectionObserver Scroll Reveal
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  var els = document.querySelectorAll('.reveal-on-scroll');
  for (var i = 0; i < els.length; i++) {
    observer.observe(els[i]);
  }

  // Immediately reveal elements already in the viewport
  requestAnimationFrame(function() {
    var hidden = document.querySelectorAll('.reveal-on-scroll:not(.revealed)');
    for (var j = 0; j < hidden.length; j++) {
      var el = hidden[j];
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
        observer.unobserve(el);
      }
    }
  });
})();
