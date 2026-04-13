"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useProgress from "@/hooks/useProgress";
import useEntries from "@/hooks/useEntries";
import StreakBadge from "@/components/entries/StreakBadge";
import EntryList from "@/components/entries/EntryList";
import TodayCard from "@/components/dashboard/TodayCard";
import WeekSummaryCard from "@/components/dashboard/WeekSummaryCard";
import MilestoneBadge from "@/components/ui/MilestoneBadge";
import { StatCardSkeleton, EntryCardSkeleton } from "@/components/ui/Skeleton";
import { exportEntriesToCSV } from "@/utils/exportCSV";

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
                        style={{ color: "var(--color-text)", fontFamily: "var(--font-orbitron)" }}
                    >
                        DASHBOARD
                    </h1>
                    <p
                        className="text-base font-medium mt-1"
                        style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-rajdhani)" }}
                    >
                        Your Japanese study overview
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Export CSV */}
                    {entries.length > 0 && (
                        <button
                            onClick={() => exportEntriesToCSV(entries)}
                            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
                            style={{
                                background: "var(--color-bg)",
                                border: "1px solid var(--color-border)",
                                color: "var(--color-text-muted)",
                                fontFamily: "var(--font-orbitron)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--color-primary)";
                                e.currentTarget.style.color = "var(--color-primary)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--color-border)";
                                e.currentTarget.style.color = "var(--color-text-muted)";
                            }}
                        >
                            ↓ Export CSV
                        </button>
                    )}

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
            </div>

            {loading ? (
                <div className="space-y-6">
                    {/* Skeleton for today card */}
                    <div
                        className="rounded-2xl border px-6 py-5 space-y-3"
                        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
                    >
                        <div className="w-16 h-3 rounded animate-pulse" style={{ background: "var(--color-border)" }} />
                        <div className="w-32 h-5 rounded animate-pulse" style={{ background: "var(--color-border)" }} />
                    </div>
                    {/* Skeleton stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </div>
                    {/* Skeleton entry cards */}
                    <div className="space-y-3">
                        <EntryCardSkeleton />
                        <EntryCardSkeleton />
                        <EntryCardSkeleton />
                    </div>
                </div>
            ) : (
                <>
                    {/* Today card */}
                    {summary && (
                        <TodayCard
                            today={summary.today}
                            onLog={() => router.push("/dashboard/entries/new")}
                        />
                    )}

                    {/* Streak + milestone badges */}
                    {summary && (
                        <div className="space-y-3">
                            <StreakBadge
                                currentStreak={summary.streak.current}
                                longestStreak={summary.streak.longest}
                            />
                            <MilestoneBadge streak={summary.streak.current} />
                        </div>
                    )}

                    {/* This week vs goals */}
                    {summary && (
                        <WeekSummaryCard week={summary.week} goal={summary.goal} />
                    )}

                    {/* Divider */}
                    <div className="border-t" style={{ borderColor: "var(--color-border)" }} />

                    {/* Entry list */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2
                                className="text-xs font-bold uppercase tracking-widest"
                                style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
                            >
                                Study Log — {entries.length} entries
                            </h2>
                        </div>
                        <EntryList entries={entries} />
                    </div>
                </>
            )}
        </div>
    );
}