DCS_TEST.suite('progress', function () {
  var T = DCS_TEST;

  var html =
    '<div>' +
      '<div data-dcs-component="progress" class="dcs-progress-ring" id="ring" data-progress-value="75" data-progress-max="100"></div>' +
      '<div data-dcs-component="progress" id="bar-comp">' +
        '<div class="progress-bar-container" id="bar">' +
          '<div class="progress-bar-fill" id="fill" style="width: 40%;"></div>' +
        '</div>' +
        '<div class="progress-bar-container" id="indet-bar" data-progress-indeterminate>' +
          '<div class="progress-bar-fill"></div>' +
        '</div>' +
      '</div>' +
    '</div>';

  var fix = T.fixture(html);
  var ring = fix.querySelector('#ring');
  var barComp = fix.querySelector('#bar-comp');
  window.DCS._init(ring);
  window.DCS._init(barComp);

  T.assertHasAttribute(ring, 'data-dcs-initialized', undefined, 'progress ring is initialized');
  T.assertHasAttribute(barComp, 'data-dcs-initialized', undefined, 'progress bar component is initialized');

  // Ring progressbar ARIA + style
  T.assertAttr(ring, 'role', 'progressbar', 'ring has role="progressbar"');
  T.assertAttr(ring, 'aria-valuenow', '75', 'ring aria-valuenow is 75');
  T.assertEqual(ring.style.getPropertyValue('--ring-pct'), '75', '--ring-pct property set to 75');

  // Bar progressbar ARIA
  var bar = fix.querySelector('#bar');
  T.assertAttr(bar, 'role', 'progressbar', 'bar has role="progressbar"');
  T.assertAttr(bar, 'aria-valuenow', '40', 'bar aria-valuenow set from fill width');

  // Indeterminate bar
  var indetBar = fix.querySelector('#indet-bar');
  T.assertHasClass(indetBar, 'is-indeterminate', 'indeterminate bar gets is-indeterminate class');
  T.assertAttr(indetBar, 'aria-valuenow', null, 'indeterminate bar has no aria-valuenow');

  T.cleanup();
});
