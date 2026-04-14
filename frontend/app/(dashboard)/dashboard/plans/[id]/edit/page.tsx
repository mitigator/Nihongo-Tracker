"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import useStudyPlans from "@/hooks/useStudyPlans";
import StudyPlanForm from "@/components/plans/StudyPlanForm";
import { StudyPlan, StudyPlanFormData } from "@/types";

export default function EditPlanPage() {
    const { id } = useParams<{ id: string }>();
    const { fetchPlanById, updatePlan } = useStudyPlans();
    const router = useRouter();
    const [plan, setPlan] = useState<StudyPlan | null>(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchPlanById(id).then((data) => {
            setPlan(data);
            setFetching(false);
        });
    }, [id, fetchPlanById]);

    if (fetching) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 rounded-full border-[3px] animate-spin border-[var(--color-border)] border-t-[var(--color-primary)]" />
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <p className="font-semibold text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)] mb-4">
                    Plan not found.
                </p>
                <button
                    onClick={() => router.push("/dashboard/plans")}
                    className="font-black uppercase tracking-widest text-xs lg:text-sm font-[var(--font-orbitron)] text-[var(--color-primary)] hover:opacity-80 transition-all"
                >
                    ← Back to Plans
                </button>
            </div>
        );
    }

    const handleSubmit = async (data: StudyPlanFormData): Promise<boolean> => {
        const success = await updatePlan(id, data);
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
                    Edit Plan
                </h1>
                <p className="font-medium text-sm lg:text-base text-[var(--color-primary)] font-[var(--font-rajdhani)] mt-1">
                    {plan.title}
                </p>
            </div>

            <div className="rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)]" style={{ padding: "2rem" }}>
                <StudyPlanForm
                    initialData={{
                        title: plan.title,
                        level: plan.level,
                        startDate: plan.startDate,
                        endDate: plan.endDate,
                        weeklyTargets: plan.weeklyTargets,
                    }}
                    onSubmit={handleSubmit}
                    submitLabel="Update Plan"
                />
            </div>
        </div>
    );
}