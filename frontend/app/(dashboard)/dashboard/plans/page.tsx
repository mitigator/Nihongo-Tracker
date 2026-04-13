"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useStudyPlans from "@/hooks/useStudyPlans";
import PlanCard from "@/components/plans/PlanCard";

export default function StudyPlansPage() {
    const { plans, loading, fetchPlans } = useStudyPlans();
    const router = useRouter();

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const activePlans = plans.filter((p) => p.currentWeek !== null);
    const otherPlans = plans.filter((p) => p.currentWeek === null);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1
                        className="text-2xl font-black tracking-wider"
                        style={{ color: "var(--color-text)", fontFamily: "var(--font-orbitron)" }}
                    >
                        STUDY PLANS
                    </h1>
                    <p
                        className="text-base font-medium mt-1"
                        style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-rajdhani)" }}
                    >
                        Custom multi-week plans for any JLPT level
                    </p>
                </div>
                <button
                    onClick={() => router.push("/dashboard/plans/new")}
                    className="px-5 py-2.5 rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98]"
                    style={{
                        background: "var(--color-primary)",
                        color: "#000",
                        fontFamily: "var(--font-orbitron)",
                        fontSize: "12px",
                    }}
                >
                    + NEW PLAN
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div
                        className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                        style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }}
                    />
                </div>
            ) : plans.length === 0 ? (
                <div
                    className="rounded-2xl border px-6 py-16 text-center"
                    style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
                >
                    <p className="text-5xl mb-4">📅</p>
                    <p
                        className="text-base font-semibold mb-4"
                        style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-rajdhani)" }}
                    >
                        No plans yet. Create your first study plan!
                    </p>
                    <button
                        onClick={() => router.push("/dashboard/plans/new")}
                        className="px-5 py-2.5 rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98]"
                        style={{
                            background: "var(--color-primary)",
                            color: "#000",
                            fontFamily: "var(--font-orbitron)",
                            fontSize: "12px",
                        }}
                    >
                        CREATE PLAN →
                    </button>
                </div>
            ) : (
                <>
                    {/* Active plans */}
                    {activePlans.length > 0 && (
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-widest mb-4"
                                style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
                            >
                                Active — {activePlans.length} plan{activePlans.length !== 1 ? "s" : ""}
                            </h2>
                            <div className="space-y-3">
                                {activePlans.map((plan) => (
                                    <PlanCard key={plan._id} plan={plan} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    {activePlans.length > 0 && otherPlans.length > 0 && (
                        <div className="border-t" style={{ borderColor: "var(--color-border)" }} />
                    )}

                    {/* Past / future plans */}
                    {otherPlans.length > 0 && (
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-widest mb-4"
                                style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
                            >
                                Other Plans — {otherPlans.length}
                            </h2>
                            <div className="space-y-3">
                                {otherPlans.map((plan) => (
                                    <PlanCard key={plan._id} plan={plan} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}