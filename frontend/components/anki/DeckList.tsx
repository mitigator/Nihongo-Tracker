"use client";

import { useEffect } from "react";
import useAnki from "@/hooks/useAnki";
import DeckCard from "./DeckCard";
import { AnkiDeck } from "@/types/anki";

export default function DeckList() {
  const {
    decks,
    loading,
    fetchDecks,
    selectDeck,
    loadDeckReview,
    setView,
  } = useAnki();

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  const handleReview = (deck: AnkiDeck) => {
    selectDeck(deck);
    loadDeckReview(deck._id);
  };

  const handleManage = (deck: AnkiDeck) => {
    selectDeck(deck);
    setView("cardManager");
  };

  const handleEdit = (deck: AnkiDeck) => {
    selectDeck(deck);
    setView("deckForm");
  };

  const totalDue = decks.reduce((s, d) => s + d.dueCount, 0);

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-black tracking-widest text-sm text-[var(--color-text)] font-[var(--font-orbitron)]">
            My Decks
          </p>
          {totalDue > 0 && (
            <p className="text-xs text-[var(--color-muted)] font-[var(--font-rajdhani)] mt-0.5">
              {totalDue} cards due across all decks
            </p>
          )}
        </div>
        <button
          onClick={() => setView("deckForm")}
          className="font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] text-[0.65rem] px-4 py-2 font-[var(--font-orbitron)] shrink-0"
          style={{ background: "var(--color-primary)", color: "#000" }}
        >
          + New Deck
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 rounded-full border-[3px] animate-spin border-[var(--color-border)] border-t-[var(--color-primary)]" />
        </div>
      ) : decks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🗂</p>
          <p className="font-semibold text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)]">
            No decks yet — create your first one!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {decks.map((deck) => (
            <DeckCard
              key={deck._id}
              deck={deck}
              onReview={handleReview}
              onManage={handleManage}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
