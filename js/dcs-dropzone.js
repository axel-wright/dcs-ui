'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry is undefined. dcs-dropzone.js could not register the dropzone component.');
} else {
  window.DCS.register('dropzone', {
    init: function(el) {
      // el is the demo-area wrapper [data-dcs-component="dropzone"]
      var zone = el.querySelector('.drop-zone');
      var status = el.querySelector('.drop-zone-status');
      if (!zone || !status) {
        return;
      }

      function setStatus(msg, type) {
        status.className = 'drop-zone-status' + (type ? ' ' + type : '');
        status.textContent = msg || '';
        // The neutral state has no CSS display rule, so show it inline.
        status.style.display = msg ? 'block' : '';
      }

      el.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn || !el.contains(btn)) {
          return;
        }
        var action = btn.getAttribute('data-action');

        if (action === 'dz-dragover') {
          zone.classList.add('dragover');
          zone.classList.remove('has-file');
          setStatus('Release to drop “bracket_v3.nc”…', '');
        } else if (action === 'dz-valid') {
          zone.classList.remove('dragover');
          zone.classList.add('has-file');
          setStatus('✓ Selected: bracket_v3.nc (2.4 MB)', 'success');
        } else if (action === 'dz-invalid') {
          zone.classList.remove('dragover', 'has-file');
          setStatus('✕ Invalid file — only .nc, .tap, .gcode are accepted', 'error');
        } else if (action === 'dz-reset') {
          zone.classList.remove('dragover', 'has-file');
          setStatus('', '');
        }
      });
    }
  });
}
