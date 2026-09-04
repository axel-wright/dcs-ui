# DCS UI — Visual Regression Testing

This directory contains automated visual regression tests powered by Playwright (`@playwright/test`).

## Overview

- **Target:** `component-library.html` rendered in the default dark theme.
- **Scope:** 62 component specimen sections are tested individually by clipping screenshots to each section container (`<section id="...">`).
- **Determinism:** Non-deterministic or animated elements (such as spinners, shimmer skeletons, pulsing status dots, and autoplaying carousels) are masked using Playwright's `mask` option and media motion reduction is emulated.

## Running Tests

To run the visual regression test suite:

```bash
npm run test:visual
```

This runs `playwright test tests/visual` and compares rendered output against the baseline snapshots in `tests/visual/visual.spec.js-snapshots/`.

## Regenerating Baseline Snapshots

When intentional CSS, layout, or component changes alter the visual appearance of components, update the baseline PNGs by running:

```bash
npx playwright test tests/visual --update-snapshots
```

Review the updated PNG images and commit them to git along with your source changes.
