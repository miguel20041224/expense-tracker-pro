# Exploration: Dashboard visual refresh

## Current State

- Theme tokens in `src/index.css`: dark surfaces, accent blue, income emerald, expense rose.
- Dashboard tab (`inicio`) order: health → alerts → insights → charts → balance hero → metrics → savings → form.
- Charts use hardcoded hex (`#34d399`, `#fb7185`) in Recharts, not theme tokens.
- Cards are flat `surface-card/80` with minimal hierarchy.

## Affected Areas

- `src/index.css` — palette tokens
- `src/pages/Dashboard.jsx` — section order
- `src/components/dashboard/*` — hero, metrics, category bars
- `src/components/intelligence/ExpenseTrendChart.jsx` — chart colors
- `src/components/ui/Card.jsx`, `IconBadge.jsx` — surfaces
- `src/theme/chartColors.js` (new) — shared chart semantics

## Recommendation

Centralize softer semantic colors in CSS, reorder dashboard for balance-first hierarchy, tint metric cards by variant, and wire charts to theme tokens.

## Risks

- Low: visual-only; PDF report CSS uses separate overrides.
