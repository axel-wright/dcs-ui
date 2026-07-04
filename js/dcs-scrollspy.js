'use strict';

// DCS Scrollspy — dual-mode: main sidebar nav + inline demo TOC
// Auto-detects which mode based on child elements.
// Mode A: Main sidebar — .sidebar-item[data-section] → #section-id, scrolls with viewport
// Mode B: Inline demo — .toc-item[data-target] → [data-spy-target], scrolls within content area
//
// Algorithm: position-based, NOT index-based. Targets are sorted by their visual
// (DOM) position. On scroll, picks the target whose section top is CLOSEST to the
// threshold from below — i.e. the section most recently scrolled into view.
// This is correct regardless of sidebar ordering.

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing — scrollspy not registered');
} else {
  window.DCS.register('scrollspy', {
    init: function(el) {
      // ── Detect mode ─────────────────────────────────────
      var items, scrollSource, getTargetId, itemSelector, activeClass;

      var sidebarItems = el.querySelectorAll('.sidebar-item');
      var tocItems = el.querySelectorAll('.toc-item');
      var contentArea = el.querySelector('[data-scrollspy-content]');

      if (sidebarItems.length) {
        // Mode A: Main sidebar nav — tracks viewport scroll
        items = sidebarItems;
        scrollSource = null; // window
        getTargetId = function(item) {
          var id = item.getAttribute('data-section');
          return id || null;
        };
        itemSelector = '.sidebar-item';
        activeClass = 'active';
      } else if (tocItems.length && contentArea) {
        // Mode B: Inline demo TOC — tracks content-area scroll
        items = tocItems;
        scrollSource = contentArea;
        getTargetId = function(item) {
          return item.getAttribute('data-target');
        };
        itemSelector = '.toc-item';
        activeClass = 'active';
      } else {
        return; // nothing to track
      }

      // ── Build target map (sorted by visual DOM position) ─
      var targets = [];
      for (var i = 0; i < items.length; i++) {
        var targetId = getTargetId(items[i]);
        if (!targetId) continue;
        var targetEl;
        if (scrollSource === null) {
          targetEl = document.getElementById(targetId);
        } else {
          targetEl = el.querySelector('[data-spy-target="' + targetId + '"]');
        }
        if (targetEl) {
          targets.push({ item: items[i], target: targetEl, id: targetId });
        }
      }

      if (!targets.length) return;

      // Sort targets by their actual DOM position (top-to-bottom visual order)
      // This ensures iteration order matches visual flow, regardless of sidebar ordering
      targets.sort(function(a, b) {
        var aTop, bTop;
        if (scrollSource === null) {
          aTop = a.target.getBoundingClientRect().top + window.scrollY;
          bTop = b.target.getBoundingClientRect().top + window.scrollY;
        } else {
          aTop = a.target.offsetTop;
          bTop = b.target.offsetTop;
        }
        return aTop - bTop;
      });

      // ── Set active item ─────────────────────────────────
      function setActive(targetItem) {
        var current = el.querySelectorAll(itemSelector);
        for (var i = 0; i < current.length; i++) {
          if (current[i] === targetItem) {
            current[i].classList.add(activeClass);
          } else {
            current[i].classList.remove(activeClass);
          }
        }
      }

      // ── Scroll handler ──────────────────────────────────
      var scrollTicking = false;
      function onScroll() {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(function() {
          scrollTicking = false;
          doScrollCheck();
        });
      }

      function doScrollCheck() {
        var viewTop, scrollThreshold;

        if (scrollSource === null) {
          viewTop = window.scrollY;
        } else {
          viewTop = scrollSource.scrollTop;
        }

        // Threshold: how far below the viewport top a section can start
        // and still be considered "active." Use 33% of viewport height so that
        // a section becomes active shortly after its top enters the viewport,
        // not just when it hits pixel 0.
        var viewHeight = scrollSource === null ? window.innerHeight : scrollSource.clientHeight;
        scrollThreshold = Math.round(viewHeight * 0.33);

        var activeTarget = null;
        var bestRefTop = -Infinity;

        // Determine the bottom of the scrollable area (for last-section detection)
        var docHeight = scrollSource === null
          ? document.documentElement.scrollHeight
          : scrollSource.scrollHeight;
        var atBottom = (viewTop + viewHeight) >= (docHeight - 2);

        for (var i = 0; i < targets.length; i++) {
          var rect = targets[i].target.getBoundingClientRect();
          var refTop;

          if (scrollSource === null) {
            refTop = rect.top;
          } else {
            var containerRect = scrollSource.getBoundingClientRect();
            refTop = rect.top - containerRect.top;
          }

          // Section is "active" if its top is at or above the scroll threshold.
          // We pick the one whose top is CLOSEST to the threshold (highest refTop
          // that's still ≤ threshold). This gives us the section most recently
          // scrolled into view, regardless of sidebar ordering.
          if (refTop <= scrollThreshold) {
            if (refTop > bestRefTop) {
              bestRefTop = refTop;
              activeTarget = targets[i].item;
            }
          }
        }

        // Edge case: we're at the very bottom of the page. The last section
        // might not reach the threshold if it's very short. Fall back to the
        // last target in visual order.
        if (atBottom && targets.length) {
          // Check if the current best is actually the last section
          var lastTarget = targets[targets.length - 1].item;
          var lastRect = targets[targets.length - 1].target.getBoundingClientRect();
          var lastRefTop = scrollSource === null ? lastRect.top : lastRect.top - scrollSource.getBoundingClientRect().top;
          // If last section is visible in the viewport, make it active
          if (lastRefTop < viewHeight) {
            activeTarget = lastTarget;
          }
        }

        // Fallback: nothing above threshold → highlight first item (top of page)
        if (!activeTarget && targets.length) {
          activeTarget = targets[0].item;
        }

        if (activeTarget) {
          setActive(activeTarget);
        }
      }

      // ── Wire scroll ─────────────────────────────────────
      if (scrollSource === null) {
        window.addEventListener('scroll', onScroll, { passive: true });
      } else {
        scrollSource.addEventListener('scroll', onScroll, { passive: true });
      }

      // ── Click handler: scroll to target ─────────────────
      el.addEventListener('click', function(e) {
        var item = e.target.closest(itemSelector);
        if (!item || !el.contains(item)) return;

        var targetId = getTargetId(item);
        if (!targetId) return;

        var targetEl;
        if (scrollSource === null) {
          targetEl = document.getElementById(targetId);
        } else {
          targetEl = el.querySelector('[data-spy-target="' + targetId + '"]');
        }

        if (targetEl) {
          e.preventDefault();
          if (scrollSource === null) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            var containerRect = scrollSource.getBoundingClientRect();
            var targetRect = targetEl.getBoundingClientRect();
            scrollSource.scrollTop += (targetRect.top - containerRect.top);
          }
          setActive(item);
        }
      });

      // ── Initial run ─────────────────────────────────────
      // Wait for fonts to load + layout to settle before positioning the indicator.
      // A fixed setTimeout is unreliable — font swap changes element widths.
      function initCheck() {
        requestAnimationFrame(function() {
          requestAnimationFrame(doScrollCheck);
        });
      }
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(initCheck);
      } else {
        window.addEventListener('load', initCheck);
      }
    }
  });
}
