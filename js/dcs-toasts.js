'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  var MAX_TOASTS = 5;
  var STACK_GAP = 8; // px between stacked toasts (matches --space-sm)

  // Resolve (or lazily create) the fixed container for a given position.
  // Each position gets its own stack so toasts never overlap across corners.
  function getContainer(position) {
    var pos = position || 'bottom';
    var container = document.querySelector('.dcs-toast-container[data-toast-position="' + pos + '"]');
    if (!container) {
      container = document.createElement('div');
      container.className = 'dcs-toast-container toast-container--' + pos;
      container.setAttribute('data-toast-position', pos);
      container.style.gap = STACK_GAP + 'px';
      // Polite live region so screen readers announce toasts as they arrive.
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(container);
    }
    return container;
  }

  // ── Public API: DCS.toast(message, options) ──────────────
  // options: { type, action:{label,callback}, duration, position }
  window.DCS.toast = function(message, options) {
    options = options || {};
    var type = options.type || 'info';
    var duration = (options.duration == null) ? 4000 : options.duration;
    var position = options.position || 'bottom';
    var container = getContainer(position);

    var toast = document.createElement('div');
    toast.className = 'toast dcs-toast toast-' + type;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    var msg = document.createElement('span');
    msg.className = 'toast-msg';
    msg.textContent = message;
    toast.appendChild(msg);

    var timer = null;
    var dismissed = false;

    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      if (timer) clearTimeout(timer);
      toast.classList.remove('show');
      toast.classList.add('toast-hide');
      setTimeout(function() {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }
    toast._dcsDismiss = dismiss;

    // Optional action button (e.g. Undo). Runs the callback, then dismisses.
    if (options.action && options.action.label) {
      var actionBtn = document.createElement('button');
      actionBtn.type = 'button';
      actionBtn.className = 'toast-action';
      actionBtn.textContent = options.action.label;
      actionBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (typeof options.action.callback === 'function') {
          options.action.callback();
        }
        dismiss();
      });
      toast.appendChild(actionBtn);
    }

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'toast-close';
    closeBtn.setAttribute('aria-label', 'Dismiss notification');
    closeBtn.textContent = '×'; // ×
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dismiss();
    });
    toast.appendChild(closeBtn);

    // Auto-dismiss with a shrinking progress bar (duration 0 = sticky).
    if (duration > 0) {
      var progress = document.createElement('div');
      progress.className = 'toast-progress';
      progress.style.animationDuration = duration + 'ms';
      toast.appendChild(progress);
      timer = setTimeout(dismiss, duration);
    }

    // Clicking the toast body dismisses it too.
    toast.addEventListener('click', function() {
      dismiss();
    });

    container.appendChild(toast);

    // Cap the stack: once past MAX_TOASTS, drop the oldest.
    var live = container.querySelectorAll('.dcs-toast');
    while (live.length > MAX_TOASTS) {
      if (live[0]._dcsDismiss) live[0]._dcsDismiss();
      live = container.querySelectorAll('.dcs-toast:not(.toast-hide)');
      if (!live.length) break;
    }

    requestAnimationFrame(function() {
      toast.classList.add('show');
    });

    return { dismiss: dismiss };
  };

  window.DCS.register('toasts', {
    init: function(el) {
      el.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action="show-toast"]');
        if (!btn) return;

        var msg = btn.getAttribute('data-toast-msg');
        var type = btn.getAttribute('data-toast-type') || 'info';
        var opts = { type: type };

        var position = btn.getAttribute('data-toast-position');
        if (position) opts.position = position;

        var duration = btn.getAttribute('data-toast-duration');
        if (duration !== null) opts.duration = parseInt(duration, 10);

        var actionLabel = btn.getAttribute('data-toast-action');
        if (actionLabel) {
          opts.action = { label: actionLabel, callback: function() {} };
        }

        if (window.DCS.toast) {
          window.DCS.toast(msg, opts);
        } else if (window.DCS._showToast) {
          window.DCS._showToast(msg, type);
        } else {
          console.warn('DCS toast function not found', msg, type);
        }
      });
    }
  });
}
