"use client";

import { useRouter, useParams } from "next/navigation";
import useEntries from "@/hooks/useEntries";
import EntryForm from "@/components/entries/EntryForm";
import { EntryFormData } from "@/types";

export default function EditEntryPage() {
    const { id } = useParams<{ id: string }>();
    const { entries, updateEntry } = useEntries();
    const router = useRouter();

    const entry = entries.find((e) => e._id === id);

    if (!entry) {
        return (
            <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <p
                    className="text-base font-semibold mb-4"
                    style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-rajdhani)",
                    }}
                >
                    Entry not found.
                </p>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="text-sm font-black uppercase tracking-widest"
                    style={{
                        color: "var(--color-primary)",
                        fontFamily: "var(--font-orbitron)",
                    }}
                >
                    ← Back to Dashboard
                </button>
            </div>
        );
    }

    const handleSubmit = async (data: EntryFormData): Promise<boolean> => {
        const { date, ...updateData } = data;
        void date;
        const success = await updateEntry(id, updateData);
        if (success) router.push("/dashboard");
        return success;
    };

    return (
        <div className="max-w-lg mx-auto space-y-6">
            {/* Back */}
            <button
                onClick={() => router.back()}
                className="text-sm font-bold uppercase tracking-widest transition-all"
                style={{
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-orbitron)",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-primary)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-text-muted)")
                }
            >
                ← Back
            </button>

            {/* Title */}
            <div>
                <h1
                    className="text-2xl font-black tracking-wider"
                    style={{
                        color: "var(--color-text)",
                        fontFamily: "var(--font-orbitron)",
                    }}
                >
                    EDIT ENTRY
                </h1>
                <p
                    className="text-base font-medium mt-1"
                    style={{
                        color: "var(--color-primary)",
                        fontFamily: "var(--font-rajdhani)",
                    }}
                >
                    {entry.date}
                </p>
            </div>

            {/* Form card */}
            <div
                className="rounded-2xl p-8 border"
                style={{
                    background: "var(--color-card)",
                    borderColor: "var(--color-border)",
                }}
            >
                <EntryForm
                    initialData={entry}
                    onSubmit={handleSubmit}
                    submitLabel="UPDATE ENTRY"
                    isDateLocked={true}
                />
            </div>
        </div>
    );
}