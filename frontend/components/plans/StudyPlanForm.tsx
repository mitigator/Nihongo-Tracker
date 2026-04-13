"use client";

import { useState, useEffect } from "react";
import { StudyPlanFormData, WeekTarget, PlanLevel } from "@/types";

interface StudyPlanFormProps {
    initialData?: Partial<StudyPlanFormData>;
    onSubmit: (data: StudyPlanFormData) => Promise<boolean>;
    submitLabel?: string;
}

const LEVELS: PlanLevel[] = ["N5", "N4", "N3", "N2", "N1", "custom"];

const defaultForm: StudyPlanFormData = {
    title: "",
    level: "custom",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
    weeklyTargets: [],
};

const emptyWeek = (week: number): WeekTarget => ({
    week,
    vocabTarget: 0,
    kanjiTarget: 0,
    grammarTarget: 0,
    listeningTarget: 0,
    notes: "",
});

const inputClass =
    "w-full px-4 py-3 rounded-xl text-base font-medium outline-none transition-all";

const inputStyle = {
    background: "var(--color-bg)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
    fontFamily: "var(--font-rajdhani)",
};

// Calculate number of weeks between two dates
const calcWeeks = (start: string, end: string): number => {
    if (!start || !end || end <= start) return 0;
    const s = new Date(start + "T00:00:00Z");
    const e = new Date(end + "T00:00:00Z");
    return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24 * 7));
};

export default function StudyPlanForm({
    initialData,
    onSubmit,
    submitLabel = "CREATE PLAN",
}: StudyPlanFormProps) {
    const [form, setForm] = useState<StudyPlanFormData>({
        ...defaultForm,
        ...initialData,
    });
    const [submitting, setSubmitting] = useState(false);

    // Auto-resize weeklyTargets when dates change
    useEffect(() => {
        const weeks = calcWeeks(form.startDate, form.endDate);
        if (weeks <= 0) return;

        setForm((prev) => {
            const existing = prev.weeklyTargets;
            const updated: WeekTarget[] = Array.from({ length: weeks }, (_, i) => {
                return existing[i] ?? emptyWeek(i + 1);
            });
            return { ...prev, weeklyTargets: updated };
        });
    }, [form.startDate, form.endDate]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleWeekChange = (
        weekIndex: number,
        field: keyof WeekTarget,
        value: string
    ) => {
        setForm((prev) => {
            const updated = [...prev.weeklyTargets];
            updated[weekIndex] = {
                ...updated[weekIndex],
                [field]: field === "notes" ? value : Number(value),
            };
            return { ...prev, weeklyTargets: updated };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await onSubmit(form);
        setSubmitting(false);
    };

    const weeks = calcWeeks(form.startDate, form.endDate);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
                <label
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
                >
                    📋 Plan Title
                </label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. JLPT N5 — 8 Week Grind"
                    className={inputClass}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                />
            </div>

            {/* Level */}
            <div className="flex flex-col gap-1.5">
                <label
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
                >
                    🎯 JLPT Level
                </label>
                <select
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
                >
                    {LEVELS.map((l) => (
                        <option key={l} value={l}>
                            {l.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
                    >
                        📅 Start Date
                    </label>
                    <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
                    >
                        🏁 End Date
                    </label>
                    <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                    />
                </div>
            </div>

            {/* Week count indicator */}
            {weeks > 0 && (
                <div
                    className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl text-center"
                    style={{
                        background: "var(--color-primary)20",
                        border: "1px solid var(--color-primary)",
                        color: "var(--color-primary)",
                        fontFamily: "var(--font-orbitron)",
                    }}
                >
                    {weeks} week{weeks !== 1 ? "s" : ""} detected — fill targets below
                </div>
            )}

            {/* Weekly targets */}
            {form.weeklyTargets.length > 0 && (
                <div className="space-y-4">
                    <h3
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
                    >
                        Weekly Targets
                    </h3>

                    {form.weeklyTargets.map((wt, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border p-4 space-y-3"
                            style={{
                                background: "var(--color-bg)",
                                borderColor: "var(--color-border)",
                            }}
                        >
                            <p
                                className="text-xs font-black uppercase tracking-widest"
                                style={{ color: "var(--color-primary)", fontFamily: "var(--font-orbitron)" }}
                            >
                                Week {wt.week}
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { field: "vocabTarget", label: "Vocab", icon: "📖" },
                                    { field: "kanjiTarget", label: "Kanji", icon: "🈶" },
                                    { field: "grammarTarget", label: "Grammar", icon: "✏️" },
                                    { field: "listeningTarget", label: "Listening", icon: "🎧" },
                                ].map(({ field, label, icon }) => (
                                    <div key={field} className="flex flex-col gap-1">
                                        <label
                                            className="text-xs font-bold uppercase tracking-widest"
                                            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)", fontSize: "9px" }}
                                        >
                                            {icon} {label}
                                        </label>
                                        <input
                                            type="number"
                                            value={wt[field as keyof WeekTarget] as number}
                                            onChange={(e) => handleWeekChange(i, field as keyof WeekTarget, e.target.value)}
                                            min={0}
                                            className="w-full px-3 py-2 rounded-lg text-sm font-medium outline-none transition-all"
                                            style={inputStyle}
                                            onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                                            onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                                        />
                                    </div>
                                ))}
                            </div>

                            <input
                                type="text"
                                value={wt.notes}
                                onChange={(e) => handleWeekChange(i, "notes", e.target.value)}
                                placeholder="Week notes (optional)"
                                className="w-full px-3 py-2 rounded-lg text-sm font-medium outline-none transition-all"
                                style={inputStyle}
                                onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                            />
                        </div>
                    ))}
                </div>
            )}

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
                {submitting ? "SAVING..." : `${submitLabel} →`}
            </button>
        </form>
    );
}