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

  // Delegate click on ANY mobile-menu-toggle — except those inside a header
  // component demo, which toggle their own nav-links (see register('header')).
  document.addEventListener('click', function(e) {
    var toggle = e.target.closest('.mobile-menu-toggle');
    if (toggle && !toggle.closest('[data-dcs-component="header"]')) {
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

// Header component — self-contained nav specimen. Its hamburger toggles the
// instance's own .nav-links dropdown rather than the page sidebar.
if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('header', {
    init: function(el) {
      el.addEventListener('click', function(e) {
        var toggle = e.target.closest('.mobile-menu-toggle');
        if (!toggle) return;
        e.preventDefault();
        var links = el.querySelector('.nav-links');
        if (!links) return;
        var isOpen = links.classList.toggle('open');
        toggle.textContent = isOpen ? '✕' : '☰';
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  });
}
