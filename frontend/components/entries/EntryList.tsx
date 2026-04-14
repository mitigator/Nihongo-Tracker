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
                <p className="font-semibold text-base lg:text-lg text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                    No entries yet — start by logging today!
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {entries.map((entry) => (
                <div
                    key={entry._id}
                    className="rounded-2xl border transition-all w-full bg-[var(--color-card)] border-[var(--color-border)] hover:border-[var(--color-primary)]"
                    style={{ padding: "1.25rem 1.5rem" }}
                >
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <p className="font-black tracking-widest text-xs lg:text-sm text-[var(--color-primary)] font-[var(--font-orbitron)]">
                            {entry.date}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => router.push(`/dashboard/entries/${entry._id}/edit`)}
                                className="font-bold uppercase tracking-widest rounded-lg transition-all text-[0.6rem] lg:text-xs px-3 lg:px-4 py-1.5 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(entry._id)}
                                disabled={deletingId === entry._id}
                                className="font-bold uppercase tracking-widest rounded-lg transition-all text-[0.6rem] lg:text-xs px-3 lg:px-4 py-1.5 font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-red-500 hover:text-red-500 disabled:opacity-50"
                            >
                                {deletingId === entry._id ? "..." : "Delete"}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 lg:gap-5 font-semibold text-sm lg:text-base text-[var(--color-text)] font-[var(--font-rajdhani)]">
                        <span>📖 {entry.vocabCount} words</span>
                        <span>🎧 {entry.listeningMinutes} min</span>
                        <span>✏️ {entry.grammarCount} grammar</span>
                    </div>
                    {entry.notes && (
                        <p className="mt-2 text-xs lg:text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)] line-clamp-1">
                            {entry.notes}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}