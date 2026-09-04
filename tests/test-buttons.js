DCS_TEST.suite('buttons', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="buttons">' +
      '<button class="btn btn-primary" id="btn-start">Start Job</button>' +
      '<button class="btn btn-secondary" id="btn-cancel">Cancel</button>' +
      '<button class="btn" id="btn-dis" disabled>Disabled Action</button>' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="buttons"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'buttons component is initialized');

  var btnStart = fix.querySelector('#btn-start');
  var btnCancel = fix.querySelector('#btn-cancel');
  var btnDis = fix.querySelector('#btn-dis');

  T.click(btnStart);
  T.click(btnCancel);
  T.click(btnDis);

  T.cleanup();
});
