# Interaction Reference

> Micro-interactions extracted from live DOM. Recreate these exactly for authentic feel.

## Coverage

| Component Type | Count | States Captured |
|----------------|-------|----------------|
| Button | 2 | default, hover, focus |
| Link | 3 | default, hover, focus |

## Transition System

These transition declarations were extracted from interactive elements:

```css
transition: 0.5s;
transition: all;
transition: 0.3s;
```

Apply these to all interactive elements. Never invent new durations or easings.

## Button Interactions

### Button 1 — `submit`

**States:**

- Default: `../screens/states/button-1-default.png`
- Hover: `../screens/states/button-1-hover.png`
- Focus: `../screens/states/button-1-focus.png`

**Transition:** `0.5s`

_No visible style changes detected for this element._

### Button 2 — `OK`

**States:**

- Default: `../screens/states/button-2-default.png`
- Hover: `../screens/states/button-2-hover.png`
- Focus: `../screens/states/button-2-focus.png`

**On focus:**

```css
/* outline: rgb(51, 51, 51) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(51, 51, 51) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `all`

## Link Interactions

### Link 1 — `a`

**States:**

- Default: `../screens/states/link-1-default.png`
- Hover: `../screens/states/link-1-hover.png`
- Focus: `../screens/states/link-1-focus.png`

**Transition:** `0.3s`

_No visible style changes detected for this element._

### Link 2 — `Inicial`

**States:**

- Default: `../screens/states/link-2-default.png`
- Hover: `../screens/states/link-2-hover.png`
- Focus: `../screens/states/link-2-focus.png`

**On hover:**

```css
/* color: rgb(64, 64, 64) → */ color: rgb(5, 163, 252);
/* border-color: rgb(64, 64, 64) → */ border-color: rgb(5, 163, 252);
/* outline: rgb(64, 64, 64) none 3px → */ outline: rgb(5, 163, 252) none 3px;
/* outline-color: rgb(64, 64, 64) → */ outline-color: rgb(5, 163, 252);
```

**Transition:** `0.3s`

### Link 3 — `Vendas`

**States:**

- Default: `../screens/states/link-3-default.png`
- Hover: `../screens/states/link-3-hover.png`
- Focus: `../screens/states/link-3-focus.png`

**On hover:**

```css
/* color: rgb(64, 64, 64) → */ color: rgb(5, 163, 252);
/* border-color: rgb(64, 64, 64) → */ border-color: rgb(5, 163, 252);
/* outline: rgb(64, 64, 64) none 3px → */ outline: rgb(5, 163, 252) none 3px;
/* outline-color: rgb(64, 64, 64) → */ outline-color: rgb(5, 163, 252);
```

**Transition:** `0.3s`

## Interaction Rules

- Accent color `#0000ee` is used for focus rings, active states, and hover highlights
- Hover effects include **color transitions** — use the extracted values, not approximations
- Focus states use **outline** (not box-shadow) — always match the extracted focus ring
- Transition durations in use: `0.5s`, `0.3s`
- Always respect `prefers-reduced-motion` — set all transitions to `0s` when enabled

