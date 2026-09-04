import { test, expect } from '@playwright/test';

test.describe('DCS Smoke Test', () => {
  test('in-browser test runner executes and passes all unit tests', async ({ page }) => {
    await page.goto('/tests/test-runner.html');

    // Wait for the test harness to finish running
    const summary = page.locator('#summary');
    await expect(summary).not.toHaveClass(/waiting/, { timeout: 15000 });
    await expect(summary).toHaveClass(/all-pass/);
    await expect(summary).toContainText('All');
    await expect(summary).toContainText('passed');
  });
});
