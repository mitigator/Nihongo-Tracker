"use client";

import { useRouter } from "next/navigation";
import GoalForm from "@/components/goals/GoalForm";
import useGoals from "@/hooks/useGoals";
import { GoalFormData } from "@/types";

export default function NewGoalPage() {
    const { upsertGoal } = useGoals();
    const router = useRouter();

    const handleSubmit = async (data: GoalFormData): Promise<boolean> => {
        const success = await upsertGoal(data);
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
                    Set Weekly Goals
                </h1>
                <p className="font-medium text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)] mt-1">
                    Defaults to the current week. Saving again updates existing goals.
                </p>
            </div>

            <div className="rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)]" style={{ padding: "2rem" }}>
                <GoalForm onSubmit={handleSubmit} submitLabel="Save Goals" />
            </div>
        </div>
    );
}