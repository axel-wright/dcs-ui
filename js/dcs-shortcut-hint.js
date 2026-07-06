'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-shortcut-hint.js could not register the shortcut-hint component.');
} else {
  window.DCS.register('shortcut-hint', {
    init: function(el) {
      // Progressive enhancement: move data-shortcut into a rendered span so
      // elements that can't author a child span in markup still show a hint.
      var shortcut = el.getAttribute('data-shortcut');
      if (!shortcut) return;
      if (el.querySelector('.dcs-shortcut-hint')) return;

      var hint = document.createElement('span');
      hint.className = 'dcs-shortcut-hint';
      hint.textContent = shortcut;
      el.appendChild(hint);
    }
  });
}
