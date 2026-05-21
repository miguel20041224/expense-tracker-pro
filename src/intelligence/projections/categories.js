/**
 * Proyección de categorías con mayor crecimiento MoM.
 */
export function projectCategoryGrowth(categoryGrowth, limit = 3) {
  if (!categoryGrowth?.length) return []

  return categoryGrowth
    .filter((c) => c.previous > 0 && c.growthPercent > 0)
    .sort((a, b) => b.growthPercent - a.growthPercent)
    .slice(0, limit)
    .map((c) => ({
      name: c.name,
      current: c.current,
      previous: c.previous,
      growthPercent: c.growthPercent,
      projectedNextMonth: c.current * (1 + c.growthPercent / 100),
    }))
}
