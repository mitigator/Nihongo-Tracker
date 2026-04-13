import { useRouter } from "next/navigation";
import { WeekSummary, GoalSummary } from "@/types";

interface WeekSummaryCardProps {
    week: WeekSummary;
    goal: GoalSummary;
}

interface RowProps {
    icon: string;
    label: string;
    actual: number;
    unit: string;
    target: number | null;
    percent: number | null;
}

function GoalRow({ icon, label, actual, unit, target, percent }: RowProps) {
    const isComplete = (percent ?? 0) >= 100;

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-orbitron)",
                    }}
                >
                    {icon} {label}
                </span>
                <span
                    className="text-xs font-semibold"
                    style={{
                        color: isComplete ? "var(--color-primary)" : "var(--color-text-muted)",
                        fontFamily: "var(--font-rajdhani)",
                    }}
                >
                    {actual} {unit}
                    {target !== null && ` / ${target}`}
                    {percent !== null && ` (${percent}%)`}
                </span>
            </div>
            {percent !== null && (
                <div
                    className="w-full h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--color-border)" }}
                >
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${percent}%`,
                            background: isComplete
                                ? "var(--color-primary)"
                                : "var(--color-secondary)",
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default function WeekSummaryCard({ week, goal }: WeekSummaryCardProps) {
    const router = useRouter();

    return (
        <div
            className="rounded-2xl border px-6 py-5 space-y-4"
            style={{
                background: "var(--color-card)",
                borderColor: "var(--color-border)",
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-orbitron)",
                        }}
                    >
                        This Week
                    </p>
                    <p
                        className="text-xs mt-0.5"
                        style={{
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-rajdhani)",
                        }}
                    >
                        {week.startDate} → {week.endDate} · {week.daysLogged} days logged
                    </p>
                </div>
                {!goal.exists && (
                    <button
                        onClick={() => router.push("/dashboard/goals/new")}
                        className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all"
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
                        Set Goals →
                    </button>
                )}
            </div>

            {/* Rows */}
            <div className="space-y-3">
                <GoalRow
                    icon="📖"
                    label="Vocab"
                    actual={week.vocabTotal}
                    unit="words"
                    target={goal.targets?.vocab ?? null}
                    percent={goal.progress?.vocab ?? null}
                />
                <GoalRow
                    icon="🎧"
                    label="Listening"
                    actual={week.listeningTotal}
                    unit="min"
                    target={goal.targets?.listening ?? null}
                    percent={goal.progress?.listening ?? null}
                />
                <GoalRow
                    icon="✏️"
                    label="Grammar"
                    actual={week.grammarTotal}
                    unit="points"
                    target={goal.targets?.grammar ?? null}
                    percent={goal.progress?.grammar ?? null}
                />
            </div>
        </div>
    );
}