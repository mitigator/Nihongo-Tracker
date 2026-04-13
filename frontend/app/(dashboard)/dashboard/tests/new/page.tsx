"use client";

import { useRouter } from "next/navigation";
import MockTestForm from "@/components/tests/MockTestForm";
import useMockTests from "@/hooks/useMockTests";
import { MockTestFormData } from "@/types";

export default function NewTestPage() {
    const { createTest } = useMockTests();
    const router = useRouter();

    const handleSubmit = async (data: MockTestFormData): Promise<boolean> => {
        const success = await createTest(data);
        if (success) router.push("/dashboard/tests");
        return success;
    };

    return (
        <div className="max-w-lg mx-auto space-y-6">
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

            <div>
                <h1
                    className="text-2xl font-black tracking-wider"
                    style={{
                        color: "var(--color-text)",
                        fontFamily: "var(--font-orbitron)",
                    }}
                >
                    LOG MOCK TEST
                </h1>
                <p
                    className="text-base font-medium mt-1"
                    style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-rajdhani)",
                    }}
                >
                    Record your JLPT practice test scores.
                </p>
            </div>

            <div
                className="rounded-2xl p-8 border"
                style={{
                    background: "var(--color-card)",
                    borderColor: "var(--color-border)",
                }}
            >
                <MockTestForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}