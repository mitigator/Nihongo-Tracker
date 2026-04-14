"use client";

import { useState } from "react";
import { GoalFormData } from "@/types";

interface GoalFormProps {
    initialData?: Partial<GoalFormData>;
    onSubmit: (data: GoalFormData) => Promise<boolean>;
    submitLabel?: string;
    weekStartDate?: string;
}

const defaultForm: GoalFormData = {
    vocabTarget: 0,
    kanjiTarget: 0,
    grammarTarget: 0,
    listeningTarget: 0,
};

const fields = [
    { name: "vocabTarget", label: "Vocab Target", icon: "📖", unit: "words" },
    { name: "kanjiTarget", label: "Kanji Target", icon: "🈶", unit: "kanji" },
    { name: "grammarTarget", label: "Grammar Target", icon: "✏️", unit: "points" },
    { name: "listeningTarget", label: "Listening Target", icon: "🎧", unit: "min" },
];

export default function GoalForm({
    initialData,
    onSubmit,
    submitLabel = "Save Goals",
    weekStartDate,
}: GoalFormProps) {
    const [form, setForm] = useState<GoalFormData>({ ...defaultForm, ...initialData });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: Number(e.target.value) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const payload: GoalFormData = weekStartDate ? { ...form, weekStartDate } : form;
        await onSubmit(payload);
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Week lock indicator */}
            {weekStartDate && (
                <div className="font-bold uppercase tracking-widest text-[0.65rem] lg:text-xs px-4 py-2.5 rounded-xl font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)]">
                    📅 Week of {weekStartDate}
                </div>
            )}

            {fields.map(({ name, label, icon, unit }) => (
                <div key={name} className="flex flex-col gap-2">
                    <label className="font-black uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)]">
                        {icon} {label}{" "}
                        <span className="normal-case font-normal">({unit})</span>
                    </label>
                    <input
                        type="number"
                        name={name}
                        value={form[name as keyof GoalFormData] as number}
                        onChange={handleChange}
                        min={0}
                        className="w-full rounded-xl text-sm lg:text-base font-medium outline-none transition-all font-[var(--font-rajdhani)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-primary)]"
                        style={{ padding: "0.75rem 1rem" }}
                    />
                </div>
            ))}

            <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-xs lg:text-sm font-[var(--font-orbitron)] bg-[var(--color-primary)] text-black hover:opacity-90"
                style={{ padding: "0.875rem", marginTop: "0.5rem" }}
            >
                {submitting ? "Saving..." : `${submitLabel} →`}
            </button>
        </form>
    );
}