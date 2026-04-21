"use client";

import { useState, useEffect } from "react";
import { AnkiCard } from "@/types/anki";

interface FlipCardProps {
  card: AnkiCard;
  onReveal?: () => void;
}

export default function FlipCard({ card, onReveal }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

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

  const accent = typeColors[card.type] ?? "var(--color-primary)";

  return (
    <div
      className="w-full cursor-pointer select-none"
      style={{ perspective: "1000px", minHeight: "220px" }}
      onClick={handleFlip}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          minHeight: "220px",
        }}
      >
        {/* ── Front ── */}
        <div
          className="absolute inset-0 rounded-2xl border flex flex-col items-center justify-center gap-4 bg-[var(--color-card)] border-[var(--color-border)]"
          style={{ backfaceVisibility: "hidden", padding: "2rem" }}
        >
          <span
            className="text-[0.6rem] font-black uppercase tracking-widest rounded-md px-2 py-0.5 font-[var(--font-orbitron)]"
            style={{ background: accent + "22", color: accent }}
          >
            {card.type}{card.jlptLevel ? ` · ${card.jlptLevel}` : ""}
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

        {/* ── Back ── */}
        <div
          className="absolute inset-0 rounded-2xl border flex flex-col items-center justify-center bg-[var(--color-card)]"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            padding: "1.5rem",
            borderColor: accent,
          }}
        >
          {card.type === "kanji" ? (
            /* ── Kanji: 3 labelled boxes ── */
            <div className="flex flex-col gap-3 w-full">
              {/* Kanji reminder at top */}
              <p
                className="text-center font-black text-[var(--color-text)] font-[var(--font-orbitron)] mb-1"
                style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}
              >
                {card.front}
              </p>

              {/* Onyomi */}
              <div
                className="w-full rounded-xl border text-center"
                style={{ borderColor: "var(--color-border)", padding: "0.6rem 1rem" }}
              >
                <p className="text-[0.55rem] font-black uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-orbitron)] mb-1">
                  音読み · Onyomi
                </p>
                <p className="text-base font-black font-[var(--font-orbitron)]" style={{ color: accent }}>
                  {card.onyomi || (
                    <span className="text-[var(--color-muted)] text-sm font-normal font-[var(--font-rajdhani)]">—</span>
                  )}
                </p>
              </div>

              {/* Kunyomi */}
              <div
                className="w-full rounded-xl border text-center"
                style={{ borderColor: "var(--color-border)", padding: "0.6rem 1rem" }}
              >
                <p className="text-[0.55rem] font-black uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-orbitron)] mb-1">
                  訓読み · Kunyomi
                </p>
                <p className="text-base font-black font-[var(--font-orbitron)]" style={{ color: accent }}>
                  {card.kunyomi || (
                    <span className="text-[var(--color-muted)] text-sm font-normal font-[var(--font-rajdhani)]">—</span>
                  )}
                </p>
              </div>

              {/* Meaning */}
              <div
                className="w-full rounded-xl border text-center"
                style={{ borderColor: "var(--color-border)", padding: "0.6rem 1rem" }}
              >
                <p className="text-[0.55rem] font-black uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-orbitron)] mb-1">
                  Meaning
                </p>
                <p className="text-base font-black text-[var(--color-text)] font-[var(--font-orbitron)]">
                  {card.back || (
                    <span className="text-[var(--color-muted)] text-sm font-normal font-[var(--font-rajdhani)]">—</span>
                  )}
                </p>
              </div>
            </div>
          ) : (
            /* ── Vocab / Custom: original layout ── */
            <>
              <p
                className="font-black text-center font-[var(--font-orbitron)]"
                style={{ fontSize: "clamp(1.25rem, 4vw, 2rem)", color: accent }}
              >
                {card.back || (
                  <span className="text-[var(--color-muted)] text-sm font-[var(--font-rajdhani)]">
                    No back content yet — edit this card to add it.
                  </span>
                )}
              </p>

              <div
                className="w-full rounded-xl border mt-4"
                style={{ borderColor: "var(--color-border)", padding: "0.75rem 1rem" }}
              >
                <p className="text-[0.6rem] font-black uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-orbitron)] mb-1">
                  Front
                </p>
                <p className="text-sm font-medium text-[var(--color-text)] font-[var(--font-rajdhani)]">
                  {card.front}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}