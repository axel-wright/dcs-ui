// ═══════════════════════════════════════════════════════════════
// DCS Core — Component Registry & Theme Manager
// Single source of truth for all DCS infrastructure.
// ═══════════════════════════════════════════════════════════════
'use strict';

(function setupDCS() {
  var _registry = {};
  var _instanceCounter = {};

  // ── Get or create window.DCS ────────────────────────────
  window.DCS = window.DCS || {};

  // ── Registry ────────────────────────────────────────────
  window.DCS.register = function(name, controller) {
    _registry[name] = controller;
  };

  window.DCS._init = function(container) {
    container = container || document;
    var els = container.querySelectorAll('[data-dcs-component]:not([data-dcs-initialized])');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var name = el.getAttribute('data-dcs-component');
      var ctrl = _registry[name];
      if (!ctrl) continue;
      if (!_instanceCounter[name]) _instanceCounter[name] = 0;
      _instanceCounter[name]++;
      el.setAttribute('data-dcs-instance', _instanceCounter[name]);
      el.setAttribute('data-dcs-initialized', '');
      if (ctrl.init) ctrl.init(el);
    }
  };

  window.DCS._registeredComponents = function() {
    return Object.keys(_registry);
  };

  // ── Toast ───────────────────────────────────────────────
  // Uses .toast-container / .toast / .toast-{type} classes from dcs-components.css
  window.DCS._showToast = function(message, type) {
    type = type || 'info';
    var container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    // The container is a polite live region so screen readers announce toasts
    // as they arrive without stealing focus.
    if (!container.getAttribute('aria-live')) {
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
    }

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    // Errors/warnings are assertive; everything else is a polite status.
    toast.setAttribute('role', (type === 'error' || type === 'warning' || type === 'danger') ? 'alert' : 'status');
    container.appendChild(toast);

    // Trigger entry animation (CSS: .toast.show = translateY(0), opacity: 1)
    requestAnimationFrame(function() {
      toast.classList.add('show');
    });

    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3000);
  };

  // ── Focus Management ────────────────────────────────────
  // Shared helpers so overlay components (modal, drawer, bottom sheet,
  // command palette) can trap focus consistently.
  var FOCUSABLE_SELECTOR =
    'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
    'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), ' +
    '[contenteditable="true"]';

  // Visible, focusable elements inside a container, in DOM order.
  window.DCS._focusable = function(container) {
    var all = container.querySelectorAll(FOCUSABLE_SELECTOR);
    var out = [];
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      // Skip elements that are hidden (no layout box).
      if (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0) {
        out.push(el);
      }
    }
    return out;
  };

  // Trap keyboard focus inside `container`. Saves the element that had focus,
  // moves focus inside, and cycles Tab / Shift+Tab within. Returns a release()
  // function that removes the trap and restores focus to the trigger.
  window.DCS._trapFocus = function(container) {
    var previouslyFocused = document.activeElement;

    function onKeydown(e) {
      if (e.key !== 'Tab') return;
      var focusable = window.DCS._focusable(container);
      if (!focusable.length) {
        // Nothing focusable inside — keep focus on the container itself.
        e.preventDefault();
        return;
      }
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      var active = document.activeElement;
      if (e.shiftKey) {
        if (active === first || !container.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !container.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    container.addEventListener('keydown', onKeydown);

    // Move focus inside on the next frame so the container is laid out/visible.
    requestAnimationFrame(function() {
      var focusable = window.DCS._focusable(container);
      if (focusable.length) {
        focusable[0].focus();
      } else {
        if (!container.hasAttribute('tabindex')) container.setAttribute('tabindex', '-1');
        container.focus();
      }
    });

    return function release() {
      container.removeEventListener('keydown', onKeydown);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  };

  // ── Theme Toggle ────────────────────────────────────────
  var THEME_KEY = 'dcs-theme';
  var themeGlobalWired = false;

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  // Sync icon + label on EVERY theme toggle button on the page.
  // Supports generated markup (.theme-toggle-icon / .theme-toggle-label)
  // and legacy demo specimens ([data-theme-icon] / [data-theme-label]).
  function syncAllButtons() {
    var theme = currentTheme();
    var icon = theme === 'light' ? '\uD83C\uDF19' : '\u2600\uFE0F'; // 🌙 : ☀️
    var label = theme === 'light' ? 'DARK' : 'LIGHT';
    var btns = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < btns.length; i++) {
      var ic = btns[i].querySelector('.theme-toggle-icon') || btns[i].querySelector('[data-theme-icon]');
      var lb = btns[i].querySelector('.theme-toggle-label') || btns[i].querySelector('[data-theme-label]');
      if (ic) ic.textContent = icon;
      if (lb) lb.textContent = label;
      // Ensure an accessible name + pressed state on every toggle button.
      if (!btns[i].getAttribute('aria-label')) {
        btns[i].setAttribute('aria-label', 'Toggle light and dark theme');
      }
      btns[i].setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    syncAllButtons();
  }

  // Wire page-level theme behavior exactly once.
  // Uses capture-phase delegation so we catch clicks before
  // any bubble-phase handlers that might double-toggle.
  function wireThemeGlobal() {
    if (themeGlobalWired) return;
    themeGlobalWired = true;

    // Restore saved preference on first init.
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved === 'light' || saved === 'dark') {
      applyTheme(saved);
    } else {
      syncAllButtons();
    }

    // Capture-phase delegation: catches clicks on ANY theme toggle button.
    // Stopping propagation prevents legacy per-button handlers from
    // double-toggling.
    document.addEventListener('click', function(e) {
      var btn = e.target && e.target.closest ? e.target.closest('[data-theme-toggle]') : null;
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
    }, true);
  }

  // ── Theme Component Registration ────────────────────────
  // Pages with <div data-dcs-component="theme"> get an auto-injected
  // toggle button. Pages without it still get global theme wiring
  // via wireThemeGlobal() below.
  window.DCS.register('theme', {
    init: function(el) {
      var btn = el.querySelector('[data-theme-toggle]');
      if (!btn) {
        el.innerHTML =
          '<button data-theme-toggle class="theme-toggle-btn" aria-label="Toggle light and dark theme">' +
            '<span class="theme-toggle-icon">\u2600\uFE0F</span>' +
            '<span class="theme-toggle-label">LIGHT</span>' +
          '</button>';
      }
      wireThemeGlobal();
      syncAllButtons();
    }
  });

  // Also wire global theme on load (so pages without a theme component still work).
  wireThemeGlobal();

  // ── Auto-Init ───────────────────────────────────────────
  // _init() is idempotent — skips already-initialized elements.
  // Fire on multiple events to catch components registered after early DOM ready.
  function initAll() {
    wireThemeGlobal();
    window.DCS._init();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initAll();
  } else {
    document.addEventListener('DOMContentLoaded', initAll);
  }

  // Belt and suspenders: retry on full load + after 500ms pause
  window.addEventListener('load', function() { window.DCS._init(); });
  setTimeout(function() { window.DCS._init(); }, 500);
})();
