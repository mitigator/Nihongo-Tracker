"use client";

import { useEffect } from "react";
import useAnki from "@/hooks/useAnki";
import DeckList from "@/components/anki/DeckList";
import DeckForm from "@/components/anki/DeckForm";
import ReviewSession from "@/components/anki/ReviewSession";
import CardManager from "@/components/anki/CardManager";
import { AnkiDeckFormData } from "@/types/anki";

export default function AnkiPage() {
    const {
        view,
        setView,
        activeDeck,
        fetchDecks,
        createDeck,
        updateDeck,
        deleteDeck,
        decks,
    } = useAnki();

    useEffect(() => {
        fetchDecks();
    }, [fetchDecks]);

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
        if (!confirm(`Delete deck "${activeDeck.name}"?`)) return;
        const action = confirm("Move cards to Unsorted? OK = move, Cancel = delete all cards.")
            ? "move"
            : "delete";
        await deleteDeck(activeDeck._id, action);
    };

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-black tracking-widest text-xl text-[var(--color-text)] font-[var(--font-orbitron)]">
                        🃏 Anki Decks
                    </h1>
                    <p className="text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)] mt-1">
                        Spaced-repetition flashcards
                    </p>
                </div>
                {(view === "cardManager" || view === "review" || view === "deckForm") && (
                    <button
                        onClick={() => setView("deckList")}
                        className="font-bold uppercase tracking-widest rounded-xl transition-all text-[0.65rem] px-3 py-2 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    >
                        ← All Decks
                    </button>
                )}
            </div>

            {/* View router */}
            <div
                className="rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)]"
                style={{ padding: "1.5rem" }}
            >
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
    );
}