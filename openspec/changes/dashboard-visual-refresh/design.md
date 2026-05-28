# Design: Dashboard visual refresh

## Technical Approach

Refresh `@theme` with warmer dark surfaces and muted semantics. Export chart stroke colors from CSS custom properties. Reorder `Dashboard.jsx` and add variant surfaces to `MetricCard` and `BalanceHero`.

## Architecture Decisions

### Decision: CSS tokens as single source of truth

**Choice**: Define colors in `index.css`; `chartColors.js` reads `getComputedStyle` fallbacks for Recharts.

**Rationale**: Tailwind utilities already map to tokens; charts need explicit hex at runtime.

### Decision: Balance-first layout

**Choice**: Hero → metrics → savings → health/alerts/insights → charts → form.

**Rationale**: Users want balance at a glance; intelligence widgets are secondary.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/index.css` | Modify | Palette + card shadow utility |
| `src/theme/chartColors.js` | Create | Income/expense/chart palette |
| `src/pages/Dashboard.jsx` | Modify | Section order |
| `src/components/dashboard/*` | Modify | Visual polish |
| `src/components/intelligence/ExpenseTrendChart.jsx` | Modify | Theme strokes |
| `src/components/ui/Card.jsx` | Modify | Subtle elevation |

## Testing Strategy

Manual: open `inicio`, verify order and colors. Run `npm run build`.
