"use client";

import { useRouter } from "next/navigation";
import StudyPlanForm from "@/components/plans/StudyPlanForm";
import useStudyPlans from "@/hooks/useStudyPlans";
import { StudyPlanFormData } from "@/types";

export default function NewPlanPage() {
    const { createPlan } = useStudyPlans();
    const router = useRouter();

    const handleSubmit = async (data: StudyPlanFormData): Promise<boolean> => {
        const success = await createPlan(data);
        if (success) router.push("/dashboard/plans");
        return success;
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <button
                onClick={() => router.back()}
                className="text-sm font-bold uppercase tracking-widest transition-all"
                style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
                ← Back
            </button>

            <div>
                <h1
                    className="text-2xl font-black tracking-wider"
                    style={{ color: "var(--color-text)", fontFamily: "var(--font-orbitron)" }}
                >
                    CREATE STUDY PLAN
                </h1>
                <p
                    className="text-base font-medium mt-1"
                    style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-rajdhani)" }}
                >
                    Set your dates — weekly target fields appear automatically.
                </p>
            </div>

            <div
                className="rounded-2xl p-8 border"
                style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
            >
                <StudyPlanForm onSubmit={handleSubmit} submitLabel="CREATE PLAN" />
            </div>
        </div>
    );
}