---
name: check-semantics
description: >-
  Audits HTML and React/JSX components for semantic correctness — proper use of HTML5
  elements, heading hierarchy, landmark regions, list structure, and ARIA misuse.
  Use when asked to check semantic HTML, heading structure, landmark regions,
  or when auditing accessibility of markup. References WCAG 1.3.1 and 4.1.2.
---

## What This Skill Does

Checks whether markup uses the correct HTML5 elements for their intended meaning,
rather than relying on generic `<div>` and `<span>` elements styled to look like
something else. Poor semantics break screen readers, keyboard navigation,
and assistive technologies.

Primary WCAG criteria: **1.3.1 Info and Relationships**, **4.1.2 Name, Role, Value**

---

## Audit Areas

### 1. Document Structure & Landmarks

Every page must have exactly one `<main>` and a clear landmark structure.
Screen reader users navigate by landmarks — missing them forces linear reading.

Required landmarks:
```
<header>     → site header / banner         (maps to role="banner")
<nav>        → navigation                   (maps to role="navigation")
<main>       → primary content              (maps to role="main")
<footer>     → site footer                  (maps to role="contentinfo")
<aside>      → supplementary content        (maps to role="complementary")
<section>    → thematic grouping (needs accessible name via aria-labelledby)
<article>    → self-contained content
```

Common failures:
```tsx
// ❌ No landmarks — entire page in divs
<div className="header">...</div>
<div className="content">...</div>
<div className="footer">...</div>

// ✅ Semantic landmarks
<header>...</header>
<main>...</main>
<footer>...</footer>

// ❌ Multiple <main> elements
<main>...</main>
<main>...</main>  {/* invalid */}

// ❌ <section> without accessible name (becomes generic region)
<section>...</section>

// ✅ Named section
<section aria-labelledby="filters-heading">
  <h2 id="filters-heading">Filter Products</h2>
</section>
```

---

### 2. Heading Hierarchy

Headings (`h1`–`h6`) communicate document outline to screen readers.
Skipping levels or using headings for visual styling breaks navigation.

Rules:
- Exactly **one `<h1>`** per page — the main page title
- No skipped levels (e.g. `h1` → `h3` without `h2`)
- Headings must describe the content that follows — not used purely for font size
- Do not use headings inside interactive components (buttons, links) unless intentional

Common failures:
```tsx
// ❌ Multiple h1s
<h1>ShopNext</h1>
...
<h1>Product Listing</h1>  {/* should be h2 */}

// ❌ Skipped heading level
<h1>Shop</h1>
<h3>Featured Products</h3>  {/* skips h2 */}

// ❌ Heading used for visual styling only
<h4 className="text-sm text-gray-500">Sort by</h4>  {/* use <label> or <p> instead */}

// ✅ Correct hierarchy
<h1>ShopNext</h1>
  <h2>Product Listing</h2>
    <h3>Filters</h3>
    <h3>Sort Options</h3>
  <h2>Featured Products</h2>
```

---

### 3. Interactive Elements

Anything clickable, focusable, or actionable must be a native interactive element.
Generic elements (`div`, `span`) are invisible to keyboard and screen readers by default.

```tsx
// ❌ Div used as button
<div onClick={handleAdd} className="cursor-pointer px-4 py-2 bg-blue-600 text-white">
  Add to cart
</div>

// ✅ Native button
<button type="button" onClick={handleAdd}>
  Add to cart
</button>

// ❌ Div used as link
<div onClick={() => router.push('/product/slug')}>View product</div>

// ✅ Native link
<Link href="/product/slug">View product</Link>

// ❌ Span used as checkbox
<span onClick={toggleChecked} className={checked ? 'checked' : ''} />

// ✅ Native checkbox
<input type="checkbox" checked={checked} onChange={toggleChecked} id="agree" />
<label htmlFor="agree">I agree</label>
```

If a `div` or `span` absolutely must be interactive (e.g. complex drag-and-drop),
it requires: `role`, `tabIndex={0}`, keyboard handlers (`onKeyDown` for Enter/Space),
and an accessible name. This is always more work than using native elements.

---

### 4. Lists

Use list elements when content is genuinely a list of related items.
Navigation menus, product grids described as collections, breadcrumbs, and tag groups
should be `<ul>` / `<ol>`.

```tsx
// ❌ Navigation without list semantics
<nav>
  <a href="/">Home</a>
  <a href="/products">Products</a>
  <a href="/cart">Cart</a>
</nav>

// ✅ Navigation with list (screen reader announces "list, 3 items")
<nav aria-label="Main navigation">
  <ul>
    <li><Link href="/">Home</Link></li>
    <li><Link href="/products">Products</Link></li>
    <li><Link href="/cart">Cart</Link></li>
  </ul>
</nav>

// ❌ Breadcrumb without semantics
<div>Home > Products > Shirts</div>

// ✅ Semantic breadcrumb
<nav aria-label="Breadcrumb">
  <ol>
    <li><Link href="/">Home</Link></li>
    <li><Link href="/products">Products</Link></li>
    <li aria-current="page">Shirts</li>
  </ol>
</nav>
```

---

### 5. Forms

Every form control must have a programmatically associated label.
Placeholder text is not a label — it disappears on input and has low contrast.

```tsx
// ❌ No label
<input type="email" placeholder="Enter your email" />

// ❌ Label not associated (for/id mismatch)
<label>Email</label>
<input type="email" />

// ✅ Explicit label
<label htmlFor="email">Email address</label>
<input type="email" id="email" placeholder="you@example.com" />

// ✅ Visually hidden label (when design has no visible label)
<label htmlFor="search" className="sr-only">Search products</label>
<input type="search" id="search" placeholder="Search..." />

// ❌ Button without accessible name inside a form
<button type="submit"><SearchIcon /></button>

// ✅
<button type="submit" aria-label="Search products">
  <SearchIcon aria-hidden="true" />
</button>

// ✅ Fieldset for grouped controls (radio, checkbox groups)
<fieldset>
  <legend>Sort by</legend>
  <label><input type="radio" name="sort" value="price" /> Price</label>
  <label><input type="radio" name="sort" value="newest" /> Newest</label>
</fieldset>
```

---

### 6. Images

```tsx
// ❌ Missing alt
<img src={product.imageUrl} />

// ❌ Filename as alt
<img src={product.imageUrl} alt="product-image-001.jpg" />

// ❌ Redundant alt ("image of", "photo of" is implicit)
<img src={product.imageUrl} alt="Image of white linen shirt" />

// ✅ Descriptive alt
<img src={product.imageUrl} alt="White linen shirt, front view" />

// ✅ Decorative image (no information conveyed)
<img src={decorativeDivider} alt="" aria-hidden="true" />

// ✅ Icon next to text (icon is decorative when text explains it)
<button>
  <CartIcon aria-hidden="true" />
  Add to cart
</button>

// ✅ Standalone icon button (icon IS the label)
<button aria-label="Add to cart">
  <CartIcon aria-hidden="true" />
</button>
```

---

### 7. Tables

Data tables must have headers that describe each column or row.
Do not use tables for layout.

```tsx
// ❌ Table without headers
<table>
  <tr><td>Name</td><td>Price</td><td>Stock</td></tr>
  <tr><td>White Shirt</td><td>149,99 zł</td><td>12</td></tr>
</table>

// ✅ Semantic data table
<table>
  <caption>Product inventory</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Price</th>
      <th scope="col">Stock</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>White Shirt</td>
      <td>149,99 zł</td>
      <td>12</td>
    </tr>
  </tbody>
</table>
```

---

### 8. ARIA Misuse

ARIA adds semantics when HTML alone is insufficient — but incorrect ARIA
is worse than no ARIA. Screen readers will announce whatever role/state you set.

Rules:
- **No ARIA role that duplicates native element semantics**
- **No `aria-label` on non-interactive, non-landmark elements** (e.g. plain `<div>`)
- **`aria-hidden="true"` must never be on a focusable element**
- **`role="button"` on a `<div>` still requires `tabIndex={0}` and keyboard handlers**

```tsx
// ❌ Redundant role
<button role="button">Submit</button>
<nav role="navigation">...</nav>
<ul role="list">...</ul>

// ❌ aria-hidden on focusable element (keyboard trap)
<button aria-hidden="true">Close</button>

// ❌ aria-label on non-interactive div
<div aria-label="product card">...</div>  {/* use article or section instead */}

// ✅ ARIA used correctly — custom disclosure widget
<button
  aria-expanded={isOpen}
  aria-controls="filter-panel"
  onClick={toggle}
>
  Filters
</button>
<div id="filter-panel" hidden={!isOpen}>
  ...
</div>
```

---

## Procedure

When asked to audit a component or file for semantic HTML:

1. **Read the file** — scan for `div`, `span`, `onClick` patterns
2. **Check each area** from the list above in order
3. **Report findings** grouped by severity:

```
## Semantics Audit: ProductCard.tsx

### 🔴 Critical (breaks screen reader / keyboard access)
- [4.1.2] Clickable div used instead of <button> for "Add to cart" action
  → Line 34: <div onClick={handleAdd}>
  Fix: Replace with <button type="button" onClick={handleAdd}>

### 🟠 Serious (degrades experience significantly)
- [1.3.1] Product image missing alt text
  → Line 12: <img src={imageUrl} />
  Fix: <img src={imageUrl} alt={product.name} />

### 🟡 Moderate (reduces clarity for AT users)
- [1.3.1] Discount badge uses <span> with no semantic meaning
  → Line 28: <span className="badge">SALE</span>
  Fix: Consider <mark> or add aria-label="On sale" to the card

### 🟢 Minor (best practice)
- [1.3.1] Icon inside button lacks aria-hidden
  → Line 36: <CartIcon />
  Fix: <CartIcon aria-hidden="true" />
```

4. **Apply fixes** if asked — do not change visual appearance or business logic
5. Add comment `{/* semantics: [wcag criterion] */}` above each changed element

---

## Quick Reference — Element Chooser

| Use case | Wrong | Right |
|---|---|---|
| Clickable action | `<div onClick>` | `<button type="button">` |
| Navigation link | `<div onClick={router.push}>` | `<Link href="">` |
| Page regions | `<div class="header">` | `<header>`, `<main>`, `<footer>` |
| Grouped form controls | `<div>` | `<fieldset>` + `<legend>` |
| Form label | `placeholder` only | `<label htmlFor="">` |
| Ordered steps | `<div>` | `<ol>` + `<li>` |
| Unordered items | `<div>` | `<ul>` + `<li>` |
| Data grid | `<div>` grid | `<table>` + `<th scope>` |
| Decorative image | `<img>` no alt | `<img alt="" aria-hidden="true">` |
| Visually hidden text | `display:none` | `className="sr-only"` |

---

## Example Prompts That Trigger This Skill

- "Check the semantic HTML in ProductCard.tsx"
- "Is the heading hierarchy correct on the homepage?"
- "Use /check-semantics on the admin product table"
- "Does this component use correct landmark regions?"
- "Find all divs being used as buttons"