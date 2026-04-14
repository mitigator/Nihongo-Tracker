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
                <p className="font-semibold text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)] mb-4">
                    Goal not found.
                </p>
                <button
                    onClick={() => router.push("/dashboard/goals")}
                    className="font-black uppercase tracking-widest text-xs lg:text-sm font-[var(--font-orbitron)] text-[var(--color-primary)] hover:opacity-80 transition-all"
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
        <div className="max-w-lg mx-auto flex flex-col gap-6">

            <button
                onClick={() => router.back()}
                className="self-start font-bold uppercase tracking-widest text-xs lg:text-sm transition-all font-[var(--font-orbitron)] text-[var(--color-muted)] hover:text-[var(--color-primary)]"
            >
                ← Back
            </button>

            <div>
                <h1 className="font-black tracking-wider text-2xl lg:text-3xl text-[var(--color-text)] font-[var(--font-orbitron)]">
                    Edit Goals
                </h1>
                <p className="font-medium text-sm lg:text-base text-[var(--color-primary)] font-[var(--font-rajdhani)] mt-1">
                    {goal.weekStartDate} → {goal.weekEndDate}
                </p>
            </div>

            <div className="rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)]" style={{ padding: "2rem" }}>
                <GoalForm
                    initialData={{
                        vocabTarget: goal.targets.vocab,
                        kanjiTarget: goal.targets.kanji,
                        grammarTarget: goal.targets.grammar,
                        listeningTarget: goal.targets.listening,
                    }}
                    onSubmit={handleSubmit}
                    submitLabel="Update Goals"
                    weekStartDate={goal.weekStartDate}
                />
            </div>
        </div>
    );
}