'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('tabs', {
    init: function(el) {
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
        }
      });

      window.addEventListener('resize', realignIndicator);

      setTimeout(realignIndicator, 100);
    }
  });
}
