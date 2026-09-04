// Node headless test runner for DCS UI using jsdom
'use strict';

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// 1. Create jsdom DOM instance
const dom = new JSDOM(`<!DOCTYPE html><html lang="en"><head></head><body><div id="test-fixtures"></div></body></html>`, {
  url: 'http://localhost/',
  runScripts: 'dangerously',
  resources: 'usable'
});

const { window } = dom;
const { document } = window;

// Expose globals required by component scripts and DCS_TEST
global.window = window;
global.document = document;
global.HTMLElement = window.HTMLElement;
global.Element = window.Element;
global.Node = window.Node;
global.KeyboardEvent = window.KeyboardEvent;
global.MouseEvent = window.MouseEvent;
global.Event = window.Event;
global.CustomEvent = window.CustomEvent;

// ── Minimal JSDOM Shims ────────────────────────────────────
// 1. requestAnimationFrame / cancelAnimationFrame:
// JSDOM does not provide layout/paint frames. We shim rAF using setTimeout(cb, 0).
window.requestAnimationFrame = global.requestAnimationFrame = function(cb) {
  return setTimeout(cb, 0);
};
window.cancelAnimationFrame = global.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};

// 2. scrollTo / scrollIntoView:
// JSDOM lacks scrolling layout engine; components call scrollTo / scrollIntoView without needing actual pixels.
window.scrollTo = global.scrollTo = function() {};
window.Element.prototype.scrollTo = function() {};
window.Element.prototype.scrollIntoView = function() {};

// 3. offsetWidth / offsetHeight / getBoundingClientRect:
// JSDOM does not compute layout dimensions (they default to 0).
// DCS focus trap (_focusable in dcs-core.js) checks offsetWidth/offsetHeight to ignore hidden elements.
// DCS tooltip uses getBoundingClientRect for positioning calculations.
Object.defineProperty(window.HTMLElement.prototype, 'offsetWidth', {
  get() { return this.style.display === 'none' ? 0 : 100; },
  configurable: true
});
Object.defineProperty(window.HTMLElement.prototype, 'offsetHeight', {
  get() { return this.style.display === 'none' ? 0 : 100; },
  configurable: true
});
window.Element.prototype.getClientRects = function() {
  return [{ width: 100, height: 100, top: 0, left: 0, right: 100, bottom: 100 }];
};
window.Element.prototype.getBoundingClientRect = function() {
  return { width: 100, height: 100, top: 0, left: 0, right: 100, bottom: 100, x: 0, y: 0 };
};

// 2. Load minified component bundle
const bundlePath = path.join(__dirname, '../js/dcs-components.min.js');
const bundleCode = fs.readFileSync(bundlePath, 'utf8');
window.eval(bundleCode);

// 3. Load test harness (test.js)
const testHarnessPath = path.join(__dirname, 'test.js');
const testHarnessCode = fs.readFileSync(testHarnessPath, 'utf8');
window.eval(testHarnessCode);
global.DCS_TEST = window.DCS_TEST;

// 4. List of all 15 test suites
const testSuites = [
  'test-modal.js',
  'test-drawer.js',
  'test-tabs.js',
  'test-accordion.js',
  'test-carousel.js',
  'test-dropdown.js',
  'test-combobox.js',
  'test-toasts.js',
  'test-tooltip.js',
  'test-context-menu.js',
  'test-tree.js',
  'test-tables.js',
  'test-pagination.js',
  'test-stepper.js',
  'test-slider.js'
];

// Load and execute each test suite
for (const file of testSuites) {
  const filePath = path.join(__dirname, file);
  const code = fs.readFileSync(filePath, 'utf8');
  window.eval(code);
}

// 5. Gather and print results
const results = global.DCS_TEST.getResults();
const stats = global.DCS_TEST.summary();

console.log('──────────────────────────────────────────────────────');
console.log(`DCS Headless Test Runner Results (${testSuites.length} suites)`);
console.log('──────────────────────────────────────────────────────');

let failCount = 0;
for (const r of results) {
  if (r.type === 'FAIL') {
    failCount++;
    console.error(`[FAIL] ${r.suite}: ${r.msg}`);
  }
}

if (failCount === 0) {
  console.log(`\n✓ All ${stats.total} tests passed across ${testSuites.length} suites.`);
  process.exit(0);
} else {
  console.error(`\n✗ ${failCount} test(s) failed out of ${stats.total} total.`);
  process.exit(1);
}
