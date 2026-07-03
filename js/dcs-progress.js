'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('progress', {
    init: function(el) {
      var isSimulating = false;
      var intervals = [];
      var timeouts = [];

      var runBtn = el.querySelector('.btn-run-sim');
      var fillBar = el.querySelector('.progress-fill');
      var percentageText = el.querySelector('.progress-pct');
      var stepText = el.querySelector('.progress-step-text') || el.querySelector('.simulation-step-text');
      var consoleEl = el.querySelector('.sim-console');

      var resetSim = function() {
        isSimulating = false;
        var i;
        for (i = 0; i < intervals.length; i++) {
          clearInterval(intervals[i]);
        }
        intervals = [];
        for (i = 0; i < timeouts.length; i++) {
          clearTimeout(timeouts[i]);
        }
        timeouts = [];

        if (runBtn) runBtn.disabled = false;
        if (fillBar) fillBar.style.width = '0%';
        if (percentageText) percentageText.textContent = '0%';
        if (stepText) stepText.textContent = 'Simulation Idle';

      };

      var startSim = function() {
        if (isSimulating) {
          if (window.DCS._showToast) {
            window.DCS._showToast('A SIMULATION JOB IS ALREADY IN PROGRESS', 'warning');
          }
          return;
        }

        if (!runBtn || !fillBar) return;

        isSimulating = true;
        runBtn.disabled = true;

        var consoleLogs = [
          { t: 0, text: '[0%] Initializing toolpath compiler...' },
          { t: 800, text: '[15%] Homing limits calibrated. Absolute mode active.' },
          { t: 1500, text: '[35%] Spindle engaged. RPM target: 18,000. Vacuum gate OPEN.' },
          { t: 2500, text: '[55%] Toolpath layer 1: Pockets carved.' },
          { t: 3200, text: '[70%] Toolpath layer 2: Profile cleanup active.' },
          { t: 4000, text: '[90%] Retracting Z-axis to G54 home.' },
          { t: 4800, text: '[100%] Spindle stopped. Vacuum gate CLOSED.' }
        ];

        if (consoleEl) consoleEl.innerHTML = '';
        var progress = 0;

        var interval = setInterval(function() {
          progress += 2;
          if (progress > 100) {
            progress = 100;
            clearInterval(interval);
          }
          if (fillBar) fillBar.style.width = progress + '%';
          if (percentageText) percentageText.textContent = progress + '%';
        }, 100);
        intervals.push(interval);

        consoleLogs.forEach(function(log) {
          var t = setTimeout(function() {
            if (!isSimulating) return;

            if (consoleEl) {
              var line = document.createElement('div');
              line.textContent = log.text;
              consoleEl.appendChild(line);
              consoleEl.scrollTop = consoleEl.scrollHeight;
            }

            if (stepText) {
              stepText.textContent = log.text.replace(/\[\d+%\]\s*/, '');
            }
          }, log.t);
          timeouts.push(t);
        });

        var finishTimeout = setTimeout(function() {
          if (!isSimulating) return;
          isSimulating = false;
          if (runBtn) runBtn.disabled = false;

          if (window.DCS._showToast) {
            window.DCS._showToast('CNC OPERATION SUCCESSFUL', 'success');
          }

          if (consoleEl) {
            var completionLine = document.createElement('div');
            completionLine.style.color = 'var(--accent-sage)';
            completionLine.style.fontWeight = 'bold';
            completionLine.textContent = '[SUCCESS] CNC JOB RUN COMPLETE.';
            consoleEl.appendChild(completionLine);
            consoleEl.scrollTop = consoleEl.scrollHeight;
          }
        }, 5000);
        timeouts.push(finishTimeout);
      };

      window.startJobSimulation = function() {
        startSim();
      };
      window.resetSimulation = function() {
        resetSim();
      };

      el.addEventListener('click', function(e) {
        if (e.target.closest('.btn-run-sim')) {
          startSim();
        }
      });
    }
  });
}
