// Tests for DCS Toasts component
DCS_TEST.suite('toasts', function() {
  var T = DCS_TEST;

  // 1. Direct DCS.toast API call
  var actionCalled = false;
  var res = window.DCS.toast('Hello Toast', {
    type: 'success',
    duration: 0, // sticky
    position: 'top-right',
    action: {
      label: 'Undo',
      callback: function() { actionCalled = true; }
    }
  });

  var container = document.querySelector('.dcs-toast-container[data-toast-position="top-right"]');
  T.assertOk(container, 'container created for position top-right');
  T.assertAttr(container, 'aria-live', 'polite', 'container has aria-live="polite"');

  var toast = container.querySelector('.dcs-toast');
  T.assertOk(toast, 'toast element appended');
  T.assertHasClass(toast, 'toast-success', 'toast has type class toast-success');
  T.assertAttr(toast, 'role', 'alert', 'toast has role="alert"');

  var msgEl = toast.querySelector('.toast-msg');
  T.assertEqual(msgEl.textContent, 'Hello Toast', 'toast message matches');

  // Action button click
  var actionBtn = toast.querySelector('.toast-action');
  T.assertOk(actionBtn, 'action button rendered');
  T.assertEqual(actionBtn.textContent, 'Undo', 'action label matches');
  T.click(actionBtn);
  T.assertOk(actionCalled, 'action callback invoked on click');

  // 2. Component init delegation (clicks on data-action="show-toast")
  var fix = T.fixture(
    '<div data-dcs-component="toasts">' +
      '<button type="button" data-action="show-toast" data-toast-msg="Triggered Toast" data-toast-type="danger" data-toast-position="bottom" data-toast-duration="0">Trigger</button>' +
    '</div>'
  );

  var wrapper = fix.querySelector('[data-dcs-component="toasts"]');
  window.DCS._init(wrapper);

  var triggerBtn = fix.querySelector('[data-action="show-toast"]');
  T.click(triggerBtn);

  var btmContainer = document.querySelector('.dcs-toast-container[data-toast-position="bottom"]');
  T.assertOk(btmContainer, 'bottom container created');

  var triggeredToast = btmContainer.querySelector('.toast-danger');
  T.assertOk(triggeredToast, 'triggered toast created with type danger');
  T.assertEqual(triggeredToast.querySelector('.toast-msg').textContent, 'Triggered Toast', 'toast message matches attribute');

  // Close button click dismisses
  var closeBtn = triggeredToast.querySelector('.toast-close');
  T.assertOk(closeBtn, 'close button exists');
  T.click(closeBtn);
  T.assertHasClass(triggeredToast, 'toast-hide', 'toast given toast-hide class on close');

  // Manual dismiss via returned API handle
  if (res && res.dismiss) {
    res.dismiss();
  }

  T.cleanup();
});
