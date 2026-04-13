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

    const handleDelete = async () => {
        if (!confirm("Delete this plan? This cannot be undone.")) return;
        await deletePlan(plan._id);
    };

    return (
        <div
            className="rounded-2xl border px-5 py-4 transition-all"
            style={{
                background: "var(--color-card)",
                borderColor: isActive ? "var(--color-primary)" : "var(--color-border)",
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--color-primary)")
            }
            onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = isActive
                ? "var(--color-primary)"
                : "var(--color-border)")
            }
        >
            <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Left */}
                <div className="flex-1 min-w-0 space-y-2">
                    {/* Title + level badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <p
                            className="text-sm font-black tracking-wide"
                            style={{ color: "var(--color-text)", fontFamily: "var(--font-orbitron)" }}
                        >
                            {plan.title}
                        </p>
                        <span
                            className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-lg"
                            style={{
                                background: `${levelColor}20`,
                                border: `1px solid ${levelColor}`,
                                color: levelColor,
                                fontFamily: "var(--font-orbitron)",
                            }}
                        >
                            {plan.level}
                        </span>
                        {isActive && (
                            <span
                                className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-lg"
                                style={{
                                    background: "var(--color-primary)20",
                                    border: "1px solid var(--color-primary)",
                                    color: "var(--color-primary)",
                                    fontFamily: "var(--font-orbitron)",
                                }}
                            >
                                ACTIVE · WK {plan.currentWeek}/{totalWeeks}
                            </span>
                        )}
                    </div>

                    {/* Dates */}
                    <p
                        className="text-xs font-semibold"
                        style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-rajdhani)" }}
                    >
                        {plan.startDate} → {plan.endDate}
                        {totalWeeks > 0 && ` · ${totalWeeks} weeks`}
                    </p>

                    {/* Current week targets */}
                    {isActive && plan.currentWeek && plan.weeklyTargets[plan.currentWeek - 1] && (
                        <div
                            className="flex flex-wrap gap-3 text-xs font-semibold"
                            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-rajdhani)" }}
                        >
                            <span>📖 {plan.weeklyTargets[plan.currentWeek - 1].vocabTarget} words</span>
                            <span>🎧 {plan.weeklyTargets[plan.currentWeek - 1].listeningTarget} min</span>
                            <span>✏️ {plan.weeklyTargets[plan.currentWeek - 1].grammarTarget} grammar</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => router.push(`/dashboard/plans/${plan._id}/edit`)}
                        className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all"
                        style={{
                            background: "var(--color-bg)",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-orbitron)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "var(--color-primary)";
                            e.currentTarget.style.color = "var(--color-primary)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--color-border)";
                            e.currentTarget.style.color = "var(--color-text-muted)";
                        }}
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all"
                        style={{
                            background: "var(--color-bg)",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-orbitron)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#ef4444";
                            e.currentTarget.style.color = "#ef4444";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--color-border)";
                            e.currentTarget.style.color = "var(--color-text-muted)";
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}