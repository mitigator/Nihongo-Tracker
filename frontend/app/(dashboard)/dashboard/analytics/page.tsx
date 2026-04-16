"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { ChartResponse, ChartDay } from "@/types";
import useMockTests from "@/hooks/useMockTests";
import useEntries from "@/hooks/useEntries";
import WeeklyBarChart from "@/components/analytics/WeeklyBarChart";
import MonthlyLineChart from "@/components/analytics/MonthlyLineChart";
import CategoryDonutChart from "@/components/analytics/CategoryDonutChart";
import TestScoreTrend from "@/components/analytics/TestScoreTrend";
import StatCard from "@/components/ui/StatCard";
import AnkiAnalyticsSection from "@/components/anki/analytics/AnkiAnalyticsSection"; // ← NEW

export default function AnalyticsPage() {
    const { tests, stats: testStats, fetchTests } = useMockTests();
    const { entries, fetchEntries } = useEntries();
    const [weeklyData, setWeeklyData] = useState<ChartDay[]>([]);
    const [monthlyData, setMonthlyData] = useState<ChartDay[]>([]);
    const [toggle, setToggle] = useState<"weekly" | "monthly">("weekly");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            await Promise.all([
                fetchTests(),
                fetchEntries(),
                axiosInstance.get<ChartResponse>("/api/progress/weekly").then(({ data }) => setWeeklyData(data.days)),
                axiosInstance.get<ChartResponse>("/api/progress/monthly").then(({ data }) => setMonthlyData(data.days)),
            ]);
            setLoading(false);
        };
        loadAll();
    }, [fetchTests, fetchEntries]);

    const totalVocab = entries.reduce((s, e) => s + e.vocabCount, 0);
    const totalListening = entries.reduce((s, e) => s + e.listeningMinutes, 0);
    const totalGrammar = entries.reduce((s, e) => s + e.grammarCount, 0);
    const totalDays = entries.length;

    return (
        <div className="flex flex-col gap-8">

            {/* Header */}
            <div>
                <h1 className="font-black tracking-wider text-2xl lg:text-3xl text-[var(--color-text)] font-[var(--font-orbitron)]">
                    Analytics
                </h1>
                <p className="font-medium text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)] mt-1">
                    All-time stats and visual trends
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-[3px] animate-spin border-[var(--color-border)] border-t-[var(--color-primary)]" />
                </div>
            ) : (
                <>
                    {/* All-time stat cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatCard label="Days Logged" value={totalDays} unit="days" icon="📅" />
                        <StatCard label="Total Vocab" value={totalVocab} unit="words" icon="📖" />
                        <StatCard label="Total Listening" value={totalListening} unit="min" icon="🎧" />
                        <StatCard label="Grammar Points" value={totalGrammar} unit="points" icon="✏️" />
                    </div>

                    {/* Toggle + charts */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            {(["weekly", "monthly"] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setToggle(t)}
                                    className="font-black uppercase tracking-widest rounded-xl transition-all text-[0.65rem] lg:text-xs px-4 py-2 font-[var(--font-orbitron)]"
                                    style={{
                                        background: toggle === t ? "var(--color-primary)" : "transparent",
                                        color: toggle === t ? "#000" : "var(--color-muted)",
                                        border: toggle === t ? "none" : "1px solid var(--color-border)",
                                    }}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {toggle === "weekly"
                            ? <WeeklyBarChart data={weeklyData} />
                            : <MonthlyLineChart data={monthlyData} />
                        }
                    </div>

                    {/* Category donut */}
                    <CategoryDonutChart
                        vocab={totalVocab}
                        listening={totalListening}
                        grammar={totalGrammar}
                    />

                    {/* Test score trend */}
                    <TestScoreTrend tests={tests} />

                    {/* Test summary */}
                    {testStats.count > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <StatCard label="Tests Taken" value={testStats.count} unit="total" icon="📝" />
                            <StatCard label="Avg Score" value={testStats.avgScore} unit="/ 180" icon="📊" />
                            <StatCard label="Best Score" value={testStats.bestScore} unit="/ 180" icon="🏆" />
                            <StatCard
                                label="Pass Rate"
                                value={Math.round((testStats.passed / testStats.count) * 100)}
                                unit="%"
                                icon="✅"
                            />
                        </div>
                    )}

                    {/* ── Anki section ── */}       {/* ← NEW */}
                    <div className="border-t border-[var(--color-border)] pt-8">
                        <AnkiAnalyticsSection />
                    </div>
                </>
            )}
        </div>
    );
}
