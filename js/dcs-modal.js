'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  var uidCounter = 0;

  // Wire ARIA roles on a modal container (the .modal-backdrop / .modal-overlay).
  // Idempotent — safe to call more than once.
  function ensureAria(modal) {
    var box = modal.querySelector('.modal-box') || modal;
    if (box.getAttribute('role') !== 'dialog') {
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
    }
    if (!box.getAttribute('aria-labelledby')) {
      var title = modal.querySelector('.modal-title');
      if (title) {
        if (!title.id) title.id = 'dcs-modal-title-' + (++uidCounter);
        box.setAttribute('aria-labelledby', title.id);
      } else if (!box.getAttribute('aria-label')) {
        box.setAttribute('aria-label', 'Dialog');
      }
    }
  }

  function openModal(modal) {
    ensureAria(modal);
    modal.classList.add('open');
    // Trap focus and remember how to release it on close.
    var box = modal.querySelector('.modal-box') || modal;
    modal._dcsRelease = window.DCS._trapFocus(box);
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    if (modal._dcsRelease) {
      modal._dcsRelease();
      modal._dcsRelease = null;
    }
  }

  // Shared flag so the document-level Escape listener is attached only once,
  // no matter how many modal containers get initialized.
  var escBound = false;

  function bindEscapeOnce() {
    if (escBound) return;
    escBound = true;
    document.addEventListener('keydown', function(e) {
      if (e.key !== 'Escape') return;
      var openModals = document.querySelectorAll('.modal-backdrop.open, .modal-overlay.open');
      for (var i = 0; i < openModals.length; i++) {
        // Static modals ignore Escape — only an explicit close button or a
        // programmatic close dismisses them.
        if (openModals[i].hasAttribute('data-modal-static')) continue;
        closeModal(openModals[i]);
      }
    });
  }

  window.DCS.register('modal', {
    init: function(el) {
      // Pre-wire ARIA on any modals present so screen readers see the roles
      // even before the dialog is opened.
      var modals = el.querySelectorAll('.modal-backdrop, .modal-overlay');
      for (var m = 0; m < modals.length; m++) ensureAria(modals[m]);

      el.addEventListener('click', function(e) {
        var openBtn = e.target.closest('[data-action="modal-open"]');
        if (openBtn) {
          var modalName = openBtn.getAttribute('data-modal');
          // Scope to actual modal containers so the trigger button (which also
          // carries data-modal) isn't matched instead of the dialog.
          var modal = el.querySelector('.modal-backdrop[data-modal-name="' + modalName + '"], .modal-overlay[data-modal-name="' + modalName + '"]')
            || el.querySelector('.modal-backdrop[data-modal="' + modalName + '"], .modal-overlay[data-modal="' + modalName + '"]');
          if (modal) {
            openModal(modal);
          }
          return;
        }

        var closeBtn = e.target.closest('[data-action="modal-close"]');
        if (closeBtn) {
          var modalToClose = closeBtn.closest('.modal-backdrop') || closeBtn.closest('.modal-overlay');
          if (modalToClose) {
            closeModal(modalToClose);
          }
          return;
        }

        var confirmDeleteBtn = e.target.closest('[data-action="confirm-delete"]');
        if (confirmDeleteBtn) {
          var modalToDelete = confirmDeleteBtn.closest('.modal-backdrop') || confirmDeleteBtn.closest('.modal-overlay');
          if (modalToDelete) {
            closeModal(modalToDelete);
          }
          return;
        }

        var backdrop = e.target;
        if (backdrop.classList.contains('modal-backdrop') || backdrop.classList.contains('modal-overlay')) {
          // Static modals ignore backdrop clicks.
          if (backdrop.hasAttribute('data-modal-static')) return;
          closeModal(backdrop);
        }
      });

      bindEscapeOnce();
    }
  });
}
