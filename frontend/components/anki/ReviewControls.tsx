"use client";

import { AnkiCard, SRSRating } from "@/types/anki";
import { previewRatings } from "@/lib/utils/srsUtils";

interface ReviewControlsProps {
  card: AnkiCard;
  onRate: (rating: SRSRating) => void;
  disabled?: boolean;
}

const BUTTONS: { rating: SRSRating; label: string; color: string }[] = [
  { rating: "again", label: "Again", color: "#ef4444" },
  { rating: "hard", label: "Hard", color: "#f59e0b" },
  { rating: "good", label: "Good", color: "var(--color-primary)" },
  { rating: "easy", label: "Easy", color: "#10b981" },
];

export default function ReviewControls({ card, onRate, disabled }: ReviewControlsProps) {
  const previews = previewRatings({
    interval: card.interval,
    easeFactor: card.easeFactor,
    repetitions: card.repetitions,
    dueDate: new Date(card.dueDate),
  });

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[0.6rem] font-black uppercase tracking-widest text-center text-[var(--color-muted)] font-[var(--font-orbitron)]">
        How did it go?
      </p>
      <div className="grid grid-cols-4 gap-2">
        {BUTTONS.map(({ rating, label, color }) => (
          <button
            key={rating}
            onClick={() => onRate(rating)}
            disabled={disabled}
            className="flex flex-col items-center gap-1 rounded-xl border transition-all active:scale-[0.96] disabled:opacity-40 disabled:cursor-not-allowed py-3 px-1"
            style={{
              background: "var(--color-bg)",
              borderColor: "var(--color-border)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = color;
              (e.currentTarget as HTMLButtonElement).style.color = color;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text)";
            }}
          >
            <span
              className="font-black text-xs uppercase tracking-widest font-[var(--font-orbitron)]"
              style={{ color }}
            >
              {label}
            </span>
            <span className="text-[0.6rem] font-medium font-[var(--font-rajdhani)] text-[var(--color-muted)]">
              {previews[rating]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
