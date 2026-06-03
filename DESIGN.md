---
name: Chilante Container
description: Industrial-grade container sales landing page
colors:
  page-bg: "#18181b"
  surface: "#000000"
  text-primary: "#ffffff"
  text-muted: "#404040"
  accent: "#0000ee"
  border: "#5d5d5d"
  success: "#27c919"
typography:
  display:
    fontFamily: "Track, sans-serif"
    fontWeight: 700
  body:
    fontFamily: "Poppins, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Poppins, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.05em"
    textTransform: "uppercase"
rounded:
  md: "10px"
  sm: "5px"
  full: "9999px"
spacing:
  xs: "5px"
  sm: "10px"
  md: "15px"
  lg: "20px"
  xl: "30px"
  xxl: "40px"
  section: "100px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    typography: "{typography.label}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    border: "1px solid {colors.border}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "20px"
    border: "1px solid {colors.border}"
  input:
    backgroundColor: "{colors.page-bg}"
    rounded: "{rounded.md}"
    padding: "10px 15px"
    border: "1px solid {colors.border}"
    textColor: "{colors.text-primary}"
  badge:
    backgroundColor: "{colors.page-bg}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.full}"
    padding: "5px 10px"
    typography: "{typography.label}"
  nav-link:
    textColor: "{colors.text-muted}"
    rounded: "{rounded.md}"
    padding: "10px 15px"
  nav-link-active:
    textColor: "{colors.accent}"
  nav-link-hover:
    textColor: "{colors.text-primary}"
---

# Design System: Chilante Container

## 1. Overview

**Creative North Star: "The Industrial Workshop"**

A dark, robust, mechanical interface that communicates strength and reliability through honest materials and deliberate restraint. The palette is predominantly monochromatic — deep charcoal (`#18181b`) and true black (`#000000`) — with a single blue accent (`#0000ee`) used sparingly for interactive elements. This is not a polished corporate site; it is a factory floor rendered in pixels.

Typography pairs **Track** (a custom industrial sans-serif) for display and heading use with **Poppins** for body text, creating hierarchy through type contrast rather than excess scale. Spacing follows a strict 5px grid. Cards have visible borders and black surfaces; there is no airy negative space. Motion is expressive but utilitarian — spring-based reveals, staggered entrances, and scroll-driven transitions that feel mechanical, not decorative.

**Key Characteristics:**
- Dark theme throughout; no light mode
- Monochromatic with a single high-saturation blue accent
- Industrial, utilitarian sans-serif typography
- Visible borders and defined surface separation
- Expressive but purposeful motion
- No glass, no blur, no gradient text, no decorative shadows

## 2. Colors

A cool, predominantly monochromatic palette with a single high-intensity accent.

### Primary
- **Accent Blue** (`#0000ee`): The only saturated color on the page. Used exclusively for CTAs, links, focus rings, and active navigation states. Its rarity is the point — it signals interactivity by contrast with the surrounding dark field.

### Neutral
- **Page Background** (`#18181b`): Deep charcoal. The base canvas for all content. Dark enough to feel industrial, not black enough to feel digital.
- **Surface** (`#000000`): True black for cards, panels, modals, footer, and the navigation bar. Creates clear visual separation from the page background.
- **Text Primary** (`#ffffff`): Pure white. Headings, body text, and primary labels.
- **Text Muted** (`#404040`): Mid-gray. Captions, placeholder text, secondary info, inactive nav links, footnotes.
- **Border** (`#5d5d5d`): Medium gray. All card borders, dividers, section separators, and input outlines.

### Status
- **Success** (`#27c919`): Price displays, positive indicators, star ratings. Vibrant green that stands out against the dark background.

### Named Rules
**The One Voice Rule.** The blue accent is used on ≤10% of any given screen. Its rarity communicates importance. A blue element that is not interactive is a design failure.

## 3. Typography

**Display Font:** Track (custom, no fallback — loaded as WOFF2)
**Body Font:** Poppins (fallback: sans-serif)

**Character:** An industrial sans-serif paired with a clean geometric sans. Track carries the weight of authority — used for brand name, headings, and emphasized display text. Poppins handles body copy, captions, and UI labels with clarity and readability.

### Hierarchy
- **Display** (Track 700, 64px, 1.2): Hero headline only. Appears once per page. Massive and commanding.
- **Headline** (Track 700, 50px, 1.2): Section headings. 3–4 per page maximum.
- **Subheading** (Track 700, 20px–24px, 1.2): Card titles, feature names.
- **Body** (Poppins 400, 14px–16px, 1.5): All paragraph text. Must not fall below 14px.
- **Label** (Poppins 700, 10px–12px, uppercase, 0.05em letter-spacing): Section eyebrows, badges, button labels, form labels. Reserved for short text only.

### Named Rules
**The Two-Family Rule.** Track and Poppins are the only fonts permitted. No third family enters the system.

## 4. Elevation

The system uses **tonal layering** rather than shadows to convey depth. Surfaces are distinguished by their color value (page background `#18181b` vs. surface `#000000`), not by drop shadows. Cards sit flush against the page with a visible border — they do not float.

Shadows are used sparingly and only for functional purposes:
- **Interactive feedback** — buttons use `rgb(132, 129, 129) 0px 2px 4px 0px` on state change
- **Modal overlay** — `10px 10px 25px rgb(0 0 0/10%)` for top-level dialogs
- **Floating elements** — the WhatsApp FAB uses `rgb(132, 129, 129) 0px 2px 4px 0px` at rest

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, elevation, focus) or for floating/overlay elements.

## 5. Components

### Buttons
- **Shape:** Medium-rounded corners (10px radius)
- **Primary:** Blue fill (`#0000ee`) with white text, uppercase label. Hover reduces opacity to 0.9. Transition: 0.15s opacity.
- **Ghost:** Transparent background with a medium-gray stroke (`#5d5d5d`), white text. No hover effect other than stroke staying stable.
- **CTA on dark sections:** Same as primary but always blue fill.

### Cards
- **Corner Style:** Medium-rounded (10px radius)
- **Background:** True black (`#000000`)
- **Border:** 1px solid `#5d5d5d`
- **Shadow Strategy:** None at rest. Cards are distinguished from the page by color, not elevation.
- **Internal Padding:** 20px (4× grid unit)

### Inputs / Fields
- **Style:** Dark fill (`#18181b`) with a medium-gray stroke (`#5d5d5d`), white text
- **Focus:** Border shifts to accent blue (`#0000ee`). No glow, no shadow.
- **Radius:** 10px
- **Padding:** 10px 15px
- **Select variant:** Same treatment with a custom dropdown arrow.

### Navigation
- **Container:** True black (`#000000`), pinned to top, bottom border in `#5d5d5d`
- **Links:** Muted gray text (`#404040`) with 10px 15px padding, 10px radius
- **Hover:** Text shifts to white
- **Active:** Text shifts to accent blue (`#0000ee`)
- **CTA button:** Same as primary button specification
- **Mobile:** Stacks vertically in a slide-down drawer

### FAQ Accordion
- **Container:** Black surface (`#000000`) with border (`#5d5d5d`), 10px radius
- **Question:** White text, bold, with a chevron toggle
- **Answer:** Muted text (`#404040`), no additional styling
- **Open state:** Chevron rotates 180°

### Badge / Tag
- **Style:** Dark fill (`#18181b`) with muted text (`#404040`), uppercase
- **Radius:** 5px
- **Padding:** 5px 10px

### Modal / Dialog
- **Surface:** True black (`#000000`) with border (`#5d5d5d`), 10px radius
- **Backdrop:** `rgba(0, 0, 0, 0.6)` — dark overlay, no blur
- **Header:** Dark section (`#18181b`) with bottom border
- **Max width:** 480px, centered

## 6. Do's and Don'ts

### Do:
- **Do** use `#0000ee` for interactive elements only — buttons, links, focus rings, active nav items
- **Do** use `#18181b` as the primary page background and `#000000` for all card/panel surfaces
- **Do** keep the accent rare — ≤10% of any given screen
- **Do** use Track for headings and display text; Poppins for body and labels
- **Do** follow the 5px spacing grid for all margins, padding, and gaps
- **Do** use borders (`#5d5d5d`) to separate sections and components
- **Do** use tonal layering (surface color) over shadows for depth
- **Do** respect `prefers-reduced-motion` — disable all animations
- **Do** provide visible focus indicators (accent blue ring)

### Don't:
- **Don't** introduce colors outside the palette — no additional blues, no warm tones, no gradients
- **Don't** use the blue accent decoratively — it signals interactivity or nothing
- **Don't** use backdrop-blur, blur effects, or glassmorphism
- **Don't** use drop shadows on cards at rest — cards are flat
- **Don't** introduce additional font families beyond Track and Poppins
- **Don't** use arbitrary spacing — stick to 5px multiples
- **Don't** make generic SaaS template designs — no stock photos, no "modern startup" layouts
- **Don't** use gradient text, border-left accent stripes, or numbered section markers
- **Don't** disable reduced-motion support — it is not optional
- **Don't** ship uppercase body copy — reserve uppercase for labels only
