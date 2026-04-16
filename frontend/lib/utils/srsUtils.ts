/**
 * SRS Utilities — pure functions, no DB calls.
 *
 * Implements a modified SM-2 algorithm (the same core algorithm Anki uses).
 *
 * References:
 *   https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method
 *
 * Card lifecycle:
 *   New → Learning (interval < 1 day) → Review (interval ≥ 1 day)
 *
 * Rating scale:
 *   again  → complete blackout, reset card to learning
 *   hard   → correct but very difficult
 *   good   → correct with some hesitation
 *   easy   → correct with no hesitation
 */

import { SRSRating } from "../models/AnkiCard";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Minimum ease factor — cards never get easier to forget than this. */
const MIN_EASE_FACTOR = 1.3;

/** Maximum ease factor cap to avoid unrealistically long intervals. */
const MAX_EASE_FACTOR = 5.0;

/** Default starting ease factor for new cards (same as Anki). */
export const DEFAULT_EASE_FACTOR = 2.5;

/**
 * How much the ease factor changes per rating.
 * Mirrors Anki's default ease delta values.
 */
const EASE_DELTA: Record<SRSRating, number> = {
  again: -0.2,
  hard: -0.15,
  good: 0,
  easy: 0.15,
};

/**
 * Interval multiplier applied on top of the ease factor for "easy" reviews.
 * Gives an extra boost to cards the user finds trivial.
 */
const EASY_BONUS = 1.3;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SRSCard {
  interval: number;      // days until next review (0 = still in learning)
  easeFactor: number;    // current ease factor
  repetitions: number;   // successful reviews in a row
  dueDate: Date;
}

export interface SRSResult {
  interval: number;
  easeFactor: number;
  repetitions: number;
  dueDate: Date;
  /** Human-readable label shown under each rating button in the UI. */
  nextReviewLabel: string;
}

// ─── Core Algorithm ───────────────────────────────────────────────────────────

/**
 * Apply an SM-2 review to a card and return the updated SRS fields.
 *
 * @param card    Current SRS state of the card.
 * @param rating  User's self-assessment of the review.
 * @param now     Reference point for scheduling (defaults to current time).
 */
export function applyRating(
  card: SRSCard,
  rating: SRSRating,
  now: Date = new Date()
): SRSResult {
  let { interval, easeFactor, repetitions } = card;

  if (rating === "again") {
    // Total failure — send back to the start of the learning queue.
    repetitions = 0;
    interval = 0;
    easeFactor = clampEase(easeFactor + EASE_DELTA.again);
  } else if (repetitions === 0) {
    // First successful review — short learning step.
    repetitions = 1;
    interval = rating === "easy" ? 4 : 1;
    easeFactor = clampEase(easeFactor + EASE_DELTA[rating]);
  } else if (repetitions === 1) {
    // Second successful review — graduate to multi-day interval.
    repetitions = 2;
    interval = rating === "easy" ? 6 : 3; // days
    easeFactor = clampEase(easeFactor + EASE_DELTA[rating]);
  } else {
    // Mature card — apply standard SM-2 interval growth.
    repetitions++;
    const multiplier =
      rating === "easy"
        ? easeFactor * EASY_BONUS
        : rating === "hard"
        ? Math.max(easeFactor * 0.8, 1.2) // hard cards grow slower
        : easeFactor;

    interval = Math.round(interval * multiplier);
    easeFactor = clampEase(easeFactor + EASE_DELTA[rating]);
  }

  // Ensure interval is never negative (safety guard).
  interval = Math.max(0, interval);

  const dueDate = addDays(now, interval);
  const nextReviewLabel = formatInterval(interval);

  return { interval, easeFactor, repetitions, dueDate, nextReviewLabel };
}

// ─── Preview helpers (used by ReviewControls UI) ──────────────────────────────

/**
 * Returns what the next review interval label *would* be for each rating,
 * without mutating anything. Used to show labels under the rating buttons.
 *
 * @example
 *   previewRatings(card)
 *   // → { again: "10 min", hard: "2 days", good: "5 days", easy: "12 days" }
 */
export function previewRatings(
  card: SRSCard
): Record<SRSRating, string> {
  const ratings: SRSRating[] = ["again", "hard", "good", "easy"];
  const result = {} as Record<SRSRating, string>;
  for (const rating of ratings) {
    result[rating] = applyRating(card, rating).nextReviewLabel;
  }
  return result;
}

// ─── Due-card helpers ─────────────────────────────────────────────────────────

/**
 * Returns true if a card is due for review right now.
 */
export function isDue(card: SRSCard, now: Date = new Date()): boolean {
  return card.dueDate <= now;
}

/**
 * Given an array of cards, returns only those due today (or overdue).
 * The result is sorted: overdue first, then by dueDate ascending.
 */
export function filterDueCards<T extends SRSCard>(
  cards: T[],
  now: Date = new Date()
): T[] {
  return cards
    .filter((c) => isDue(c, now))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

/**
 * Splits cards into new (never reviewed) and review (previously seen) buckets.
 * Useful for enforcing the deck's newCardsPerDay cap.
 */
export function splitNewAndReview<T extends SRSCard>(cards: T[]): {
  newCards: T[];
  reviewCards: T[];
} {
  const newCards = cards.filter((c) => c.repetitions === 0);
  const reviewCards = cards.filter((c) => c.repetitions > 0);
  return { newCards, reviewCards };
}

// ─── Retention rate ───────────────────────────────────────────────────────────

export interface RatingCounts {
  againCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
}

/**
 * Calculates retention rate as a percentage (0–100).
 * Retention = (good + easy) / total reviews × 100.
 * Returns null when there are no reviews yet.
 */
export function calcRetentionRate(counts: RatingCounts): number | null {
  const total =
    counts.againCount +
    counts.hardCount +
    counts.goodCount +
    counts.easyCount;
  if (total === 0) return null;
  return Math.round(((counts.goodCount + counts.easyCount) / total) * 100);
}

// ─── Card state label ─────────────────────────────────────────────────────────

export type CardState = "new" | "learning" | "review" | "overdue";

/**
 * Returns a human-readable state for a card, used in deck health analytics.
 *
 *   new      — never reviewed
 *   learning — interval < 1 day (still in learning steps)
 *   review   — mature card, due in the future
 *   overdue  — due date has passed and not yet reviewed
 */
export function getCardState(card: SRSCard, now: Date = new Date()): CardState {
  if (card.repetitions === 0) return "new";
  if (card.interval < 1) return "learning";
  if (card.dueDate < now) return "overdue";
  return "review";
}

// ─── Private helpers ──────────────────────────────────────────────────────────

function clampEase(value: number): number {
  return Math.min(MAX_EASE_FACTOR, Math.max(MIN_EASE_FACTOR, value));
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  if (days === 0) {
    // Still in learning — due again in 10 minutes.
    result.setMinutes(result.getMinutes() + 10);
  } else {
    result.setDate(result.getDate() + days);
    // Normalise to midnight so due-card queries are date-based, not time-based.
    result.setHours(0, 0, 0, 0);
  }
  return result;
}

/**
 * Converts an interval (in days) to a short human-readable label.
 *
 * @example
 *   formatInterval(0)   // "10 min"
 *   formatInterval(1)   // "1 day"
 *   formatInterval(14)  // "2 wks"
 *   formatInterval(60)  // "2 mo"
 */
export function formatInterval(days: number): string {
  if (days === 0) return "10 min";
  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;
  if (days < 14) return "1 wk";
  if (days < 30) return `${Math.round(days / 7)} wks`;
  if (days < 60) return "1 mo";
  return `${Math.round(days / 30)} mo`;
}