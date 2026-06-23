# Design system reference

> Current theme: **Degradado índigo**. Source of truth is `apps/web/src/app/globals.css`
> (`:root` CSS vars + Tailwind v4 `@theme inline`) and `layout.tsx` (font loading).
> This file documents it; the CSS is authoritative.

## Fonts (self-hosted via `next/font/google`, zero external requests)

- `font-serif` → **Fraunces** — headlines, scores, logo
- `font-sans` → **Plus Jakarta Sans** — UI, body

## Color utilities (registered via `@theme inline`)

| Utility | CSS var | Value | Use |
|---|---|---|---|
| `bg-background` / `text-foreground` | `--background` / `--foreground` | `#ffffff` / `#1a1a1a` | Page base |
| `text-muted` | `--muted` | `#6b7280` | Secondary text |
| `bg-border` / `border-border` | `--border` | `#e8eaed` | Dividers, card borders |
| `bg-accent` / `text-accent` | `--accent` | `#4338ca` | Primary CTA, active nav |
| `bg-accent-dark` | `--accent-dark` | `#1e1b4b` | Hover, pressed states |
| `bg-green-600` | `--g600` | `#1c6b3a` | UNMSM brand, admitted badge bg |
| `bg-green-500` | `--g500` | `#238a4a` | Admitted text on light |
| `bg-green-50` | `--g50` | `#eef7f1` | Admitted card background |
| `bg-amber-600` / `text-amber-600` | `--a600` | `#a86b1a` | Non-admitted score, warnings |
| `bg-amber-50` | `--a50` | `#faf4e8` | Non-admitted card background |

Full green scale: `--g900 … --g50`. Full amber scale: `--a600 … --a50`. See `globals.css`.

## Hero gradient (CSS-var only — gradients can't be Tailwind colors)

```css
background: var(--hero-bg); /* linear-gradient(145deg, #1e1b4b 0%, #0f766e 100%) */
```
For hero sections use an inline `style={{ background: "var(--hero-bg)" }}`.
Do **NOT** use `bg-[var(--hero-bg)]` — Tailwind compiles that to `background-color`,
which cannot hold a gradient, so the hero renders white (and white text vanishes).
Hero text vars: `--hero-sub`, `--hero-muted`, `--hero-sep`, `--hero-hi`, `--hero-na`.

## Border radius (overrides Tailwind defaults)

- `rounded-sm` → 8px — buttons, badges, small cards
- `rounded` → 12px — standard cards
- `rounded-lg` → 16px — large cards, modals

## Shadows (CSS-var only — use inline style or `shadow-[var(--shadow)]`)

- `--shadow` — `0 1px 3px rgba(0,0,0,.07), 0 4px 16px rgba(0,0,0,.06)`
- `--shadow-lg` — `0 8px 32px rgba(0,0,0,.12)`

## University accent colors (chips, timeline dots, card borders)

```
UNMSM:   #15803D (green)    UNI:     #B45309 (copper/amber)
UNFV:    #7C3AED (violet)   UNSAAC:  #0F766E (teal)
UNSA:    #0369A1 (blue, future)
```

## Emotional / color rules (NON-NEGOTIABLE — from PRODUCT.md §5)

- **NEVER red for admission results.** Amber/copper = "close, keep going", never failure.
- **Green** is reserved for genuine achievement (admitted, reachable programs).
- Informational text (stats, labels, data values) is always neutral black/gray —
  accent colors are for actions, badges, and emphasis only.
- The "no ingresó" experience must always end with a path forward.
- Share button present in BOTH admitted and non-admitted states.

## Design reference & prototypes

- `apps/web/design-reference/` (gitignored) — HTML prototypes from Claude Design.
  Read the relevant one before building or redesigning a screen.
  - `admitidos v2.html`, `admitidos-v3.html`, `admitidos-v3-proximos-examenes.html`,
    `Paletas y Tipografía.html`, `design-canvas.jsx`
</content>
