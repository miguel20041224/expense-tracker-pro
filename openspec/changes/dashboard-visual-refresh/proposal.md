# Proposal: Dashboard visual refresh

## Intent

Improve the home dashboard so users see their financial picture clearly, with a calmer palette that reduces eye strain and clearer visual hierarchy.

## Scope

### In Scope

- Softer semantic palette (income, expense, savings, surfaces)
- Balance-first layout on tab `inicio`
- Metric cards with variant tints and chart token reuse
- Chart/tooltip styling aligned with theme

### Out of Scope

- Light mode, auth UI, other tabs redesign
- New data or intelligence logic

## Capabilities

### New Capabilities

- `dashboard-ui`: Home dashboard layout, palette semantics, and chart color contract

### Modified Capabilities

- None

## Approach

Extend `@theme` tokens, add `chartColors.js`, reorder `Dashboard.jsx` sections, enhance dashboard components.

## Success Criteria

- [ ] Balance hero and metrics appear before secondary widgets
- [ ] Income/expense colors are softer and consistent across cards and charts
- [ ] Build passes (`npm run build`)

## Rollback Plan

Revert `openspec/changes/dashboard-visual-refresh` code changes and restore `src/index.css` tokens.
