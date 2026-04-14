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
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

            <button
                onClick={() => router.back()}
                className="self-start font-bold uppercase tracking-widest text-xs lg:text-sm transition-all font-[var(--font-orbitron)] text-[var(--color-muted)] hover:text-[var(--color-primary)]"
            >
                ← Back
            </button>

            <div>
                <h1 className="font-black tracking-wider text-2xl lg:text-3xl text-[var(--color-text)] font-[var(--font-orbitron)]">
                    Create Study Plan
                </h1>
                <p className="font-medium text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)] mt-1">
                    Set your dates — weekly target fields appear automatically.
                </p>
            </div>

            <div className="rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)]" style={{ padding: "2rem" }}>
                <StudyPlanForm onSubmit={handleSubmit} submitLabel="Create Plan" />
            </div>
        </div>
    );
}