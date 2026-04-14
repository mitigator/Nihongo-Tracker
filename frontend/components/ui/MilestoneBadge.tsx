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
        const next = milestones[milestones.length - 1];
        return (
            <div className="w-full flex items-center gap-2.5 rounded-xl px-5 py-3 border bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-muted)] font-[var(--font-rajdhani)] text-sm lg:text-base font-semibold">
                <span className="text-lg lg:text-xl">{next.emoji}</span>
                <span>{next.days - streak} days until {next.label}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2 w-full">
            {earned.map((m) => (
                <div
                    key={m.days}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 font-black uppercase tracking-widest text-[0.6rem] lg:text-xs font-[var(--font-orbitron)]"
                    style={{
                        background: `${m.color}18`,
                        border: `1px solid ${m.color}60`,
                        color: m.color,
                    }}
                >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                </div>
            ))}
        </div>
    );
}