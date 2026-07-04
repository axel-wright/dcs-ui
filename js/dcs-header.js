'use strict';

// Sidebar overlay and mobile menu
function initMobileSidebar() {
  var sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // Create overlay backdrop
  var overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.style.cssText = 'display:none;position:fixed;top:70px;left:0;width:100%;height:calc(100vh - 70px);background:rgba(0,0,0,0.5);z-index:998;';
  document.body.appendChild(overlay);

  function open() {
    sidebar.classList.add('open');
    overlay.style.display = 'block';
    var toggles = document.querySelectorAll('.mobile-menu-toggle');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].textContent = '\u2715';
      toggles[i].setAttribute('aria-expanded', 'true');
    }
  }

  function close() {
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
    var toggles = document.querySelectorAll('.mobile-menu-toggle');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].textContent = '\u2630';
      toggles[i].setAttribute('aria-expanded', 'false');
    }
  }

  // Delegate click on ANY mobile-menu-toggle
  document.addEventListener('click', function(e) {
    var toggle = e.target.closest('.mobile-menu-toggle');
    if (toggle) {
      e.preventDefault();
      sidebar.classList.contains('open') ? close() : open();
    }
  });

  // Close on overlay click
  overlay.addEventListener('click', close);

  // Close on sidebar link click
  sidebar.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') close();
  });
}

document.addEventListener('DOMContentLoaded', initMobileSidebar);
