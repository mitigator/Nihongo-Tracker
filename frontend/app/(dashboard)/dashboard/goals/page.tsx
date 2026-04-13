"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useGoals from "@/hooks/useGoals";
import ProgressBar from "@/components/goals/ProgressBar";

export default function WeeklyGoalsPage() {
    const { currentGoal, goals, loading, fetchCurrentGoal, fetchGoals, deleteGoal } =
        useGoals();
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
        <div className="space-y-8">

            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1
                        className="text-2xl font-black tracking-wider"
                        style={{
                            color: "var(--color-text)",
                            fontFamily: "var(--font-orbitron)",
                        }}
                    >
                        WEEKLY GOALS
                    </h1>
                    <p
                        className="text-base font-medium mt-1"
                        style={{
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-rajdhani)",
                        }}
                    >
                        Targets that give your daily data meaning
                    </p>
                </div>
                <button
                    onClick={() => router.push("/dashboard/goals/new")}
                    className="px-5 py-2.5 rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98]"
                    style={{
                        background: "var(--color-primary)",
                        color: "#000",
                        fontFamily: "var(--font-orbitron)",
                        fontSize: "12px",
                    }}
                >
                    + SET GOALS
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div
                        className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                        style={{
                            borderColor: "var(--color-primary)",
                            borderTopColor: "transparent",
                        }}
                    />
                </div>
            ) : (
                <>
                    {/* Current week */}
                    <div>
                        <h2
                            className="text-xs font-bold uppercase tracking-widest mb-4"
                            style={{
                                color: "var(--color-text-muted)",
                                fontFamily: "var(--font-orbitron)",
                            }}
                        >
                            This Week
                        </h2>

                        {currentGoal ? (
                            <div className="space-y-3">
                                <div
                                    className="text-xs font-semibold mb-4"
                                    style={{
                                        color: "var(--color-text-muted)",
                                        fontFamily: "var(--font-rajdhani)",
                                    }}
                                >
                                    {currentGoal.weekStartDate} → {currentGoal.weekEndDate}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <ProgressBar
                                        label="Vocab"
                                        icon="📖"
                                        actual={currentGoal.actuals.vocab}
                                        target={currentGoal.targets.vocab}
                                        percent={currentGoal.progress.vocab}
                                        unit="words"
                                    />
                                    <ProgressBar
                                        label="Listening"
                                        icon="🎧"
                                        actual={currentGoal.actuals.listening}
                                        target={currentGoal.targets.listening}
                                        percent={currentGoal.progress.listening}
                                        unit="min"
                                    />
                                    <ProgressBar
                                        label="Grammar"
                                        icon="✏️"
                                        actual={currentGoal.actuals.grammar}
                                        target={currentGoal.targets.grammar}
                                        percent={currentGoal.progress.grammar}
                                        unit="points"
                                    />
                                    <ProgressBar
                                        label="Kanji"
                                        icon="🈶"
                                        actual={0}
                                        target={currentGoal.targets.kanji}
                                        percent={0}
                                        unit="kanji"
                                    />
                                </div>

                                {/* Edit current */}
                                <button
                                    onClick={() =>
                                        router.push(`/dashboard/goals/${currentGoal._id}/edit`)
                                    }
                                    className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all mt-2"
                                    style={{
                                        background: "var(--color-bg)",
                                        border: "1px solid var(--color-border)",
                                        color: "var(--color-text-muted)",
                                        fontFamily: "var(--font-orbitron)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = "var(--color-primary)";
                                        e.currentTarget.style.color = "var(--color-primary)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = "var(--color-border)";
                                        e.currentTarget.style.color = "var(--color-text-muted)";
                                    }}
                                >
                                    Edit This Week&apos;s Goals
                                </button>
                            </div>
                        ) : (
                            <div
                                className="rounded-2xl border px-6 py-10 text-center"
                                style={{
                                    background: "var(--color-card)",
                                    borderColor: "var(--color-border)",
                                }}
                            >
                                <p className="text-4xl mb-3">🎯</p>
                                <p
                                    className="text-base font-semibold mb-4"
                                    style={{
                                        color: "var(--color-text-muted)",
                                        fontFamily: "var(--font-rajdhani)",
                                    }}
                                >
                                    No goals set for this week yet.
                                </p>
                                <button
                                    onClick={() => router.push("/dashboard/goals/new")}
                                    className="px-5 py-2.5 rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98]"
                                    style={{
                                        background: "var(--color-primary)",
                                        color: "#000",
                                        fontFamily: "var(--font-orbitron)",
                                        fontSize: "12px",
                                    }}
                                >
                                    SET THIS WEEK&apos;S GOALS →
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="border-t" style={{ borderColor: "var(--color-border)" }} />

                    {/* Past goals */}
                    <div>
                        <h2
                            className="text-xs font-bold uppercase tracking-widest mb-4"
                            style={{
                                color: "var(--color-text-muted)",
                                fontFamily: "var(--font-orbitron)",
                            }}
                        >
                            Past Goals — {goals.length} weeks
                        </h2>

                        {goals.length === 0 ? (
                            <p
                                className="text-sm text-center py-8"
                                style={{
                                    color: "var(--color-text-muted)",
                                    fontFamily: "var(--font-rajdhani)",
                                }}
                            >
                                No past goals yet.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {goals.map((goal) => {
                                    const avgProgress = Math.round(
                                        (goal.progress.vocab +
                                            goal.progress.grammar +
                                            goal.progress.listening) /
                                        3
                                    );
                                    return (
                                        <div
                                            key={goal._id}
                                            className="rounded-2xl border px-5 py-4 flex items-center justify-between gap-4 transition-all"
                                            style={{
                                                background: "var(--color-card)",
                                                borderColor: "var(--color-border)",
                                            }}
                                            onMouseEnter={(e) =>
                                            (e.currentTarget.style.borderColor =
                                                "var(--color-primary)")
                                            }
                                            onMouseLeave={(e) =>
                                            (e.currentTarget.style.borderColor =
                                                "var(--color-border)")
                                            }
                                        >
                                            <div>
                                                <p
                                                    className="text-sm font-black tracking-widest mb-1"
                                                    style={{
                                                        color: "var(--color-primary)",
                                                        fontFamily: "var(--font-orbitron)",
                                                    }}
                                                >
                                                    {goal.weekStartDate} → {goal.weekEndDate}
                                                </p>
                                                <p
                                                    className="text-xs font-semibold"
                                                    style={{
                                                        color: "var(--color-text-muted)",
                                                        fontFamily: "var(--font-rajdhani)",
                                                    }}
                                                >
                                                    Avg progress:{" "}
                                                    <span style={{ color: "var(--color-text)" }}>
                                                        {avgProgress}%
                                                    </span>
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(goal._id)}
                                                className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all"
                                                style={{
                                                    background: "var(--color-bg)",
                                                    border: "1px solid var(--color-border)",
                                                    color: "var(--color-text-muted)",
                                                    fontFamily: "var(--font-orbitron)",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = "#ef4444";
                                                    e.currentTarget.style.color = "#ef4444";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor =
                                                        "var(--color-border)";
                                                    e.currentTarget.style.color =
                                                        "var(--color-text-muted)";
                                                }}
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