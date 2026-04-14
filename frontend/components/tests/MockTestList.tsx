"use client";

import { useState } from "react";
import { MockTest } from "@/types";
import useMockTests from "@/hooks/useMockTests";

interface MockTestListProps {
    tests: MockTest[];
}

export default function MockTestList({ tests }: MockTestListProps) {
    const { deleteTest } = useMockTests();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this test result? This cannot be undone.")) return;
        setDeletingId(id);
        await deleteTest(id);
        setDeletingId(null);
    };

    if (tests.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-5xl mb-4">📝</p>
                <p className="font-semibold text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                    No tests logged yet. Take a mock test and record your score!
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {tests.map((test) => (
                <div
                    key={test._id}
                    className="rounded-2xl border transition-all bg-[var(--color-card)]"
                    style={{
                        borderColor: test.passed ? "var(--color-primary)" : "var(--color-border)",
                        padding: "1.25rem 1.5rem",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = test.passed ? "var(--color-primary)" : "#ef4444")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = test.passed ? "var(--color-primary)" : "var(--color-border)")}
                >
                    <div className="flex items-start justify-between gap-4 flex-wrap">

                        {/* Left */}
                        <div className="flex-1 min-w-0">
                            {/* Date + badge */}
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                <p className="font-black tracking-widest text-xs lg:text-sm text-[var(--color-primary)] font-[var(--font-orbitron)]">
                                    {test.date}
                                </p>
                                <span
                                    className="font-bold uppercase tracking-widest text-[0.6rem] lg:text-xs px-2.5 py-1 rounded-lg font-[var(--font-orbitron)]"
                                    style={{
                                        background: test.passed ? "color-mix(in srgb, var(--color-primary) 15%, transparent)" : "rgba(239,68,68,0.12)",
                                        color: test.passed ? "var(--color-primary)" : "#ef4444",
                                        border: `1px solid ${test.passed ? "var(--color-primary)" : "#ef4444"}`,
                                    }}
                                >
                                    {test.passed ? "✅ Pass" : "❌ Fail"}
                                </span>
                            </div>

                            {/* Total score */}
                            <p
                                className="font-black text-2xl lg:text-3xl leading-none mb-3 font-[var(--font-orbitron)]"
                                style={{ color: test.passed ? "var(--color-primary)" : "#ef4444" }}
                            >
                                {test.totalScore}
                                <span className="font-medium text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)] ml-1">
                                    / 180
                                </span>
                            </p>

                            {/* Section scores */}
                            <div className="flex flex-wrap gap-3 font-semibold text-xs lg:text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                                <span>📖 Vocab: {test.vocabScore}</span>
                                <span>✏️ Grammar: {test.grammarScore}</span>
                                <span>📄 Reading: {test.readingScore}</span>
                                <span>🎧 Listening: {test.listeningScore}</span>
                            </div>

                            {test.notes && (
                                <p className="mt-2 text-xs lg:text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)] line-clamp-1">
                                    {test.notes}
                                </p>
                            )}
                        </div>

                        {/* Delete */}
                        <button
                            onClick={() => handleDelete(test._id)}
                            disabled={deletingId === test._id}
                            className="shrink-0 font-bold uppercase tracking-widest rounded-lg transition-all text-[0.6rem] lg:text-xs px-3 py-1.5 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-red-500 hover:text-red-500 disabled:opacity-50"
                        >
                            {deletingId === test._id ? "..." : "Delete"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}