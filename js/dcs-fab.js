'use strict';

// Back-to-top scroll detection (global, not per-instance)
(function() {
  var scrollThreshold = 300;
  var ticking = false;

  function updateBackToTopVisibility() {
    var btns = document.querySelectorAll('.fab-back-to-top');
    var shouldShow = window.pageYOffset > scrollThreshold;
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('is-visible', shouldShow);
    }
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        updateBackToTopVisibility();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Click handler for back-to-top buttons
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.fab-back-to-top');
    if (btn) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Initial check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateBackToTopVisibility);
  } else {
    updateBackToTopVisibility();
  }
})();

// DCS fab component (existing behavior)
if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('fab', {
    init: function(el) {
      el.addEventListener('click', function(e) {
        var mainBtn = e.target.closest('.fab-main');
        if (mainBtn) {
          var menu = el.querySelector('.fab-menu');
          if (menu) {
            menu.classList.toggle('visible');
          }

          var msg = mainBtn.getAttribute('data-toast-msg');
          var type = mainBtn.getAttribute('data-toast-type') || 'success';
          if (msg && window.DCS._showToast) {
            window.DCS._showToast(msg, type);
          } else if (msg && window._showToast) {
            window.DCS._showToast(msg, type);
          }
          return;
        }

        var actionBtn = e.target.closest('.fab-action');
        if (actionBtn) {
          var msg = actionBtn.getAttribute('data-toast-msg') || 'Action triggered';
          var type = actionBtn.getAttribute('data-toast-type') || 'success';
          if (window.DCS._showToast) {
            window.DCS._showToast(msg, type);
          } else if (window._showToast) {
            window.DCS._showToast(msg, type);
          }
        }
      });
    }
  });
}
