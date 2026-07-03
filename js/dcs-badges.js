'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('badges', {
    init: function(el) {
      el.addEventListener('click', function(e) {
        // 1. Dismissible badge: click on the dismiss control removes the badge.
        var dismiss = e.target.closest('.badge-dismiss');
        if (dismiss) {
          var dismissible = dismiss.closest('.badge--dismissible');
          if (dismissible) {
            var label = dismissible.textContent.replace(/[×✕✖x]\s*$/i, '').trim();
            dismissible.classList.add('badge--removing');
            setTimeout(function() {
              if (dismissible.parentNode) {
                dismissible.parentNode.removeChild(dismissible);
              }
            }, 150);
            showToast('Badge dismissed: ' + label, 'info');
          }
          return;
        }

        // 2. Status switcher buttons.
        var statusBtn = e.target.closest('[data-action="update-status"]');
        if (statusBtn) {
          var status = statusBtn.getAttribute('data-status');
          var color = statusBtn.getAttribute('data-color');
          if (window.DCS.updateGlobalStatus) {
            window.DCS.updateGlobalStatus(status, color);
          } else {
            showToast('Status changed to: ' + status, 'success');
          }
          return;
        }

        // 3. Ribbon is decorative — clicking the wrapper does nothing.
        if (e.target.closest('.badge-ribbon-wrapper')) {
          return;
        }

        // 4. Count badge: toggle active state.
        var count = e.target.closest('.badge--count, .badge--counter');
        if (count) {
          count.classList.toggle('is-active');
          return;
        }

        // 5. Any other badge acts as a filter toggle.
        var badge = e.target.closest('.badge');
        if (badge) {
          badge.classList.toggle('is-active');
          return;
        }
      });
    }
  });
}

function showToast(message, type) {
  if (window.DCS && window.DCS._showToast) {
    window.DCS._showToast(message, type);
  } else if (window._showToast) {
    window._showToast(message, type);
  }
}
