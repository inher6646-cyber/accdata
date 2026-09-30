# Design Brief

## Direction

**Buku Kas Teal** — a calm, ledger-inspired business console for Indonesian online sellers: dense data, quiet surfaces, one confident teal accent.

## Tone

Refined utilitarian — a well-made paper ledger translated to screen; restrained decoration, maximum legibility, nothing shouting.

## Differentiation

Money speaks through color discipline: every Rupiah is tabular-aligned, green for in, red for out, and the only saturated ink on the page is the teal primary — the interface reads like a clean account book, not a dashboard toy.

## Color Palette

| Token      | OKLCH        | Role                                    |
| ---------- | ------------ | --------------------------------------- |
| background | 0.985 0.004 95  | Warm paper canvas, light mode        |
| foreground | 0.22 0.02 260   | Ink text, high contrast              |
| card       | 1.0 0.002 95    | Raised surfaces, tables, forms       |
| primary    | 0.4 0.09 195    | Deep teal — CTAs, active nav, focus  |
| accent     | 0.72 0.14 78    | Warm amber — highlights, warnings    |
| muted      | 0.955 0.008 220 | Section alternation, table headers   |
| success    | 0.5 0.13 158    | Money in / profit / positive values  |
| destructive| 0.5 0.18 25     | Money out / expense / delete         |

## Typography

- Display: Plus Jakarta Sans — headings, card titles, nav labels, buttons
- Body: Plus Jakarta Sans — tables, forms, paragraphs (single family, weight-driven hierarchy)
- Mono: Geist Mono — Rupiah figures in tables and summary cards (tabular-nums)
- Scale: hero `text-3xl md:text-4xl font-bold tracking-tight`, section `text-xl font-semibold tracking-tight`, label `text-xs font-semibold uppercase tracking-wider text-muted-foreground`, body `text-sm md:text-base`

## Elevation & Depth

Flat by default with a single soft shadow tier (`shadow-subtle` for cards, `shadow-elevated` for popovers/dialogs); depth comes from surface tint steps (background → muted/40 → card), never from heavy shadows.

## Structural Zones

| Zone    | Background        | Border        | Notes                                          |
| ------- | ----------------- | ------------- | ---------------------------------------------- |
| Header  | bg-card           | border-b      | Sticky top bar, app name + primary action       |
| Sidebar | bg-sidebar        | border-r      | Desktop only; active item = teal tint + bar     |
| Content | bg-background     | —             | Sections alternate bg-muted/30 for rhythm       |
| MobileNav | bg-card         | border-t      | Fixed bottom bar, 5 modules, safe-area padding  |

## Spacing & Rhythm

Page gutter `px-4 md:px-6 lg:px-8`, section gap `space-y-6 md:space-y-8`, card padding `p-4 md:p-6`, table cell `px-3 py-2.5`, micro-gaps `gap-2`/`gap-3`; density is compact on mobile, comfortable on desktop.

## Component Patterns

- Buttons: `rounded-md`, teal primary (subtle gradient), outline for secondary, ghost for table row actions; hover = 4% darken + `transition-fast`
- Cards: `rounded-lg` (0.5rem), `bg-card`, 1px `border-border`, `shadow-subtle`; summary cards carry a colored left rule (teal / green / red / amber)
- Badges: pill shape, soft tinted background (`bg-success-soft`, `bg-destructive-soft`, `bg-warning-soft`) with matching dark text; used for stock status and transaction type
- Tables: zebra-free, `bg-muted/40` sticky header, `border-b border-border` rows, right-aligned mono figures

## Motion

- Entrance: gentle `fade-in-up` (0.3s ease-out) staggered 40ms across summary cards only
- Hover: background/border shift with `transition-fast` (0.15s); no scale transforms
- Decorative: none — motion is functional feedback only

## Constraints

- No raw hex/rgb in components; semantic tokens only
- Rupiah always formatted `Rp` + thousands separator, tabular figures, right-aligned in tables
- Minimum 4.5:1 body contrast; touch targets ≥44px on mobile
- No CSV/Excel export UI, no product-edit UI (per doNotBuild)
- Single-user, no login/account surfaces

## Signature Detail

The **ledger rule**: a 3px colored left edge on every summary card and table section — teal for neutral totals, green for money in, red for money out — turning the page into a scannable account book.
