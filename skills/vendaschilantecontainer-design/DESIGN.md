# vendaschilantecontainer DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 2 · Components: 7
> Icon library: not detected · State: not detected
> Primary theme: dark · Dark mode toggle: no · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![vendaschilantecontainer Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **dark-themed** interface with a cool tone. Depth is expressed through layered shadows and subtle surface color variation. Typography pairs **Poppins** for display/headings with **Track** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **5px base grid** (standard density), with scale: 5, 10, 15, 20, 25, 30, 35, 40px. The palette is predominantly monochromatic with **#0000ee** as the single accent color — used sparingly for interactive elements and emphasis. Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| background | `#18181b` | background | Page background, darkest surface |
| surface | `#000000` | surface | Card and panel backgrounds |
| text-primary | `#ffffff` | text-primary | Headings and body text |
| text-muted | `#404040` | text-muted | Captions, placeholders, secondary info |
| border | `#5d5d5d` | border | Dividers, card borders, outlines |
| accent | `#0000ee` | accent | CTAs, links, focus rings, active states |
| success | `#27c919` | success | Success states, positive indicators |
| primary | `#05a3fc` | info | Informational highlights |
| unknown | `#0e0e0e` | unknown | Palette color |
| unknown | `#f3f3f3` | unknown | Palette color |
| unknown | `#e5e3df` | unknown | Palette color |
| unknown | `#cccccc` | unknown | Palette color |
| secondary | `#61c9f5` | unknown | Palette color |
| unknown | `#333333` | unknown | Palette color |
| unknown | `#22d5e9` | unknown | Palette color |
| unknown | `#ababab` | unknown | Palette color |
| unknown | `#d9d9d9` | unknown | Palette color |
| unknown | `#c1c1c1` | unknown | Palette color |
| unknown | `#00c2ff` | unknown | Palette color |
| unknown | `#374151` | unknown | Palette color |

### CSS Variable Tokens

```css
--primary: #05A3FC;
--secondary: #61C9F5;
--primary: #05A3FC;
--secondary: #61C9F5;
--primary: #05A3FC;
--secondary: #61C9F5;
--primary: #05A3FC;
--secondary: #61C9F5;
--primary: #05A3FC;
--secondary: #61C9F5;
```


---

## 3. Typography Rules

**Font Stack:**
- **Track** — Heading 1, Heading 2, Heading 3
- **Poppins** — Body, Caption

**Font Sources:**

```css
@font-face {
  font-family: "Poppins";
  src: url("https://fonts.gstatic.com/s/poppins/v24/pxiEyp8kv8JHgFVrFJA.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Poppins";
  src: url("https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLCz7V1s.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Track";
  src: url("https://www.interago.com.br/App/Sites/386/mc/Fontes/Track/Track.woff2") format("woff2");
  font-weight: 400;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Track | 64px | 700 |
| Heading 2 | Track | 50px | 700 |
| Heading 3 | Track | 40px | 700 |
| Body | Poppins | 16px | 400 |
| Caption | Poppins | 20px | 400 |

**Typographic Rules:**
- Limit to 2 font families max per screen
- Use **Track** for body/UI text, **Poppins** for display/headings
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

### Layout (1)

**Footer** — `html`

### Navigation (1)

**Navigation** — `html`

### Data Input (2)

**Button** — `html`
- Animation: 

**Input** — `html`
- State: :focus, :placeholder

### Media (3)

**Image** — `html`

**Icon** — `html`

**Map/Canvas** — `html`



---

## 5. Layout Principles

- **Base spacing unit:** 5px
- **Spacing scale:** 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70
- **Border radius:** 0px 0px 0px 30px, 2px, 4px, 5px, 8px, 10px, 10px 10px 0px 0px, 16px, 19px, 50px 0px 8px
- **Max content width:** 992px

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 2.5-5px | Tight: related items within a group |
| 10px | Medium: between groups |
| 15-20px | Wide: between sections |
| 30px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Flat — subtle depth hints

- `0 0 0 1px #fff,0 0 0 2px var(--fancybox-accent-color,rgba(1,210,232,0.94))`
- `rgb(160, 160, 160) 0px 2px 2px 0px`

### Raised — cards, buttons, interactive elements

- `var(--carousel-button-shadow,none)`
- `inset 0 0 4px rgba(0,0,0,.2)`
- `rgb(132, 129, 129) 0px 2px 4px 0px`

### Overlay — full-screen overlays, top-level dialogs

- `10px 10px 25px rgb(0 0 0/10%)`
- `0px 0px 24px rgb(0 0 0/10%)`
- `0px 4px 32px 0px rgba(0,91,130,0.16)`

### Z-Index Scale

`0, 1, 2, 10, 20, 30, 40, 998, 999, 1000, 1050, 1053`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes fancybox-rotate`
- `@keyframes fancybox-dash`
- `@keyframes fancybox-fadeIn`
- `@keyframes fancybox-fadeOut`
- `@keyframes fancybox-zoomInUp`
- `@keyframes fancybox-zoomOutDown`
- `@keyframes fancybox-throwOutUp`
- `@keyframes fancybox-throwOutDown`

### Animated Components

- **Button**: 

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#0000ee` for interactive elements (buttons, links, focus rings)
- Use `#18181b` as the primary page background
- Pair **Track** (body) with **Poppins** (display) — these are the only allowed fonts
- Follow the **5px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 0px 0px 0px 30px, 2px, 4px, 5px, 8px
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond Track and Poppins
- Don't use arbitrary spacing values — stick to multiples of 5px
- Don't create custom box-shadow values outside the system tokens
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No blur or backdrop-blur effects
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

| Name | Value | Source |
|---|---|---|
| sm | 576px | css |
| sm | 640px | css |
| md | 768px | css |
| lg | 992px | css |
| lg | 1024px | css |
| xl | 1200px | css |
| xl | 1280px | css |
| 2xl | 1400px | css |
| 2xl | 1500px | css |
| 2xl | 1800px | css |
| 2xl | 1850px | css |
| 2xl | 2000px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #000000
Border: 1px solid #5d5d5d
Radius: 10px
Padding: 20px
Font: Track
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #0000ee, text white
Ghost: bg transparent, border #5d5d5d
Padding: 10px 20px
Radius: 10px
Hover: opacity 0.9 or lighter shade
Focus: ring with #0000ee
```

### Build a Page Layout

```
Background: #18181b
Max-width: 992px, centered
Grid: 5px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #000000
Label: #404040 (muted, 12px, uppercase)
Value: #ffffff (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #18181b
Input border: 1px solid #5d5d5d
Focus: border-color #0000ee
Label: #404040 12px
Spacing: 20px between fields
Radius: 10px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Track, type scale from Section 3
4. Spacing: 5px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```
