# Component Reference

> Repeated DOM patterns detected by structural analysis. Each component appeared 3+ times.

## Detected Components

| Component | Category | Instances | Key Classes |
|-----------|----------|-----------|-------------|
| **Active** | list-item | 7× | `.active` |
| **Container** | unknown | 5× | `.container` |
| **Btn** | button | 4× | `.btn`, `.btnPrimary` |
| **Col 6** | unknown | 4× | `.col-6` |
| **CardGuia** | card | 3× | `.cardGuia` |
| **NomeGuia** | unknown | 3× | `.nomeGuia` |
| **Title** | unknown | 3× | `.title`, `.txtGuia` |
| **TextoLink** | unknown | 3× | `.textoLink` |
| **ChevronGroup** | unknown | 3× | `.chevronGroup` |
| **FooterTitle** | unknown | 3× | `.footerTitle` |
| **FooterList** | unknown | 3× | `.footerList` |

## Cards

### CardGuia

**Instances found:** 3

**CSS classes:** `.cardGuia`

**HTML structure:**

```html
<a href="perguntas-frequentes" title="Ver detalhes de FAQ" class="cardGuia"> <div class="txtBox"> <p class="nomeGuia"><img src="https://www.interago.com.br/App/Sites/386/mc/Icones/icon-faq.svg" alt="ícone FAQ" loading="lazy">FAQ</p> <p class="txtGuia title">Tem alguma dúvida?</p> </div> <p class="textoLink">Acesse nosso FAQ</p> <div class="chevronGroup"> <img src="https://www.interago.com.br/App/Sites/386/mc/Icones/chevron-right.svg" alt="ícone seta direita" loading="lazy"> </div> </a>
```

**Base styles (from design tokens):**

```css
.cardGuia {
  background: #000000;
  border: 1px solid #5d5d5d;
  border-radius: 10px;
  padding: 10px;
}```

## List Items

### Active

**Instances found:** 7

**CSS classes:** `.active`

**HTML structure:**

```html
<li class="active"><a href="index" title="Ir para página inicial">Inicial</a></li>
```

**Base styles (from design tokens):**

```css
.active {
  padding: 5px 0;
  border-bottom: 1px solid #5d5d5d;
}```

## Buttons

### Btn

**Instances found:** 4

**CSS classes:** `.btn` `.btnPrimary`

**HTML structure:**

```html
<a href="vendas/index" class="btn btnPrimary">Ir para venda</a>
```

**Base styles (from design tokens):**

```css
.btn {
  background: #0000ee;
  color: #ffffff;
  border-radius: 10px;
  padding: 5px 10px;
  cursor: pointer;
}```

## Other Components

### Container

**Instances found:** 5

**CSS classes:** `.container`

**HTML structure:**

```html
<div class="container"> <div class="navBar"> <div class="logo active"> <a href="index" title="Ir para a Página Inicial" rel="nofollow"> <img src="https://cdn.interago.com.br/img/png/w_0_q_8/386/mc/Logo e favicon//logo-chilante" width="307" height="83" alt="Logotipo da Chilante"> </a> </div> <nav class="active"> <!-- <div class="toggleSearch toggleSearchMobile"> <img src="https://www.interago.com.br/App/Sites/386/mc/Icones/icon-lupa.svg" alt="ícone de lupa" width="20" height="20"> </div> --> <input class="menuBtn" type="checkbox" id="menuBtn"> <label onclick="overlayLeft()" class="menuIcon" for
```

**Base styles (from design tokens):**

```css
.container {
  background: #000000;
  padding: 5px;
}```

### Col 6

**Instances found:** 4

**CSS classes:** `.col-6`

**HTML structure:**

```html
<div class="col-6"> <img src="https://cdn.interago.com.br/img/jpeg/w_0_q_8/386/mc/Páginas/01. Inicial/containerAmarelo01" data-fancybox="vendidosGallery" data-src="" alt="Imagem de container" loading="lazy"> </div>
```

**Base styles (from design tokens):**

```css
.col-6 {
  background: #000000;
  padding: 5px;
}```

### NomeGuia

**Instances found:** 3

**CSS classes:** `.nomeGuia`

**HTML structure:**

```html
<p class="nomeGuia"><img src="https://www.interago.com.br/App/Sites/386/mc/Icones/icon-faq.svg" alt="ícone FAQ" loading="lazy">FAQ</p>
```

**Base styles (from design tokens):**

```css
.nomeGuia {
  background: #000000;
  padding: 5px;
}```

### Title

**Instances found:** 3

**CSS classes:** `.title` `.txtGuia`

**HTML structure:**

```html
<p class="txtGuia title">Tem alguma dúvida?</p>
```

**Base styles (from design tokens):**

```css
.title {
  background: #000000;
  padding: 5px;
}```

### TextoLink

**Instances found:** 3

**CSS classes:** `.textoLink`

**HTML structure:**

```html
<p class="textoLink">Acesse nosso FAQ</p>
```

**Base styles (from design tokens):**

```css
.textoLink {
  background: #000000;
  padding: 5px;
}```

### ChevronGroup

**Instances found:** 3

**CSS classes:** `.chevronGroup`

**HTML structure:**

```html
<div class="chevronGroup"> <img src="https://www.interago.com.br/App/Sites/386/mc/Icones/chevron-right.svg" alt="ícone seta direita" loading="lazy"> </div>
```

**Base styles (from design tokens):**

```css
.chevronGroup {
  background: #000000;
  padding: 5px;
}```

### FooterTitle

**Instances found:** 3

**CSS classes:** `.footerTitle`

**HTML structure:**

```html
<div class="footerTitle"> <h2>WEBSITE</h2> </div>
```

**Base styles (from design tokens):**

```css
.footerTitle {
  background: #000000;
  padding: 5px;
}```

### FooterList

**Instances found:** 3

**CSS classes:** `.footerList`

**HTML structure:**

```html
<ul class="footerList"> <li><a href="index" rel="nofollow" title="Ir para página inicial">Inicial</a></li> <li><a href="vendas/index" rel="nofollow" title="Ver Vendas da Chilante">Vendas</a></li> <li><a href="modificacoes" rel="nofollow" title="Ver Modificações da Chilante">Modificações</a></li> <li><a href="vendidos" rel="nofollow" title="Ver containers vendidos da Chilante">Vendidos</a></li> <li><a href="sobre-nos" rel="nofollow" title="Ver mais sobre a Chilante">Sobre nós</a></li> <li><a href="perguntas-frequentes" rel="nofollow" title="Ver FAQ da Chilante">FAQ</a></li> </ul>
```

**Base styles (from design tokens):**

```css
.footerList {
  background: #000000;
  padding: 5px;
}```

## Component Rules

- Match class names exactly from the patterns above
- Each component instance must be visually identical to others of its type
- Do not add extra wrappers or change the DOM structure
- Use `#5d5d5d` for all dividers within components
- Use `#0000ee` for all interactive/active states

