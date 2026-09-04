// Tests for DCS Carousel component
DCS_TEST.suite('carousel', function() {
  var T = DCS_TEST;

  // ── Setup: basic 3-slide carousel, autoplay disabled to avoid timers ──
  var fix = T.fixture(
    '<div data-dcs-component="carousel" data-autoplay="false" data-cards-visible="3">' +
      '<div class="dcs-carousel-track">' +
        '<div class="dcs-carousel-slide is-active">' +
          '<img class="dcs-carousel-image" src="" alt="Slide 1" />' +
        '</div>' +
        '<div class="dcs-carousel-slide">' +
          '<img class="dcs-carousel-image" src="" alt="Slide 2" />' +
        '</div>' +
        '<div class="dcs-carousel-slide">' +
          '<img class="dcs-carousel-image" src="" alt="Slide 3" />' +
        '</div>' +
      '</div>' +
      '<button class="dcs-carousel-prev" aria-label="Previous slide">&lt;</button>' +
      '<button class="dcs-carousel-next" aria-label="Next slide">&gt;</button>' +
      '<div class="dcs-carousel-dots">' +
        '<button class="dcs-carousel-dot is-active" aria-label="Go to slide 1"></button>' +
        '<button class="dcs-carousel-dot" aria-label="Go to slide 2"></button>' +
        '<button class="dcs-carousel-dot" aria-label="Go to slide 3"></button>' +
      '</div>' +
    '</div>'
  );

  var carousel = fix.querySelector('[data-dcs-component="carousel"]');
  window.DCS._init(carousel);

  var slides = carousel.querySelectorAll('.dcs-carousel-slide');
  var dots = carousel.querySelectorAll('.dcs-carousel-dot');
  var prevBtn = carousel.querySelector('.dcs-carousel-prev');
  var nextBtn = carousel.querySelector('.dcs-carousel-next');
  var track = carousel.querySelector('.dcs-carousel-track');

  // ── Tests ──────────────────────────────────────────────

  // Initial state
  T.assertHasClass(slides[0], 'is-active', 'slide 1 starts active');
  T.assertHasClass(dots[0], 'is-active', 'dot 1 starts active');

  // ARIA landmarks & keyboard accessibility
  T.assertAttr(carousel, 'aria-roledescription', 'carousel', 'carousel has aria-roledescription');
  T.assertAttr(slides[0], 'role', 'group', 'slide has role="group"');
  T.assertAttr(slides[0], 'aria-roledescription', 'slide', 'slide has aria-roledescription="slide"');
  T.assertAttr(track, 'tabindex', '0', 'multiMode track has tabindex="0"');
  T.assertAttr(track, 'aria-label', 'Carousel track', 'multiMode track has aria-label');

  // Next button
  T.click(nextBtn);
  T.assertHasClass(dots[0], 'is-active', 'multiMode page slide active');

  // Keyboard: ArrowRight
  T.keydown(carousel, 'ArrowRight');

  T.cleanup();
});
