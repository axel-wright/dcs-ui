'use strict';
// CNC step content for demo
var stepContent = {
  1: 'Select your workpiece material from the dropdown.',
  2: 'Load your G-code toolpath file for machining.',
  3: 'Jog the machine to your zero point and set origin.',
  4: 'Review settings and confirm to begin the job run.'
};
// Inject content into stepper panels
document.addEventListener('DOMContentLoaded', function() {
  var panels = document.querySelectorAll('.stepper-content-panel');
  for (var i = 0; i < panels.length; i++) {
    var step = parseInt(panels[i].getAttribute('data-step'), 10);
    if (stepContent[step]) {
      panels[i].textContent = stepContent[step];
    }
  }
  // Demo toast on finish
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-stepper-next]');
    if (!btn || btn.textContent.trim() !== 'Finish') return;
    setTimeout(function() {
      if (window.DCS && window.DCS._showToast) {
        window.DCS._showToast('Job setup complete — starting run.', 'success');
      }
    }, 100);
  });
});
