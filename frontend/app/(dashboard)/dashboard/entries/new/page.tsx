"use client";

import { useRouter } from "next/navigation";
import EntryForm from "@/components/entries/EntryForm";
import useEntries from "@/hooks/useEntries";
import { EntryFormData } from "@/types";

export default function NewEntryPage() {
    const { createEntry } = useEntries();
    const router = useRouter();

    const handleSubmit = async (data: EntryFormData): Promise<boolean> => {
        const success = await createEntry(data);
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
                    LOG TODAY&apos;S STUDY
                </h1>
                <p
                    className="text-base font-medium mt-1"
                    style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-rajdhani)",
                    }}
                >
                    One entry per day — update it any time with Edit.
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
                <EntryForm onSubmit={handleSubmit} submitLabel="SAVE ENTRY" />
            </div>
        </div>
    );
}