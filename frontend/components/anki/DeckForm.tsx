"use client";

import { useState } from "react";
import { AnkiDeckFormData, AnkiDeck, JLPTLevel, JLPT_LEVELS, DECK_COLORS, DeckColor } from "@/types/anki";

interface DeckFormProps {
  initialData?: Partial<AnkiDeck>;
  onSubmit: (data: AnkiDeckFormData) => Promise<boolean>;
  onCancel: () => void;
  submitLabel?: string;
}

const defaultForm: AnkiDeckFormData = {
  name: "",
  description: "",
  jlptLevel: null,
  color: DECK_COLORS[0],
  dailyReviewTarget: 10,
  newCardsPerDay: 5,
};

export default function DeckForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Create Deck",
}: DeckFormProps) {
  const [form, setForm] = useState<AnkiDeckFormData>({
    ...defaultForm,
    ...initialData,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await onSubmit(form);
    setSubmitting(false);
    if (!ok) return;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-orbitron)]">
          🗂 Deck Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
          maxLength={100}
          placeholder='e.g. "N5 Vocab"'
          className="w-full px-4 py-3 rounded-xl text-base font-medium outline-none transition-all font-[var(--font-rajdhani)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)]"
          onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-orbitron)]">
          📝 Description{" "}
          <span className="normal-case font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={form.description ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          maxLength={500}
          placeholder="What's in this deck?"
          className="w-full px-4 py-3 rounded-xl text-base font-medium outline-none transition-all font-[var(--font-rajdhani)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)]"
          onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
        />
      </div>

      {/* JLPT Level */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-orbitron)]">
          🎌 JLPT Level{" "}
          <span className="normal-case font-normal">(optional — enables auto-assign)</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {([null, ...JLPT_LEVELS] as (JLPTLevel | null)[]).map((lvl) => (
            <button
              key={lvl ?? "none"}
              type="button"
              onClick={() => setForm((p) => ({ ...p, jlptLevel: lvl }))}
              className="font-black uppercase tracking-widest rounded-xl transition-all text-[0.65rem] px-3 py-2 font-[var(--font-orbitron)]"
              style={{
                background: form.jlptLevel === lvl ? "var(--color-primary)" : "transparent",
                color: form.jlptLevel === lvl ? "#000" : "var(--color-muted)",
                border: form.jlptLevel === lvl ? "none" : "1px solid var(--color-border)",
              }}
            >
              {lvl ?? "None"}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-orbitron)]">
          🎨 Color
        </label>
        <div className="flex gap-3">
          {DECK_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm((p) => ({ ...p, color: c as DeckColor }))}
              className="w-8 h-8 rounded-full transition-all"
              style={{
                background: c,
                outline: form.color === c ? `3px solid var(--color-text)` : "none",
                outlineOffset: "2px",
                transform: form.color === c ? "scale(1.15)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Targets */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-orbitron)]">
            🎯 Daily Review Target
          </label>
          <input
            type="number"
            min={1}
            max={500}
            value={form.dailyReviewTarget}
            onChange={(e) => setForm((p) => ({ ...p, dailyReviewTarget: Number(e.target.value) }))}
            className="w-full px-4 py-3 rounded-xl text-base font-medium outline-none transition-all font-[var(--font-rajdhani)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)]"
            onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-orbitron)]">
            🆕 New Cards / Day
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={form.newCardsPerDay}
            onChange={(e) => setForm((p) => ({ ...p, newCardsPerDay: Number(e.target.value) }))}
            className="w-full px-4 py-3 rounded-xl text-base font-medium outline-none transition-all font-[var(--font-rajdhani)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)]"
            onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl font-black tracking-widest uppercase transition-all text-xs font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-3 rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-[var(--font-orbitron)]"
          style={{ background: "var(--color-primary)", color: "#000" }}
        >
          {submitting ? "Saving..." : `${submitLabel} →`}
        </button>
      </div>
    </form>
  );
}
