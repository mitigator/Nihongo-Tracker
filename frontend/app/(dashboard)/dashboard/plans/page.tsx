"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useStudyPlans from "@/hooks/useStudyPlans";
import PlanCard from "@/components/plans/PlanCard";

export default function StudyPlansPage() {
    const { plans, loading, fetchPlans } = useStudyPlans();
    const router = useRouter();

    useEffect(() => { fetchPlans(); }, [fetchPlans]);

    const activePlans = plans.filter((p) => p.currentWeek !== null);
    const otherPlans = plans.filter((p) => p.currentWeek === null);

    return (
        <div className="flex flex-col gap-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="font-black tracking-wider text-2xl lg:text-3xl text-[var(--color-text)] font-[var(--font-orbitron)]">
                        Study Plans
                    </h1>
                    <p className="font-medium text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)] mt-1">
                        Custom multi-week plans for any JLPT level
                    </p>
                </div>
                <button
                    onClick={() => router.push("/dashboard/plans/new")}
                    className="w-full sm:w-auto font-black tracking-widest uppercase rounded-xl transition-all active:scale-[0.98] text-xs lg:text-sm px-5 py-2.5 font-[var(--font-orbitron)] bg-[var(--color-primary)] text-black hover:opacity-90 text-center"
                >
                    + New Plan
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 rounded-full border-[3px] animate-spin border-[var(--color-border)] border-t-[var(--color-primary)]" />
                </div>
            ) : plans.length === 0 ? (
                <div className="rounded-2xl border px-6 py-16 text-center bg-[var(--color-card)] border-[var(--color-border)]">
                    <p className="text-5xl mb-4">📅</p>
                    <p className="font-semibold text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)] mb-5">
                        No plans yet. Create your first study plan!
                    </p>
                    <button
                        onClick={() => router.push("/dashboard/plans/new")}
                        className="font-black tracking-widest uppercase rounded-xl transition-all active:scale-[0.98] text-xs lg:text-sm px-5 py-2.5 font-[var(--font-orbitron)] bg-[var(--color-primary)] text-black hover:opacity-90"
                    >
                        Create Plan →
                    </button>
                </div>
            ) : (
                <>
                    {activePlans.length > 0 && (
                        <div className="flex flex-col gap-4">
                            <h2 className="font-bold uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)]">
                                Active — {activePlans.length} plan{activePlans.length !== 1 ? "s" : ""}
                            </h2>
                            <div className="flex flex-col gap-3">
                                {activePlans.map((plan) => <PlanCard key={plan._id} plan={plan} />)}
                            </div>
                        </div>
                    )}

                    {activePlans.length > 0 && otherPlans.length > 0 && (
                        <div className="border-t border-[var(--color-border)]" />
                    )}

                    {otherPlans.length > 0 && (
                        <div className="flex flex-col gap-4">
                            <h2 className="font-bold uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)]">
                                Other Plans — {otherPlans.length}
                            </h2>
                            <div className="flex flex-col gap-3">
                                {otherPlans.map((plan) => <PlanCard key={plan._id} plan={plan} />)}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}