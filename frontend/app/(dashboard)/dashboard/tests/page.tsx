"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useMockTests from "@/hooks/useMockTests";
import MockTestList from "@/components/tests/MockTestList";
import StatCard from "@/components/ui/StatCard";

export default function MockTestsPage() {
    const { tests, stats, loading, fetchTests } = useMockTests();
    const router = useRouter();

    useEffect(() => { fetchTests(); }, [fetchTests]);

    const passRate = stats.count > 0 ? Math.round((stats.passed / stats.count) * 100) : 0;

    return (
        <div className="flex flex-col gap-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="font-black tracking-wider text-2xl lg:text-3xl text-[var(--color-text)] font-[var(--font-orbitron)]">
                        Mock Tests
                    </h1>
                    <p className="font-medium text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)] mt-1">
                        Track your JLPT practice scores over time
                    </p>
                </div>
                <button
                    onClick={() => router.push("/dashboard/tests/new")}
                    className="w-full sm:w-auto font-black tracking-widest uppercase rounded-xl transition-all active:scale-[0.98] text-xs lg:text-sm px-5 py-2.5 font-[var(--font-orbitron)] bg-[var(--color-primary)] text-black hover:opacity-90 text-center"
                >
                    + Log Test
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 rounded-full border-[3px] animate-spin border-[var(--color-border)] border-t-[var(--color-primary)]" />
                </div>
            ) : (
                <>
                    {stats.count > 0 && (
                        <>
                            {/* Stat cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <StatCard label="Tests Taken" value={stats.count} unit="total" icon="📝" />
                                <StatCard label="Avg Score" value={stats.avgScore} unit="/ 180" icon="📊" />
                                <StatCard label="Best Score" value={stats.bestScore} unit="/ 180" icon="🏆" />
                                <StatCard label="Pass Rate" value={passRate} unit="%" icon="✅" />
                            </div>

                            {/* Pass/fail summary */}
                            <div className="rounded-2xl border flex flex-wrap items-center gap-6 bg-[var(--color-card)] border-[var(--color-border)]" style={{ padding: "1.25rem 1.5rem" }}>
                                <div>
                                    <p className="font-bold uppercase tracking-widest text-[0.6rem] lg:text-[0.7rem] text-[var(--color-muted)] font-[var(--font-orbitron)] mb-1">
                                        Passed
                                    </p>
                                    <p className="font-black text-2xl lg:text-3xl leading-none text-[var(--color-primary)] font-[var(--font-orbitron)]">
                                        {stats.passed}
                                    </p>
                                </div>

                                <div className="w-px h-10 self-center bg-[var(--color-border)]" />

                                <div>
                                    <p className="font-bold uppercase tracking-widest text-[0.6rem] lg:text-[0.7rem] text-[var(--color-muted)] font-[var(--font-orbitron)] mb-1">
                                        Failed
                                    </p>
                                    <p className="font-black text-2xl lg:text-3xl leading-none text-red-500 font-[var(--font-orbitron)]">
                                        {stats.failed}
                                    </p>
                                </div>

                                <div className="w-px h-10 self-center bg-[var(--color-border)]" />

                                <div className="flex-1 min-w-[140px]">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-bold uppercase tracking-widest text-[0.6rem] lg:text-[0.7rem] text-[var(--color-muted)] font-[var(--font-orbitron)]">
                                            Pass Rate
                                        </p>
                                        <p className="font-black text-xs lg:text-sm text-[var(--color-primary)] font-[var(--font-orbitron)]">
                                            {passRate}%
                                        </p>
                                    </div>
                                    <div className="w-full h-2 rounded-full overflow-hidden bg-[var(--color-border)]">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${passRate}%`, background: "var(--color-primary)" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="border-t border-[var(--color-border)]" />

                    <div>
                        <h2 className="font-bold uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)] mb-4">
                            Score History — {stats.count} tests
                        </h2>
                        <MockTestList tests={tests} />
                    </div>
                </>
            )}
        </div>
    );
}