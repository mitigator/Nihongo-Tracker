interface StreakBadgeProps {
    currentStreak: number;
    longestStreak: number;
}

export default function StreakBadge({ currentStreak, longestStreak }: StreakBadgeProps) {
    const flame = currentStreak >= 7 ? "🔥" : currentStreak >= 3 ? "✨" : "📅";

    return (
        <div className="flex flex-wrap gap-3">
            {/* Current streak */}
            <div
                className="flex items-center gap-3 rounded-2xl px-5 py-3 border"
                style={{
                    background: "var(--color-card)",
                    borderColor: "var(--color-border)",
                }}
            >
                <span className="text-2xl">{flame}</span>
                <div>
                    <p
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-orbitron)",
                        }}
                    >
                        Current Streak
                    </p>
                    <p
                        className="text-2xl font-black leading-tight"
                        style={{
                            color: "var(--color-primary)",
                            fontFamily: "var(--font-orbitron)",
                        }}
                    >
                        {currentStreak}
                        <span
                            className="text-sm font-semibold ml-1"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            days
                        </span>
                    </p>
                </div>
            </div>

            {/* Longest streak */}
            <div
                className="flex items-center gap-3 rounded-2xl px-5 py-3 border"
                style={{
                    background: "var(--color-card)",
                    borderColor: "var(--color-border)",
                }}
            >
                <span className="text-2xl">🏆</span>
                <div>
                    <p
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-orbitron)",
                        }}
                    >
                        Longest Streak
                    </p>
                    <p
                        className="text-2xl font-black leading-tight"
                        style={{
                            color: "var(--color-accent)",
                            fontFamily: "var(--font-orbitron)",
                        }}
                    >
                        {longestStreak}
                        <span
                            className="text-sm font-semibold ml-1"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            days
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}