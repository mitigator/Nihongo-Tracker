interface StreakBadgeProps {
    currentStreak: number;
    longestStreak: number;
}

export default function StreakBadge({ currentStreak, longestStreak }: StreakBadgeProps) {
    const flame = currentStreak >= 7 ? "🔥" : currentStreak >= 3 ? "✨" : "📅";

    const cardStyle = { padding: "1.25rem 1.5rem" };

    return (
        <div className="grid grid-cols-2 gap-3 w-full">
            <div className="flex items-center gap-3 lg:gap-4 rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)]" style={cardStyle}>
                <span className="text-2xl lg:text-3xl leading-none shrink-0">{flame}</span>
                <div className="min-w-0">
                    <p className="font-black uppercase tracking-widest text-[0.5rem] lg:text-[0.6rem] text-[var(--color-muted)] font-[var(--font-orbitron)] mb-1">
                        Current Streak
                    </p>
                    <p className="font-black text-2xl lg:text-3xl leading-none text-[var(--color-primary)] font-[var(--font-orbitron)]">
                        {currentStreak}
                        <span className="font-semibold text-xs lg:text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)] ml-1">
                            days
                        </span>
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-4 rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)]" style={cardStyle}>
                <span className="text-2xl lg:text-3xl leading-none shrink-0">🏆</span>
                <div className="min-w-0">
                    <p className="font-black uppercase tracking-widest text-[0.5rem] lg:text-[0.6rem] text-[var(--color-muted)] font-[var(--font-orbitron)] mb-1">
                        Longest Streak
                    </p>
                    <p className="font-black text-2xl lg:text-3xl leading-none text-[var(--color-accent)] font-[var(--font-orbitron)]">
                        {longestStreak}
                        <span className="font-semibold text-xs lg:text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)] ml-1">
                            days
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}