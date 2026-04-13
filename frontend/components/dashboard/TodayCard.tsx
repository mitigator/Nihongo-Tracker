import { TodaySummary } from "@/types";

interface TodayCardProps {
    today: TodaySummary;
    onLog: () => void;
}

export default function TodayCard({ today, onLog }: TodayCardProps) {
    return (
        <div
            className="rounded-2xl border px-6 py-5"
            style={{
                background: "var(--color-card)",
                borderColor: today.logged ? "var(--color-primary)" : "var(--color-border)",
            }}
        >
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <p
                        className="text-xs font-bold uppercase tracking-widest mb-1"
                        style={{
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-orbitron)",
                        }}
                    >
                        Today
                    </p>

                    {today.logged ? (
                        <div className="space-y-2">
                            <p
                                className="text-sm font-black tracking-wide"
                                style={{
                                    color: "var(--color-primary)",
                                    fontFamily: "var(--font-orbitron)",
                                }}
                            >
                                ✅ Logged
                            </p>
                            <div
                                className="flex flex-wrap gap-4 text-sm font-semibold"
                                style={{
                                    color: "var(--color-text)",
                                    fontFamily: "var(--font-rajdhani)",
                                }}
                            >
                                <span>📖 {today.vocabCount} words</span>
                                <span>🎧 {today.listeningMinutes} min</span>
                                <span>✏️ {today.grammarCount} grammar</span>
                            </div>
                            {today.notes && (
                                <p
                                    className="text-xs"
                                    style={{
                                        color: "var(--color-text-muted)",
                                        fontFamily: "var(--font-rajdhani)",
                                    }}
                                >
                                    {today.notes}
                                </p>
                            )}
                        </div>
                    ) : (
                        <p
                            className="text-sm font-semibold"
                            style={{
                                color: "var(--color-text-muted)",
                                fontFamily: "var(--font-rajdhani)",
                            }}
                        >
                            No entry yet — don&apos;t break the streak!
                        </p>
                    )}
                </div>

                {!today.logged && (
                    <button
                        onClick={onLog}
                        className="px-5 py-2.5 rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98] shrink-0"
                        style={{
                            background: "var(--color-primary)",
                            color: "#000",
                            fontFamily: "var(--font-orbitron)",
                            fontSize: "12px",
                        }}
                    >
                        + LOG TODAY
                    </button>
                )}
            </div>
        </div>
    );
}