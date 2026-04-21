"use client";

import { useEffect, useState } from "react";
import useAnki from "@/hooks/useAnki";
import { AnkiCard, AnkiCardFormData, CardType, CARD_TYPES } from "@/types/anki";

const inputClass =
  "w-full px-4 py-3 rounded-xl text-base font-medium outline-none transition-all font-[var(--font-rajdhani)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)]";

const focusStyle = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.target.style.borderColor = "var(--color-primary)");
const blurStyle = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.target.style.borderColor = "var(--color-border)");

export default function CardManager() {
  const {
    activeDeck,
    decks,
    fetchCards,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    setView,
    clearActiveDeck,
  } = useAnki();

  const [cards, setCards] = useState<AnkiCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState<CardType | "all">("all");

  const emptyAdd = (): AnkiCardFormData => ({
    front: "",
    back: "",
    onyomi: "",
    kunyomi: "",
    type: "vocab",
    jlptLevel: activeDeck?.jlptLevel ?? null,
    deckId: activeDeck?._id,
  });

  const [addForm, setAddForm] = useState<AnkiCardFormData>(emptyAdd());
  const [editForm, setEditForm] = useState<Partial<AnkiCardFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!activeDeck) return;
    setLoading(true);
    fetchCards(activeDeck._id).then((c) => {
      setCards(c);
      setLoading(false);
    });
  }, [activeDeck, fetchCards]);

  const handleBack = () => {
    clearActiveDeck();
    setView("deckList");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await createCard({ ...addForm, deckId: activeDeck?._id });
    if (ok) {
      setAddForm(emptyAdd());
      setShowAddForm(false);
      if (activeDeck) fetchCards(activeDeck._id).then(setCards);
    }
    setSubmitting(false);
  };

  const handleEdit = async (card: AnkiCard) => {
    setSubmitting(true);
    const ok = await updateCard(card._id, editForm);
    if (ok) {
      setCards((prev) =>
        prev.map((c) => (c._id === card._id ? { ...c, ...editForm } as AnkiCard : c))
      );
      setEditingId(null);
      setEditForm({});
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this card? This cannot be undone.")) return;
    setDeletingId(id);
    await deleteCard(id);
    setCards((prev) => prev.filter((c) => c._id !== id));
    setDeletingId(null);
  };

  const handleMove = async (cardId: string, toDeckId: string) => {
    const ok = await moveCard(cardId, toDeckId);
    if (ok) setCards((prev) => prev.filter((c) => c._id !== cardId));
  };

  const filtered = filterType === "all" ? cards : cards.filter((c) => c.type === filterType);

  return (
    <div className="flex flex-col gap-4">

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
            {cards.length} cards
          </p>
        </div>
      </div>

      {/* Add card button */}
      <button
        onClick={() => setShowAddForm((p) => !p)}
        className="w-full font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] text-xs py-2.5 font-[var(--font-orbitron)]"
        style={{ background: "var(--color-primary)", color: "#000" }}
      >
        {showAddForm ? "Cancel" : "+ Add Card"}
      </button>

      {/* Add form */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="flex flex-col gap-3 rounded-2xl border p-4 bg-[var(--color-card)] border-[var(--color-border)]"
        >
          {/* Type selector */}
          <div className="flex gap-2">
            {CARD_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setAddForm((p) => ({ ...p, type: t }))}
                className="flex-1 font-black uppercase tracking-widest rounded-xl transition-all text-[0.6rem] py-2 font-[var(--font-orbitron)]"
                style={{
                  background: addForm.type === t ? "var(--color-primary)" : "transparent",
                  color: addForm.type === t ? "#000" : "var(--color-muted)",
                  border: addForm.type === t ? "none" : "1px solid var(--color-border)",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Front */}
          <input
            type="text"
            placeholder={addForm.type === "kanji" ? "Kanji (e.g. 山)" : "Front (word / kanji)"}
            required
            value={addForm.front}
            onChange={(e) => setAddForm((p) => ({ ...p, front: e.target.value }))}
            className={inputClass}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />

          {/* Back fields — 3 for kanji, 1 for others */}
          {addForm.type === "kanji" ? (
            <>
              <input
                type="text"
                placeholder="Onyomi 音読み (e.g. サン)"
                value={addForm.onyomi ?? ""}
                onChange={(e) => setAddForm((p) => ({ ...p, onyomi: e.target.value }))}
                className={inputClass}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <input
                type="text"
                placeholder="Kunyomi 訓読み (e.g. やま)"
                value={addForm.kunyomi ?? ""}
                onChange={(e) => setAddForm((p) => ({ ...p, kunyomi: e.target.value }))}
                className={inputClass}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <input
                type="text"
                placeholder="Meaning (e.g. mountain)"
                required
                value={addForm.back}
                onChange={(e) => setAddForm((p) => ({ ...p, back: e.target.value }))}
                className={inputClass}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </>
          ) : (
            <input
              type="text"
              placeholder="Back (meaning / reading)"
              required
              value={addForm.back}
              onChange={(e) => setAddForm((p) => ({ ...p, back: e.target.value }))}
              className={inputClass}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-50 text-xs font-[var(--font-orbitron)]"
            style={{ background: "var(--color-primary)", color: "#000" }}
          >
            {submitting ? "Adding..." : "Add Card →"}
          </button>
        </form>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(["all", ...CARD_TYPES] as (CardType | "all")[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className="font-black uppercase tracking-widest rounded-xl transition-all text-[0.6rem] px-3 py-1.5 font-[var(--font-orbitron)]"
            style={{
              background: filterType === t ? "var(--color-primary)" : "transparent",
              color: filterType === t ? "#000" : "var(--color-muted)",
              border: filterType === t ? "none" : "1px solid var(--color-border)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Card list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 rounded-full border-[3px] animate-spin border-[var(--color-border)] border-t-[var(--color-primary)]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-3xl mb-2">🃏</p>
          <p className="text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)]">No cards here yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((card) => (
            <div
              key={card._id}
              className="rounded-2xl border transition-all bg-[var(--color-card)] border-[var(--color-border)]"
              style={{ padding: "1rem 1.25rem" }}
            >
              {editingId === card._id ? (
                /* ── Edit form ── */
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    defaultValue={card.front}
                    placeholder="Front"
                    onChange={(e) => setEditForm((p) => ({ ...p, front: e.target.value }))}
                    className={inputClass}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />

                  {card.type === "kanji" ? (
                    <>
                      <input
                        type="text"
                        defaultValue={card.onyomi ?? ""}
                        placeholder="Onyomi 音読み"
                        onChange={(e) => setEditForm((p) => ({ ...p, onyomi: e.target.value }))}
                        className={inputClass}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      />
                      <input
                        type="text"
                        defaultValue={card.kunyomi ?? ""}
                        placeholder="Kunyomi 訓読み"
                        onChange={(e) => setEditForm((p) => ({ ...p, kunyomi: e.target.value }))}
                        className={inputClass}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      />
                      <input
                        type="text"
                        defaultValue={card.back}
                        placeholder="Meaning"
                        onChange={(e) => setEditForm((p) => ({ ...p, back: e.target.value }))}
                        className={inputClass}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                      />
                    </>
                  ) : (
                    <input
                      type="text"
                      defaultValue={card.back}
                      placeholder="Back"
                      onChange={(e) => setEditForm((p) => ({ ...p, back: e.target.value }))}
                      className={inputClass}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setEditingId(null); setEditForm({}); }}
                      className="flex-1 py-2 rounded-xl font-black uppercase tracking-widest text-[0.6rem] font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(card)}
                      disabled={submitting}
                      className="flex-1 py-2 rounded-xl font-black uppercase tracking-widest text-[0.6rem] font-[var(--font-orbitron)] disabled:opacity-50"
                      style={{ background: "var(--color-primary)", color: "#000" }}
                    >
                      {submitting ? "..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Card display ── */
                <>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="font-black text-sm text-[var(--color-text)] font-[var(--font-orbitron)] truncate">
                        {card.front}
                      </p>

                      {card.type === "kanji" ? (
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          {(card.onyomi || card.kunyomi) && (
                            <p className="text-xs text-[var(--color-muted)] font-[var(--font-rajdhani)] truncate">
                              {card.onyomi && <span>音: {card.onyomi}</span>}
                              {card.onyomi && card.kunyomi && <span className="mx-1">·</span>}
                              {card.kunyomi && <span>訓: {card.kunyomi}</span>}
                            </p>
                          )}
                          <p className="text-xs text-[var(--color-muted)] font-[var(--font-rajdhani)] truncate">
                            {card.back || <em>No meaning yet</em>}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-[var(--color-muted)] font-[var(--font-rajdhani)] mt-0.5 truncate">
                          {card.back || <em>No back yet</em>}
                        </p>
                      )}
                    </div>

                    <span
                      className="text-[0.55rem] font-black uppercase tracking-widest rounded px-1.5 py-0.5 font-[var(--font-orbitron)] shrink-0"
                      style={{ background: "var(--color-border)", color: "var(--color-muted)" }}
                    >
                      {card.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        setEditingId(card._id);
                        setEditForm({
                          front: card.front,
                          back: card.back,
                          onyomi: card.onyomi,
                          kunyomi: card.kunyomi,
                        });
                      }}
                      className="font-bold uppercase tracking-widest rounded-lg transition-all text-[0.6rem] px-3 py-1.5 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(card._id)}
                      disabled={deletingId === card._id}
                      className="font-bold uppercase tracking-widest rounded-lg transition-all text-[0.6rem] px-3 py-1.5 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-red-500 hover:text-red-500 disabled:opacity-50"
                    >
                      {deletingId === card._id ? "..." : "Delete"}
                    </button>
                    <select
                      onChange={(e) => e.target.value && handleMove(card._id, e.target.value)}
                      value=""
                      className="font-bold uppercase tracking-widest rounded-lg text-[0.6rem] px-2 py-1.5 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] outline-none cursor-pointer"
                    >
                      <option value="">Move to…</option>
                      {decks
                        .filter((d) => d._id !== activeDeck?._id)
                        .map((d) => (
                          <option key={d._id} value={d._id}>{d.name}</option>
                        ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}