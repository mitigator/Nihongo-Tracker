// ── Anki ─────────────────────────────────────────────────────

export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";
export type CardType = "vocab" | "kanji" | "custom";
export type SRSRating = "again" | "hard" | "good" | "easy";
export type CardState = "new" | "learning" | "review" | "overdue";

export const JLPT_LEVELS: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];
export const CARD_TYPES: CardType[] = ["vocab", "kanji", "custom"];
export const DECK_COLORS = [
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
] as const;
export type DeckColor = (typeof DECK_COLORS)[number];

// ── Deck ─────────────────────────────────────────────────────

export interface AnkiDeckTodayProgress {
  reviewedCount: number;
  newCardsStudied: number;
  againCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
}

export interface AnkiDeck {
  _id: string;
  name: string;
  description: string;
  jlptLevel: JLPTLevel | null;
  color: DeckColor;
  dailyReviewTarget: number;
  newCardsPerDay: number;
  cardCount: number;
  dueCount: number;
  todayProgress: AnkiDeckTodayProgress;
  createdAt: string;
  updatedAt: string;
}

export interface AnkiDeckFormData {
  name: string;
  description?: string;
  jlptLevel?: JLPTLevel | null;
  color?: DeckColor;
  dailyReviewTarget?: number;
  newCardsPerDay?: number;
}

export interface DecksResponse {
  count: number;
  decks: AnkiDeck[];
}

// ── Card ─────────────────────────────────────────────────────

export interface AnkiCard {
  _id: string;
  user: string;
  deck: string;
  front: string;
  back: string;
  type: CardType;
  jlptLevel: JLPTLevel | null;
  manuallyAssigned: boolean;
  sourceEntry: string | null;
  interval: number;
  easeFactor: number;
  dueDate: string;
  repetitions: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnkiCardFormData {
  front: string;
  back: string;
  type: CardType;
  jlptLevel?: JLPTLevel | null;
  deckId?: string;
}

export interface CardsResponse {
  count: number;
  cards: AnkiCard[];
}

// ── Review ───────────────────────────────────────────────────

export interface DeckReviewResponse {
  deckId: string;
  dueCount: number;
  reviewedToday: number;
  dailyReviewTarget: number;
  cards: AnkiCard[];
}

export interface ReviewRatingResult {
  cardId: string;
  rating: SRSRating;
  nextReviewLabel: string;
  dueDate: string;
  interval: number;
}

// ── Analytics ────────────────────────────────────────────────

export interface AnkiDayStats {
  date: string;
  reviewed: number;
  newCards: number;
  retentionRate: number | null;
}

export interface AnkiRetentionDay {
  date: string;
  retentionRate: number | null;
}

export interface AnkiDeckHealth {
  name: string;
  color: string;
  new: number;
  learning: number;
  review: number;
  overdue: number;
}

export interface AnkiPerDeckProgress {
  deckId: string;
  deckName: string;
  color: string;
  reviewedToday: number;
  dailyReviewTarget: number;
}

export interface AnkiAnalyticsResponse {
  last7Days: AnkiDayStats[];
  last30Days: AnkiRetentionDay[];
  deckHealth: AnkiDeckHealth[];
  perDeckProgress: AnkiPerDeckProgress[];
}
