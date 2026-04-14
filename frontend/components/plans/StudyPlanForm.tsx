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

const calcWeeks = (start: string, end: string): number => {
    if (!start || !end || end <= start) return 0;
    const s = new Date(start + "T00:00:00Z");
    const e = new Date(end + "T00:00:00Z");
    return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24 * 7));
};

const inputClass = "w-full rounded-xl text-sm lg:text-base font-medium outline-none transition-all font-[var(--font-rajdhani)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-primary)]";
const inputPadding = { padding: "0.75rem 1rem" };
const labelClass = "font-black uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)]";

export default function StudyPlanForm({ initialData, onSubmit, submitLabel = "Create Plan" }: StudyPlanFormProps) {
    const [form, setForm] = useState<StudyPlanFormData>({ ...defaultForm, ...initialData });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const weeks = calcWeeks(form.startDate, form.endDate);
        if (weeks <= 0) return;
        setForm((prev) => {
            const existing = prev.weeklyTargets;
            const updated: WeekTarget[] = Array.from({ length: weeks }, (_, i) => existing[i] ?? emptyWeek(i + 1));
            return { ...prev, weeklyTargets: updated };
        });
    }, [form.startDate, form.endDate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleWeekChange = (weekIndex: number, field: keyof WeekTarget, value: string) => {
        setForm((prev) => {
            const updated = [...prev.weeklyTargets];
            updated[weekIndex] = { ...updated[weekIndex], [field]: field === "notes" ? value : Number(value) };
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Title */}
            <div className="flex flex-col gap-2">
                <label className={labelClass}>📋 Plan Title</label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. JLPT N5 — 8 Week Grind"
                    className={inputClass}
                    style={inputPadding}
                />
            </div>

            {/* Level */}
            <div className="flex flex-col gap-2">
                <label className={labelClass}>🎯 JLPT Level</label>
                <select
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ ...inputPadding, appearance: "auto" }}
                >
                    {LEVELS.map((l) => (
                        <option key={l} value={l}>{l.toUpperCase()}</option>
                    ))}
                </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className={labelClass}>📅 Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        style={inputPadding}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className={labelClass}>🏁 End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        style={inputPadding}
                    />
                </div>
            </div>

            {/* Week count indicator */}
            {weeks > 0 && (
                <div
                    className="font-bold uppercase tracking-widest text-[0.65rem] lg:text-xs text-center rounded-xl font-[var(--font-orbitron)] text-[var(--color-primary)] border border-[var(--color-primary)]"
                    style={{
                        padding: "0.625rem 1rem",
                        background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                    }}
                >
                    {weeks} week{weeks !== 1 ? "s" : ""} detected — fill targets below
                </div>
            )}

            {/* Weekly targets */}
            {form.weeklyTargets.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h3 className={labelClass}>Weekly Targets</h3>

                    {form.weeklyTargets.map((wt, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border flex flex-col gap-3 bg-[var(--color-bg)] border-[var(--color-border)]"
                            style={{ padding: "1rem 1.25rem" }}
                        >
                            <p className="font-black uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-primary)] font-[var(--font-orbitron)]">
                                Week {wt.week}
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { field: "vocabTarget", label: "Vocab", icon: "📖" },
                                    { field: "kanjiTarget", label: "Kanji", icon: "🈶" },
                                    { field: "grammarTarget", label: "Grammar", icon: "✏️" },
                                    { field: "listeningTarget", label: "Listening", icon: "🎧" },
                                ].map(({ field, label, icon }) => (
                                    <div key={field} className="flex flex-col gap-1.5">
                                        <label className="font-black uppercase tracking-widest text-[0.5rem] lg:text-[0.6rem] text-[var(--color-muted)] font-[var(--font-orbitron)]">
                                            {icon} {label}
                                        </label>
                                        <input
                                            type="number"
                                            value={wt[field as keyof WeekTarget] as number}
                                            onChange={(e) => handleWeekChange(i, field as keyof WeekTarget, e.target.value)}
                                            min={0}
                                            className="w-full rounded-lg text-sm font-medium outline-none transition-all font-[var(--font-rajdhani)] bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-primary)]"
                                            style={{ padding: "0.5rem 0.75rem" }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <input
                                type="text"
                                value={wt.notes}
                                onChange={(e) => handleWeekChange(i, "notes", e.target.value)}
                                placeholder="Week notes (optional)"
                                className="w-full rounded-lg text-sm font-medium outline-none transition-all font-[var(--font-rajdhani)] bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-primary)]"
                                style={{ padding: "0.5rem 0.75rem" }}
                            />
                        </div>
                    ))}
                </div>
            )}

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