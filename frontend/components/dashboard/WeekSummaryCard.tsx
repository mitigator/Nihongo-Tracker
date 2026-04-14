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
    const clamped = Math.min(percent ?? 0, 100);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
                <span className="font-bold uppercase tracking-widest text-[0.6rem] lg:text-[0.7rem] text-[var(--color-muted)] font-[var(--font-orbitron)]">
                    {icon} {label}
                </span>
                <span
                    className="font-semibold text-xs lg:text-sm font-[var(--font-rajdhani)] shrink-0"
                    style={{ color: isComplete ? "var(--color-primary)" : "var(--color-muted)" }}
                >
                    {actual} {unit}{target !== null && ` / ${target}`}{percent !== null && ` · ${percent}%`}
                </span>
            </div>
            {percent !== null && (
                <div className="w-full h-2 rounded-full overflow-hidden bg-[var(--color-border)]">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${clamped}%`,
                            background: isComplete ? "var(--color-primary)" : "var(--color-secondary)",
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
        <div className="rounded-2xl border w-full bg-[var(--color-card)] border-[var(--color-border)]" style={{ padding: "1.5rem" }}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                <div>
                    <p className="font-black uppercase tracking-widest text-[0.6rem] lg:text-[0.7rem] text-[var(--color-muted)] font-[var(--font-orbitron)] mb-1">
                        This Week
                    </p>
                    <p className="text-xs lg:text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                        {week.startDate} → {week.endDate} · {week.daysLogged} days logged
                    </p>
                </div>
                {!goal.exists && (
                    <button
                        onClick={() => router.push("/dashboard/goals/new")}
                        className="w-full sm:w-auto shrink-0 font-black uppercase tracking-widest rounded-xl transition-all text-[0.6rem] lg:text-xs px-4 py-2.5 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-center"
                    >
                        Set Goals →
                    </button>
                )}
            </div>
            <div className="flex flex-col gap-5">
                <GoalRow icon="📖" label="Vocab" actual={week.vocabTotal} unit="words" target={goal.targets?.vocab ?? null} percent={goal.progress?.vocab ?? null} />
                <GoalRow icon="🎧" label="Listening" actual={week.listeningTotal} unit="min" target={goal.targets?.listening ?? null} percent={goal.progress?.listening ?? null} />
                <GoalRow icon="✏️" label="Grammar" actual={week.grammarTotal} unit="points" target={goal.targets?.grammar ?? null} percent={goal.progress?.grammar ?? null} />
            </div>
        </div>
    );
}