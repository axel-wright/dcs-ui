'use strict';

// Sidebar overlay and mobile menu
function initMobileSidebar() {
  var sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // Inject page-level nav links into sidebar for mobile
  var pageLinks = document.createElement('div');
  pageLinks.className = 'sidebar-page-links';
  var pages = [
    { href: 'dcs-warm-dark-guide.html', label: 'Brand Guide' },
    { href: 'dcs-blog.html', label: 'Blog' },
    { href: 'dcs-components-agy-v2.html', label: 'Components' },
    { href: 'dcs-coming-soon.html', label: 'Coming Soon' }
  ];
  var path = window.location.pathname;
  pageLinks.innerHTML = '<div class="sidebar-page-label">PAGES</div>' + pages.map(function(p) {
    var active = path.indexOf(p.href) !== -1 ? ' active-page' : '';
    return '<a href="' + p.href + '" class="sidebar-page-link' + active + '">' + p.label + '</a>';
  }).join('');
  var sectionTitle = sidebar.querySelector('.sidebar-section-title');
  sidebar.insertBefore(pageLinks, sectionTitle);

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

// DCS header component — status dot only
if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('header', {
    init: function(el) {
      el.addEventListener('click', function(e) {
        var dot = e.target.closest('.header-status-dot');
        if (!dot) return;

        var isGreen = dot.classList.contains('pulse-green');
        if (isGreen) {
          dot.classList.remove('pulse-green');
          dot.classList.add('pulse-amber');
          if (window.DCS._showToast) {
            window.DCS._showToast('STATUS CHANGED TO: WARNING / PENDING', 'warning');
          }
        } else {
          dot.classList.remove('pulse-amber');
          dot.classList.add('pulse-green');
          if (window.DCS._showToast) {
            window.DCS._showToast('STATUS CHANGED TO: ONLINE / ACTIVE', 'success');
          }
        }
      });
    }
  });
}
