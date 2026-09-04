DCS_TEST.suite('inputs', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="inputs">' +
      '<div class="calc-container">' +
        '<input type="number" data-calc-input="rpm" id="rpm" value="12000">' +
        '<input type="number" data-calc-input="flutes" id="flutes" value="2">' +
        '<input type="number" data-calc-input="chipload" id="chipload" value="0.003">' +
        '<div data-calc-output id="output"></div>' +
      '</div>' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="inputs"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'inputs component is initialized');

  var output = fix.querySelector('#output');
  var rpmInput = fix.querySelector('#rpm');

  T.assertOk(output.textContent.indexOf('72') !== -1, 'initial feedrate calculation is 72 IPM');

  // Change RPM
  rpmInput.value = '10000';
  rpmInput.dispatchEvent(new Event('input', { bubbles: true }));

  T.assertOk(output.textContent.indexOf('60') !== -1, 're-calculated feedrate is 60 IPM');

  T.cleanup();
});
