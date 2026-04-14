interface ProgressBarProps {
    label: string;
    icon: string;
    actual: number;
    target: number;
    percent: number;
    unit: string;
}

export default function ProgressBar({ label, icon, actual, target, percent, unit }: ProgressBarProps) {
    const isComplete = percent >= 100;
    const clamped = Math.min(percent, 100);

    return (
        <div
            className="rounded-2xl border flex flex-col gap-3 bg-[var(--color-card)]"
            style={{
                borderColor: isComplete ? "var(--color-primary)" : "var(--color-border)",
                padding: "1.25rem",
            }}
        >
            {/* Top row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-lg lg:text-xl leading-none">{icon}</span>
                    <span className="font-bold uppercase tracking-widest text-[0.6rem] lg:text-[0.7rem] text-[var(--color-muted)] font-[var(--font-orbitron)]">
                        {label}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    {isComplete && <span className="text-sm">✅</span>}
                    <span
                        className="font-black text-xs lg:text-sm font-[var(--font-orbitron)]"
                        style={{ color: isComplete ? "var(--color-primary)" : "var(--color-muted)" }}
                    >
                        {percent}%
                    </span>
                </div>
            </div>

            {/* Bar */}
            <div className="w-full h-2 rounded-full overflow-hidden bg-[var(--color-border)]">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                        width: `${clamped}%`,
                        background: isComplete ? "var(--color-primary)" : "var(--color-secondary)",
                    }}
                />
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between">
                <span className="font-semibold text-xs lg:text-sm text-[var(--color-text)] font-[var(--font-rajdhani)]">
                    {actual} {unit}
                </span>
                <span className="text-xs lg:text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                    goal: {target} {unit}
                </span>
            </div>
        </div>
    );
}