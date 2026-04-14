"use client";

import { useRouter } from "next/navigation";
import { StudyPlan } from "@/types";
import useStudyPlans from "@/hooks/useStudyPlans";

interface PlanCardProps {
    plan: StudyPlan;
}

const levelColors: Record<string, string> = {
    N5: "#22c55e",
    N4: "#3b82f6",
    N3: "#f59e0b",
    N2: "#f97316",
    N1: "#ef4444",
    custom: "var(--color-primary)",
};

export default function PlanCard({ plan }: PlanCardProps) {
    const { deletePlan } = useStudyPlans();
    const router = useRouter();

    const isActive = plan.currentWeek !== null;
    const totalWeeks = plan.weeklyTargets.length;
    const levelColor = levelColors[plan.level] ?? "var(--color-primary)";
    const currentTargets = isActive && plan.currentWeek
        ? plan.weeklyTargets[plan.currentWeek - 1]
        : null;

    const handleDelete = async () => {
        if (!confirm("Delete this plan? This cannot be undone.")) return;
        await deletePlan(plan._id);
    };

    return (
        <div
            className="rounded-2xl border transition-all bg-[var(--color-card)] hover:border-[var(--color-primary)]"
            style={{
                borderColor: isActive ? "var(--color-primary)" : "var(--color-border)",
                padding: "1.25rem 1.5rem",
            }}
        >
            <div className="flex items-start justify-between gap-4 flex-wrap">

                {/* Left */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">

                    {/* Title + badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-black tracking-wide text-sm lg:text-base text-[var(--color-text)] font-[var(--font-orbitron)]">
                            {plan.title}
                        </p>
                        <span
                            className="font-black uppercase tracking-widest text-[0.55rem] lg:text-[0.65rem] px-2 py-0.5 rounded-lg font-[var(--font-orbitron)]"
                            style={{
                                background: `color-mix(in srgb, ${levelColor} 15%, transparent)`,
                                border: `1px solid ${levelColor}`,
                                color: levelColor,
                            }}
                        >
                            {plan.level}
                        </span>
                        {isActive && (
                            <span className="font-black uppercase tracking-widest text-[0.55rem] lg:text-[0.65rem] px-2 py-0.5 rounded-lg font-[var(--font-orbitron)] bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] border border-[var(--color-primary)] text-[var(--color-primary)]">
                                Active · Wk {plan.currentWeek}/{totalWeeks}
                            </span>
                        )}
                    </div>

                    {/* Dates */}
                    <p className="font-semibold text-xs lg:text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                        {plan.startDate} → {plan.endDate}
                        {totalWeeks > 0 && ` · ${totalWeeks} weeks`}
                    </p>

                    {/* Current week targets */}
                    {currentTargets && (
                        <div className="flex flex-wrap gap-3 font-semibold text-xs lg:text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                            <span>📖 {currentTargets.vocabTarget} words</span>
                            <span>🎧 {currentTargets.listeningTarget} min</span>
                            <span>✏️ {currentTargets.grammarTarget} grammar</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => router.push(`/dashboard/plans/${plan._id}/edit`)}
                        className="font-bold uppercase tracking-widest rounded-lg transition-all text-[0.6rem] lg:text-xs px-3 py-1.5 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="font-bold uppercase tracking-widest rounded-lg transition-all text-[0.6rem] lg:text-xs px-3 py-1.5 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-red-500 hover:text-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}