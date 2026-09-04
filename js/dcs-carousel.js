'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('carousel', {
    init: function(el) {
      var slides = el.querySelectorAll('.dcs-carousel-slide');
      var prev = el.querySelector('.dcs-carousel-prev');
      var next = el.querySelector('.dcs-carousel-next');
      var dots = el.querySelectorAll('.dcs-carousel-dot');
      if (slides.length === 0) return;

      var current = 0;
      var autoplayInterval = 4000;
      var timer = null;
      var progress = null;
      // Respect reduced-motion: never autoplay if the user prefers reduced motion.
      var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var autoplayEnabled = el.getAttribute('data-autoplay') !== 'false' && !reduceMotion;
      var cardsVisible = parseInt(el.getAttribute('data-cards-visible'), 10) || 1;
      var multiMode = cardsVisible > 1;

      // ── ARIA: identify the carousel and label its controls ──
      el.setAttribute('aria-roledescription', 'carousel');
      if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
        el.setAttribute('aria-label', 'Carousel');
      }
      var liveRegion = el.querySelector('.dcs-carousel-track') || el;
      if (multiMode && liveRegion) {
        liveRegion.setAttribute('tabindex', '0');
        if (!liveRegion.getAttribute('aria-label')) {
          liveRegion.setAttribute('aria-label', 'Carousel track');
        }
      }
      // Announce slide changes only when the user drives navigation; keep it
      // silent while autoplay is running so a screen reader isn't spammed.
      liveRegion.setAttribute('aria-live', autoplayEnabled ? 'off' : 'polite');
      for (var sa = 0; sa < slides.length; sa++) {
        slides[sa].setAttribute('role', 'group');
        slides[sa].setAttribute('aria-roledescription', 'slide');
        slides[sa].setAttribute('aria-label', (sa + 1) + ' of ' + slides.length);
      }
      if (prev) prev.setAttribute('aria-label', 'Previous slide');
      if (next) next.setAttribute('aria-label', 'Next slide');
      for (var dl = 0; dl < dots.length; dl++) {
        dots[dl].setAttribute('aria-label', 'Go to slide ' + (dl + 1));
      }

      // Create progress bar — append to active slide's image area
      progress = document.createElement('div');
      progress.className = 'dcs-carousel-progress';

      function showSlide(index) {
        if (multiMode) {
          var totalPages = Math.ceil(slides.length / cardsVisible);
          if (index < 0) index = totalPages - 1;
          if (index >= totalPages) index = 0;
          current = index;
          // Scroll the track to the correct page
          var track = el.querySelector('.dcs-carousel-track');
          if (track) {
            track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
          }
          resetProgress();
          return;
        }
        // Original single-slide logic
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        for (var i = 0; i < slides.length; i++) {
          slides[i].classList.toggle('is-active', i === index);
          slides[i].setAttribute('aria-hidden', i === index ? 'false' : 'true');
        }
        for (var j = 0; j < dots.length; j++) {
          dots[j].classList.toggle('is-active', j === index);
        }
        if (prev) prev.disabled = false;
        if (next) next.disabled = false;
        current = index;
        // Move progress bar to active slide's image
        if (progress && slides[index]) {
          var img = slides[index].querySelector('.dcs-carousel-image');
          if (img) img.appendChild(progress);
        }
        resetProgress();
      }

      function nextSlide() { showSlide(current + 1); }
      function prevSlide() { showSlide(current - 1); }

      // Progress bar animation
      var progressRAF = null;
      var progressStart = 0;
      function resetProgress() {
        if (!autoplayEnabled) return;
        if (progressRAF) cancelAnimationFrame(progressRAF);
        progress.style.transition = 'none';
        progress.style.width = '0%';
        progressStart = performance.now();
        progressRAF = requestAnimationFrame(animateProgress);
      }
      function animateProgress(timestamp) {
        if (!progressStart) progressStart = timestamp;
        var elapsed = timestamp - progressStart;
        var pct = Math.min((elapsed / autoplayInterval) * 100, 100);
        progress.style.transition = 'none';
        progress.style.width = pct + '%';
        if (pct < 100) {
          progressRAF = requestAnimationFrame(animateProgress);
        }
      }

      // Autoplay
      function startAutoplay() {
        if (!autoplayEnabled) return;
        stopAutoplay();
        resetProgress();
        timer = setInterval(function() {
          nextSlide();
        }, autoplayInterval);
      }
      function stopAutoplay() {
        if (timer) { clearInterval(timer); timer = null; }
        if (progressRAF) { cancelAnimationFrame(progressRAF); progressRAF = null; }
      }

      // Pause on hover
      el.addEventListener('mouseenter', function() {
        el.classList.add('is-paused');
        stopAutoplay();
      });
      el.addEventListener('mouseleave', function() {
        el.classList.remove('is-paused');
        startAutoplay();
      });

      // Arrows
      if (prev) prev.addEventListener('click', prevSlide);
      if (next) next.addEventListener('click', nextSlide);

      // Dots
      for (var d = 0; d < dots.length; d++) {
        (function(i) {
          dots[i].addEventListener('click', function() { showSlide(i); });
        })(d);
      }

      // Multi-mode: scroll listener to update dots on drag/swipe
      if (multiMode) {
        var trackEl = el.querySelector('.dcs-carousel-track');
        var scrollTimeout;
        trackEl.addEventListener('scroll', function() {
          if (!trackEl.clientWidth) return;
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(function() {
            var newPage = Math.round(trackEl.scrollLeft / trackEl.clientWidth);
            var totalPages = Math.ceil(slides.length / cardsVisible);
            if (newPage !== current && newPage >= 0 && newPage < totalPages) {
              current = newPage;
              for (var d = 0; d < dots.length; d++) {
                dots[d].classList.toggle('is-active', d === current);
              }
              resetProgress();
            }
          }, 150);
        });
      }

      // Keyboard
      el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
      });

      // Touch swipe
      var touchStartX = 0;
      el.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
      });
      el.addEventListener('touchend', function(e) {
        var diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) nextSlide();
          else prevSlide();
        }
      });

      // Init
      if (multiMode) {
        // All slides visible in multi-mode — mark them active
        for (var s = 0; s < slides.length; s++) {
          slides[s].classList.add('is-active');
        }
        if (dots.length > 0) dots[0].classList.add('is-active');
      }
      showSlide(0);
      // Only autoplay if not explicitly disabled
      if (autoplayEnabled) {
        startAutoplay();
      } else if (progress && progress.parentNode) {
        progress.parentNode.removeChild(progress);
      }
    }
  });
}
