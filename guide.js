/* DCS Warm Dark Brand Guide — page-specific layer (only what the registry cannot do). */
(function () {
  'use strict';

  // Mobile nav toggle
  document.addEventListener('click', function(e) {
    var toggle = e.target.closest('.mobile-menu-toggle');
    if (!toggle) {
      // Close if clicking outside
      var links = document.querySelector('.nav-links');
      if (links && links.classList.contains('open') && !e.target.closest('.nav-links')) {
        links.classList.remove('open');
      }
      return;
    }
    var links = document.querySelector('.nav-links');
    if (links) {
      links.classList.toggle('open');
      toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
    }
  });

  // Close mobile nav when a link is clicked
  document.addEventListener('click', function(e) {
    var link = e.target.closest('.nav-links a');
    if (link) {
      var links = document.querySelector('.nav-links');
      var toggle = document.querySelector('.mobile-menu-toggle');
      if (links && links.classList.contains('open')) {
        links.classList.remove('open');
        if (toggle) toggle.textContent = '☰';
      }
    }
  });

  function toast(msg) {
    if (window.DCS && typeof window.DCS._showToast === 'function') window.DCS._showToast(msg);
  }
  function flash(el) {
    el.style.borderColor = 'var(--accent-sage)';
    setTimeout(function () { el.style.borderColor = ''; }, 800);
  }
  function copy(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {});
    }
  }
  function palette() { return document.querySelector('.palette-overlay'); }
  function visibleItems() {
    return Array.prototype.filter.call(document.querySelectorAll('.palette-item'),
      function (i) { return i.style.display !== 'none'; });
  }
  function openPalette() {
    var o = palette(); if (!o) return;
    o.classList.add('open');
    var input = o.querySelector('.palette-input');
    if (input) { input.value = ''; input.focus(); }
    document.querySelectorAll('.palette-item').forEach(function (i) {
      i.style.display = ''; i.classList.remove('active');
    });
  }
  function closePalette() { var o = palette(); if (o) o.classList.remove('open'); }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (el) {
      var action = el.getAttribute('data-action');
      if (action === 'copy-color') {
        var hex = el.getAttribute('data-color');
        if (hex) copy(hex, function () { toast('VALUE COPIED: ' + hex); flash(el); });
      } else if (action === 'copy-glow') {
        var glow = el.getAttribute('data-glow');
        if (glow) copy(glow, function () { toast('BOX-SHADOW VALUE COPIED!'); flash(el); });
      } else if (action === 'palette-open') { openPalette(); }
      else if (action === 'palette-close') { closePalette(); }
      else if (action === 'replay-animation') {
        document.querySelectorAll('[data-pg-card]').forEach(function (c) {
          c.classList.remove('animate-fade-up'); void c.offsetWidth; c.classList.add('animate-fade-up');
        });
      }
    }
    var item = e.target.closest('.palette-item');
    if (item) {
      toast('Selected: ' + (item.querySelector('.palette-item-name') || item).textContent.trim());
      closePalette();
    }
  });

  document.addEventListener('keydown', function (e) {
    var o = palette(); if (!o) return;
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      o.classList.contains('open') ? closePalette() : openPalette();
      return;
    }
    if (!o.classList.contains('open')) return;
    if (e.key === 'Escape') { closePalette(); return; }
    var items = visibleItems();
    if (!items.length) return;
    var idx = items.findIndex(function (i) { return i.classList.contains('active'); });
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (idx >= 0) items[idx].classList.remove('active');
      var next = (idx + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items[next].classList.add('active');
      items[next].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && idx >= 0) { items[idx].click(); }
  });

  document.addEventListener('input', function (e) {
    if (!e.target.classList.contains('palette-input')) return;
    var q = e.target.value.toLowerCase();
    document.querySelectorAll('.palette-item').forEach(function (i) {
      i.style.display = i.textContent.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
    });
  });

  document.addEventListener('submit', function (e) {
    if (!e.target.matches('#subscribe-form')) return;
    e.preventDefault();
    var input = e.target.querySelector('.subscribe-input');
    var msg = e.target.querySelector('.subscribe-message');
    if (!input || !msg) return;
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    msg.textContent = ok ? 'Success! You have been subscribed.' : 'Please enter a valid email address.';
    msg.style.color = ok ? 'var(--accent-sage)' : 'var(--accent-rose)';
    msg.style.display = 'block';
    if (ok) { input.value = ''; toast('SUBSCRIBED'); setTimeout(function () { msg.style.display = 'none'; }, 5000); }
  });

  // ── Nav scrollspy ──────────────────────────────────
  (function() {
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!navLinks.length) return;

    // Build target-map: href → section element
    var targets = [];
    for (var i = 0; i < navLinks.length; i++) {
      var id = navLinks[i].getAttribute('href').replace('#', '');
      var section = document.getElementById(id);
      if (section) targets.push({ link: navLinks[i], section: section });
    }
    if (!targets.length) return;

    // Threshold line sits just below the fixed nav, so a section becomes
    // active the moment its top scrolls up under the nav bar.
    function thresholdLine() {
      var nav = document.querySelector('.sticky-nav');
      var navH = nav ? nav.getBoundingClientRect().height : 70;
      return navH + 24;
    }

    // Position the sliding indicator under the active link
    function positionIndicator() {
      var nav = document.querySelector('.sticky-nav');
      if (!nav) return;
      var active = nav.querySelector('a.active');
      if (active) {
        var navRect = nav.getBoundingClientRect();
        var activeRect = active.getBoundingClientRect();
        nav.style.setProperty('--indicator-left', (activeRect.left - navRect.left) + 'px');
        nav.style.setProperty('--indicator-width', activeRect.width + 'px');
      }
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function() {
        ticking = false;
        var threshold = thresholdLine();
        var active = targets[0].link;

        // Active = the last (deepest) section whose top has passed the
        // threshold line. Sections are traversed in document order, so the
        // last one to satisfy top <= threshold is the one we're inside.
        for (var i = 0; i < targets.length; i++) {
          if (targets[i].section.getBoundingClientRect().top <= threshold) {
            active = targets[i].link;
          }
        }

        // At the very bottom, the last section's top may still be below the
        // threshold if it is short — force-highlight the final link so the
        // last nav item is reachable.
        var scrollBottom = window.scrollY + window.innerHeight;
        if (scrollBottom >= document.documentElement.scrollHeight - 4) {
          active = targets[targets.length - 1].link;
        }

        for (var j = 0; j < navLinks.length; j++) {
          navLinks[j].classList.toggle('active', navLinks[j] === active);
        }

        positionIndicator();
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Reposition the indicator on resize (debounced)
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(positionIndicator, 100);
    });

    setTimeout(onScroll, 150);
  })();
})();
