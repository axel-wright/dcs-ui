import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');
const REPORT_PATH = path.join(__dirname, 'axe-report.json');

// MIME type map for static server
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function createStaticServer(root) {
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/component-library.html';
    const filePath = path.join(root, reqPath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mimeType });
      fs.createReadStream(filePath).pipe(res);
    });
  });
}

async function runAudit() {
  const server = createStaticServer(ROOT_DIR);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  console.log(`[a11y] Static server listening at ${baseUrl}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`[a11y] Loading ${baseUrl}/component-library.html ...`);
  await page.goto(`${baseUrl}/component-library.html`, { waitUntil: 'domcontentloaded' });
  // Wait a bit for components to initialize
  await page.waitForTimeout(1000);

  // Discover sections to audit
  const sections = await page.evaluate(() => {
    const list = [];
    // 1. Scan all specimen sections
    const specimenSections = Array.from(document.querySelectorAll('section.section-specimen'));
    specimenSections.forEach((sec, idx) => {
      const id = sec.id || `section-${idx}`;
      const titleEl = sec.querySelector('.section-title');
      const title = titleEl ? titleEl.textContent.trim() : id;
      list.push({
        id,
        title,
        selector: `#${id}`,
        type: 'section',
      });
    });

    // 2. Global overlay/top-level components outside sections
    const extraContainers = [
      { id: 'global-nav', title: 'Global Navigation Header', selector: 'nav.sticky-nav' },
      { id: 'global-toast', title: 'Global Toast Container', selector: '#toast-container' },
      { id: 'global-context-menu', title: 'Global Context Menu Floating', selector: '.context-menu-floating' },
      { id: 'global-drawer', title: 'Global Drawer Panel', selector: '.drawer-overlay' },
    ];

    extraContainers.forEach((item) => {
      if (document.querySelector(item.selector)) {
        list.push({ ...item, type: 'global' });
      }
    });

    return list;
  });

  console.log(`[a11y] Found ${sections.length} targets to audit.`);

  const auditResults = {
    timestamp: new Date().toISOString(),
    totalTargets: sections.length,
    summary: {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    },
    components: [],
  };

  let totalCritical = 0;
  let totalSerious = 0;
  let totalModerate = 0;
  let totalMinor = 0;

  for (const sec of sections) {
    try {
      const axe = new AxeBuilder({ page }).include(sec.selector);
      const res = await axe.analyze();

      const violations = res.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map((n) => ({
          html: n.html,
          target: n.target,
          failureSummary: n.failureSummary,
        })),
      }));

      const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
      violations.forEach((v) => {
        if (counts[v.impact] !== undefined) {
          counts[v.impact] += v.nodes.length;
        }
      });

      totalCritical += counts.critical;
      totalSerious += counts.serious;
      totalModerate += counts.moderate;
      totalMinor += counts.minor;

      auditResults.components.push({
        id: sec.id,
        title: sec.title,
        selector: sec.selector,
        counts,
        violations,
      });
    } catch (err) {
      console.error(`[a11y] Error auditing ${sec.id} (${sec.selector}):`, err.message);
    }
  }

  auditResults.summary.critical = totalCritical;
  auditResults.summary.serious = totalSerious;
  auditResults.summary.moderate = totalModerate;
  auditResults.summary.minor = totalMinor;

  // Write JSON report
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(auditResults, null, 2), 'utf-8');
  console.log(`[a11y] Report written to ${REPORT_PATH}`);

  // Print human-readable summary
  console.log('\n======================================================');
  console.log('            ACCESSIBILITY AUDIT SUMMARY               ');
  console.log('======================================================');
  console.log(`Total Targets Audited: ${sections.length}`);
  console.log(`Critical Violations:   ${totalCritical}`);
  console.log(`Serious Violations:    ${totalSerious}`);
  console.log(`Moderate Violations:   ${totalModerate}`);
  console.log(`Minor Violations:      ${totalMinor}`);
  console.log('------------------------------------------------------\n');

  auditResults.components.forEach((c) => {
    const totalViolations = c.counts.critical + c.counts.serious + c.counts.moderate + c.counts.minor;
    if (totalViolations > 0) {
      console.log(` Component: ${c.title} (${c.id})`);
      console.log(`   Critical: ${c.counts.critical} | Serious: ${c.counts.serious} | Moderate: ${c.counts.moderate} | Minor: ${c.counts.minor}`);
      c.violations.forEach((v) => {
        console.log(`   - [${v.impact?.toUpperCase()}] ${v.id}: ${v.help} (${v.nodes.length} instance(s))`);
        v.nodes.forEach((n) => {
          console.log(`       Target: ${n.target.join(', ')}`);
          console.log(`       HTML:   ${n.html}`);
        });
      });
      console.log('');
    }
  });

  await browser.close();
  server.close();

  if (totalCritical > 0 || totalSerious > 0) {
    console.error(`[a11y] FAILED: Audit found ${totalCritical} critical and ${totalSerious} serious violation(s).`);
    process.exit(1);
  } else {
    console.log(`[a11y] PASSED: Zero critical and zero serious violations!`);
    process.exit(0);
  }
}

runAudit().catch((err) => {
  console.error('[a11y] Fatal error running audit:', err);
  process.exit(1);
});
