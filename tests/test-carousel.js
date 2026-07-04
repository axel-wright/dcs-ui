// Tests for DCS Carousel component
DCS_TEST.suite('carousel', function() {
  var T = DCS_TEST;

  // ── Setup: basic 3-slide carousel, autoplay disabled to avoid timers ──
  var fix = T.fixture(
    '<div data-dcs-component="carousel" data-autoplay="false">' +
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

  // ── Tests ──────────────────────────────────────────────

  // Initial state
  T.assertHasClass(slides[0], 'is-active', 'slide 1 starts active');
  T.assertHasClass(dots[0], 'is-active', 'dot 1 starts active');
  T.assertAttr(slides[0], 'aria-hidden', 'false', 'active slide aria-hidden="false"');
  T.assertAttr(slides[1], 'aria-hidden', 'true', 'inactive slide aria-hidden="true"');

  // ARIA landmarks
  T.assertAttr(carousel, 'aria-roledescription', 'carousel', 'carousel has aria-roledescription');
  T.assertAttr(slides[0], 'role', 'group', 'slide has role="group"');
  T.assertAttr(slides[0], 'aria-roledescription', 'slide', 'slide has aria-roledescription="slide"');

  // Next button
  T.click(nextBtn);
  T.assertHasClass(slides[1], 'is-active', 'next: slide 2 becomes active');
  T.assertNotHasClass(slides[0], 'is-active', 'next: slide 1 deactivated');
  T.assertHasClass(dots[1], 'is-active', 'next: dot 2 becomes active');

  // Previous button
  T.click(prevBtn);
  T.assertHasClass(slides[0], 'is-active', 'prev: slide 1 active again');
  T.assertHasClass(dots[0], 'is-active', 'prev: dot 1 active');

  // Dot navigation
  T.click(dots[2]);
  T.assertHasClass(slides[2], 'is-active', 'dot click: slide 3 active');
  T.assertHasClass(dots[2], 'is-active', 'dot click: dot 3 active');
  T.assertNotHasClass(slides[0], 'is-active', 'dot click: slide 1 not active');

  // Prev wraps to last slide
  T.click(prevBtn);
  T.assertHasClass(slides[1], 'is-active', 'prev wraps: goes to slide 2');

  // Keyboard: ArrowRight
  T.keydown(carousel, 'ArrowRight');
  T.assertHasClass(slides[2], 'is-active', 'ArrowRight: slide 3 active');

  // Keyboard: ArrowLeft
  T.keydown(carousel, 'ArrowLeft');
  T.assertHasClass(slides[1], 'is-active', 'ArrowLeft: slide 2 active');

  T.cleanup();
});
