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
                    SET WEEKLY GOALS
                </h1>
                <p
                    className="text-base font-medium mt-1"
                    style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-rajdhani)",
                    }}
                >
                    Defaults to the current week. Saving again updates existing goals.
                </p>
            </div>

            <div
                className="rounded-2xl p-8 border"
                style={{
                    background: "var(--color-card)",
                    borderColor: "var(--color-border)",
                }}
            >
                <GoalForm onSubmit={handleSubmit} submitLabel="SAVE GOALS" />
            </div>
        </div>
    );
}