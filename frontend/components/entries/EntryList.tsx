"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DailyEntry } from "@/types";
import useEntries from "@/hooks/useEntries";

interface EntryListProps {
    entries: DailyEntry[];
}

export default function EntryList({ entries }: EntryListProps) {
    const { deleteEntry } = useEntries();
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this entry? This cannot be undone.")) return;
        setDeletingId(id);
        await deleteEntry(id);
        setDeletingId(null);
    };

    if (entries.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-5xl mb-4">📭</p>
                <p
                    className="text-base font-semibold"
                    style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-rajdhani)",
                    }}
                >
                    No entries yet. Start by logging today!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {entries.map((entry) => (
                <div
                    key={entry._id}
                    className="rounded-2xl border px-5 py-4 flex items-start justify-between gap-4 transition-all"
                    style={{
                        background: "var(--color-card)",
                        borderColor: "var(--color-border)",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = "var(--color-primary)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = "var(--color-border)")
                    }
                >
                    {/* Left: date + stats */}
                    <div className="flex-1 min-w-0">
                        <p
                            className="text-sm font-black tracking-widest mb-2"
                            style={{
                                color: "var(--color-primary)",
                                fontFamily: "var(--font-orbitron)",
                            }}
                        >
                            {entry.date}
                        </p>
                        <div
                            className="flex flex-wrap gap-4 text-sm font-semibold"
                            style={{
                                color: "var(--color-text)",
                                fontFamily: "var(--font-rajdhani)",
                            }}
                        >
                            <span>📖 {entry.vocabCount} words</span>
                            <span>🎧 {entry.listeningMinutes} min</span>
                            <span>✏️ {entry.grammarCount} grammar</span>
                        </div>
                        {entry.notes && (
                            <p
                                className="mt-2 text-xs truncate"
                                style={{
                                    color: "var(--color-text-muted)",
                                    fontFamily: "var(--font-rajdhani)",
                                }}
                            >
                                {entry.notes}
                            </p>
                        )}
                    </div>

                    {/* Right: actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() =>
                                router.push(`/dashboard/entries/${entry._id}/edit`)
                            }
                            className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all"
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
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(entry._id)}
                            disabled={deletingId === entry._id}
                            className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
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
                            {deletingId === entry._id ? "..." : "Delete"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}