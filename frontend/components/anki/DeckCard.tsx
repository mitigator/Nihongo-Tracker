"use client";

import { AnkiDeck } from "@/types/anki";

interface DeckCardProps {
  deck: AnkiDeck;
  onReview: (deck: AnkiDeck) => void;
  onManage: (deck: AnkiDeck) => void;
  onEdit: (deck: AnkiDeck) => void;
}

export default function DeckCard({ deck, onReview, onManage, onEdit }: DeckCardProps) {
  const reviewed = deck.todayProgress?.reviewedCount ?? 0;
  const target = deck.dailyReviewTarget ?? 1;

  const pct = reviewed / target;
  const clampedPct = Math.min(pct, 1);
  const isDone = reviewed >= target;

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  return (
    <div
      className="rounded-2xl border transition-all flex flex-col gap-4 bg-[var(--color-card)] border-[var(--color-border)] hover:border-[var(--color-primary)]"
      style={{ padding: "1.25rem 1.5rem", borderLeft: `3px solid ${deck.color}` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <p
            className="font-black tracking-widest text-sm truncate font-[var(--font-orbitron)] text-[var(--color-text)]"
          >
            {deck.name}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {deck.jlptLevel && (
              <span
                className="text-[0.6rem] font-black uppercase tracking-widest rounded-md px-2 py-0.5 font-[var(--font-orbitron)]"
                style={{ background: deck.color + "22", color: deck.color }}
              >
                {deck.jlptLevel}
              </span>
            )}
            <span className="text-xs font-medium text-[var(--color-muted)] font-[var(--font-rajdhani)]">
              {deck.cardCount} cards
            </span>
            {deck.dueCount > 0 && !isDone && (
              <span
                className="text-[0.6rem] font-black uppercase tracking-widest rounded-md px-2 py-0.5 font-[var(--font-orbitron)]"
                style={{ background: "#ef444422", color: "#ef4444" }}
              >
                {deck.dueCount} due
              </span>
            )}
            {isDone && (
              <span
                className="text-[0.6rem] font-black uppercase tracking-widest rounded-md px-2 py-0.5 font-[var(--font-orbitron)]"
                style={{ background: "#10b98122", color: "#10b981" }}
              >
                ✓ Done
              </span>
            )}
          </div>
        </div>

        {/* Progress ring */}
        <div className="relative shrink-0 w-12 h-12">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="4"
            />
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke={isDone ? "#10b981" : deck.color}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - clampedPct)}
              strokeLinecap="round"
              transform="rotate(-90 24 24)"
              style={{ transition: "stroke-dashoffset 0.4s ease" }}
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center font-black text-[0.6rem] font-[var(--font-orbitron)] text-[var(--color-text)]"
          >
            {reviewed}/{target}
          </span>
        </div>
      </div>

      {deck.description && (
        <p className="text-xs text-[var(--color-muted)] font-[var(--font-rajdhani)] line-clamp-1 -mt-2">
          {deck.description}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onReview(deck)}
          disabled={deck.dueCount === 0}
          className="flex-1 font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] text-[0.65rem] py-2 font-[var(--font-orbitron)] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "var(--color-primary)", color: "#000" }}
        >
          Review
        </button>
        <button
          onClick={() => onManage(deck)}
          className="font-bold uppercase tracking-widest rounded-xl transition-all text-[0.65rem] px-3 py-2 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          Cards
        </button>
        <button
          onClick={() => onEdit(deck)}
          className="font-bold uppercase tracking-widest rounded-xl transition-all text-[0.65rem] px-3 py-2 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
