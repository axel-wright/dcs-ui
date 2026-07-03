# DCS — Diaz Creative Studio Design System

A vanilla JS/CSS component library in the Warm Dark ("Workshop at Night") aesthetic, built for dashboards, tooling UIs, and CNC/fabrication interfaces. Zero framework, zero build step.

## Quick Start

Include in any new project with just two core files:

```html
<!-- In <head>: core design tokens and base styles -->
<link rel="stylesheet" href="css/dcs-core.css?v=1789999999">
<link rel="stylesheet" href="css/dcs-components.css?v=1789999999">

<!-- Anti-flash theme script (inline, before any CSS/JS) -->
<script>
  (function(){
    var t;
    try { t = localStorage.getItem('dcs-theme'); } catch(e) {}
    if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
  })();
</script>

<!-- Before </body>: registry + component controllers (all defer) -->
<script src="js/dcs-core.js?v=1789999999" defer></script>
<script src="js/dcs-accordion.js?v=1789999999" defer></script>
<!-- ... add only the component JS files you need ... -->
```

Then add components as HTML with `data-dcs-component` attributes:

```html
<div data-dcs-component="accordion">
  <button class="accordion-trigger" aria-expanded="false">Section 1</button>
  <div class="accordion-panel">Content here</div>
</div>

<div data-dcs-component="theme"></div>
```

## Architecture

### Registry Pattern

Every interactive component registers through `window.DCS` (defined in `js/dcs-core.js`).

```
js/dcs-core.js           ← Registry hub (~170 lines)
                            DCS.register() — components register themselves
                            DCS._init()    — scans DOM, wires everything up
                            DCS._showToast() — notification system
                            Theme toggle (dark/light) with localStorage persistence

js/dcs-accordion.js         ← One file per interactive component (38 total)
js/dcs-tabs.js
js/dcs-modal.js
... (36 more)

css/dcs-components.css   ← All component styles (~3,675 lines, 94KB)
```

### How It Works

1. Page loads all scripts with `defer` — execution order guaranteed
2. `js/dcs-core.js` runs first, creates `window.DCS` namespace with `register()`, `_init()`, `_showToast()`
3. Each component file calls `window.DCS.register('accordion', { init: function(el) {...} })`
4. `js/dcs-core.js` scans DOM for `[data-dcs-component="accordion"]` elements
5. For each match, calls `init(el)` — passing the container element so the controller operates only within its scope
6. `_init()` fires three times (DOMContentLoaded, window.load, 500ms timeout) — belt and suspenders for race conditions with defer script loading

### Code Example

```js
'use strict';

if (typeof window.DCS === 'undefined') {
  console.warn('DCS registry missing');
} else {
  window.DCS.register('mycomponent', {
    init: function(el) {
      // el = the container element [data-dcs-component="mycomponent"]
      // All event handlers use delegation on el, never document
      el.addEventListener('click', function(e) {
        var target = e.target.closest('[data-action="something"]');
        if (!target) return;
        // handle interaction
      });
    }
  });
}
```

## Design Tokens

All tokens are CSS custom properties defined in `css/dcs-core.css`.

### Surfaces

| Token | Value | Description |
|-------|-------|-------------|
| `--bg-deepest` | `#0b0d14` | Deepest background (hero sections, cards) |
| `--bg-default` | `#0f1119` | Default page background |
| `--surface-default` | `#131621` | Card and panel backgrounds |
| `--surface-elevated` | `#161922` | Elevated surfaces (modals, dropdowns) |
| `--surface-hover` | `#1c1f2a` | Hover state for interactive surfaces |

### Text

| Token | Value | Description |
|-------|-------|-------------|
| `--text-primary` | `#ede6dc` | Primary body text |
| `--text-secondary` | `#a89e92` | Secondary/meta text |
| `--text-muted` | `#6b635a` | Muted/disabled text |
| `--text-inverse` | `#1a1814` | Text on light/amber backgrounds |

### Accent Colors

| Token | Value | Description |
|-------|-------|-------------|
| `--accent-primary` | `#e8992b` | Amber-gold — primary actions, highlights |
| `--accent-primary-hover` | `#f0a83d` | Primary accent hover state |
| `--accent-sage` | `#5a9e6f` | Green — success states |
| `--accent-rose` | `#b8453a` | Red — danger/error states |
| `--accent-terracotta` | `#c4653a` | Warm earthy accent |
| `--accent-gold` | `#d4a853` | Gold — premium/brand accent |
| `--accent-amber` | `#e8992b` | Amber — warnings |

### Borders & Shadows

| Token | Value |
|-------|-------|
| `--border-default` | `rgba(232, 153, 43, 0.08)` |
| `--radius-sm` | `4px` |
| `--radius-md` | `8px` |
| `--radius-lg` | `12px` |
| `--shadow-card` | `0 4px 24px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)` |
| `--shadow-elevated` | `0 8px 32px rgba(0,0,0,0.5)` |
| `--glow-amber` | `0 0 20px rgba(232,153,43,0.15), 0 0 60px rgba(232,153,43,0.05)` |

### Typography

| Token | Value |
|-------|-------|
| `--font-body` | `'Inter', system-ui, sans-serif` |
| `--font-headings` | `'Inter', system-ui, sans-serif` |
| `--font-display` | `'Playfair Display', Georgia, serif` |
| `--font-mono` | `'JetBrains Mono', monospace` |
| `--type-xs` | `12px` |
| `--type-sm` | `14px` |
| `--type-base` | `16px` |
| `--type-md` | `18px` |
| `--type-lg` | `20px` |
| `--type-xl` | `24px` |
| `--type-2xl` | `28px` |
| `--type-3xl` | `36px` |
| `--type-4xl` | `48px` |
| `--type-5xl` | `64px` |

### Spacing (4px Grid)

| Token | Value |
|-------|-------|
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `16px` |
| `--space-lg` | `24px` |
| `--space-xl` | `32px` |
| `--space-2xl` | `48px` |
| `--space-3xl` | `64px` |
| `--space-4xl` | `96px` |

## Components

### 38 JS-Powered Components

| Component | File | Description |
|-----------|------|-------------|
| Accordion | `js/dcs-accordion.js` | Expandable panels with single/multi-select modes |
| Alerts | `js/dcs-alerts.js` | Dismissible notification banners (info, success, warning, error) |
| Badges | `js/dcs-badges.js` | Status and count badges with color variants |
| Bottom Sheet | `js/dcs-bottom-sheet.js` | Slide-up panel from bottom of viewport |
| Breadcrumbs | `js/dcs-breadcrumbs.js` | Navigation breadcrumb trails |
| Buttons | `js/dcs-buttons.js` | Primary, secondary, ghost, and icon buttons with states |
| Cards | `js/dcs-cards.js` | Content containers with hover effects |
| Carousel | `js/dcs-carousel.js` | Image/content carousel with navigation |
| Checkboxes | `js/dcs-checkboxes-v1.js` | Checkbox groups with select-all |
| Chips/Tags | `js/dcs-chips.js` | Compact label elements for filtering/categorization |
| Code | `js/dcs-code.js` | Syntax-highlighted code blocks with copy functionality |
| Combo Box | `js/dcs-combobox.js` | Combined input + dropdown selection |
| Context Menu | `js/dcs-context-menu.js` | Right-click contextual action menus |
| Drawer | `js/dcs-drawer.js` | Slide-out side panel |
| Dropdown | `js/dcs-dropdown.js` | Select-style dropdown menus |
| Dropzone | `js/dcs-dropzone.js` | File upload drag-and-drop area |
| Empty | `js/dcs-empty.js` | Empty state illustrations with CTAs |
| FAB | `js/dcs-fab.js` | Floating action button (back-to-top, etc.) |
| Header | `js/dcs-header.js` | Page header with sticky behavior |
| Image Compare | `js/dcs-image-compare.js` | Side-by-side or overlay image comparison |
| Inputs | `js/dcs-inputs.js` | Text inputs, textareas, selects with validation states |
| KPI | `js/dcs-kpi.js` | Key performance indicator cards with trend indicators |
| Modal | `js/dcs-modal.js` | Overlay dialogs with Escape key and click-outside dismiss |
| Pagination | `js/dcs-pagination.js` | Page navigation controls |
| Palette | `js/dcs-palette.js` | Color palette picker |
| Popover | `js/dcs-popover.js` | Floating tooltip-like content panels |
| Progress | `js/dcs-progress.js` | Progress bars with percentage and simulation mode |
| Scrollspy | `js/dcs-scrollspy.js` | Scroll-position-based navigation highlighting |
| Search | `js/dcs-search.js` | Search input with autocomplete and results |
| Segmented Control | `js/dcs-segmented-control.js` | iOS-style segmented button groups |
| Slider | `js/dcs-slider.js` | Range sliders with value display |
| Split Pane | `js/dcs-split-pane.js` | Resizable split-pane layout |
| Stepper | `js/dcs-stepper.js` | Multi-step progress indicator |
| Sticky Bar | `js/dcs-sticky-bar.js` | Sticky bar with scroll-aware behavior |
| Tables | `js/dcs-tables.js` | Data tables with sorting and row selection |
| Tabs | `js/dcs-tabs.js` | Tabbed content panels with animated indicator |
| Toasts | `js/dcs-toasts.js` | Auto-dismissing notification toasts (3s) |
| Toggles | `js/dcs-toggles.js` | Toggle switches with on/off states |

### 6 CSS-Only Components

These components are styled entirely with CSS — no JavaScript required.

| Component | Description |
|-----------|-------------|
| Avatars | User/profile avatar images |
| Dividers | Horizontal and vertical separators |
| KV List | Key-value data display pairs |
| Testimonial | Quote/testimonial cards |
| Timeline | Vertical timeline with events |
| Tooltips | Hover tooltip popups |

## Rules

These rules are **non-negotiable**. Every component and page must follow them.

1. **No `id` attributes** on component elements. Use `data-*`, classes, or `[data-dcs-component]`. IDs create single-instance constraints.

2. **No inline JS** — no `onclick`, `onchange`, `onsubmit` attributes. All event handling via delegation inside `init()`.

3. **No inline CSS** — no `<style>` blocks in HTML. All styles in `css/dcs-components.css` or page-specific CSS files.

4. **All scripts use `defer`** — prevents DOM-not-ready race conditions.

5. **`window.DCS` only** — every reference to the DCS namespace must use `window.DCS.register()`, `window.DCS._showToast()`, etc. Never bare `DCS.` — it fails in `'use strict'` mode.

6. **Strict mode everywhere** — `'use strict';` at the top of every JS file.

7. **No IIFEs that shadow DCS** — the registry lives on `window.DCS`. Do not create local `const DCS = {...}` in any file.

8. **Multi-instance safe** — every `init(el)` receives the container element. Operate only within `el`:
   - `el.querySelector('.my-class')` ✓
   - `document.querySelector('.my-class')` ✗ (finds wrong instance)

9. **Cache-busting** — script tags need `?v=TIMESTAMP` query strings. Always bump the timestamp when changing any JS file.

## Documentation & Demo Pages

Documentation pages live at the repository root. Demo pages live in `demo/`. Both reference the core library via relative paths.

| Page | File | Description |
|------|------|-------------|
| Brand Guide | `brand-guide.html` | Complete brand design system specification — colors, typography, spacing, photography, motion |
| Component Library | `component-library.html` | Interactive specimen book with all 39 components live-demoed |
| Blog Listing | `demo/blog.html` | Blog index with category filters and post cards |
| Blog Post | `demo/blog-post.html` | Single blog post layout with hero image, article typography, video embed, and figure captions |
| Coming Soon | `demo/coming-soon.html` | Pre-launch landing page with subscribe form |

## How to Add a Component

1. **Add HTML** to the showcase page with `data-dcs-component="my-component"` on the container element
2. **Add CSS** to `css/dcs-components.css` — use existing custom properties, match the spacing/radius/shadow conventions
3. **Create `js/dcs-mycomponent.js`:**
   ```js
   'use strict';

   if (typeof window.DCS === 'undefined') {
     console.warn('DCS registry missing');
   } else {
     window.DCS.register('mycomponent', {
       init: function(el) {
         // el = the container element [data-dcs-component="mycomponent"]
         // All event handlers use delegation on el, never document
         el.addEventListener('click', function(e) {
           var target = e.target.closest('[data-action="something"]');
           if (!target) return;
           // handle interaction
         });
       }
     });
   }
   ```
4. **Add script tag** to the page: `<script src="js/dcs-mycomponent.js?v=TIMESTAMP" defer></script>`
5. **Bump the cache-buster** on all script tags in the HTML

## License

MIT License — see [LICENSE](LICENSE) for full text.

Copyright (c) 2026 Diaz Creative Studio
