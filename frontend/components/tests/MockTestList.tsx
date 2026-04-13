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
                <p
                    className="text-base font-semibold"
                    style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-rajdhani)",
                    }}
                >
                    No tests logged yet. Take a mock test and record your score!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tests.map((test) => (
                <div
                    key={test._id}
                    className="rounded-2xl border px-5 py-4 transition-all"
                    style={{
                        background: "var(--color-card)",
                        borderColor: test.passed ? "var(--color-primary)" : "var(--color-border)",
                    }}
                    onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = test.passed
                        ? "var(--color-primary)"
                        : "#ef4444")
                    }
                    onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = test.passed
                        ? "var(--color-primary)"
                        : "var(--color-border)")
                    }
                >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        {/* Left */}
                        <div className="flex-1 min-w-0">
                            {/* Date + pass badge */}
                            <div className="flex items-center gap-3 mb-2">
                                <p
                                    className="text-sm font-black tracking-widest"
                                    style={{
                                        color: "var(--color-primary)",
                                        fontFamily: "var(--font-orbitron)",
                                    }}
                                >
                                    {test.date}
                                </p>
                                <span
                                    className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg"
                                    style={{
                                        background: test.passed ? "var(--color-primary)20" : "#ef444420",
                                        color: test.passed ? "var(--color-primary)" : "#ef4444",
                                        fontFamily: "var(--font-orbitron)",
                                        border: `1px solid ${test.passed ? "var(--color-primary)" : "#ef4444"}`,
                                    }}
                                >
                                    {test.passed ? "✅ PASS" : "❌ FAIL"}
                                </span>
                            </div>

                            {/* Total score */}
                            <p
                                className="text-2xl font-black mb-2"
                                style={{
                                    color: test.passed ? "var(--color-primary)" : "#ef4444",
                                    fontFamily: "var(--font-orbitron)",
                                }}
                            >
                                {test.totalScore}
                                <span
                                    className="text-sm font-medium ml-1"
                                    style={{
                                        color: "var(--color-text-muted)",
                                        fontFamily: "var(--font-rajdhani)",
                                    }}
                                >
                                    / 180
                                </span>
                            </p>

                            {/* Section scores */}
                            <div
                                className="flex flex-wrap gap-3 text-xs font-semibold"
                                style={{
                                    color: "var(--color-text-muted)",
                                    fontFamily: "var(--font-rajdhani)",
                                }}
                            >
                                <span>📖 Vocab: {test.vocabScore}</span>
                                <span>✏️ Grammar: {test.grammarScore}</span>
                                <span>📄 Reading: {test.readingScore}</span>
                                <span>🎧 Listening: {test.listeningScore}</span>
                            </div>

                            {test.notes && (
                                <p
                                    className="mt-2 text-xs truncate"
                                    style={{
                                        color: "var(--color-text-muted)",
                                        fontFamily: "var(--font-rajdhani)",
                                    }}
                                >
                                    {test.notes}
                                </p>
                            )}
                        </div>

                        {/* Delete */}
                        <button
                            onClick={() => handleDelete(test._id)}
                            disabled={deletingId === test._id}
                            className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 shrink-0"
                            style={{
                                background: "var(--color-bg)",
                                border: "1px solid var(--color-border)",
                                color: "var(--color-text-muted)",
                                fontFamily: "var(--font-orbitron)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#ef4444";
                                e.currentTarget.style.color = "#ef4444";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--color-border)";
                                e.currentTarget.style.color = "var(--color-text-muted)";
                            }}
                        >
                            {deletingId === test._id ? "..." : "Delete"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}