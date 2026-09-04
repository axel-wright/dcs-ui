import { test, expect } from '@playwright/test';

const COMPONENTS = [
  'buttons',
  'toggles',
  'checkboxes',
  'radio-sec',
  'fab-sec',
  'inputs',
  'dropdown-sec',
  'combo-sec',
  'search-sec',
  'chips-sec',
  'slider-sec',
  'dropzone-sec',
  'segment-sec',
  'tabs',
  'breadcrumbs-sec',
  'pagination-sec',
  'stepper-sec',
  'command-palette',
  'scrollspy-sec',
  'header-sec',
  'skiplink-sec',
  'theme-sec',
  'cards',
  'tables',
  'badges',
  'kpi-sec',
  'gauge-sec',
  'kvlist-sec',
  'code',
  'timeline-sec',
  'avatars',
  'testimonial-sec',
  'carousel-sec',
  'sparkline-sec',
  'tree-sec',
  'taggroup-sec',
  'toasts',
  'alert-sec',
  'modal-sec',
  'loading',
  'ring-sec',
  'empty-sec',
  'tooltips',
  'popover-sec',
  'context-sec',
  'drawer-sec',
  'sheet-sec',
  'accordion',
  'container-sec',
  'dividers',
  'grid-sec',
  'stack-sec',
  'cluster-sec',
  'toolbar-sec',
  'panel-sec',
  'splitpane-sec',
  'stickybar-sec',
  'compare-sec',
  'kbd-sec',
  'clipboard-sec',
  'truncate-sec',
  'shortcut-sec',
];

// Per-component masks for non-deterministic / animated regions:
// - loading: animated CSS spinner (.spinner-loader), shimmer skeleton (.skeleton-card), indeterminate progress bar ([data-progress-indeterminate])
// - badges: animated pulsing dot badge (.badge--pulse)
// - header-sec: animated status pulse dot (.pulse-dot)
// - popover-sec: animated status pulse dot (.pulse-dot)
// - carousel-sec: carousel slides/progress (.dcs-carousel-track, .dcs-carousel-progress)
// - fab-sec: animated pulsing floating action button (.fab-pulse, .fab-button-main)
const COMPONENT_MASKS = {
  loading: ['.spinner-loader', '.skeleton-card', '[data-progress-indeterminate]'],
  badges: ['.badge--pulse'],
  'header-sec': ['.pulse-dot'],
  'popover-sec': ['.pulse-dot'],
  'carousel-sec': ['.dcs-carousel-track', '.dcs-carousel-progress'],
  'fab-sec': ['.fab-pulse', '.fab-button-main'],
};

test.describe('Component Visual Regression Baseline', () => {
  test.beforeEach(async ({ page }) => {
    // Emulate reduced motion to disable autoplay JS timers and CSS motion where supported
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // Navigate to component library page (dark theme by default)
    await page.goto('/component-library.html');
    await page.waitForLoadState('domcontentloaded');
    // Ensure fonts are loaded for stable rendering
    await page.evaluate(() => document.fonts.ready);
    // Prevent specimen header sticky nav from popping out of container on scroll
    await page.addStyleTag({
      content: 'section.section-specimen .sticky-nav { position: relative !important; }',
    });
  });

  for (const compId of COMPONENTS) {
    test(`component baseline: ${compId}`, async ({ page }) => {
      const section = page.locator(`#${compId}`);
      await expect(section).toBeVisible();
      await section.scrollIntoViewIfNeeded();

      const maskSelectors = COMPONENT_MASKS[compId] || [];
      const maskLocators = maskSelectors.map((sel) => section.locator(sel));

      await expect(section).toHaveScreenshot(`${compId}.png`, {
        mask: maskLocators,
        animations: 'disabled',
      });
    });
  }
});
