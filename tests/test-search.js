DCS_TEST.suite('search', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="search" id="search">' +
      '<input type="search" class="dcs-search-input" id="input" placeholder="Search components...">' +
      '<button type="button" class="dcs-search-clear" id="clear">Clear</button>' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="search"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'search component is initialized');
  T.assertAttr(el, 'role', 'search', 'search container gets role="search"');

  var input = fix.querySelector('#input');
  var clear = fix.querySelector('#clear');

  T.assertAttr(input, 'aria-label', 'Search components...', 'input gets aria-label from placeholder');
  T.assertNotHasClass(el, 'has-value', 'search container starts without has-value class');

  // Type value into input
  input.value = 'modal';
  input.dispatchEvent(new Event('input', { bubbles: true }));

  T.assertHasClass(el, 'has-value', 'search container gets has-value class when input has text');

  // Click clear button
  T.click(clear);

  T.assertEqual(input.value, '', 'input value cleared on clear click');
  T.assertNotHasClass(el, 'has-value', 'has-value class removed after clear');

  T.cleanup();
});
