'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('code', {
    init: function(el) {
      el.addEventListener('click', function(e) {
        var btn = e.target.closest('.btn-copy-code');
        if (!btn) return;

        var codeContent = el.querySelector('.code-content');
        if (!codeContent) return;

        var codeLines = codeContent.querySelector('.code-lines');
        var text = codeLines ? codeLines.textContent : codeContent.textContent;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function() {
            if (window.DCS._showToast) {
              window.DCS._showToast('G-CODE COPIED TO CLIPBOARD', 'success');
            }
          })['catch'](function() {
            if (window.DCS._showToast) {
              window.DCS._showToast('FAILED TO COPY G-CODE', 'error');
            }
          });
        } else {
          console.warn('Clipboard API not supported');
        }
      });
    }
  });
}
