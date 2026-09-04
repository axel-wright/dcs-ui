DCS_TEST.suite('dropzone', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="dropzone">' +
      '<div class="drop-zone" id="zone"></div>' +
      '<div class="drop-zone-status" id="status"></div>' +
      '<button data-action="dz-dragover" id="btn-dragover">Dragover</button>' +
      '<button data-action="dz-valid" id="btn-valid">Valid</button>' +
      '<button data-action="dz-invalid" id="btn-invalid">Invalid</button>' +
      '<button data-action="dz-reset" id="btn-reset">Reset</button>' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="dropzone"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'dropzone component is initialized');

  var zone = fix.querySelector('#zone');
  var status = fix.querySelector('#status');
  var btnDragover = fix.querySelector('#btn-dragover');
  var btnValid = fix.querySelector('#btn-valid');
  var btnInvalid = fix.querySelector('#btn-invalid');
  var btnReset = fix.querySelector('#btn-reset');

  // Action: dragover
  T.click(btnDragover);
  T.assertHasClass(zone, 'dragover', 'dragover class added to zone');
  T.assertNotHasClass(zone, 'has-file', 'has-file class not on zone during dragover');

  // Action: valid
  T.click(btnValid);
  T.assertNotHasClass(zone, 'dragover', 'dragover class removed on valid file selection');
  T.assertHasClass(zone, 'has-file', 'has-file class added on valid file selection');
  T.assertHasClass(status, 'success', 'status has success class');

  // Action: invalid
  T.click(btnInvalid);
  T.assertNotHasClass(zone, 'has-file', 'has-file class removed on invalid file selection');
  T.assertHasClass(status, 'error', 'status has error class');

  // Action: reset
  T.click(btnReset);
  T.assertNotHasClass(zone, 'dragover', 'dragover class cleared on reset');
  T.assertNotHasClass(zone, 'has-file', 'has-file class cleared on reset');

  T.cleanup();
});
