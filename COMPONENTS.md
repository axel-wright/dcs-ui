# DCS Component Reference

<!-- Generated 2026-07-04 from 39 registered components across 42 source files -->

## Quick Reference

| Component | JS File | CSS File | Actions | ARIA | Keyboard |
|---|---|---|---|---|---|
| `accordion` | dcs-accordion.js | accordion.css | — | ✅ | ✅ |
| `alerts` | dcs-alerts.js | alert-banner.css | `restore-alerts` | — | — |
| `badges` | dcs-badges.js | badges.css | `update-status` | — | — |
| `bottom-sheet` | dcs-bottom-sheet.js | bottom-sheet.css | `sheet-open`, `sheet-close`, `sheet-apply`, `sheet-chip-single`, `sheet-chip-toggle` | ✅ | ✅ |
| `breadcrumbs` | dcs-breadcrumbs.js | breadcrumbs.css | — | ✅ | — |
| `buttons` | dcs-buttons.js | buttons.css | — | — | — |
| `cards` | dcs-cards.js | cards.css | — | — | — |
| `carousel` | dcs-carousel.js | carousel.css | — | ✅ | ✅ |
| `checkboxes` | dcs-checkboxes.js | checkboxes.css | — | — | — |
| `chips` | dcs-chips.js | chips.css | — | — | ✅ |
| `code` | dcs-code.js | code-blocks.css | — | — | — |
| `combobox` | dcs-combobox.js | combo-box.css | — | ✅ | ✅ |
| `context-menu` | dcs-context-menu.js | context-menu.css | — | (`role`) | ✅ |
| `drawer` | dcs-drawer.js | drawer.css | `drawer-open`, `drawer-close`, `drawer-toast-close` | — | ✅ |
| `dropdown` | dcs-dropdown.js | dropdown-select.css | — | ✅ | ✅ |
| `dropzone` | dcs-dropzone.js | file-drop-zone.css | — | — | — |
| `empty` | dcs-empty.js | empty-state.css | — | — | — |
| `fab` | dcs-fab.js | fab.css | — | — | — |
| `image-compare` | dcs-image-compare.js | image-comparison.css | — | — | — |
| `inputs` | dcs-inputs.js | inputs.css | — | — | — |
| `kpi` | dcs-kpi.js | kpi-cards.css | — | — | — |
| `modal` | dcs-modal.js | modals.css | `modal-open`, `modal-close`, `confirm-delete` | ✅ | ✅ |
| `pagination` | dcs-pagination.js | pagination.css | — | ✅ | ✅ |
| `palette` | dcs-palette.js | command-palette.css | — | ✅ | ✅ |
| `popover` | dcs-popover.js | popover.css | — | — | — |
| `progress` | dcs-progress.js | progress.css | — | ✅ | — |
| `scrollspy` | dcs-scrollspy.js | scroll-spy.css | — | — | ✅ |
| `search` | dcs-search.js | search-input.css | — | ✅ | — |
| `segmented-control` | dcs-segmented-control.js | segmented-control.css | — | ✅ | ✅ |
| `slider` | dcs-slider.js | slider.css | — | ✅ | ✅ |
| `split-pane` | dcs-split-pane.js | — | — | — | — |
| `stepper` | dcs-stepper.js | stepper.css | — | ✅ | ✅ |
| `sticky-bar` | dcs-sticky-bar.js | sticky-action-bar.css | — | — | — |
| `tables` | dcs-tables.js | tables.css | — | — | — |
| `tabs` | dcs-tabs.js | tabs.css | — | ✅ | ✅ |
| `theme` | dcs-core.js | dcs-core.css | — | ✅ | — |
| `toasts` | dcs-toasts.js | toasts.css | `show-toast` | — | — |
| `toggles` | dcs-toggles.js | toggles.css | — | ✅ | — |

**Infrastructure-only (no registered component):** `dcs-header.js`, `dcs-hub.js`

---

## Usage Pattern

### How DCS Initializes

DCS uses auto-discovery: components are registered at script load time and initialized automatically when the DOM is ready.

```
1. <script> tags load dcs-core.js first, then individual dcs-*.js files
2. Each dcs-*.js calls window.DCS.register('name', { init: fn(el) })
3. On DOMContentLoaded (and load + 500ms retry), DCS._init() runs:
   a. Finds all [data-dcs-component]:not([data-dcs-initialized])
   b. Matches the attribute value to a registered controller
   c. Calls controller.init(el) with the container element
   d. Marks el with data-dcs-initialized + data-dcs-instance="N"
```

### HTML Pattern

Every DCS component starts with a container element:

```html
<div data-dcs-component="accordion">
  <!-- component markup using dcs- prefixed classes -->
</div>
```

### Re-initializing After DOM Changes

Call `DCS._init(container)` after injecting new HTML:

```js
// After AJAX content load:
var panel = document.getElementById('dynamic-panel');
panel.innerHTML = newHtml;
window.DCS._init(panel);
```

### Production Build

In production, use the minified bundle instead of individual files:

```html
<script src="js/dcs-components.min.js?v=20260704-abc1234"></script>
```

The build script (`bash build.sh`) concatenates all `dcs-*.js` files (core first, then alphabetical, skipping legacy files), minifies them, and cache-busts HTML references.

### Core Utilities

Shared helpers available on `window.DCS`:

| Method | Description |
|---|---|
| `DCS.register(name, ctrl)` | Register a component controller |
| `DCS._init(container?)` | Initialize all uninitialized components in `container` (defaults to `document`) |
| `DCS._registeredComponents()` | Returns array of registered component names |
| `DCS._showToast(msg, type?)` | Show a toast notification (types: info, success, warning, error, danger) |
| `DCS._focusable(container)` | Returns array of visible, focusable elements in a container |
| `DCS._trapFocus(container)` | Trap Tab/Shift+Tab within a container. Returns a `release()` function. |

---

## Per-Component Reference

### accordion

**File:** `js/dcs-accordion.js` | **CSS:** `css/accordion.css` | **Lines:** 114

```html
<div data-dcs-component="accordion" data-accordion-mode="single">
  <div class="accordion-item open">
    <button class="accordion-trigger">Section 1</button>
    <div class="accordion-content">Content here</div>
  </div>
  <div class="accordion-item">
    <button class="accordion-trigger">Section 2</button>
    <div class="accordion-content">More content</div>
  </div>
</div>
```

**Data Attributes:**
| Attribute | Values | Description |
|---|---|---|
| `data-dcs-component` | `"accordion"` | Triggers auto-init |
| `data-accordion-mode` | `"single"` (default `"multi"`) | Single-select (accordion) vs multi-open |

**Actions:** None — event delegation on `.accordion-trigger` clicks.

**Accessibility:**
- Triggers get `aria-expanded` synced with `.open` class
- Triggers get `aria-controls` pointing to content panel
- Content panels get `role="region"` and `aria-labelledby`
- Keyboard: ArrowDown, ArrowUp, Home, End

---

### alerts

**File:** `js/dcs-alerts.js` | **CSS:** `css/alert-banner.css` | **Lines:** 45

```html
<div data-dcs-component="alerts">
  <div class="alert-banner alert-warning">
    <span>This is a warning banner</span>
    <button aria-label="Dismiss">×</button>
  </div>
</div>
```

**Actions:**
| Action | Description |
|---|---|
| `data-action="restore-alerts"` | Click handler to restore dismissed alerts |

---

### badges

**File:** `js/dcs-badges.js` | **CSS:** `css/badges.css` | **Lines:** 69

```html
<div data-dcs-component="badges">
  <span class="badge badge-new">New</span>
  <span class="badge badge-danger" data-status="offline">Offline</span>
</div>
```

**Actions:**
| Action | Description |
|---|---|
| `data-action="update-status"` | Updates a badge's displayed status |

---

### bottom-sheet

**File:** `js/dcs-bottom-sheet.js` | **CSS:** `css/bottom-sheet.css` | **Lines:** 201

```html
<div data-dcs-component="bottom-sheet">
  <button data-action="sheet-open">Open Sheet</button>
  <div class="bottom-sheet-overlay">
    <div class="bottom-sheet-panel">
      <div class="bottom-sheet-header">
        <button data-action="sheet-close">Close</button>
      </div>
      <div class="bottom-sheet-body">
        <button class="bottom-sheet-chip" data-action="sheet-chip-single">Option</button>
      </div>
      <div class="bottom-sheet-footer">
        <button data-action="sheet-apply">Apply</button>
      </div>
    </div>
  </div>
</div>
```

**Actions:**
| Action | Description |
|---|---|
| `data-action="sheet-open"` | Opens the bottom sheet |
| `data-action="sheet-close"` | Closes the bottom sheet |
| `data-action="sheet-apply"` | Apply button (closes sheet) |
| `data-action="sheet-chip-single"` | Single-select chip |
| `data-action="sheet-chip-toggle"` | Toggle chip selection |

**Accessibility:**
- `aria-label` / `aria-labelledby` on the sheet panel
- `DCS._trapFocus()` used to trap focus inside the open sheet
- Escape key closes the sheet

---

### breadcrumbs

**File:** `js/dcs-breadcrumbs.js` | **CSS:** `css/breadcrumbs.css` | **Lines:** 35

```html
<div data-dcs-component="breadcrumbs">
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><a href="/products/">Products</a></li>
      <li aria-current="page">Current</li>
    </ol>
  </nav>
</div>
```

**Accessibility:** Sets `aria-current="page"` on the last breadcrumb item automatically.

---

### buttons

**File:** `js/dcs-buttons.js` | **CSS:** `css/buttons.css` | **Lines:** 33

```html
<div data-dcs-component="buttons">
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-secondary">Secondary</button>
  <button class="btn btn-danger">Danger</button>
</div>
```

No actions or custom attributes. Primarily CSS-driven; minimal JS for ripple effects / interaction.

---

### cards

**File:** `js/dcs-cards.js` | **CSS:** `css/cards.css` | **Lines:** 21

```html
<div data-dcs-component="cards">
  <div class="card">
    <div class="card-header">Title</div>
    <div class="card-body">Content</div>
  </div>
</div>
```

No actions or custom attributes. Primarily CSS-driven.

---

### carousel

**File:** `js/dcs-carousel.js` | **CSS:** `css/carousel.css` | **Lines:** 202

```html
<div data-dcs-component="carousel" data-autoplay="true" data-cards-visible="1">
  <div class="dcs-carousel-track">
    <div class="dcs-carousel-slide is-active">
      <img class="dcs-carousel-image" src="slide1.jpg" alt="Slide 1" />
    </div>
    <div class="dcs-carousel-slide">
      <img class="dcs-carousel-image" src="slide2.jpg" alt="Slide 2" />
    </div>
  </div>
  <button class="dcs-carousel-prev" aria-label="Previous slide">←</button>
  <button class="dcs-carousel-next" aria-label="Next slide">→</button>
  <div class="dcs-carousel-dots">
    <button class="dcs-carousel-dot is-active"></button>
    <button class="dcs-carousel-dot"></button>
  </div>
</div>
```

**Data Attributes:**
| Attribute | Values | Description |
|---|---|---|
| `data-dcs-component` | `"carousel"` | Triggers auto-init |
| `data-autoplay` | `"true"` / `"false"` | Enable autoplay (defaults true; respects `prefers-reduced-motion`) |
| `data-cards-visible` | integer | Cards visible per slide (multi-mode when > 1) |

**Accessibility:**
- Container: `aria-roledescription="carousel"`, `aria-label`
- Slides: `role="group"`, `aria-roledescription="slide"`, `aria-label="N of M"`
- Hidden slides: `aria-hidden="true"`
- Live region on track: `aria-live` synced to autoplay state
- Keyboard: ArrowLeft/ArrowRight, tabindex on container
- Touch swipe support

---

### checkboxes

**File:** `js/dcs-checkboxes.js` | **CSS:** `css/checkboxes.css` | **Lines:** 57

```html
<div data-dcs-component="checkboxes">
  <label class="checkbox">
    <input type="checkbox" />
    <span class="checkbox-mark"></span>
    Option
  </label>
</div>
```

No actions or custom attributes. Handles indeterminate state and ripple effects.

---

### chips

**File:** `js/dcs-chips.js` | **CSS:** `css/chips.css` | **Lines:** 57

```html
<div data-dcs-component="chips">
  <span class="chip chip-selectable">Chip</span>
  <span class="chip chip-deletable">
    Deletable
    <button class="chip-delete" aria-label="Remove">×</button>
  </span>
</div>
```

**Keyboard:** Enter/Space to toggle selectable chips.

---

### code

**File:** `js/dcs-code.js` | **CSS:** `css/code-blocks.css` | **Lines:** 35

```html
<div data-dcs-component="code">
  <pre><code>console.log('hello');</code></pre>
</div>
```

No actions or custom attributes. Adds a copy button to code blocks.

---

### combobox

**File:** `js/dcs-combobox.js` | **CSS:** `css/combo-box.css` | **Lines:** 163

```html
<div data-dcs-component="combobox">
  <input class="combobox-input" type="text" placeholder="Search..." />
  <ul class="combobox-list" role="listbox">
    <li role="option">Option 1</li>
    <li role="option">Option 2</li>
  </ul>
</div>
```

**Accessibility:**
- `role="combobox"`, `aria-autocomplete`, `aria-expanded`, `aria-controls`
- `aria-activedescendant` for active option
- `aria-selected` on selected items
- Keyboard: ArrowUp, ArrowDown, Enter, Escape

---

### context-menu

**File:** `js/dcs-context-menu.js` | **CSS:** `css/context-menu.css` | **Lines:** 122

```html
<div data-dcs-component="context-menu">
  <div class="context-menu-trigger">Right-click me</div>
  <div class="context-menu" role="menu">
    <button role="menuitem">Copy</button>
    <button role="menuitem">Delete</button>
  </div>
</div>
```

**Accessibility:**
- `role="menu"` / `role="menuitem"` on menu items
- Keyboard: ArrowUp, ArrowDown, Escape (closes menu)
- Right-click or long-press triggers

---

### drawer

**File:** `js/dcs-drawer.js` | **CSS:** `css/drawer.css` | **Lines:** 141

```html
<div data-dcs-component="drawer">
  <button data-action="drawer-open" data-drawer="main-drawer">Open Drawer</button>
</div>

<div class="drawer-overlay" data-drawer="main-drawer">
  <div class="drawer-panel">
    <div class="drawer-header">
      <button data-action="drawer-close">Close</button>
    </div>
    <div class="drawer-body">Content</div>
  </div>
</div>
```

**Actions:**
| Action | Description |
|---|---|
| `data-action="drawer-open"` | Opens the drawer |
| `data-action="drawer-close"` | Closes the drawer |
| `data-action="drawer-toast-close"` | Closes drawer + shows a toast (requires `data-toast-msg`, `data-toast-type`) |

**Data Attributes:**
| Attribute | Description |
|---|---|
| `data-drawer` | Links trigger to overlay via matching value |
| `data-toast-msg` | Toast message when using `drawer-toast-close` |
| `data-toast-type` | Toast type: info, success, warning, error |

**Accessibility:** `DCS._trapFocus()` on drawer panel. Escape key closes. Auto-detects header offset via `--dcs-header-height` CSS variable.

---

### dropdown

**File:** `js/dcs-dropdown.js` | **CSS:** `css/dropdown-select.css` | **Lines:** 143

```html
<div data-dcs-component="dropdown">
  <button class="dropdown-trigger">Select</button>
  <div class="dropdown-menu">
    <div class="dropdown-item" data-value="1">Option 1</div>
    <div class="dropdown-item" data-value="2">Option 2</div>
  </div>
</div>
```

**Accessibility:**
- `aria-expanded` on trigger
- `aria-selected` on selected item
- Keyboard: ArrowUp, ArrowDown, Enter, Escape

---

### dropzone

**File:** `js/dcs-dropzone.js` | **CSS:** `css/file-drop-zone.css` | **Lines:** 48

```html
<div data-dcs-component="dropzone">
  <div class="file-drop-zone">
    <p>Drag files here or click to browse</p>
    <input type="file" class="file-input" hidden />
  </div>
</div>
```

No actions. Handles dragenter/dragleave/dragover/drop events with visual feedback.

---

### empty

**File:** `js/dcs-empty.js` | **CSS:** `css/empty-state.css` | **Lines:** 25

```html
<div data-dcs-component="empty">
  <div class="empty-state">
    <div class="empty-icon">📭</div>
    <h3>No items yet</h3>
    <p>Create your first item to get started.</p>
  </div>
</div>
```

No actions or custom attributes. CSS-driven.

---

### fab

**File:** `js/dcs-fab.js` | **CSS:** `css/fab.css` | **Lines:** 81

```html
<div data-dcs-component="fab">
  <button class="fab fab-primary" aria-label="Create new">+</button>
  <div class="fab-menu">
    <button class="fab-item">Option 1</button>
    <button class="fab-item">Option 2</button>
  </div>
</div>
```

No actions. Handles FAB menu expand/collapse with rotation animation.

---

### image-compare

**File:** `js/dcs-image-compare.js` | **CSS:** `css/image-comparison.css` | **Lines:** 34

```html
<div data-dcs-component="image-compare">
  <div class="image-compare">
    <img class="image-compare-before" src="before.jpg" alt="Before" />
    <img class="image-compare-after" src="after.jpg" alt="After" />
    <div class="image-compare-handle"></div>
  </div>
</div>
```

No actions. Draggable comparison slider.

---

### inputs

**File:** `js/dcs-inputs.js` | **CSS:** `css/inputs.css` | **Lines:** 41

```html
<div data-dcs-component="inputs">
  <div class="input-group">
    <input class="input" type="text" placeholder="Enter value" />
    <span class="input-helper">Helper text</span>
  </div>
</div>
```

**Data Attributes:**
| Attribute | Description |
|---|---|
| `data-calc-input` | Marks an input for calculator-style behavior |

---

### kpi

**File:** `js/dcs-kpi.js` | **CSS:** `css/kpi-cards.css` | **Lines:** 17

```html
<div data-dcs-component="kpi">
  <div class="kpi-card">
    <div class="kpi-value">$12,450</div>
    <div class="kpi-label">Revenue</div>
    <div class="kpi-change kpi-up">+12.5%</div>
  </div>
</div>
```

No actions or custom attributes. CSS-driven; JS handles live value updates via `setValue()`.

---

### modal

**File:** `js/dcs-modal.js` | **CSS:** `css/modals.css` | **Lines:** 108

```html
<div data-dcs-component="modal">
  <button data-action="modal-open" data-modal="confirm-dialog">Open Modal</button>

  <div class="modal-overlay" data-modal-name="confirm-dialog">
    <div class="modal-box" role="dialog" aria-modal="true">
      <div class="modal-title">Confirm</div>
      <div class="modal-body">Are you sure?</div>
      <div class="modal-footer">
        <button data-action="modal-close">Cancel</button>
        <button data-action="confirm-delete">Delete</button>
      </div>
    </div>
  </div>
</div>
```

**Actions:**
| Action | Description |
|---|---|
| `data-action="modal-open"` | Opens the modal (requires `data-modal` attribute) |
| `data-action="modal-close"` | Closes the containing modal |
| `data-action="confirm-delete"` | Closes modal (for destructive actions) |

**Data Attributes:**
| Attribute | Description |
|---|---|
| `data-modal` | Links trigger button to modal overlay |
| `data-modal-name` | Alternative linking attribute on the overlay |

**Accessibility:**
- `role="dialog"`, `aria-modal="true"` on the modal box
- `aria-labelledby` auto-linked to `.modal-title` (or `aria-label` fallback)
- `DCS._trapFocus()` traps focus when open
- Escape key closes all open modals
- Backdrop click closes
- Title gets auto-generated `id` for ARIA linking

---

### pagination

**File:** `js/dcs-pagination.js` | **CSS:** `css/pagination.css` | **Lines:** 104

```html
<div data-dcs-component="pagination">
  <nav class="pagination" aria-label="Pagination">
    <button class="page-btn" data-page="1" aria-current="page">1</button>
    <button class="page-btn" data-page="2">2</button>
    <button class="page-btn page-dots" disabled>…</button>
    <button class="page-btn" data-page="10">10</button>
  </nav>
</div>
```

**Accessibility:**
- `aria-current="page"` on active page
- `aria-disabled="true"` on disabled buttons
- `aria-label` on nav element
- Keyboard: left/right arrow navigation via page buttons

---

### palette (Command Palette)

**File:** `js/dcs-palette.js` | **CSS:** `css/command-palette.css` | **Lines:** 224

```html
<div data-dcs-component="palette">
  <div class="palette-overlay">
    <div class="palette-box">
      <input class="palette-input" type="text" placeholder="Type a command..." />
      <div class="palette-results">
        <div class="palette-item" data-action="navigate" data-url="/settings">
          <span class="palette-icon">⚙️</span>
          <span>Settings</span>
          <kbd>⌘,</kbd>
        </div>
      </div>
    </div>
  </div>
</div>
```

**Accessibility:**
- `role="dialog"`, `aria-modal="true"`, `aria-label` on the palette box
- `role="combobox"`, `aria-autocomplete`, `aria-expanded`, `aria-controls` on input
- `role="listbox"` / `role="option"` on results
- `aria-activedescendant` for active result
- `aria-selected` on selected item
- Keyboard: ArrowUp/Down, Enter, Escape

---

### popover

**File:** `js/dcs-popover.js` | **CSS:** `css/popover.css` | **Lines:** 52

```html
<div data-dcs-component="popover">
  <button class="popover-trigger">Info</button>
  <div class="popover">
    <div class="popover-arrow"></div>
    <div class="popover-body">Helpful information here</div>
  </div>
</div>
```

No actions or custom attributes. Click-toggle popover with auto-positioning.

---

### progress

**File:** `js/dcs-progress.js` | **CSS:** `css/progress.css` | **Lines:** 37

```html
<div data-dcs-component="progress">
  <div class="progress" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
    <div class="progress-bar" style="width: 60%"></div>
  </div>
</div>
```

**Accessibility:**
- `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `aria-label` on the progress bar

---

### scrollspy

**File:** `js/dcs-scrollspy.js` | **CSS:** `css/scroll-spy.css` | **Lines:** 226

```html
<div data-dcs-component="scrollspy">
  <nav class="scrollspy-nav">
    <a href="#section1" class="scrollspy-link active">Section 1</a>
    <a href="#section2" class="scrollspy-link">Section 2</a>
  </nav>
</div>
```

**Data Attributes:**
| Attribute | Description |
|---|---|
| `data-spy-target` | CSS selector for the scroll container to observe |

**Keyboard:** Arrow key navigation through links.

---

### search

**File:** `js/dcs-search.js` | **CSS:** `css/search-input.css` | **Lines:** 39

```html
<div data-dcs-component="search">
  <div class="search-input">
    <input type="search" placeholder="Search..." />
    <button class="search-clear" aria-label="Clear">×</button>
  </div>
</div>
```

**Accessibility:**
- `role="search"` on the container
- `aria-label` / `aria-labelledby` on the input

---

### segmented-control

**File:** `js/dcs-segmented-control.js` | **CSS:** `css/segmented-control.css` | **Lines:** 77

```html
<div data-dcs-component="segmented-control">
  <div class="segmented-control" role="radiogroup">
    <button class="segment active" role="radio" aria-checked="true">Day</button>
    <button class="segment" role="radio" aria-checked="false">Week</button>
    <button class="segment" role="radio" aria-checked="false">Month</button>
  </div>
</div>
```

**Accessibility:**
- `role="radiogroup"` / `role="radio"` on segments
- `aria-checked` synced with active state
- Keyboard: ArrowLeft/ArrowRight

---

### slider

**File:** `js/dcs-slider.js` | **CSS:** `css/slider.css` | **Lines:** 110

```html
<div data-dcs-component="slider">
  <div class="slider">
    <input type="range" class="slider-input" min="0" max="100" value="50" />
    <div class="slider-track">
      <div class="slider-fill"></div>
    </div>
    <div class="slider-thumb"></div>
  </div>
</div>
```

**Accessibility:**
- `role="slider"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`
- `aria-label` / `aria-labelledby`
- `aria-checked` for toggle-style sliders
- Keyboard: ArrowLeft/ArrowRight/ArrowUp/ArrowDown

---

### split-pane

**File:** `js/dcs-split-pane.js` | **Lines:** 50

```html
<div data-dcs-component="split-pane">
  <div class="split-pane">
    <div class="split-pane-left">Left</div>
    <div class="split-pane-handle"></div>
    <div class="split-pane-right">Right</div>
  </div>
</div>
```

No CSS file. Draggable split pane with mouse event handling.

---

### stepper

**File:** `js/dcs-stepper.js` | **CSS:** `css/stepper.css` | **Lines:** 150

```html
<div data-dcs-component="stepper">
  <div class="stepper">
    <div class="step completed">
      <div class="step-indicator">✓</div>
      <div class="step-label">Details</div>
    </div>
    <div class="step active">
      <div class="step-indicator">2</div>
      <div class="step-label">Review</div>
    </div>
    <div class="step">
      <div class="step-indicator">3</div>
      <div class="step-label">Confirm</div>
    </div>
  </div>
</div>
```

**Accessibility:**
- `role="list"` with `role="listitem"` on steps
- `aria-current="step"` on the active step
- Keyboard: ArrowLeft/ArrowRight navigation between steps

---

### sticky-bar

**File:** `js/dcs-sticky-bar.js` | **CSS:** `css/sticky-action-bar.css` | **Lines:** 32

```html
<div data-dcs-component="sticky-bar">
  <div class="sticky-action-bar">
    <button class="btn btn-primary">Save</button>
    <button class="btn">Cancel</button>
  </div>
</div>
```

No actions or custom attributes. Shows/hides based on scroll position.

---

### tables

**File:** `js/dcs-tables.js` | **CSS:** `css/tables.css` | **Lines:** 67

```html
<div data-dcs-component="tables">
  <table class="table">
    <thead><tr><th>Name</th><th>Status</th></tr></thead>
    <tbody><tr><td>Item</td><td>Active</td></tr></tbody>
  </table>
</div>
```

No actions or custom attributes. Responsive table handling with horizontal scroll.

---

### tabs

**File:** `js/dcs-tabs.js` | **CSS:** `css/tabs.css` | **Lines:** 108

```html
<div data-dcs-component="tabs">
  <div class="tab-nav">
    <button class="tab-btn active" data-tab="panel1">Tab 1</button>
    <button class="tab-btn" data-tab="panel2">Tab 2</button>
    <div class="tab-indicator"></div>
  </div>
  <div class="tab-panel active" data-tab="panel1">Content 1</div>
  <div class="tab-panel" data-tab="panel2">Content 2</div>
</div>
```

**Data Attributes:**
| Attribute | Description |
|---|---|
| `data-tab` | Links button to panel (must match on both `.tab-btn` and `.tab-panel`) |

**Accessibility:**
- `aria-controls` on tab buttons, `aria-labelledby` on panels
- `aria-selected` synced with `.active` class
- `tabindex="0"` on active tab, `tabindex="-1"` on inactive
- Keyboard: ArrowLeft/ArrowRight, Home, End
- `.tab-indicator` animated underline

---

### theme

**File:** `js/dcs-core.js` | **CSS:** `css/dcs-core.css`

```html
<div data-dcs-component="theme">
  <!-- Auto-injected toggle button if none present -->
</div>

<!-- Or standalone toggle anywhere on page: -->
<button data-theme-toggle class="theme-toggle-btn" aria-label="Toggle light and dark theme">
  <span class="theme-toggle-icon">☀️</span>
  <span class="theme-toggle-label">LIGHT</span>
</button>
```

**Accessibility:** `aria-label` and `aria-pressed` on toggle button. Theme persists in `localStorage` under key `dcs-theme`.

---

### toasts

**File:** `js/dcs-toasts.js` | **CSS:** `css/toasts.css` | **Lines:** 24

```html
<div data-dcs-component="toasts">
  <button data-action="show-toast" data-toast-type="success" data-toast-msg="Saved!">Show Toast</button>
</div>
```

**Actions:**
| Action | Description |
|---|---|
| `data-action="show-toast"` | Shows a toast notification via `DCS._showToast()` |

**Data Attributes:**
| Attribute | Description |
|---|---|
| `data-toast-type` | Toast type: info, success, warning, error, danger |
| `data-toast-msg` | Toast message text |

---

### toggles

**File:** `js/dcs-toggles.js` | **CSS:** `css/toggles.css` | **Lines:** 47

```html
<div data-dcs-component="toggles">
  <label class="toggle">
    <input type="checkbox" class="toggle-input" />
    <span class="toggle-switch"></span>
    <span class="toggle-label">Enable feature</span>
  </label>
</div>
```

**Accessibility:**
- `role="switch"` on toggle element
- `aria-checked` synced with input state

---

## Infrastructure Files

### dcs-header.js

Not a registered component. Provides responsive header behavior:
- Mobile menu toggle with `aria-expanded`
- Scroll-aware header state management

### dcs-hub.js

Not a registered component. Dashboard hub functionality — handles cross-component communication and Escape key for stacked overlays.

---

## Build & Deploy

```bash
# Development: load individual files
<script src="js/dcs-core.js"></script>
<script src="js/dcs-modal.js"></script>
<script src="js/dcs-drawer.js"></script>
<!-- ... -->

# Production: single minified bundle
bash build.sh
# Outputs: js/dcs-components.min.js, css/dcs-components.min.css, css/dcs-core.min.css
```
