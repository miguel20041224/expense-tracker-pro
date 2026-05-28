# Spec: dashboard-ui

## Requirements

### Requirement: Balance-first home layout

The system SHALL render the `inicio` tab with balance summary and metric cards before health score, alerts, insights, and charts.

#### Scenario: User opens home tab

- **GIVEN** the user is on tab `inicio`
- **WHEN** the page renders
- **THEN** `BalanceHero` appears before `FinancialHealthScore`
- **AND** metric cards appear before the charts section

### Requirement: Friendly semantic palette

The system SHALL use theme tokens for income (mint-teal), expense (soft coral), and savings (soft sky) defined in `src/index.css`.

#### Scenario: Metric card colors

- **GIVEN** a metric card with variant `income` or `expense`
- **WHEN** it displays a value
- **THEN** the value color uses `text-income` or `text-expense` from the theme

#### Scenario: Trend chart colors

- **GIVEN** expense trend data exists
- **WHEN** the line chart renders
- **THEN** income and expense series use colors from `chartColors` tied to theme tokens

### Requirement: Enhanced category visualization

Category breakdown bars SHALL use a fixed palette derived from theme semantic colors with minimum bar height for readability.

#### Scenario: Categories with data

- **GIVEN** at least one expense category
- **WHEN** the breakdown renders
- **THEN** each bar uses a distinct semantic color from the dashboard palette
