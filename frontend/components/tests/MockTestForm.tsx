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

const inputClass =
    "w-full px-4 py-3 rounded-xl text-base font-medium outline-none transition-all";

const inputStyle = {
    background: "var(--color-bg)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
    fontFamily: "var(--font-rajdhani)",
};

const scoreFields = [
    { name: "totalScore", label: "Total Score", icon: "🎯", max: 180 },
    { name: "vocabScore", label: "Vocab Score", icon: "📖", max: 60 },
    { name: "grammarScore", label: "Grammar Score", icon: "✏️", max: 60 },
    { name: "readingScore", label: "Reading Score", icon: "📄", max: 60 },
    { name: "listeningScore", label: "Listening Score", icon: "🎧", max: 60 },
];

export default function MockTestForm({ onSubmit }: MockTestFormProps) {
    const [form, setForm] = useState<MockTestFormData>(defaultForm);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
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
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Date */}
            <div className="flex flex-col gap-1.5">
                <label
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
                >
                    📅 Date
                </label>
                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                />
            </div>

            {/* Score fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {scoreFields.map(({ name, label, icon, max }) => (
                    <div key={name} className="flex flex-col gap-1.5">
                        <label
                            className="text-xs font-bold uppercase tracking-widest"
                            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
                        >
                            {icon} {label}{" "}
                            <span style={{ fontWeight: 400, textTransform: "none" }}>
                                (max {max})
                            </span>
                        </label>
                        <input
                            type="number"
                            name={name}
                            value={form[name as keyof MockTestFormData] as number}
                            onChange={handleChange}
                            min={0}
                            max={max}
                            className={inputClass}
                            style={{
                                ...inputStyle,
                                // Highlight totalScore green/red based on pass
                                ...(name === "totalScore"
                                    ? {
                                        borderColor: isPassing ? "var(--color-primary)" : "#ef4444",
                                        color: isPassing ? "var(--color-primary)" : "#ef4444",
                                    }
                                    : {}),
                            }}
                            onFocus={(e) =>
                                (e.target.style.borderColor = "var(--color-primary)")
                            }
                            onBlur={(e) => {
                                if (name !== "totalScore") {
                                    e.target.style.borderColor = "var(--color-border)";
                                }
                            }}
                        />
                    </div>
                ))}

                {/* Pass threshold */}
                <div className="flex flex-col gap-1.5">
                    <label
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
                    >
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
                        style={inputStyle}
                        onFocus={(e) =>
                            (e.target.style.borderColor = "var(--color-primary)")
                        }
                        onBlur={(e) =>
                            (e.target.style.borderColor = "var(--color-border)")
                        }
                    />
                </div>
            </div>

            {/* Live pass/fail indicator */}
            <div
                className="rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-widest text-center"
                style={{
                    background: isPassing ? "var(--color-primary)20" : "#ef444420",
                    border: `1px solid ${isPassing ? "var(--color-primary)" : "#ef4444"}`,
                    color: isPassing ? "var(--color-primary)" : "#ef4444",
                    fontFamily: "var(--font-orbitron)",
                }}
            >
                {isPassing ? "✅ PASSING" : "❌ FAILING"} — {form.totalScore} /{" "}
                {form.passThreshold}
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
                <label
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
                >
                    📝 Notes{" "}
                    <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span>
                </label>
                <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    maxLength={1000}
                    placeholder="How did it go? What to improve?"
                    className={inputClass + " resize-none"}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                    background: "var(--color-primary)",
                    color: "#000",
                    fontFamily: "var(--font-orbitron)",
                    fontSize: "13px",
                }}
            >
                {submitting ? "SAVING..." : "LOG TEST →"}
            </button>
        </form>
    );
}