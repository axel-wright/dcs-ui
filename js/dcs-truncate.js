'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-truncate.js could not register the truncate component.');
} else {
  window.DCS.register('truncate', {
    init: function(el) {
      var lines = parseInt(el.getAttribute('data-truncate-lines'), 10) || 3;

      // Move the original content into an inner wrapper so the line clamp only
      // affects the text, never the toggle button we append alongside it.
      var content = document.createElement('div');
      while (el.firstChild) content.appendChild(el.firstChild);
      el.appendChild(content);

      function clamp() {
        content.style.display = '-webkit-box';
        content.style.webkitBoxOrient = 'vertical';
        content.style.webkitLineClamp = String(lines);
        content.style.overflow = 'hidden';
      }

      function unclamp() {
        content.style.display = 'block';
        content.style.webkitLineClamp = 'unset';
        content.style.overflow = 'visible';
      }

      clamp();

      // Only add the toggle if the content actually overflows its clamp.
      if (content.scrollHeight <= content.clientHeight) return;

      var expanded = false;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-sm btn-ghost';
      btn.textContent = 'Show more';
      // Separate the toggle from the clamped text (the button is inline-flex,
      // so it otherwise butts directly against the last visible line).
      btn.style.marginTop = 'var(--space-sm)';
      el.appendChild(btn);

      btn.addEventListener('click', function() {
        expanded = !expanded;
        if (expanded) {
          unclamp();
          btn.textContent = 'Show less';
        } else {
          clamp();
          btn.textContent = 'Show more';
          if (el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }
  });
}
