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
        <div className="flex flex-col gap-5 lg:gap-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="font-black tracking-wider text-2xl lg:text-3xl text-[var(--color-text)] font-[var(--font-orbitron)]">
                        Dashboard
                    </h1>
                    <p className="font-medium text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)] mt-1">
                        Your Japanese study overview
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {entries.length > 0 && (
                        <button
                            onClick={() => exportEntriesToCSV(entries)}
                            className="font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] text-[0.65rem] lg:text-xs px-4 py-2.5 font-[var(--font-orbitron)] bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                        >
                            ↓ Export CSV
                        </button>
                    )}
                    {summary?.today.logged && (
                        <button
                            onClick={() => router.push("/dashboard/entries/new")}
                            className="font-black tracking-widest uppercase rounded-xl transition-all active:scale-[0.98] text-[0.65rem] lg:text-xs px-4 py-2.5 font-[var(--font-orbitron)] bg-[var(--color-primary)] text-black hover:opacity-90"
                        >
                            + Log Today
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col gap-4">
                    <div className="rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)] p-6 animate-pulse flex flex-col gap-3">
                        <div className="h-3 w-20 rounded bg-[var(--color-border)]" />
                        <div className="h-5 w-36 rounded bg-[var(--color-border)]" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
                    </div>
                    <div className="flex flex-col gap-3">
                        <EntryCardSkeleton /><EntryCardSkeleton /><EntryCardSkeleton />
                    </div>
                </div>
            ) : (
                <>
                    {summary && (
                        <TodayCard today={summary.today} onLog={() => router.push("/dashboard/entries/new")} />
                    )}
                    {summary && (
                        <div className="flex flex-col gap-3">
                            <StreakBadge currentStreak={summary.streak.current} longestStreak={summary.streak.longest} />
                            <MilestoneBadge streak={summary.streak.current} />
                        </div>
                    )}
                    {summary && <WeekSummaryCard week={summary.week} goal={summary.goal} />}
                    <div className="border-t border-[var(--color-border)]" />
                    <div>
                        <p className="font-bold uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)] mb-4">
                            Study Log — {entries.length} {entries.length === 1 ? "entry" : "entries"}
                        </p>
                        <EntryList entries={entries} />
                    </div>
                </>
            )}
        </div>
    );
}