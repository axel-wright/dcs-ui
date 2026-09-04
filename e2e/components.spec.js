import { test, expect } from '@playwright/test';

test.describe('DCS E2E Component Interactive Scenarios', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/component-library.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test('image-compare: pointer-drag slider changes clip-path and handle position', async ({ page }) => {
    const compareContainer = page.locator('.compare-container').first();
    await compareContainer.scrollIntoViewIfNeeded();

    const slider = compareContainer.locator('.compare-slider');
    const beforeLayer = compareContainer.locator('.compare-before');
    const handle = compareContainer.locator('.compare-handle');

    // Initial state check (value 50)
    await expect(slider).toHaveValue('50');
    expect(await handle.evaluate(el => el.style.left)).toBe('50%');

    // Drag / fill slider to 20%
    await slider.fill('20');
    await slider.dispatchEvent('input');

    expect(await handle.evaluate(el => el.style.left)).toBe('20%');
    const clipPath = await beforeLayer.evaluate(el => el.style.clipPath || el.style.webkitClipPath);
    expect(clipPath).toContain('80%');
  });

  test('split-pane: pointer-drag splitter resizes left pane', async ({ page }) => {
    const splitPane = page.locator('.dcs-split-pane').first();
    await splitPane.scrollIntoViewIfNeeded();

    const handle = splitPane.locator('.dcs-split-handle');
    const leftPane = splitPane.locator('.dcs-split-left');

    const initialBox = await leftPane.boundingBox();
    expect(initialBox).not.toBeNull();
    const initialWidth = initialBox.width;

    const handleBox = await handle.boundingBox();
    expect(handleBox).not.toBeNull();

    // Drag handle to the right by 100px
    await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox.x + handleBox.width / 2 + 100, handleBox.y + handleBox.height / 2);
    await page.mouse.up();

    const newBox = await leftPane.boundingBox();
    expect(newBox.width).toBeGreaterThan(initialWidth + 50);
  });

  test('dropzone: dispatch real file drop and assert selection status', async ({ page }) => {
    const dropzoneComp = page.locator('[data-dcs-component="dropzone"]').first();
    await dropzoneComp.scrollIntoViewIfNeeded();

    const dropZone = dropzoneComp.locator('.drop-zone');
    const status = dropzoneComp.locator('.drop-zone-status');

    // Create a DataTransfer with a real File and drop it
    const filePayload = {
      name: 'part_v1.gcode',
      mimeType: 'text/plain',
      buffer: Buffer.from('G0 X0 Y0\nG1 X10 Y10 F1000\n')
    };

    // Use Playwright's evaluate to dispatch a drop event with DataTransfer
    await dropZone.evaluate(async (node, payload) => {
      const file = new File([payload.buffer], payload.name, { type: payload.mimeType });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer: dataTransfer
      });
      node.dispatchEvent(dropEvent);
    }, filePayload);

    await expect(dropZone).toHaveClass(/has-file/);
    await expect(status).toHaveClass(/success/);
    await expect(status).toContainText('part_v1.gcode');
  });

  test('scrollspy: scrolling updates active section in TOC', async ({ page }) => {
    const scrollspyComp = page.locator('.scrollspy-demo-layout').first();
    await scrollspyComp.scrollIntoViewIfNeeded();

    const tocIntro = scrollspyComp.locator('.toc-item[data-target="spy-intro"]');
    const tocFinish = scrollspyComp.locator('.toc-item[data-target="spy-finish"]');
    const contentArea = scrollspyComp.locator('[data-scrollspy-content]');
    const finishSection = scrollspyComp.locator('[data-spy-target="spy-finish"]');

    await expect(tocIntro).toHaveClass(/active/);

    // Scroll content area to finish section
    await finishSection.evaluate(el => el.scrollIntoView());
    await contentArea.dispatchEvent('scroll');

    await expect(tocFinish).toHaveClass(/active/);
  });

  test('sticky-bar: scrolling container triggers sticky stuck behavior', async ({ page }) => {
    const stickyDemo = page.locator('.dcs-actionbar-demo').first();
    await stickyDemo.scrollIntoViewIfNeeded();

    const scrollContainer = stickyDemo.locator('.dcs-actionbar-scroll');
    const stickyBar = stickyDemo.locator('.dcs-sticky-bar');

    const initialBox = await stickyBar.boundingBox();
    expect(initialBox).not.toBeNull();

    // Scroll down inside the container
    await scrollContainer.evaluate(el => {
      el.scrollTop = 200;
    });

    // Wait for IntersectionObserver or style update
    await expect(stickyBar).toHaveClass(/is-stuck/);

    const stuckBox = await stickyBar.boundingBox();
    expect(stuckBox).not.toBeNull();
  });

  test('header: viewport resize shows mobile menu toggle and toggles nav', async ({ page }) => {
    const headerComp = page.locator('[data-dcs-component="header"]').first();
    await headerComp.scrollIntoViewIfNeeded();

    const toggleBtn = headerComp.locator('.mobile-menu-toggle');
    const navLinks = headerComp.locator('.nav-links');

    await page.setViewportSize({ width: 500, height: 800 });

    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    await toggleBtn.click();
    await expect(navLinks).toHaveClass(/open/);
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');

    await toggleBtn.click();
    await expect(navLinks).not.toHaveClass(/open/);
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('clipboard: navigator.clipboard write works with context permissions', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const clipboardBtn = page.locator('[data-dcs-component="clipboard"]').first();
    await clipboardBtn.scrollIntoViewIfNeeded();

    await clipboardBtn.click();

    await expect(clipboardBtn).toHaveClass(/copied/);

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe('npm install @dcs/ui');
  });

  test('tooltip and popover: open/close and have sensible, non-zero coordinates', async ({ page }) => {
    // Tooltip Test
    const tooltipTrigger = page.locator('[data-dcs-component="tooltip"][data-tooltip]').first();
    await tooltipTrigger.scrollIntoViewIfNeeded();

    await tooltipTrigger.hover();

    const tooltipEl = page.locator('.dcs-tooltip-js');
    await expect(tooltipEl).toBeVisible();
    await expect(tooltipEl).toHaveClass(/is-visible/);

    const tipBox = await tooltipEl.boundingBox();
    expect(tipBox).not.toBeNull();
    expect(tipBox.width).toBeGreaterThan(0);
    expect(tipBox.height).toBeGreaterThan(0);
    expect(tipBox.x).toBeGreaterThan(0);
    expect(tipBox.y).toBeGreaterThan(0);

    // Popover Test
    const popoverComp = page.locator('[data-dcs-component="popover"]').first();
    await popoverComp.scrollIntoViewIfNeeded();

    const popoverTrigger = popoverComp.locator('.popover-trigger');
    const popoverCard = popoverComp.locator('.popover-card');

    await expect(popoverCard).not.toHaveClass(/visible/);

    await popoverTrigger.click();
    await expect(popoverCard).toHaveClass(/visible/);

    const popBox = await popoverCard.boundingBox();
    expect(popBox).not.toBeNull();
    expect(popBox.width).toBeGreaterThan(0);
    expect(popBox.height).toBeGreaterThan(0);
    expect(popBox.x).toBeGreaterThan(0);
    expect(popBox.y).toBeGreaterThan(0);

    // Close on outside click
    await page.mouse.click(10, 10);
    await expect(popoverCard).not.toHaveClass(/visible/);
  });

});
