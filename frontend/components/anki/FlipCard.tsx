"use client";

import { useState, useEffect } from "react";
import { AnkiCard } from "@/types/anki";

interface FlipCardProps {
  card: AnkiCard;
  onReveal?: () => void;
}

export default function FlipCard({ card, onReveal }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  // Reset flip when card changes
  useEffect(() => {
    setFlipped(false);
  }, [card._id]);

  const handleFlip = () => {
    if (flipped) return;
    setFlipped(true);
    onReveal?.();
  };

  const typeColors: Record<string, string> = {
    vocab: "var(--color-primary)",
    kanji: "var(--color-secondary)",
    custom: "var(--color-accent)",
  };

  return (
    <div
      className="w-full cursor-pointer select-none"
      style={{ perspective: "1000px", minHeight: "200px" }}
      onClick={handleFlip}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          minHeight: "200px",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl border flex flex-col items-center justify-center gap-4 bg-[var(--color-card)] border-[var(--color-border)]"
          style={{ backfaceVisibility: "hidden", padding: "2rem" }}
        >
          <span
            className="text-[0.6rem] font-black uppercase tracking-widest rounded-md px-2 py-0.5 font-[var(--font-orbitron)]"
            style={{
              background: (typeColors[card.type] ?? "var(--color-primary)") + "22",
              color: typeColors[card.type] ?? "var(--color-primary)",
            }}
          >
            {card.type}
            {card.jlptLevel ? ` · ${card.jlptLevel}` : ""}
          </span>

          <p
            className="font-black text-center text-[var(--color-text)] font-[var(--font-orbitron)]"
            style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}
          >
            {card.front}
          </p>

          <p className="text-xs text-[var(--color-muted)] font-[var(--font-rajdhani)] mt-2">
            Tap to reveal →
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl border flex flex-col items-center justify-center gap-4 bg-[var(--color-card)] border-[var(--color-primary)]"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            padding: "2rem",
          }}
        >
          <p
            className="font-black text-center text-[var(--color-primary)] font-[var(--font-orbitron)]"
            style={{ fontSize: "clamp(1.25rem, 4vw, 2rem)" }}
          >
            {card.back || (
              <span className="text-[var(--color-muted)] text-sm font-[var(--font-rajdhani)]">
                No back content yet — edit this card to add it.
              </span>
            )}
          </p>

          <div
            className="w-full rounded-xl border mt-2"
            style={{ borderColor: "var(--color-border)", padding: "0.75rem 1rem" }}
          >
            <p className="text-[0.6rem] font-black uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-orbitron)] mb-1">
              Front
            </p>
            <p className="text-sm font-medium text-[var(--color-text)] font-[var(--font-rajdhani)]">
              {card.front}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
