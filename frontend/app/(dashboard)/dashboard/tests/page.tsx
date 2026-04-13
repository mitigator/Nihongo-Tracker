"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useMockTests from "@/hooks/useMockTests";
import MockTestList from "@/components/tests/MockTestList";
import StatCard from "@/components/ui/StatCard";

export default function MockTestsPage() {
    const { tests, stats, loading, fetchTests } = useMockTests();
    const router = useRouter();

    useEffect(() => {
        fetchTests();
    }, [fetchTests]);

    const passRate =
        stats.count > 0 ? Math.round((stats.passed / stats.count) * 100) : 0;

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
                        MOCK TESTS
                    </h1>
                    <p
                        className="text-base font-medium mt-1"
                        style={{
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-rajdhani)",
                        }}
                    >
                        Track your JLPT practice scores over time
                    </p>
                </div>
                <button
                    onClick={() => router.push("/dashboard/tests/new")}
                    className="px-5 py-2.5 rounded-xl font-black tracking-widest uppercase transition-all active:scale-[0.98]"
                    style={{
                        background: "var(--color-primary)",
                        color: "#000",
                        fontFamily: "var(--font-orbitron)",
                        fontSize: "12px",
                    }}
                >
                    + LOG TEST
                </button>
            </div>

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
                <>
                    {/* Stats row */}
                    {stats.count > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <StatCard
                                label="Tests Taken"
                                value={stats.count}
                                unit="total"
                                icon="📝"
                            />
                            <StatCard
                                label="Avg Score"
                                value={stats.avgScore}
                                unit="/ 180"
                                icon="📊"
                            />
                            <StatCard
                                label="Best Score"
                                value={stats.bestScore}
                                unit="/ 180"
                                icon="🏆"
                            />
                            <StatCard
                                label="Pass Rate"
                                value={passRate}
                                unit="%"
                                icon="✅"
                            />
                        </div>
                    )}

                    {/* Pass/fail summary */}
                    {stats.count > 0 && (
                        <div
                            className="rounded-2xl border px-6 py-4 flex items-center gap-6 flex-wrap"
                            style={{
                                background: "var(--color-card)",
                                borderColor: "var(--color-border)",
                            }}
                        >
                            <div>
                                <p
                                    className="text-xs font-bold uppercase tracking-widest"
                                    style={{
                                        color: "var(--color-text-muted)",
                                        fontFamily: "var(--font-orbitron)",
                                    }}
                                >
                                    Passed
                                </p>
                                <p
                                    className="text-2xl font-black"
                                    style={{
                                        color: "var(--color-primary)",
                                        fontFamily: "var(--font-orbitron)",
                                    }}
                                >
                                    {stats.passed}
                                </p>
                            </div>
                            <div
                                className="w-px h-10 self-center"
                                style={{ background: "var(--color-border)" }}
                            />
                            <div>
                                <p
                                    className="text-xs font-bold uppercase tracking-widest"
                                    style={{
                                        color: "var(--color-text-muted)",
                                        fontFamily: "var(--font-orbitron)",
                                    }}
                                >
                                    Failed
                                </p>
                                <p
                                    className="text-2xl font-black"
                                    style={{
                                        color: "#ef4444",
                                        fontFamily: "var(--font-orbitron)",
                                    }}
                                >
                                    {stats.failed}
                                </p>
                            </div>
                            <div
                                className="w-px h-10 self-center"
                                style={{ background: "var(--color-border)" }}
                            />
                            {/* Pass rate bar */}
                            <div className="flex-1 min-w-[120px]">
                                <div className="flex justify-between mb-1">
                                    <p
                                        className="text-xs font-bold uppercase tracking-widest"
                                        style={{
                                            color: "var(--color-text-muted)",
                                            fontFamily: "var(--font-orbitron)",
                                        }}
                                    >
                                        Pass Rate
                                    </p>
                                    <p
                                        className="text-xs font-bold"
                                        style={{
                                            color: "var(--color-primary)",
                                            fontFamily: "var(--font-orbitron)",
                                        }}
                                    >
                                        {passRate}%
                                    </p>
                                </div>
                                <div
                                    className="w-full h-2 rounded-full overflow-hidden"
                                    style={{ background: "var(--color-border)" }}
                                >
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${passRate}%`,
                                            background: "var(--color-primary)",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div
                        className="border-t"
                        style={{ borderColor: "var(--color-border)" }}
                    />

                    {/* Test history */}
                    <div>
                        <h2
                            className="text-xs font-bold uppercase tracking-widest mb-4"
                            style={{
                                color: "var(--color-text-muted)",
                                fontFamily: "var(--font-orbitron)",
                            }}
                        >
                            Score History — {stats.count} tests
                        </h2>
                        <MockTestList tests={tests} />
                    </div>
                </>
            )}
        </div>
    );
}