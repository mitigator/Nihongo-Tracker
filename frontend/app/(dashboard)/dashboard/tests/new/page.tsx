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
        <div className="max-w-lg mx-auto flex flex-col gap-6">

            <button
                onClick={() => router.back()}
                className="self-start font-bold uppercase tracking-widest text-xs lg:text-sm transition-all font-[var(--font-orbitron)] text-[var(--color-muted)] hover:text-[var(--color-primary)]"
            >
                ← Back
            </button>

            <div>
                <h1 className="font-black tracking-wider text-2xl lg:text-3xl text-[var(--color-text)] font-[var(--font-orbitron)]">
                    Log Mock Test
                </h1>
                <p className="font-medium text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)] mt-1">
                    Record your JLPT practice test scores.
                </p>
            </div>

            <div className="rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)]" style={{ padding: "2rem" }}>
                <MockTestForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}