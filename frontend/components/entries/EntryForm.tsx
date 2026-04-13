"use client";

import { useState } from "react";
import { EntryFormData } from "@/types";

interface EntryFormProps {
    initialData?: Partial<EntryFormData>;
    onSubmit: (data: EntryFormData) => Promise<boolean>;
    submitLabel?: string;
    isDateLocked?: boolean;
}

const defaultForm: EntryFormData = {
    date: new Date().toISOString().slice(0, 10),
    vocabCount: 0,
    listeningMinutes: 0,
    grammarCount: 0,
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

export default function EntryForm({
    initialData,
    onSubmit,
    submitLabel = "SAVE ENTRY",
    isDateLocked = false,
}: EntryFormProps) {
    const [form, setForm] = useState<EntryFormData>({
        ...defaultForm,
        ...initialData,
    });
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

    const fields = [
        { name: "date", label: "Date", type: "date", icon: "📅" },
        { name: "vocabCount", label: "Vocab Words Learned", type: "number", icon: "📖" },
        { name: "listeningMinutes", label: "Listening (minutes)", type: "number", icon: "🎧" },
        { name: "grammarCount", label: "Grammar Points", type: "number", icon: "✏️" },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(({ name, label, type, icon }) => (
                <div key={name} className="flex flex-col gap-1.5">
                    <label
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-orbitron)",
                        }}
                    >
                        {icon} {label}
                    </label>
                    <input
                        type={type}
                        name={name}
                        value={form[name as keyof EntryFormData]}
                        onChange={handleChange}
                        min={type === "number" ? 0 : undefined}
                        disabled={name === "date" && isDateLocked}
                        required={name === "date"}
                        className={inputClass}
                        style={{
                            ...inputStyle,
                            opacity: name === "date" && isDateLocked ? 0.5 : 1,
                            cursor: name === "date" && isDateLocked ? "not-allowed" : "auto",
                        }}
                        onFocus={(e) =>
                            (e.target.style.borderColor = "var(--color-primary)")
                        }
                        onBlur={(e) =>
                            (e.target.style.borderColor = "var(--color-border)")
                        }
                    />
                    {name === "date" && isDateLocked && (
                        <p
                            className="text-xs"
                            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-rajdhani)" }}
                        >
                            Date cannot be changed after creation.
                        </p>
                    )}
                </div>
            ))}

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
                <label
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-orbitron)",
                    }}
                >
                    📝 Notes{" "}
                    <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>
                        (optional)
                    </span>
                </label>
                <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    maxLength={1000}
                    placeholder="What did you study today?"
                    className={inputClass + " resize-none"}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                />
            </div>

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
                {submitting ? "SAVING..." : submitLabel + " →"}
            </button>
        </form>
    );
}