"use client";

import { useState } from "react";
import { MockTestFormData } from "@/types";

interface MockTestFormProps {
    onSubmit: (data: MockTestFormData) => Promise<boolean>;
}

const defaultForm: MockTestFormData = {
    date: new Date().toISOString().slice(0, 10),
    totalScore: 0,
    vocabScore: 0,
    grammarScore: 0,
    readingScore: 0,
    listeningScore: 0,
    passThreshold: 80,
    notes: "",
};

const scoreFields = [
    { name: "totalScore", label: "Total Score", icon: "🎯", max: 180 },
    { name: "vocabScore", label: "Vocab Score", icon: "📖", max: 60 },
    { name: "grammarScore", label: "Grammar Score", icon: "✏️", max: 60 },
    { name: "readingScore", label: "Reading Score", icon: "📄", max: 60 },
    { name: "listeningScore", label: "Listening Score", icon: "🎧", max: 60 },
];

const inputClass = "w-full rounded-xl text-sm lg:text-base font-medium outline-none transition-all font-[var(--font-rajdhani)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-primary)]";
const inputPadding = { padding: "0.75rem 1rem" };

export default function MockTestForm({ onSubmit }: MockTestFormProps) {
    const [form, setForm] = useState<MockTestFormData>(defaultForm);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "notes" || name === "date" ? value : Number(value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await onSubmit(form);
        setSubmitting(false);
    };

    const isPassing = form.totalScore >= form.passThreshold;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Date */}
            <div className="flex flex-col gap-2">
                <label className="font-black uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)]">
                    📅 Date
                </label>
                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    style={inputPadding}
                />
            </div>

            {/* Score fields grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {scoreFields.map(({ name, label, icon, max }) => {
                    const isTotalScore = name === "totalScore";
                    return (
                        <div key={name} className="flex flex-col gap-2">
                            <label className="font-black uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)]">
                                {icon} {label} <span className="normal-case font-normal">(max {max})</span>
                            </label>
                            <input
                                type="number"
                                name={name}
                                value={form[name as keyof MockTestFormData] as number}
                                onChange={handleChange}
                                min={0}
                                max={max}
                                className="w-full rounded-xl text-sm lg:text-base font-medium outline-none transition-all font-[var(--font-rajdhani)]"
                                style={{
                                    ...inputPadding,
                                    background: "var(--color-bg)",
                                    color: isTotalScore
                                        ? isPassing ? "var(--color-primary)" : "#ef4444"
                                        : "var(--color-text)",
                                    border: `1px solid ${isTotalScore
                                        ? isPassing ? "var(--color-primary)" : "#ef4444"
                                        : "var(--color-border)"}`,
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                                onBlur={(e) => {
                                    if (!isTotalScore) e.target.style.borderColor = "var(--color-border)";
                                    else e.target.style.borderColor = isPassing ? "var(--color-primary)" : "#ef4444";
                                }}
                            />
                        </div>
                    );
                })}

                {/* Pass threshold */}
                <div className="flex flex-col gap-2">
                    <label className="font-black uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)]">
                        🏁 Pass Threshold
                    </label>
                    <input
                        type="number"
                        name="passThreshold"
                        value={form.passThreshold}
                        onChange={handleChange}
                        min={0}
                        max={180}
                        className={inputClass}
                        style={inputPadding}
                    />
                </div>
            </div>

            {/* Live pass/fail indicator */}
            <div
                className="rounded-xl text-xs lg:text-sm font-black uppercase tracking-widest text-center font-[var(--font-orbitron)]"
                style={{
                    padding: "0.75rem 1rem",
                    background: isPassing ? "color-mix(in srgb, var(--color-primary) 15%, transparent)" : "rgba(239,68,68,0.12)",
                    border: `1px solid ${isPassing ? "var(--color-primary)" : "#ef4444"}`,
                    color: isPassing ? "var(--color-primary)" : "#ef4444",
                }}
            >
                {isPassing ? "✅ Passing" : "❌ Failing"} — {form.totalScore} / {form.passThreshold}
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-2">
                <label className="font-black uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)]">
                    📝 Notes <span className="normal-case font-normal">(optional)</span>
                </label>
                <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    maxLength={1000}
                    placeholder="How did it go? What to improve?"
                    className={inputClass + " resize-none"}
                    style={inputPadding}
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-xs lg:text-sm font-[var(--font-orbitron)] bg-[var(--color-primary)] text-black hover:opacity-90"
                style={{ padding: "0.875rem", marginTop: "0.5rem" }}
            >
                {submitting ? "Saving..." : "Log Test →"}
            </button>
        </form>
    );
}