interface ProgressBarProps {
    label: string;
    icon: string;
    actual: number;
    target: number;
    percent: number;
    unit: string;
}

export default function ProgressBar({
    label,
    icon,
    actual,
    target,
    percent,
    unit,
}: ProgressBarProps) {
    const isComplete = percent >= 100;

    return (
        <div
            className="rounded-2xl border px-5 py-4"
            style={{
                background: "var(--color-card)",
                borderColor: isComplete ? "var(--color-primary)" : "var(--color-border)",
            }}
        >
            {/* Top row */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-orbitron)",
                        }}
                    >
                        {label}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {isComplete && <span className="text-xs">✅</span>}
                    <span
                        className="text-xs font-bold"
                        style={{
                            color: isComplete ? "var(--color-primary)" : "var(--color-text-muted)",
                            fontFamily: "var(--font-orbitron)",
                        }}
                    >
                        {percent}%
                    </span>
                </div>
            </div>

            {/* Bar */}
            <div
                className="w-full h-2 rounded-full overflow-hidden mb-2"
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

            {/* Bottom row */}
            <div className="flex justify-between">
                <span
                    className="text-xs font-semibold"
                    style={{
                        color: "var(--color-text)",
                        fontFamily: "var(--font-rajdhani)",
                    }}
                >
                    {actual} {unit}
                </span>
                <span
                    className="text-xs"
                    style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-rajdhani)",
                    }}
                >
                    goal: {target} {unit}
                </span>
            </div>
        </div>
    );
}