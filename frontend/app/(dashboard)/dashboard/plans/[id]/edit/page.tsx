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
                <div
                    className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                    style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }}
                />
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <p
                    className="text-base font-semibold mb-4"
                    style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-rajdhani)" }}
                >
                    Plan not found.
                </p>
                <button
                    onClick={() => router.push("/dashboard/plans")}
                    className="text-sm font-black uppercase tracking-widest"
                    style={{ color: "var(--color-primary)", fontFamily: "var(--font-orbitron)" }}
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
                    EDIT PLAN
                </h1>
                <p
                    className="text-base font-medium mt-1"
                    style={{ color: "var(--color-primary)", fontFamily: "var(--font-rajdhani)" }}
                >
                    {plan.title}
                </p>
            </div>

            <div
                className="rounded-2xl p-8 border"
                style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
            >
                <StudyPlanForm
                    initialData={{
                        title: plan.title,
                        level: plan.level,
                        startDate: plan.startDate,
                        endDate: plan.endDate,
                        weeklyTargets: plan.weeklyTargets,
                    }}
                    onSubmit={handleSubmit}
                    submitLabel="UPDATE PLAN"
                />
            </div>
        </div>
    );
}