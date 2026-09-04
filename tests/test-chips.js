DCS_TEST.suite('chips', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="chips">' +
      '<div class="chip" id="chip1"><span>Tag1</span><span class="chip-close" id="close1">&times;</span></div>' +
      '<input type="text" data-chip-input id="chip-input">' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="chips"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'chips component is initialized');

  var chip1 = fix.querySelector('#chip1');
  var close1 = fix.querySelector('#close1');
  var input = fix.querySelector('#chip-input');

  // Remove chip on close click
  T.click(close1);
  T.assertEqual(fix.querySelector('#chip1'), null, 'chip1 is removed on close click');

  // Create new chip on Enter
  input.value = 'New Tag';
  T.keydown(input, 'Enter');

  var newChips = el.querySelectorAll('.chip');
  T.assertEqual(newChips.length, 1, 'new chip added to container');
  T.assertEqual(newChips[0].querySelector('span').textContent, 'New Tag', 'new chip text matches input value');
  T.assertEqual(input.value, '', 'input cleared after adding chip');

  T.cleanup();
});
