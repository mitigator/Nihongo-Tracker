"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useGoals from "@/hooks/useGoals";
import ProgressBar from "@/components/goals/ProgressBar";

export default function WeeklyGoalsPage() {
    const { currentGoal, goals, loading, fetchCurrentGoal, fetchGoals, deleteGoal } = useGoals();
    const router = useRouter();

    useEffect(() => {
        fetchCurrentGoal();
        fetchGoals();
    }, [fetchCurrentGoal, fetchGoals]);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this goal?")) return;
        await deleteGoal(id);
    };

    return (
        <div className="flex flex-col gap-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="font-black tracking-wider text-2xl lg:text-3xl text-[var(--color-text)] font-[var(--font-orbitron)]">
                        Weekly Goals
                    </h1>
                    <p className="font-medium text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)] mt-1">
                        Targets that give your daily data meaning
                    </p>
                </div>
                <button
                    onClick={() => router.push("/dashboard/goals/new")}
                    className="w-full sm:w-auto font-black tracking-widest uppercase rounded-xl transition-all active:scale-[0.98] text-xs lg:text-sm px-5 py-2.5 font-[var(--font-orbitron)] bg-[var(--color-primary)] text-black hover:opacity-90 text-center"
                >
                    + Set Goals
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 rounded-full border-[3px] animate-spin border-[var(--color-border)] border-t-[var(--color-primary)]" />
                </div>
            ) : (
                <>
                    {/* Current week */}
                    <div className="flex flex-col gap-4">
                        <h2 className="font-bold uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)]">
                            This Week
                        </h2>

                        {currentGoal ? (
                            <div className="flex flex-col gap-4">
                                <p className="text-xs lg:text-sm font-semibold text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                                    {currentGoal.weekStartDate} → {currentGoal.weekEndDate}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <ProgressBar label="Vocab" icon="📖" actual={currentGoal.actuals.vocab} target={currentGoal.targets.vocab} percent={currentGoal.progress.vocab} unit="words" />
                                    <ProgressBar label="Listening" icon="🎧" actual={currentGoal.actuals.listening} target={currentGoal.targets.listening} percent={currentGoal.progress.listening} unit="min" />
                                    <ProgressBar label="Grammar" icon="✏️" actual={currentGoal.actuals.grammar} target={currentGoal.targets.grammar} percent={currentGoal.progress.grammar} unit="points" />
                                    <ProgressBar label="Kanji" icon="🈶" actual={0} target={currentGoal.targets.kanji} percent={0} unit="kanji" />
                                </div>

                                <button
                                    onClick={() => router.push(`/dashboard/goals/${currentGoal._id}/edit`)}
                                    className="self-start font-black uppercase tracking-widest rounded-xl transition-all text-[0.65rem] lg:text-xs px-4 py-2 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                                >
                                    Edit This Week&apos;s Goals
                                </button>
                            </div>
                        ) : (
                            <div className="rounded-2xl border px-6 py-12 text-center bg-[var(--color-card)] border-[var(--color-border)]">
                                <p className="text-4xl mb-3">🎯</p>
                                <p className="font-semibold text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)] mb-5">
                                    No goals set for this week yet.
                                </p>
                                <button
                                    onClick={() => router.push("/dashboard/goals/new")}
                                    className="font-black tracking-widest uppercase rounded-xl transition-all active:scale-[0.98] text-xs lg:text-sm px-5 py-2.5 font-[var(--font-orbitron)] bg-[var(--color-primary)] text-black hover:opacity-90"
                                >
                                    Set This Week&apos;s Goals →
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-[var(--color-border)]" />

                    {/* Past goals */}
                    <div className="flex flex-col gap-4">
                        <h2 className="font-bold uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)]">
                            Past Goals — {goals.length} weeks
                        </h2>

                        {goals.length === 0 ? (
                            <p className="text-sm lg:text-base text-center py-8 text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                                No past goals yet.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {goals.map((goal) => {
                                    const avgProgress = Math.round(
                                        (goal.progress.vocab + goal.progress.grammar + goal.progress.listening) / 3
                                    );
                                    return (
                                        <div
                                            key={goal._id}
                                            className="rounded-2xl border flex items-center justify-between gap-4 transition-all bg-[var(--color-card)] border-[var(--color-border)] hover:border-[var(--color-primary)]"
                                            style={{ padding: "1rem 1.25rem" }}
                                        >
                                            <div>
                                                <p className="font-black tracking-widest text-xs lg:text-sm text-[var(--color-primary)] font-[var(--font-orbitron)] mb-1">
                                                    {goal.weekStartDate} → {goal.weekEndDate}
                                                </p>
                                                <p className="text-xs lg:text-sm font-semibold text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                                                    Avg progress:{" "}
                                                    <span className="text-[var(--color-text)]">{avgProgress}%</span>
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(goal._id)}
                                                className="shrink-0 font-bold uppercase tracking-widest rounded-lg transition-all text-[0.6rem] lg:text-xs px-3 py-1.5 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-red-500 hover:text-red-500"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}