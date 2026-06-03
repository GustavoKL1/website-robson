# Layout Reference

> Auto-extracted from live DOM. Use this to understand how the site is structured spatially.

## Spacing System

**Base grid:** 5px

**Scale:** `5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100` px

| Spacing | Semantic Use |
|---------|-------------|
| 5px | Tight — within a component |
| 10px | Medium — between sibling items |
| 20px | Wide — between sections |
| 40px | Vast — major section breaks |

## Flex Layouts

| Element | Direction | Justify | Align | Gap | Children |
|---------|-----------|---------|-------|-----|----------|
| `div.container` | row | space-between | center | — | 2 |
| `div.container.showUp` | column | center | center | — | 2 |
| `nav.active` | row | — | center | 15px | 5 |
| `div.col-12.col-lg-5` | column | center | — | — | 1 |

## Grid Layouts

| Element | Template Columns | Gap | Children |
|---------|-----------------|-----|----------|
| `div.row` | `95.8281px 95.8281px 95.8281px 95.8281px 95.8281px ` | 20px | 2 |
| `div.row` | `95.8281px 95.8281px 95.8281px 95.8281px 95.8281px ` | 20px | 3 |
| `div.row` | `95.8281px 95.8281px 95.8281px 95.8281px 95.8281px ` | 20px | 2 |
| `div.row` | `94.8281px 94.8281px 94.8281px 106.734px 94.8438px ` | 20px | 5 |
| `div.row.parallaxVertical` | `47.5625px 47.5625px 47.5625px 47.5625px 47.5625px ` | 20px | 4 |

## Structural Containers

### `<header>` (`header#jsHeader`)

```
display:          block
children:         2
```

### `<footer>` 

```
display:          block
padding:          100px 0px 0px
children:         2
```

### `<section>` (`section.sectionBanner.active`)

```
display:          block
padding:          100px 0px
children:         2
```

### `<section>` (`section.sectionSobre`)

```
display:          block
padding:          70px 0px
children:         1
```

### `<section>` (`section.sectionProjetos`)

```
display:          block
padding:          100px 0px
children:         1
```

### `<section>` (`section.sectionGuia`)

```
display:          block
padding:          50px 0px
children:         1
```

### `<section>` (`section.sectionVendidos`)

```
display:          block
padding:          100px 0px
children:         1
```

### `<section>` (`section.sectionCta`)

```
display:          block
padding:          200px 0px
children:         2
```

### `<nav>` (`nav.active`)

```
display:          flex
flex-direction:   row
justify-content:  —
align-items:      center
gap:              15px
children:         5
```

## Layout Rules

- **Container max-width:** `1400px` — always center with `margin: auto`
- Primary layout system: **Flexbox**
- Secondary layout system: **CSS Grid** (used for card grids and multi-column layouts)
- Every spacing value must be a multiple of **5px**
- Never use arbitrary margin/padding values outside the spacing scale

