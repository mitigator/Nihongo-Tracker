"use client";

import { useState } from "react";
import { GoalFormData } from "@/types";

interface GoalFormProps {
    initialData?: Partial<GoalFormData>;
    onSubmit: (data: GoalFormData) => Promise<boolean>;
    submitLabel?: string;
    weekStartDate?: string; // if passed, week is locked (editing existing)
}

const defaultForm: GoalFormData = {
    vocabTarget: 0,
    kanjiTarget: 0,
    grammarTarget: 0,
    listeningTarget: 0,
};

const inputClass =
    "w-full px-4 py-3 rounded-xl text-base font-medium outline-none transition-all";

const inputStyle = {
    background: "var(--color-bg)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
    fontFamily: "var(--font-rajdhani)",
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
    submitLabel = "SAVE GOALS",
    weekStartDate,
}: GoalFormProps) {
    const [form, setForm] = useState<GoalFormData>({
        ...defaultForm,
        ...initialData,
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: Number(e.target.value) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const payload: GoalFormData = weekStartDate
            ? { ...form, weekStartDate }
            : form;
        await onSubmit(payload);
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Week label */}
            {weekStartDate && (
                <div
                    className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl"
                    style={{
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-orbitron)",
                    }}
                >
                    📅 Week of {weekStartDate}
                </div>
            )}

            {fields.map(({ name, label, icon, unit }) => (
                <div key={name} className="flex flex-col gap-1.5">
                    <label
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-orbitron)",
                        }}
                    >
                        {icon} {label}{" "}
                        <span style={{ fontWeight: 400, textTransform: "none" }}>
                            ({unit})
                        </span>
                    </label>
                    <input
                        type="number"
                        name={name}
                        value={form[name as keyof GoalFormData] as number}
                        onChange={handleChange}
                        min={0}
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
            ))}

            <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                style={{
                    background: "var(--color-primary)",
                    color: "#000",
                    fontFamily: "var(--font-orbitron)",
                    fontSize: "13px",
                }}
            >
                {submitting ? "SAVING..." : `${submitLabel} →`}
            </button>
        </form>
    );
}