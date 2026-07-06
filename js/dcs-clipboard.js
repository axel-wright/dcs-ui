'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-clipboard.js could not register the clipboard component.');
} else {
  window.DCS.register('clipboard', {
    init: function(el) {
      var restoreTimer = null;

      function flash(text, ok) {
        var original = el.getAttribute('data-clipboard-original');
        if (original === null) {
          original = el.textContent;
          el.setAttribute('data-clipboard-original', original);
        }
        if (restoreTimer) clearTimeout(restoreTimer);
        el.textContent = text;
        el.classList.toggle('copied', !!ok);
        restoreTimer = setTimeout(function() {
          el.textContent = el.getAttribute('data-clipboard-original');
          el.classList.remove('copied');
        }, 2000);
      }

      function onSuccess() {
        flash('Copied!', true);
        if (window.DCS && typeof window.DCS._showToast === 'function') {
          window.DCS._showToast('Copied to clipboard', 'success');
        }
      }

      function onError() {
        flash('Failed', false);
        if (window.DCS && typeof window.DCS._showToast === 'function') {
          window.DCS._showToast('Copy failed', 'error');
        }
      }

      el.addEventListener('click', function() {
        var text = el.hasAttribute('data-clipboard-text')
          ? el.getAttribute('data-clipboard-text')
          : el.textContent;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(onSuccess, onError);
        } else {
          onError();
        }
      });
    }
  });
}
