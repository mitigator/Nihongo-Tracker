"use client";

import { useRouter, useParams } from "next/navigation";
import useGoals from "@/hooks/useGoals";
import GoalForm from "@/components/goals/GoalForm";
import { GoalFormData } from "@/types";

export default function EditGoalPage() {
    const { id } = useParams<{ id: string }>();
    const { goals, upsertGoal } = useGoals();
    const router = useRouter();

    const goal = goals.find((g) => g._id === id);

    if (!goal) {
        return (
            <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <p
                    className="text-base font-semibold mb-4"
                    style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-rajdhani)",
                    }}
                >
                    Goal not found.
                </p>
                <button
                    onClick={() => router.push("/dashboard/goals")}
                    className="text-sm font-black uppercase tracking-widest"
                    style={{
                        color: "var(--color-primary)",
                        fontFamily: "var(--font-orbitron)",
                    }}
                >
                    ← Back to Goals
                </button>
            </div>
        );
    }

    const handleSubmit = async (data: GoalFormData): Promise<boolean> => {
        const success = await upsertGoal({ ...data, weekStartDate: goal.weekStartDate });
        if (success) router.push("/dashboard/goals");
        return success;
    };

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <button
                onClick={() => router.back()}
                className="text-sm font-bold uppercase tracking-widest transition-all"
                style={{
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-orbitron)",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-primary)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-text-muted)")
                }
            >
                ← Back
            </button>

            <div>
                <h1
                    className="text-2xl font-black tracking-wider"
                    style={{
                        color: "var(--color-text)",
                        fontFamily: "var(--font-orbitron)",
                    }}
                >
                    EDIT GOALS
                </h1>
                <p
                    className="text-base font-medium mt-1"
                    style={{
                        color: "var(--color-primary)",
                        fontFamily: "var(--font-rajdhani)",
                    }}
                >
                    {goal.weekStartDate} → {goal.weekEndDate}
                </p>
            </div>

            <div
                className="rounded-2xl p-8 border"
                style={{
                    background: "var(--color-card)",
                    borderColor: "var(--color-border)",
                }}
            >
                <GoalForm
                    initialData={{
                        vocabTarget: goal.targets.vocab,
                        kanjiTarget: goal.targets.kanji,
                        grammarTarget: goal.targets.grammar,
                        listeningTarget: goal.targets.listening,
                    }}
                    onSubmit={handleSubmit}
                    submitLabel="UPDATE GOALS"
                    weekStartDate={goal.weekStartDate}
                />
            </div>
        </div>
    );
}