"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useProgress from "@/hooks/useProgress";
import useEntries from "@/hooks/useEntries";
import StreakBadge from "@/components/entries/StreakBadge";
import EntryList from "@/components/entries/EntryList";
import TodayCard from "@/components/dashboard/TodayCard";
import WeekSummaryCard from "@/components/dashboard/WeekSummaryCard";

export default function DashboardPage() {
    const { summary, loading: summaryLoading, fetchSummary } = useProgress();
    const { entries, loading: entriesLoading, fetchEntries } = useEntries();
    const router = useRouter();

    useEffect(() => {
        fetchSummary();
        fetchEntries();
    }, [fetchSummary, fetchEntries]);

    const loading = summaryLoading || entriesLoading;

    return (
        <div className="space-y-6">

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
                        DASHBOARD
                    </h1>
                    <p
                        className="text-base font-medium mt-1"
                        style={{
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-rajdhani)",
                        }}
                    >
                        Your Japanese study overview
                    </p>
                </div>

                {/* Only show LOG TODAY button in header if today is already logged */}
                {summary?.today.logged && (
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
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div
                        className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                        style={{
                            borderColor: "var(--color-primary)",
                            borderTopColor: "transparent",
                        }}
                    />
                </div>
            ) : (
                <>
                    {/* Today status card */}
                    {summary && (
                        <TodayCard
                            today={summary.today}
                            onLog={() => router.push("/dashboard/entries/new")}
                        />
                    )}

                    {/* Streak badges */}
                    {summary && (
                        <StreakBadge
                            currentStreak={summary.streak.current}
                            longestStreak={summary.streak.longest}
                        />
                    )}

                    {/* This week vs goals */}
                    {summary && (
                        <WeekSummaryCard week={summary.week} goal={summary.goal} />
                    )}

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
                        <EntryList entries={entries} />
                    </div>
                </>
            )}
        </div>
    );
}