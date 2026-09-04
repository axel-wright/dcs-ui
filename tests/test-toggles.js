DCS_TEST.suite('toggles', function () {
  var T = DCS_TEST;

  var html =
    '<div data-dcs-component="toggles">' +
      '<label class="toggle-switch">' +
        '<input type="checkbox" id="sw1" checked>' +
        '<span class="toggle-switch-text">Dark Mode</span>' +
        '<span class="toggle-badge active" id="badge">ENABLED</span>' +
      '</label>' +
    '</div>';

  var fix = T.fixture(html);
  var el = fix.querySelector('[data-dcs-component="toggles"]');
  window.DCS._init(el);

  T.assertHasAttribute(el, 'data-dcs-initialized', undefined, 'toggles component is initialized');

  var sw1 = fix.querySelector('#sw1');
  var badge = fix.querySelector('#badge');

  T.assertAttr(sw1, 'role', 'switch', 'checkbox receives role="switch"');
  T.assertAttr(sw1, 'aria-checked', 'true', 'checked switch has aria-checked="true"');

  // Toggle off
  sw1.checked = false;
  sw1.dispatchEvent(new Event('change', { bubbles: true }));

  T.assertAttr(sw1, 'aria-checked', 'false', 'unchecked switch has aria-checked="false"');
  T.assertEqual(badge.textContent, 'DISABLED', 'badge text updated to DISABLED');
  T.assertNotHasClass(badge, 'active', 'badge active class removed');

  // Toggle on
  sw1.checked = true;
  sw1.dispatchEvent(new Event('change', { bubbles: true }));

  T.assertAttr(sw1, 'aria-checked', 'true', 'checked switch has aria-checked="true"');
  T.assertEqual(badge.textContent, 'ENABLED', 'badge text updated to ENABLED');
  T.assertHasClass(badge, 'active', 'badge active class restored');

  T.cleanup();
});
