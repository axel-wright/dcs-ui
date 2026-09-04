DCS_TEST.suite('segmented-control', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="segmented-control" id="seg">' +
      '<div class="segmented-control" id="sc">' +
        '<button class="segment-btn active" id="s1" data-filter="all">All</button>' +
        '<button class="segment-btn" id="s2" data-filter="active">Active</button>' +
        '<button class="segment-btn" id="s3" data-filter="completed">Completed</button>' +
      '</div>' +
      '<div class="segmented-feedback" id="feedback"></div>' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="segmented-control"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'segmented-control is initialized');

  var group = fix.querySelector('#sc');
  var s1 = fix.querySelector('#s1');
  var s2 = fix.querySelector('#s2');
  var s3 = fix.querySelector('#s3');
  var feedback = fix.querySelector('#feedback');

  T.assertAttr(group, 'role', 'radiogroup', 'group receives role="radiogroup"');
  T.assertAttr(s1, 'role', 'radio', 'btn 1 receives role="radio"');
  T.assertAttr(s1, 'aria-checked', 'true', 'active btn 1 has aria-checked="true"');
  T.assertAttr(s1, 'tabindex', '0', 'active btn 1 has tabindex="0"');

  T.assertAttr(s2, 'aria-checked', 'false', 'inactive btn 2 has aria-checked="false"');
  T.assertAttr(s2, 'tabindex', '-1', 'inactive btn 2 has tabindex="-1"');

  // Click s2
  T.click(s2);
  T.assertHasClass(s2, 'active', 'btn 2 receives active class on click');
  T.assertAttr(s2, 'aria-checked', 'true', 'btn 2 aria-checked="true"');
  T.assertAttr(s1, 'aria-checked', 'false', 'btn 1 aria-checked="false"');
  T.assertEqual(feedback.textContent, 'ACTIVE FILTER: ACTIVE', 'feedback text updated for btn 2');

  // Keyboard navigation: ArrowRight on s2 moves to s3
  T.keydown(s2, 'ArrowRight');
  T.assertHasClass(s3, 'active', 'ArrowRight moves active selection to btn 3');
  T.assertAttr(s3, 'aria-checked', 'true', 'btn 3 aria-checked="true"');

  T.cleanup();
});
