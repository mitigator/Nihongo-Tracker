interface MilestoneBadgeProps {
    streak: number;
}

const milestones = [
    { days: 60, label: "60 Day Legend", emoji: "🔥", color: "#ef4444" },
    { days: 30, label: "30 Day Master", emoji: "⚡", color: "#f59e0b" },
    { days: 7, label: "7 Day Warrior", emoji: "✨", color: "#22c55e" },
];

export default function MilestoneBadge({ streak }: MilestoneBadgeProps) {
    const earned = milestones.filter((m) => streak >= m.days);

    if (earned.length === 0) {
        // Show next milestone progress
        const next = milestones[milestones.length - 1]; // 7 days is closest
        return (
            <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold"
                style={{
                    background: "var(--color-card)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-rajdhani)",
                }}
            >
                <span>{next.emoji}</span>
                <span>{next.days - streak} days to {next.label}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            {earned.map((m) => (
                <div
                    key={m.days}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black uppercase tracking-widest"
                    style={{
                        background: `${m.color}15`,
                        borderColor: m.color,
                        color: m.color,
                        fontFamily: "var(--font-orbitron)",
                    }}
                >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                </div>
            ))}
        </div>
    );
}