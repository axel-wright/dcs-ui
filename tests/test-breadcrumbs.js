DCS_TEST.suite('breadcrumbs', function () {
  var T = DCS_TEST;

  var html =
    '<nav data-dcs-component="breadcrumbs" aria-label="Breadcrumb">' +
      '<ol class="breadcrumb">' +
        '<li class="breadcrumb-item"><a href="#" class="breadcrumb-link" id="home">🏠 Home</a></li>' +
        '<li class="breadcrumb-item"><a href="#" class="breadcrumb-link" id="proj" title="Projects">Projects</a></li>' +
        '<li class="breadcrumb-item"><a href="#" class="breadcrumb-link" id="curr">Current Page</a></li>' +
      '</ol>' +
    '</nav>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="breadcrumbs"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'breadcrumbs component is initialized');

  var curr = fix.querySelector('#curr');
  T.assertAttr(curr, 'aria-current', 'page', 'final crumb link gets aria-current="page"');

  var home = fix.querySelector('#home');
  var proj = fix.querySelector('#proj');

  T.click(proj);
  T.click(home);

  T.cleanup();
});
