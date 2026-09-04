'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('tabs', {
    init: function(el) {
      // Link each tab to its panel via aria-controls / aria-labelledby so
      // screen readers can associate the two.
      var uid = 'dcs-tabs-' + Math.random().toString(36).substr(2, 6);
      var allTabs = el.querySelectorAll('.tab-btn');
      for (var t = 0; t < allTabs.length; t++) {
        var val = allTabs[t].getAttribute('data-tab');
        var pnl = el.querySelector('.tab-panel[data-tab="' + val + '"]');
        if (pnl) {
          if (!allTabs[t].id) allTabs[t].id = uid + '-tab-' + t;
          if (!pnl.id) pnl.id = uid + '-panel-' + t;
          allTabs[t].setAttribute('aria-controls', pnl.id);
          pnl.setAttribute('aria-labelledby', allTabs[t].id);
          pnl.setAttribute('tabindex', '0');
        }
        var isActive = allTabs[t].classList.contains('active');
        allTabs[t].setAttribute('aria-selected', isActive ? 'true' : 'false');
        allTabs[t].setAttribute('tabindex', isActive ? '0' : '-1');
      }

      var realignIndicator = function() {
        var activeTab = el.querySelector('.tab-btn.active');
        var indicator = el.querySelector('.tab-indicator');
        if (activeTab && indicator) {
          indicator.style.left = activeTab.offsetLeft + 'px';
          indicator.style.width = activeTab.offsetWidth + 'px';
        }
      };

      var switchTab = function(btn) {
        if (!btn) return;
        var tabVal = btn.getAttribute('data-tab');
        
        var buttons = el.querySelectorAll('.tab-btn');
        for (var i = 0; i < buttons.length; i++) {
          var b = buttons[i];
          if (b === btn) {
            b.classList.add('active');
            b.setAttribute('aria-selected', 'true');
            b.setAttribute('tabindex', '0');
            b.focus();
          } else {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
            b.setAttribute('tabindex', '-1');
          }
        }

        var panels = el.querySelectorAll('.tab-panel');
        for (var j = 0; j < panels.length; j++) {
          var panel = panels[j];
          if (panel.getAttribute('data-tab') === tabVal) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        }

        realignIndicator();
      };

      el.addEventListener('click', function(e) {
        var btn = e.target.closest('.tab-btn');
        if (btn) {
          switchTab(btn);
        }
      });

      el.addEventListener('keydown', function(e) {
        var activeBtn = el.querySelector('.tab-btn.active');
        if (!activeBtn) return;
        
        var buttons = [];
        var allButtons = el.querySelectorAll('.tab-btn');
        for (var k = 0; k < allButtons.length; k++) {
          buttons.push(allButtons[k]);
        }
        
        var currentIdx = buttons.indexOf(activeBtn);
        if (currentIdx === -1) return;

        if (e.key === 'ArrowRight' || e.key === 'Right') {
          e.preventDefault();
          var nextIdx = (currentIdx + 1) % buttons.length;
          switchTab(buttons[nextIdx]);
        } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
          e.preventDefault();
          var prevIdx = (currentIdx - 1 + buttons.length) % buttons.length;
          switchTab(buttons[prevIdx]);
        } else if (e.key === 'Home') {
          e.preventDefault();
          switchTab(buttons[0]);
        } else if (e.key === 'End') {
          e.preventDefault();
          switchTab(buttons[buttons.length - 1]);
        }
      });

      window.addEventListener('resize', realignIndicator);

      setTimeout(realignIndicator, 100);
    }
  });
}
