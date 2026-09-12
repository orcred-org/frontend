/**
 * Founding cohort — the single source of truth for slot counts.
 *
 * `claimed` is the only value to change. Every slot count on the site derives
 * from it, so what a visitor sees is always the real number. Nothing here
 * ticks, decays, or invents urgency: the scarcity is real, and that is the
 * point — a company whose product is "we hold a standard" cannot fake a count.
 *
 * `total` stays at 15. If it fills faster than expected, close it and take
 * names for the paid round. Raising it teaches people our numbers move.
 */
export const COHORT = {
  total: 15,
  claimed: 9,
} as const;

export const slotsTaken = Math.min(COHORT.total, Math.max(0, COHORT.claimed));
export const slotsLeft = COHORT.total - slotsTaken;
export const cohortOpen = slotsLeft > 0;

/** Nearly gone — the site leans a little harder on the count from here. */
export const cohortNearlyFull = cohortOpen && slotsLeft <= 5;

/** Proportion filled, 0–1. Drives the meter. */
export const cohortFilled = slotsTaken / COHORT.total;
