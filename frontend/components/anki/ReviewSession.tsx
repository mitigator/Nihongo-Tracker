"use client";

import { useState } from "react";
import useAnki from "@/hooks/useAnki";
import FlipCard from "./FlipCard";
import ReviewControls from "./ReviewControls";
import { SRSRating } from "@/types/anki";

export default function ReviewSession() {
  const {
    activeDeck,
    dueCards,
    currentCardIndex,
    reviewLoading,
    submitRating,
    setView,
    clearActiveDeck,
  } = useAnki();

  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const card = dueCards[currentCardIndex];
  const isComplete = currentCardIndex >= dueCards.length;
  const progress = Math.min(currentCardIndex / Math.max(dueCards.length, 1), 1);

  const handleRate = async (rating: SRSRating) => {
    if (!card || submitting) return;
    setSubmitting(true);
    setRevealed(false);
    await submitRating(card._id, rating);
    setSubmitting(false);
  };

  const handleBack = () => {
    clearActiveDeck();
    setView("deckList");
  };

  if (reviewLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 rounded-full border-[3px] animate-spin border-[var(--color-border)] border-t-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleBack}
          className="font-bold uppercase tracking-widest rounded-xl transition-all text-[0.65rem] px-3 py-2 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          ← Back
        </button>
        <div className="text-right">
          <p className="font-black tracking-widest text-xs text-[var(--color-text)] font-[var(--font-orbitron)]">
            {activeDeck?.name}
          </p>
          <p className="text-[0.6rem] text-[var(--color-muted)] font-[var(--font-rajdhani)]">
            {isComplete ? dueCards.length : currentCardIndex} / {dueCards.length} reviewed
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: "4px", background: "var(--color-border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress * 100}%`,
            background: "var(--color-primary)",
          }}
        />
      </div>

      {/* Daily target progress */}
      {activeDeck && (
        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-center text-[var(--color-muted)] font-[var(--font-orbitron)]">
          Today: {activeDeck.todayProgress.reviewedCount} / {activeDeck.dailyReviewTarget} daily target
        </p>
      )}

      {/* Complete state */}
      {isComplete ? (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <p className="text-5xl">🎉</p>
          <p className="font-black tracking-widest text-base text-[var(--color-text)] font-[var(--font-orbitron)]">
            Deck Complete!
          </p>
          <p className="text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)]">
            {dueCards.length} cards reviewed · great work!
          </p>
          <button
            onClick={handleBack}
            className="font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] text-xs px-6 py-3 font-[var(--font-orbitron)] mt-2"
            style={{ background: "var(--color-primary)", color: "#000" }}
          >
            Back to Decks →
          </button>
        </div>
      ) : card ? (
        <>
          {/* Card counter */}
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-center text-[var(--color-muted)] font-[var(--font-orbitron)]">
            Card {currentCardIndex + 1} of {dueCards.length}
          </p>

          {/* Flip card */}
          <FlipCard card={card} onReveal={() => setRevealed(true)} />

          {/* Rating controls — only shown after reveal */}
          <div
            className="transition-all duration-300 overflow-hidden"
            style={{ maxHeight: revealed ? "200px" : "0px", opacity: revealed ? 1 : 0 }}
          >
            <ReviewControls
              card={card}
              onRate={handleRate}
              disabled={submitting || !revealed}
            />
          </div>

          {!revealed && (
            <p className="text-center text-xs text-[var(--color-muted)] font-[var(--font-rajdhani)]">
              Tap the card to reveal the answer
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}
