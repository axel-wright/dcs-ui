/* DCS Hub Index — Scripts */

// ── Status checker ──
const BACKENDS = [
  { id: 'crypto',   path: '/crypto/' },
  { id: 'garden',   path: '/garden/' },
  { id: 'fitness',  path: '/fitness/' },
  { id: 'meal-prep', path: '/meal-prep/' },
  { id: 'studio',   path: '/studio/' },
];

async function checkStatus(id, path, port) {
  const dot = document.getElementById('status-' + id);
  const url = port ? (location.protocol + '//' + location.hostname + ':' + port) : path;
  try {
    const resp = await fetch(url, { method: 'HEAD', mode: port ? 'cors' : 'same-origin', signal: AbortSignal.timeout(5000) });
    if (resp.ok || resp.status === 301 || resp.status === 302 || resp.status === 401 || resp.status === 405) {
      dot.className = 'status-dot up';
      dot.title = id + ' — online';
    } else {
      dot.className = 'status-dot down';
      dot.title = id + ' — HTTP ' + resp.status;
    }
  } catch (e) {
    if (port && e.name === 'TypeError') {
      // CORS block on cross-origin — try through nginx or treat as reachable
      // The workspace on :3000 may CORS-block a HEAD from :8080, but if we
      // got here it means the server is listening (no connection refused).
      dot.className = 'status-dot up';
      dot.title = id + ' — online (no CORS HEAD)';
    } else {
      dot.className = 'status-dot down';
      dot.title = id + ' — unreachable';
    }
  }
}

// ── Dynamic descriptions ──
async function fetchGardenSeason() {
  const el = document.getElementById('garden-season');
  try {
    const resp = await fetch('/garden/', { signal: AbortSignal.timeout(5000) });
    const text = await resp.text();
    // Extract from <title>Garden — Summer 2026</title>
    const m = text.match(/<title>Garden\s*[—–-]\s*(.+?)<\/title>/i);
    if (m) { el.textContent = m[1]; return; }
  } catch(e) {}
  // Fallback: compute from current month
  const now = new Date();
  const seasons = ['Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer', 'Summer', 'Summer', 'Fall', 'Fall', 'Fall', 'Winter'];
  el.textContent = seasons[now.getMonth()] + ' ' + now.getFullYear();
}

async function fetchFitnessPhase() {
  const el = document.getElementById('fitness-phase');
  try {
    const resp = await fetch('/fitness/workout-data.json', { signal: AbortSignal.timeout(5000) });
    const data = await resp.json();
    const plan = data.plan || {};
    // Compute current week
    const ref = new Date(plan.ref_date + 'T00:00:00');
    const now = new Date(); now.setHours(0,0,0,0);
    const wNum = Math.floor((now - ref) / (7*86400000)) + 1;
    // Find current phase
    const phases = data.plan.phases || [{ phase: plan.phase, name: plan.phase_name, weeks: 6 }];
    let cp = phases[phases.length - 1];
    let start = 1;
    for (const p of phases) {
      const end = start + (p.weeks || 6) - 1;
      if (wNum <= end) { cp = { ...p, weekInPhase: wNum - start + 1 }; break; }
      start = end + 1;
    }
    el.textContent = 'Phase ' + cp.phase + ' · ' + cp.name;
  } catch(e) {
    el.textContent = 'Phase —';
  }
}

// Kick off all checks
checkStatus('crypto', '/crypto/');
checkStatus('garden', '/garden/');
checkStatus('fitness', '/fitness/');
checkStatus('meal-prep', '/meal-prep/');
checkStatus('studio', '/studio/');
fetchGardenSeason();
fetchFitnessPhase();