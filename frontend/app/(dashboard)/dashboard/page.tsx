"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useEntries from "@/hooks/useEntries";
import StreakBadge from "@/components/entries/StreakBadge";
import EntryList from "@/components/entries/EntryList";
import StatCard from "@/components/ui/StatCard";

export default function DashboardPage() {
    const { entries, currentStreak, longestStreak, loading, fetchEntries } =
        useEntries();
    const router = useRouter();

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const totalVocab = entries.reduce((s, e) => s + e.vocabCount, 0);
    const totalListening = entries.reduce((s, e) => s + e.listeningMinutes, 0);
    const totalGrammar = entries.reduce((s, e) => s + e.grammarCount, 0);

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1
                        className="text-2xl font-black tracking-wider"
                        style={{
                            color: "var(--color-text)",
                            fontFamily: "var(--font-orbitron)",
                        }}
                    >
                        DAILY TRACKER
                    </h1>
                    <p
                        className="text-base font-medium mt-1"
                        style={{
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-rajdhani)",
                        }}
                    >
                        Log your study session — keep the streak alive
                    </p>
                </div>

                <button
                    onClick={() => router.push("/dashboard/entries/new")}
                    className="px-5 py-2.5 rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98]"
                    style={{
                        background: "var(--color-primary)",
                        color: "#000",
                        fontFamily: "var(--font-orbitron)",
                        fontSize: "12px",
                    }}
                >
                    + LOG TODAY
                </button>
            </div>

            {/* Streak */}
            <StreakBadge currentStreak={currentStreak} longestStreak={longestStreak} />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <StatCard label="Total Vocab" value={totalVocab} unit="words" icon="📖" />
                <StatCard label="Total Listening" value={totalListening} unit="min" icon="🎧" />
                <StatCard label="Grammar Points" value={totalGrammar} unit="points" icon="✏️" />
            </div>

            {/* Divider */}
            <div
                className="border-t"
                style={{ borderColor: "var(--color-border)" }}
            />

            {/* Entry list */}
            <div>
                <h2
                    className="text-xs font-bold uppercase tracking-widest mb-4"
                    style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-orbitron)",
                    }}
                >
                    Study Log — {entries.length} entries
                </h2>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div
                            className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                            style={{
                                borderColor: "var(--color-primary)",
                                borderTopColor: "transparent",
                            }}
                        />
                    </div>
                ) : (
                    <EntryList entries={entries} />
                )}
            </div>
        </div>
    );
}