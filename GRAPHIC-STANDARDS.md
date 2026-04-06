# Inline SVG Graphic Standards

Visual standards for inline SVG graphics used in blog articles on olberding.me. These ensure consistency and readability across all graphics while allowing flexibility for different chart types.

---

## Typography

All text uses two font families. No exceptions.

| Role | Font | Weight | Example |
|------|------|--------|---------|
| **Titles, section headers, big numbers** | `Literata, Georgia, serif` | 600 | Chart titles, column headers, callout stats |
| **Labels, body text, annotations** | `Outfit, sans-serif` | 400–600 | Axis labels, descriptors, subtitles |

### Font Size Scale

Sizes are in SVG coordinate units. Actual rendered size depends on the viewBox-to-container ratio. Target a container width of ~680px when checking readability.

| Element | Size | Notes |
|---------|------|-------|
| **Graphic title** | 19–20 | Literata, weight 600, `letter-spacing: -0.01em` |
| **Subtitle / kicker** | 11–12 | Outfit, uppercase, `letter-spacing: 0.06em`, fill `#999` |
| **Section headers** | 17–18 | Literata, weight 600 |
| **Primary labels** | 15–16 | Outfit, weight 500–600. Row/column headers, entity names |
| **Body / description text** | 13–14 | Outfit. Main readable text within the graphic |
| **Secondary labels / annotations** | 11–12 | Outfit. Callout annotations, axis descriptors |
| **Tertiary / source text** | 10 | Outfit. Footnotes, caveats, source attributions |
| **Big callout numbers** | 36–40 | Literata, weight 600. Used for key statistics |

**Minimum font size: 10.** Nothing in the graphic should be smaller than 10 SVG units. At a typical viewBox-to-container ratio, 10 units renders at ~8–9px on screen, which is the floor for readability.

---

## Color

### Text fills

| Use | Value |
|-----|-------|
| Primary text (titles, headers) | `#1a1a1a` |
| Body text | `#555` or `#888` |
| Secondary / muted text | `#999` or `#aaa` |
| Tertiary / source text | `#bbb` or `#ccc` |
| Accent emphasis | `var(--color-accent-text)` or `#2a6e5a` |
| Warning / contrast accent | `#cc6644` |

### Shape fills

Use low-opacity fills for background shapes. This keeps the graphic light and ensures text remains readable over shapes.

| Use | Opacity |
|-----|---------|
| Primary background shapes | `0.04–0.06` |
| Secondary / overlay shapes | `0.02–0.04` |
| Accent background shapes | `0.15–0.20` |

Fill colors: `#1a1a1a` for neutral, `#2a6e5a` or `var(--color-accent)` for accent, `#cc6644` for contrast/warning.

### Lines and dividers

| Use | Stroke | Width |
|-----|--------|-------|
| Major dividers | `#e8e5e0` | 0.5–1 |
| Leader / annotation lines | Accent color | 0.8, `stroke-dasharray="2,2"` |

---

## Layout

### ViewBox sizing

Choose the viewBox to give the content room to breathe. The SVG will scale to fit its container (typically ~680px on desktop).

| Guideline | Value |
|-----------|-------|
| Typical width | 760–880 |
| Minimum width | 680 |
| Height | Determined by content; aim for a 1.5:1 to 2.5:1 width-to-height ratio |

**Important:** Widening the viewBox makes all text appear smaller at the same font-size value, because the coordinate system maps to the same container width. If you increase viewBox width, increase font sizes proportionally.

### Spacing pattern

```
Title block:       y = 24–30
Subtitle:          y = title + 20–24
Content start:     y = subtitle + 20–30
                   (leave breathing room between header and content)
Footer/caption:    y = viewBox height - 12–20
```

### Margins

- Left content margin: `x = 25–30`
- Keep at least 15px clear of viewBox edges for all text
- Right-aligned (text-anchor="end") annotations must account for text width — verify the longest string doesn't start before `x = 5`

### Annotation positioning

When using side annotations with leader lines:
- **Right-side annotations** (left-aligned text pointing left to shape): straightforward, text grows rightward into available space
- **Left-side annotations** (right-aligned text pointing right to shape): verify text width doesn't exceed available margin. At font-size 13, an 18-character label needs ~130px of space left of its anchor point
- Leader lines should be at least 15px long to be visible. If the shape edge is too close to the text, consider angling the line or using proximity alone
- Short leader lines (8–15px) are acceptable when proximity makes the connection obvious

---

## Structure

### Title block

Every graphic starts with a title block:

```svg
<text x="30" y="28" font-family="Literata, Georgia, serif" font-size="20"
      fill="#1a1a1a" font-weight="600" letter-spacing="-0.01em">
  Title Text Here
</text>
<text x="30" y="50" font-family="Outfit, sans-serif" font-size="12"
      fill="#999" letter-spacing="0.06em">
  UPPERCASE SUBTITLE OR KICKER
</text>
```

### Wrapper

All graphics wrap in a `<figure>` with a descriptive class name:

```html
<figure class="descriptive-name">
<svg viewBox="0 0 W H" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="Accessible description of what the graphic shows.">
  ...
</svg>
</figure>
```

### Accessibility

- Always include `role="img"` and a descriptive `aria-label` on the SVG
- The aria-label should describe the graphic's meaning, not its visual appearance
- Source attributions (if any) go in a `<p class="chart-sources">` below the SVG, not inside it

---

## Card Image Rendering

When a graphic is used as a homepage card image:

1. **Render at 2x** (`deviceScaleFactor: 2`) for Retina displays
2. **Screenshot the SVG element directly** using Playwright, not the full page
3. **Crop the title block** from the top (~10–15% of height) since the card already shows the article title
4. **Trim minimal bottom margin** (~2%)
5. **Do not crop sides** — annotations at edges should remain visible
6. Save to `src/assets/blog/` and reference in frontmatter as `cardImage`

Card images are displayed with `object-fit: cover`, `object-position: top`, and a `max-height: 280px` constraint (180px on mobile). Design the graphic so the most visually distinctive content is in the upper-middle portion.

---

## Citations and Footnotes

All blog posts use a consistent citation pattern for references and footnotes.

### Inline reference

```html
<sup class="cite-ref" data-ref="1" id="ref-1-back"><a href="#ref-1">1</a></sup>
```

- Place immediately after the relevant text (no space before `<sup>`)
- `data-ref` matches the footnote number
- `id` uses pattern `ref-N-back` for the return link
- If the same reference appears twice, use `ref-N-back-2` etc.

### Reference list

```html
## References

<ol class="references">
  <li id="ref-1">Citation text here. <a href="#ref-1-back" class="cite-back" aria-label="Back to reference 1">↩</a></li>
  <li id="ref-2">Citation text here. <a href="#ref-2-back" class="cite-back" aria-label="Back to reference 2">↩</a></li>
</ol>
```

- Always use `## References` heading
- Always use `<ol class="references">` (not markdown lists)
- Each `<li>` has `id="ref-N"` matching the inline `href`
- Return link uses `class="cite-back"` with `aria-label`
- For cross-references to other posts on the site, use relative URLs: `/blog/slug-name`

### Key Points / Summary Box

```html
<div class="key-points">

## Key Points

- **Bold lead sentence.** Supporting text.
- **Another point.** More detail.

</div>
```

- Wrap in `<div class="key-points">`
- Use `## Key Points` heading inside the div
- Each bullet starts with a bold lead phrase followed by a period, then supporting text

---

## Checklist

Before finalizing a graphic:

- [ ] No font-size below 10
- [ ] Title uses Literata 19–20, subtitle uses Outfit 11–12 uppercase
- [ ] All text within viewBox bounds (check right-aligned text especially)
- [ ] Shapes use low opacity (0.02–0.06) for fills
- [ ] Leader lines use dashed stroke at 0.8 width
- [ ] `role="img"` and `aria-label` present on SVG element
- [ ] Wrapped in `<figure>` with descriptive class name
- [ ] Renders readably at ~680px container width
- [ ] Card image (if applicable) rendered at 2x with title cropped
- [ ] Citations use `cite-ref` / `references` / `cite-back` pattern
- [ ] Key points wrapped in `<div class="key-points">`
