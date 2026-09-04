// Tests for DCS Slider component
DCS_TEST.suite('slider', function() {
  var T = DCS_TEST;

  var fix = T.fixture(
    '<div data-dcs-component="slider">' +
      '<span class="slider-label">Volume</span>' +
      '<input type="range" class="range-slider" min="0" max="100" value="30">' +
      '<div class="range-fill"></div>' +
      '<span class="range-badge">30%</span>' +
      '<div class="slider-current-label">Current: 30%</div>' +
      '<div class="jog-group">' +
        '<div class="jog-btn active" data-jog="Low">Low</div>' +
        '<div class="jog-btn" data-jog="Med">Med</div>' +
        '<div class="jog-btn" data-jog="High">High</div>' +
      '</div>' +
      '<div class="jog-display">Active: Low</div>' +
    '</div>'
  );

  var container = fix.querySelector('[data-dcs-component="slider"]');
  window.DCS._init(container);

  var slider = fix.querySelector('.range-slider');
  var fill = fix.querySelector('.range-fill');
  var badge = fix.querySelector('.range-badge');
  var currentLabel = fix.querySelector('.slider-current-label');
  var jogGroup = fix.querySelector('.jog-group');
  var jogBtns = fix.querySelectorAll('.jog-btn');
  var jogDisplay = fix.querySelector('.jog-display');

  // Initial state & ARIA
  T.assertOk(container.hasAttribute('data-dcs-initialized'), 'slider initialized');
  T.assertAttr(slider, 'aria-label', 'Volume', 'range input accessible label set from .slider-label');
  T.assertAttr(slider, 'aria-valuetext', '30%', 'aria-valuetext set on init');
  T.assertEqual(fill.style.width, '30%', 'fill width matches initial value');
  T.assertAttr(jogGroup, 'role', 'radiogroup', 'jog group has role="radiogroup"');
  T.assertAttr(jogBtns[0], 'role', 'radio', 'jog btn has role="radio"');
  T.assertAttr(jogBtns[0], 'aria-checked', 'true', 'active jog btn has aria-checked="true"');
  T.assertAttr(jogBtns[1], 'aria-checked', 'false', 'inactive jog btn has aria-checked="false"');

  // Input event updates range slider UI
  slider.value = '75';
  var evt = new Event('input', { bubbles: true });
  slider.dispatchEvent(evt);

  T.assertAttr(slider, 'aria-valuetext', '75%', 'aria-valuetext updated to 75%');
  T.assertEqual(fill.style.width, '75%', 'fill width updated to 75%');
  T.assertEqual(badge.textContent, '75%', 'badge updated to 75%');
  T.assertEqual(currentLabel.textContent, 'Current: 75%', 'current label updated to Current: 75%');

  // Click jog button selects notch
  T.click(jogBtns[1]);
  T.assertHasClass(jogBtns[1], 'active', 'Med jog button becomes active on click');
  T.assertAttr(jogBtns[1], 'aria-checked', 'true', 'Med jog button aria-checked="true"');
  T.assertAttr(jogBtns[0], 'aria-checked', 'false', 'Low jog button aria-checked="false"');
  T.assertEqual(jogDisplay.textContent, 'Active: Med', 'jog display updated to Active: Med');

  // Keyboard navigation on jog buttons: ArrowRight
  jogBtns[1].focus();
  T.keydown(jogBtns[1], 'ArrowRight');
  T.assertHasClass(jogBtns[2], 'active', 'ArrowRight moves selection to High');
  T.assertEqual(jogDisplay.textContent, 'Active: High', 'jog display updated to Active: High');

  // Keyboard navigation: ArrowLeft
  T.keydown(jogBtns[2], 'ArrowLeft');
  T.assertHasClass(jogBtns[1], 'active', 'ArrowLeft moves selection back to Med');

  T.cleanup();
});
