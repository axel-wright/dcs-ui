'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
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
        openModals[i].classList.remove('open');
      }
    });
  }

  window.DCS.register('modal', {
    init: function(el) {
      el.addEventListener('click', function(e) {
        var openBtn = e.target.closest('[data-action="modal-open"]');
        if (openBtn) {
          var modalName = openBtn.getAttribute('data-modal');
          // Scope to actual modal containers so the trigger button (which also
          // carries data-modal) isn't matched instead of the dialog.
          var modal = el.querySelector('.modal-backdrop[data-modal-name="' + modalName + '"], .modal-overlay[data-modal-name="' + modalName + '"]')
            || el.querySelector('.modal-backdrop[data-modal="' + modalName + '"], .modal-overlay[data-modal="' + modalName + '"]');
          if (modal) {
            modal.classList.add('open');
          }
          return;
        }

        var closeBtn = e.target.closest('[data-action="modal-close"]');
        if (closeBtn) {
          var modalToClose = closeBtn.closest('.modal-backdrop') || closeBtn.closest('.modal-overlay');
          if (modalToClose) {
            modalToClose.classList.remove('open');
          }
          return;
        }

        var confirmDeleteBtn = e.target.closest('[data-action="confirm-delete"]');
        if (confirmDeleteBtn) {
          var modalToDelete = confirmDeleteBtn.closest('.modal-backdrop') || confirmDeleteBtn.closest('.modal-overlay');
          if (modalToDelete) {
            modalToDelete.classList.remove('open');
          }
          if (window.DCS._showToast) {
            window.DCS._showToast('G-CODE ACTION: Profile successfully purged.', 'error');
          }
          return;
        }

        var backdrop = e.target;
        if (backdrop.classList.contains('modal-backdrop') || backdrop.classList.contains('modal-overlay')) {
          backdrop.classList.remove('open');
        }
      });

      bindEscapeOnce();
    }
  });
}
