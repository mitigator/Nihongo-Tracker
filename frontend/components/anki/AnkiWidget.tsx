"use client";

import { useEffect } from "react";
import useAnki from "@/hooks/useAnki";
import DeckList from "./DeckList";
import DeckForm from "./DeckForm";
import ReviewSession from "./ReviewSession";
import CardManager from "./CardManager";
import { AnkiDeckFormData } from "@/types/anki";

export default function AnkiWidget() {
  const {
    isWidgetOpen,
    openWidget,
    closeWidget,
    view,
    setView,
    decks,
    activeDeck,
    fetchDecks,
    createDeck,
    updateDeck,
    deleteDeck,
  } = useAnki();

  // Load decks once when widget mounts so badge count is fresh
  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  const totalDue = decks.reduce((s, d) => s + d.dueCount, 0);

  const handleDeckFormSubmit = async (data: AnkiDeckFormData): Promise<boolean> => {
    if (activeDeck) {
      const ok = await updateDeck(activeDeck._id, data);
      if (ok) setView("deckList");
      return ok;
    }
    const ok = await createDeck(data);
    if (ok) setView("deckList");
    return ok;
  };

  const handleDeleteDeck = async () => {
    if (!activeDeck) return;
    if (!confirm(`Delete deck "${activeDeck.name}"? Choose what happens to its cards below.`)) return;
    const action = confirm("Move cards to Unsorted? OK = move, Cancel = delete all cards.")
      ? "move"
      : "delete";
    await deleteDeck(activeDeck._id, action);
  };

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        onClick={isWidgetOpen ? closeWidget : openWidget}
        aria-label="Open Anki deck"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-[0.95]"
        style={{
          background: "var(--color-primary)",
          color: "#000",
          boxShadow: "0 4px 24px 0 var(--color-primary)55",
        }}
      >
        {isWidgetOpen ? (
          <span className="text-xl font-black">✕</span>
        ) : (
          <span className="text-2xl">🃏</span>
        )}

        {/* Due count badge */}
        {!isWidgetOpen && totalDue > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 rounded-full flex items-center justify-center font-black text-[0.55rem] font-[var(--font-orbitron)] px-1"
            style={{ background: "#ef4444", color: "#fff" }}
          >
            {totalDue > 99 ? "99+" : totalDue}
          </span>
        )}
      </button>

      {/* ── Modal overlay ── */}
      {isWidgetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
            onClick={closeWidget}
          />

          {/* Panel */}
          <div
            className="fixed bottom-24 right-6 z-50 w-full rounded-2xl border shadow-2xl overflow-hidden flex flex-col"
            style={{
              maxWidth: "420px",
              maxHeight: "80vh",
              background: "var(--color-card)",
              borderColor: "var(--color-border)",
            }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between shrink-0"
              style={{
                padding: "1rem 1.25rem",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🃏</span>
                <span
                  className="font-black tracking-widest text-xs text-[var(--color-text)] font-[var(--font-orbitron)]"
                >
                  Anki Decks
                </span>
                {totalDue > 0 && (
                  <span
                    className="text-[0.55rem] font-black rounded-md px-1.5 py-0.5 font-[var(--font-orbitron)]"
                    style={{ background: "#ef444422", color: "#ef4444" }}
                  >
                    {totalDue} due
                  </span>
                )}
              </div>
              <button
                onClick={closeWidget}
                className="font-bold text-lg leading-none text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Panel body — scrollable */}
            <div className="flex-1 overflow-y-auto" style={{ padding: "1.25rem" }}>
              {view === "deckList" && <DeckList />}

              {view === "review" && <ReviewSession />}

              {view === "cardManager" && <CardManager />}

              {view === "deckForm" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="font-black tracking-widest text-sm text-[var(--color-text)] font-[var(--font-orbitron)]">
                      {activeDeck ? "Edit Deck" : "New Deck"}
                    </p>
                    {activeDeck && (
                      <button
                        onClick={handleDeleteDeck}
                        className="font-bold uppercase tracking-widest rounded-lg transition-all text-[0.6rem] px-3 py-1.5 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-red-500 hover:text-red-500"
                      >
                        Delete Deck
                      </button>
                    )}
                  </div>
                  <DeckForm
                    initialData={activeDeck ?? undefined}
                    onSubmit={handleDeckFormSubmit}
                    onCancel={() => setView("deckList")}
                    submitLabel={activeDeck ? "Save Changes" : "Create Deck"}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
