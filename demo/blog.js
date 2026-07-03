/* DCS Blog — Scripts */
(function() {
  'use strict';

  // Category Filter Module
  document.addEventListener('DOMContentLoaded', function() {
    var tabs = document.querySelectorAll('.filter-tab');
    var cards = document.querySelectorAll('.blog-card-link');

    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function() {
        // Update active tab
        for (var j = 0; j < tabs.length; j++) {
          tabs[j].classList.remove('active');
          tabs[j].setAttribute('aria-selected', 'false');
        }
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        var category = this.getAttribute('data-category') || this.dataset.category;

        for (var k = 0; k < cards.length; k++) {
          var card = cards[k];
          var cardCat = card.getAttribute('data-category') || card.dataset.category;
          if (category === 'all' || cardCat === category) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        }
      });
    }
  });

  // IntersectionObserver Scroll Reveal
  (function() {
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

    // Immediately reveal any elements already in the viewport
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
})();
