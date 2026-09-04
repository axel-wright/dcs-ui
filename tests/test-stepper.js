// Tests for DCS Stepper component
DCS_TEST.suite('stepper', function() {
  var T = DCS_TEST;

  var fix = T.fixture(
    '<div data-dcs-component="stepper">' +
      '<div class="stepper-steps">' +
        '<div class="stepper-step active" data-stepper-step="1">' +
          '<span class="stepper-circle">1</span>' +
          '<span class="stepper-label">Step 1</span>' +
        '</div>' +
        '<div class="stepper-step" data-stepper-step="2">' +
          '<span class="stepper-circle">2</span>' +
          '<span class="stepper-label">Step 2</span>' +
        '</div>' +
        '<div class="stepper-step" data-stepper-step="3">' +
          '<span class="stepper-circle">3</span>' +
          '<span class="stepper-label">Step 3</span>' +
        '</div>' +
      '</div>' +
      '<div data-stepper-content>Content</div>' +
      '<button data-stepper-back>Back</button>' +
      '<button data-stepper-next>Next Step →</button>' +
    '</div>'
  );

  var container = fix.querySelector('[data-dcs-component="stepper"]');
  window.DCS._init(container);

  var steps = fix.querySelectorAll('.stepper-step');
  var backBtn = fix.querySelector('[data-stepper-back]');
  var nextBtn = fix.querySelector('[data-stepper-next]');

  // Initial state & ARIA setup
  T.assertOk(container.hasAttribute('data-dcs-initialized'), 'stepper initialized');
  T.assertAttr(steps[0], 'role', 'button', 'step indicator has role="button"');
  T.assertAttr(steps[0], 'tabindex', '0', 'step indicator has tabindex="0"');
  T.assertHasClass(steps[0], 'active', 'step 1 is active');
  T.assertAttr(steps[0], 'aria-current', 'step', 'step 1 has aria-current="step"');
  T.assertOk(backBtn.disabled, 'back button disabled on step 1');

  // Next button click -> Step 2
  T.click(nextBtn);
  T.assertHasClass(steps[0], 'completed', 'step 1 marked completed');
  T.assertEqual(steps[0].querySelector('.stepper-circle').textContent, '✓', 'step 1 circle gets checkmark');
  T.assertHasClass(steps[1], 'active', 'step 2 is active');
  T.assertAttr(steps[1], 'aria-current', 'step', 'step 2 has aria-current="step"');
  T.assertNotOk(backBtn.disabled, 'back button enabled on step 2');

  // Next button click -> Step 3 (last step)
  T.click(nextBtn);
  T.assertHasClass(steps[2], 'active', 'step 3 is active');
  T.assertEqual(nextBtn.textContent, 'Finish', 'next button text changes to Finish on last step');

  // Back button click -> Step 2
  T.click(backBtn);
  T.assertHasClass(steps[1], 'active', 'back button moves to step 2');

  // Click step indicator jump to Step 1 (since 1 < current 2)
  T.click(steps[0]);
  T.assertHasClass(steps[0], 'active', 'clicking completed step 1 jumps back to it');

  // Keyboard navigation: Space key on step 2 (num === current + 1) jumps to step 2
  T.keydown(steps[1], ' ');
  T.assertHasClass(steps[1], 'active', 'Space key on next step jumps to step 2');

  T.cleanup();
});
