import { TodaySummary } from "@/types";

interface TodayCardProps {
    today: TodaySummary;
    onLog: () => void;
}

export default function TodayCard({ today, onLog }: TodayCardProps) {
    return (
        <div
            className="rounded-2xl border w-full"
            style={{
                background: "var(--color-card)",
                borderColor: today.logged ? "var(--color-primary)" : "var(--color-border)",
                padding: "1.5rem",
            }}
        >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="font-black uppercase tracking-widest text-[0.6rem] lg:text-[0.7rem] text-[var(--color-muted)] font-[var(--font-orbitron)] mb-3">
                        Today
                    </p>
                    {today.logged ? (
                        <div className="flex flex-col gap-3">
                            <p className="font-black tracking-wide text-sm lg:text-base text-[var(--color-primary)] font-[var(--font-orbitron)]">
                                ✅ Logged
                            </p>
                            <div className="flex flex-wrap gap-4 font-semibold text-sm lg:text-base text-[var(--color-text)] font-[var(--font-rajdhani)]">
                                <span>📖 {today.vocabCount} words</span>
                                <span>🎧 {today.listeningMinutes} min</span>
                                <span>✏️ {today.grammarCount} grammar</span>
                            </div>
                            {today.notes && (
                                <p className="text-xs lg:text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                                    {today.notes}
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="font-semibold text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                            No entry yet — don&apos;t break the streak!
                        </p>
                    )}
                </div>
                {!today.logged && (
                    <button
                        onClick={onLog}
                        className="w-full sm:w-auto shrink-0 rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98] text-xs lg:text-sm px-6 py-3 font-[var(--font-orbitron)] bg-[var(--color-primary)] text-black hover:opacity-90 text-center"
                    >
                        + Log Today
                    </button>
                )}
            </div>
        </div>
    );
}