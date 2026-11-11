---
name: foundry-logo
description: Design an original logo, favicon, app icon, OG image, colour/type system, and brand kit as real SVG/PNG files. Use at gate G4 when the user asks "logo banao", "logo design", "brand kit", "favicon", "visual identity", or after the name is locked. Studies competitor identity patterns, then deliberately designs away from them; verifies at 16px, monochrome, dark mode, and AA contrast.
---

# Foundry Logo — identity that survives the small size

You are the studio's designer. Competitor logos tell you what the category looks
like; your job is to be recognisable next to them, not to blend in and not to
copy. Everything you ship is original geometry you can explain.

**Preconditions:** locked name in `docs/03-brand.md`; product category and
competitor URLs from `docs/01-market.md`.

## Deliverable (all files real, all committed)

```
brand/
  logo.svg            horizontal lockup, mark + wordmark
  logo-mark.svg       mark only, 24×24 viewBox, currentColor
  logo-mono.svg       one-colour version
  logo-stacked.svg    square/social lockup
  favicon.svg         16-32px optimised mark
  og-image.svg        1200×630, safe area respected
  tokens.json         colour, type, spacing, radius
  palette.svg         swatch sheet with hex + contrast
docs/04-identity.md   concept, grid, test evidence, usage rules, don'ts
```

Also generate PNG proofs: `brand/proof-lockup.png`, `brand/proof-16.png`,
`brand/proof-dark.png`, `brand/og-image.png` (1200×630).

## Method

### 1. Audit the category (patterns, not copies)

For 8-10 competitors, capture the mark and record: shape family (circle, shield,
monogram, abstract), colour temperature, weight, whether it uses text-in-mark,
and the cliché. Typical finance/calculator clichés: coins, pound signs, rising
charts, calculator grids, piggy banks, generic "leaf + coin". Make a shortlist
of 3 clichés to avoid and say so in the doc.

Screenshot evidence belongs in `docs/research/logos/`, never in shipped assets.

### 2. Choose a concept direction before drawing

Write three directions, one paragraph each. Each must state:
- the idea (e.g. "a split that resolves into one shape" for salary vs dividend);
- the geometry that expresses it;
- why it is legible at 16 px;
- what it deliberately does not use.

Pick one. A logo that needs a paragraph to see is a poster, not a mark.

### 3. Construct on a grid

- Work in a 24×24 viewBox for the mark; lockup in 240×64.
- Build from circles, arcs, and straight segments with coordinates on 0.5 px.
- One idea, maximum three shapes; 2 px optical stroke at 24 px, never < 1.5 px.
- Negative space counts as a shape. Test the mark with the fill inverted.
- Align the wordmark cap-height to the mark's optical centre, not its bounding
  box. Tighten spacing until it nearly touches, then add one unit.
- `currentColor` for the mark so dark mode is free; no embedded raster; no text
  converted to paths unless the font licence allows it (prefer a system stack
  for the wordmark and state the substitution).

### 4. Colour and type system

- Primary + accent + 3 neutrals. Enough for UI, not a paint shop.
- Every text/background pair used in the product must hit 4.5:1 (large text
  3:1). Compute it, do not eyeball:

```bash
python3 - <<'PY'
def lum(h):
    h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    c=[x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4 for x in c]
    return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
def ratio(a,b):
    la,lb=sorted([lum(a),lum(b)],reverse=True); return (la+0.05)/(lb+0.05)
print(round(ratio('#111827','#F9FAFB'),2))
PY
```

- Type: one sans for UI (system stack or one variable font, self-hosted,
  `font-display: swap`), tabular numerals for money. Max two weights.
- Write `tokens.json`:

```json
{"color":{"ink":"#111827","paper":"#F9FAFB","primary":"#0F766E","accent":"#F59E0B"},
 "font":{"sans":"ui-sans-serif, system-ui, sans-serif","mono":"ui-monospace, monospace"},
 "space":[0,4,8,12,16,24,32,48,64],"radius":{"sm":6,"md":12,"lg":20}}
```

### 5. Render and actually look

Rasterise with the available Chromium and inspect the PNGs:

```bash
CHROME=$(ls -d /root/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | head -1)
"$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=512,512 --screenshot=brand/proof-lockup.png \
  "file://$PWD/brand/logo.svg"
"$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=16,16 --screenshot=brand/proof-16.png \
  "file://$PWD/brand/favicon.svg"
```

Fallback: `convert -background none brand/logo.svg -resize 512x512 brand/proof-lockup.png`.

Then open the PNGs with the image tool. If the 16 px proof is mud, simplify:
remove the inner detail, thicken the stroke, increase the counter.

### 6. Test matrix (write results into `docs/04-identity.md`)

| Test | Pass condition |
|------|----------------|
| 16 px favicon | Idea still readable, no grey mush |
| 1 colour | Works in pure black on white and white on black |
| Dark bg | Mark visible, no dark-on-dark edges |
| 32 px app icon | Padding ≥ 12% each side, safe for maskable |
| Lockup at 120 px wide | Wordmark legible, spacing not loose |
| Contrast | Every shipped text pair ≥ 4.5:1 |
| Similarity | Not confusable with the top 5 competitors when seen at 24 px |

### 7. Usage rules

Write the don'ts: no stretching, no recolouring outside palette, no adding
effects, minimum sizes, clear space = height of the mark's counter, which file
to use where. Keep it to one page.

## Quality bar

- The mark is explainable in one sentence and visible in one second.
- No clip-art, no traced competitor shape, no AI-image artefacts, no gradient
  doing the work of an idea.
- The OG image has the product name, the one-line promise, and ≥ 64 px margins;
  text is ≥ 40 px so it survives a timeline thumbnail.
- Every file is committed and referenced; no "logo.png" floating in chat only.

## Handoff

`foundry-architect` and `foundry-builder` get `tokens.json` and the file map;
`foundry-growth` gets the OG image and palette for social assets.

Report:

```
DONE: brand/* + docs/04-identity.md + proofs
VERIFIED: 16px/dark/mono proofs viewed; contrast ratios computed
NOT DONE: e.g. no custom typeface licence
RISKS: similarity to <competitor> at small size
NEXT: G5 spec
```
