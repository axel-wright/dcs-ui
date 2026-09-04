---
version: alpha
name: Diaz Creative Studio
description: "Warm Dark — Workshop at night. Deep industrial steel tones, glowing tungsten accents, high-contrast typography, and organic ambient shadows. Inspired by the tactile warmth of a metal and woodworking shop after hours."
colors:
  primary: "#e8992b"
  bg-deepest: "#0b0d14"
  bg-default: "#0f1119"
  surface-elevated: "#161922"
  surface-hover: "#1c1f2a"
  accent-primary: "#e8992b"
  accent-primary-hover: "#f0a83d"
  accent-terracotta: "#c4653a"
  accent-gold: "#d4a853"
  accent-sage: "#5a9e6f"
  accent-rose: "#b8453a"
  accent-rose-hover: "#c85146"
  accent-info: "#4988c8"
  accent-purple: "#a78bfa"
  accent-purple-hover: "#c4b5fd"
  text-primary: "#ede6dc"
  text-secondary: "#a89e92"
  text-muted: "#6b635a"
  text-inverse: "#1a1814"
  on-accent: "#1a1814"
  border-default: "rgba(255, 255, 255, 0.06)"
  border-active: "rgba(232, 153, 43, 0.25)"
typography:
  h1:
    fontFamily: Inter
    fontSize: 4rem
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  h2:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h3:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h4:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: 700
    lineHeight: 1.3
  h5:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.3
  body-lg:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.4
  body-md:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 500
    lineHeight: 1.5
  body-base:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: 500
    letterSpacing: "0.05em"
  display:
    fontFamily: Playfair Display
    fontSize: 1.75rem
    fontWeight: 700
    fontStyle: italic
    lineHeight: 1.2
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
components:
  button-primary:
    backgroundColor: "{colors.accent-primary}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.accent-primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: 12px
  button-secondary-hover:
    backgroundColor: "{colors.surface-hover}"
  card:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-hover:
    backgroundColor: "{colors.surface-hover}"
  card-bordered:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: 24px
  page:
    backgroundColor: "{colors.bg-deepest}"
    textColor: "{colors.text-primary}"
  input:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: 12px
  badge:
    backgroundColor: "rgba(232, 153, 43, 0.10)"
    textColor: "{colors.accent-primary}"
    rounded: "{rounded.full}"
    padding: 8px
  badge-green:
    backgroundColor: "rgba(90, 158, 111, 0.10)"
    textColor: "{colors.accent-sage}"
  badge-red:
    backgroundColor: "rgba(184, 69, 58, 0.10)"
    textColor: "{colors.accent-rose}"
  badge-terracotta:
    backgroundColor: "rgba(196, 101, 58, 0.10)"
    textColor: "{colors.accent-terracotta}"
  badge-gold:
    backgroundColor: "rgba(212, 168, 83, 0.10)"
    textColor: "{colors.accent-gold}"
  badge-info:
    backgroundColor: "rgba(73, 136, 200, 0.10)"
    textColor: "{colors.accent-info}"
  badge-purple:
    backgroundColor: "rgba(167, 139, 250, 0.10)"
    textColor: "{colors.accent-purple}"
  caption:
    textColor: "{colors.text-muted}"
    typography: "{typography.body-sm}"
  nav-link:
    textColor: "{colors.text-secondary}"
  nav-link-active:
    textColor: "{colors.accent-primary}"
  nav:
    backgroundColor: "{colors.bg-default}"
    textColor: "{colors.text-primary}"
light:
  description: "Warm Cream — Daylight workshop. White cards on a warm cream canvas. Tungsten amber accents, dark brown text, subtle brown-tinted borders."
  bg-deepest: "#e8e3db"
  bg-default: "#f5f2eb"
  surface-elevated: "#ffffff"
  surface-hover: "#f0ece4"
  nav-surface: "rgba(245, 242, 235, 0.85)"
  nav-surface-mobile: "rgba(245, 242, 235, 0.95)"
  text-primary: "#1a1510"
  text-secondary: "#5c5348"
  text-muted: "#8a8178"
  text-inverse: "#f5f2eb"
  on-accent: "#f5f2eb"
  border-default: "rgba(26, 21, 16, 0.10)"
  border-active: "rgba(232, 153, 43, 0.30)"
  glow-amber: "0 0 12px rgba(232,153,43,0.20), 0 0 40px rgba(232,153,43,0.08)"
  shadow-card: "0 1px 3px rgba(26,21,16,0.08), 0 4px 16px rgba(26,21,16,0.06)"
  shadow-elevated: "0 2px 8px rgba(26,21,16,0.10), 0 8px 24px rgba(26,21,16,0.08)"
---

## Overview

Diaz Creative Studio is a digital fabrication brand — CNC machining, 3D printing,
laser engraving, and maker projects from Northern California. The visual identity
is **"Warm Dark"** — inspired by the tactile warmth of a metal and woodworking
shop after hours. Deep industrial steel tones form the foundation. Glowing
tungsten amber punctuates. Organic ambient shadows replace hard borders. Dark
doesn't have to be cold.

The brand voice is split: **Inter** carries the functional weight — navigation,
data, buttons, labels. **Playfair Display italic** carries the emotional weight —
hero titles, pull quotes, brand statements. Together they create rhythm: a page
that's all Inter feels clinical. All Playfair feels like a wedding invitation.
The mix is the brand.

## Colors

The palette is rooted in four layers of dark steel, a single tungsten amber
accent, and warm off-white text.

### Backgrounds

Four distinct surface layers create depth without borders. Each has a clear
purpose — deeper = further back, lighter = closer to the user.

- **`{colors.bg-deepest}` (#0b0d14):** The page canvas. Deepest steel.
- **`{colors.bg-default}` (#0f1119):** Resting surfaces and sidebars.
- **`{colors.surface-elevated}` (#161922):** Cards, panels, elevated content.
- **`{colors.surface-hover}` (#1c1f2a):** Hovered and interactive surfaces.
  The warmest of the steel tones.

### Accents

- **`{colors.accent-primary}` (#e8992b):** Tungsten amber. THE accent. Used
  for primary buttons, active nav links, key data highlights, and critical
  indicators. Use sparingly — amber is punctuation, not wallpaper. One primary
  button per viewport. One glow highlight per section.
- **`{colors.accent-gold}` (#d4a853):** Polished gold. Reserved for editorial
  moments — Playfair Display pull quotes, section dividers, brand statements.
- **`{colors.accent-terracotta}` (#c4653a):** Warm clay. Secondary accent for
  hover states, progress indicators, subtle warmth.
- **`{colors.accent-sage}` (#5a9e6f):** Muted green. Success states, completion
  badges, positive indicators.
- **`{colors.accent-rose}` (#b8453a):** Muted red. Errors, destructive actions,
  critical alerts.
- **`{colors.accent-info}` (#4988c8):** Cool blue. Informational badges, links,
  system messages.
- **`{colors.accent-purple}` (#a78bfa):** Soft purple. Creative/experimental
  moments, secondary decorative accents.

### Text

Text is warm, never stark. No pure white — everything carries a subtle amber
undertone.

- **`{colors.text-primary}` (#ede6dc):** Warm off-white. Headlines, body text,
  primary content.
- **`{colors.text-secondary}` (#a89e92):** Warm gray. Supporting text, captions,
  metadata.
- **`{colors.text-muted}` (#6b635a):** Warm dark gray. Timestamps, placeholders,
  truly secondary information.
- **`{colors.text-inverse}` (#1a1814):** Near-black. Text on amber/gold
  backgrounds — buttons, badges, accent surfaces.

### Glows & Shadows

The brand uses organic ambient glows instead of hard borders. Cards lift from
the page with warm amber shadows, not cold white outlines.

- **`{colors.glow-amber}`:** Soft tungsten halo for elevated cards and primary
  buttons. The signature brand treatment.
- **`{colors.glow-terracotta}`:** Warm clay glow for secondary elevation.
- **`{colors.glow-rose}`:** Muted red glow for error/destructive elevated states.
- **`{colors.shadow-card}`:** Standard card elevation.
- **`{colors.shadow-elevated}`:** Modals, slide-out panels, top-layer surfaces.

## Light Mode — Warm Cream

DCS has two modes: **Warm Dark** (default) and **Warm Cream** (light). The light
mode is a **full palette adaptation** — cards, panels, and surfaces shift from
dark steel to warm cream tones. Tungsten amber accents remain the same across
both modes.

The philosophy: the workshop at night vs. the workshop in daylight. Same tools,
same materials, same amber glow — different ambient light.

### Page Canvas

The page background shifts from the deepest steel to warm cream. A subtle amber
radial gradient at the top of the viewport mimics daylight filtering through
workshop windows.

- **`{light.bg-deepest}` / `{light.bg-default}` (#f5f2eb):** Warm cream canvas.
  The page background. Replaces `{colors.bg-deepest}` (#0b0d14).

### Surfaces

Cards shift to white in light mode. The dark steel surfaces (#161922, #1c1f2a)
are exclusive to dark mode.

- **`{light.surface-elevated}` (#ffffff):** Cards, panels, inputs — pure white.
  Replaces `{colors.surface-elevated}` (#161922).
- **`{light.surface-hover}` (#f0ece4):** Card and panel hover states —
  very slightly off-white. Replaces `{colors.surface-hover}` (#1c1f2a).
- **`{light.nav-surface}` (rgba(245,242,235,0.85)):** Semi-transparent cream
  for the sticky navigation bar. Blends with the cream canvas.
- **`{light.nav-surface-mobile}` (rgba(245,242,235,0.95)):** More opaque
  version for mobile nav drawer backgrounds.

### Text

All text in light mode uses the cream-adapted palette. Since surfaces are light,
text shifts to dark brown tones for readability. No separate "card text" vs
"canvas text" distinction — all surfaces are light.

### Badge Text

Badge labels on the cream canvas need darker tones for contrast. The badge
backgrounds also become slightly more opaque.

- **`{light.badge-amber-text}` (#8B5E14):** Dark amber-brown for badge labels
  on cream. Dark mode uses `{colors.accent-primary}` (#e8992b) — that bright
  amber washes out on cream.

### Borders & Inputs

Borders become slightly more visible against the cream background. The default
border shifts from cool white-transparent to warm brown-transparent; the active
border stays amber-transparent in both modes, stepping up 0.25 → 0.30.

- **`{light.border-default}` (rgba(26,21,16,0.10)):** Brown-tinted borders
  visible against cream. Dark mode uses `rgba(255,255,255,0.06)`.
- **`{light.input-border}` (rgba(232,153,43,0.18)):** Input borders — more
  visible than the default border. Dark mode uses `rgba(232,153,43,0.12)`.

### Hero & Overlay

Hero sections use cream-toned overlays instead of dark steel. The monochrome
photography treatment uses brighter sepia with higher opacity so the cream
background bleeds through naturally.

- **`{light.hero-overlay-1}` (rgba(235,229,216,0.65)):** Primary hero overlay.
- **`{light.hero-overlay-2}` (rgba(235,229,216,0.85)):** Deeper hero overlay
  for article headers.
- **`{light.hero-overlay-3}` (rgba(245,242,235,0.65)):** Hero badge container
  background.

Photography treatment for light mode:
`grayscale(100%) sepia(55%) brightness(1.15)` at 40% opacity over cream
(#f5f2eb). Dark mode equivalent: `grayscale(100%) sepia(35%) brightness(0.35)`.

### What Does NOT Change

The following tokens are identical in both modes:

- **All accent colors:** Amber (#e8992b), gold (#d4a853), terracotta (#c4653a),
  sage (#5a9e6f), rose (#b8453a), info (#4988c8), purple (#a78bfa).
- **All glow and shadow tokens:** Glow-amber, glow-terracotta, shadow-card,
  shadow-elevated. Glows work the same on light surfaces as dark.
- **Typography:** Font families, sizes, weights, line heights. All unchanged.
- **Spacing, radius, and motion:** All unchanged.

### Light Mode Do's and Don'ts

- **Do** use white surfaces (#ffffff) for all cards, panels, and elevated
  surfaces in light mode — matching the brand guide CSS. The page canvas is
  warm cream (#f5f2eb); cards float above it in white.
- **Do** use `{light.text-primary}` (#1a1510) for all text — there is no
  separate card vs canvas text palette.
- **Do** use slightly more opaque badge backgrounds on cream —
  `{light.border-default}` at minimum.
- **Do** maintain the amber radial gradient at the top of the viewport.
- **Don't** use dark steel surfaces (#161922, #1c1f2a) in light mode. Those
  are dark-mode only.
- **Don't** change accent colors between modes. Tungsten amber is tungsten
  amber, day or night.
- **Don't** use warm off-white text (#ede6dc) on cream surfaces — the contrast
  requires dark brown text.

## Typography

Two typefaces, two roles. Never swap them.

### Inter — Functional

Inter is the workhorse. Headings, navigation, body text, buttons, forms, data
tables, dashboards — anything the user needs to act on or scan. Available in
weights 300–800. Headings use 800 (display) or 700 (subheads). Body uses 400–600.

### Playfair Display — Editorial

Playfair Display italic is the brand voice. Hero titles, pull quotes, taglines,
section dividers with personality — anything meant to land emotionally or set
tone. Weight 700, always italic. Use once or twice per page. A Playfair nav
bar feels pretentious. An Inter pull quote feels sterile. Each has its place.

### JetBrains Mono — Technical

Micro-labels, code blocks, data readouts, version strings, system chrome.
Weight 500 at 12px with 0.05em tracking. The monospace grounds the brand in
its technical roots.

### Type Scale

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| 5XL | 64px | 800 | Hero titles, landing pages |
| 4XL | 48px | 800 | Page titles |
| 3XL | 36px | 800 | Section headers |
| 2XL | 28px | 700 | Subheadings |
| XL | 24px | 700 | Card titles |
| LG | 20px | 600 | Large body, lead paragraphs |
| MD | 18px | 500 | Medium body |
| Base | 16px | 400 | Standard body, forms |
| SM | 14px | 400 | Captions, metadata |
| XS | 12px | 500 (mono) | Labels, version strings |

## Layout

A 4px baseline grid drives all spacing. The hierarchy:

| Token | Value | Use |
|-------|-------|-----|
| `xs` | 4px | Icon-text gaps, inline spacing |
| `sm` | 8px | Intra-component padding |
| `md` | 16px | Standard padding, card internals, flow spacing |
| `lg` | 24px | Inter-component separation |
| `xl` | 32px | Section padding |
| `2xl` | 48px | Large section breaks |
| `3xl` | 64px | Major section separation |
| `4xl` | 96px | Page-level separation |

Content max-width is 1200px. Sidebars and panels use 280-320px. Touch targets
minimum 44px. Dark themes depend on generous negative space — if elements feel
cramped, increase spacing by 8px before adjusting anything else.

## Elevation & Depth

Depth is communicated through surface color luminance and organic glows, not
hard borders. Four distinct surface layers stack from deepest to most elevated.
Cards never use solid white borders — they use amber glow shadows to lift from
the dark background. The result feels like objects under warm workshop lighting,
not diagnostic UI panels.

## Shapes

Rounded corners are modest and warm. Nothing sharp. Nothing pillowed.

- `sm` (4px): Inline elements, small buttons, code blocks.
- `md` (8px): Default — buttons, inputs, form elements.
- `lg` (12px): Cards, panels, modals.
- `full` (9999px): Badges, pills, status dots.

## Components

### Buttons

`button-primary` is the only high-emphasis action on a page. Tungsten amber
fill with dark text. Hover shifts to lighter amber. No more than one per
viewport — amber is punctuation, not wallpaper.

`button-secondary` is the default. Elevated surface fill with warm off-white
text. Hover lifts to surface-hover. This is the workhorse button.

### Cards

`card` uses surface-elevated fill with a 12px radius and 24px internal padding.
The signature treatment is an amber glow shadow — the card appears to float
above the dark background under warm workshop lighting. Hover shifts to
surface-hover fill. No borders.

### Inputs

Dark steel filled inputs (surface-elevated) with 8px rounding and 12px padding.
Focus state adds a subtle amber border or glow. Placeholder text uses text-muted.

### Badges

Rounded pill badges for status and metadata. Tinted backgrounds at 10% opacity
with matching text. Variants: amber (default), sage (success), rose (error),
info (blue), purple (creative).

### Navigation

`nav` sits on bg-default. Links are text-secondary by default, amber on hover/active.
The amber accent marks where you are — nothing else in the nav should compete.

## Photography & Imagery

The photography language is atmospheric and tactile.

- **Dark, dramatic lighting:** High contrast, directional, single-source light.
- **Warm color temperatures:** Deep gold, amber, tungsten. Never cold blue or
  diagnostic white fluorescent.
- **Macro detail:** Close-ups of steel blades, wood grain, dust particles,
  material finishes.
- **Maker context:** Hands actively crafting. The creator is implied, the
  physical process is the focus.
- **Atmospheric motion:** Stutter sparks, floating dust, slight motion blur.

**Monochrome hero treatment:** Full-bleed photography is desaturated, sepia-tinted,
and dimmed. Dark mode uses `grayscale(100%) sepia(35%) brightness(0.35)`. Light
mode uses `grayscale(100%) sepia(55%) brightness(1.15)` at 40% opacity over a
cream (#f5f2eb) background. The image recedes; the brand colors dominate.

Never use: sterile white-background product sheets, cool blue tones, generic
stock corporate photography.

## Design Principles

1. **Breathing room.** Dark themes live or die on negative space. If elements
   feel cramped, increase spacing by 8px. Default to 16px gaps over 8px.

2. **Luminance hierarchy.** Importance is mapped directly to brightness.
   Interactive targets glow (amber). Headers are warm white (#ede6dc).
   Secondary details step down to warm gray (#a89e92). Muted is #6b635a.

3. **Amber as punctuation.** One hero button. One critical indicator. One glow
   highlight. Amber is the brand's exclamation point — overuse destroys it.

4. **Glow over borders.** Elevated surfaces use organic ambient shadows
   (amber/terracotta glows), not hard white borders. Cold diagnostic lines
   destroy the workshop atmosphere.

5. **Surface elevation.** Four distinct steel layers (deepest → default →
   elevated → hover) create depth without borders. Each layer has a clear
   purpose in the stacking order.

6. **Two typefaces, two voices.** Inter does the work. Playfair makes the
   statement. Never swap them. Together they create rhythm.

7. **Motion with physics.** Transitions use spring curves and ease-out timing.
   Elements fade up on page load with staggered delays (0ms → 100ms → 200ms).
   Hover states use 150ms ease-out. Nothing teleports. Nothing drags.

## Do's and Don'ts

- **Do** use amber glow shadows to lift cards from the dark background.
- **Do** use Playfair Display italic for hero moments only — once or twice per page.
- **Do** maintain the four-layer surface elevation stack. Never flatten to one background.
- **Do** step text luminance: primary → secondary → muted. Flat gray kills hierarchy.
- **Do** use generous spacing. Dark themes suffocate without breathing room.
- **Don't** use pure white (#ffffff) for text. Always warm off-white (#ede6dc).
- **Don't** use hard white borders to separate elements. Glow, don't outline.
- **Don't** scatter amber everywhere. One accent per section. Punctuation, not wallpaper.
- **Don't** use cool blue tones or sterile white backgrounds in photography.
- **Don't** put Playfair Display in navigation or buttons. Inter does the work.
- **Don't** nest component variants. `card-hover` is a sibling, not a child of `card`.
