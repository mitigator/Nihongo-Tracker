"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { MockTest } from "@/types";

interface TestScoreTrendProps {
    tests: MockTest[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const passed = payload[0].payload.passed;
    return (
        <div className="rounded-xl flex flex-col gap-1 font-[var(--font-rajdhani)]" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", padding: "0.75rem 1rem" }}>
            <p className="font-black uppercase tracking-widest mb-1 font-[var(--font-orbitron)] text-[var(--color-primary)]" style={{ fontSize: "10px" }}>
                {label}
            </p>
            <p className="text-xs" style={{ color: passed ? "var(--color-primary)" : "#ef4444" }}>
                Score: <strong>{payload[0].value}</strong> {passed ? "✅" : "❌"}
            </p>
        </div>
    );
};

export default function TestScoreTrend({ tests }: TestScoreTrendProps) {
    const cardClass = "rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)]";
    const cardPadding = { padding: "1.5rem" };
    const titleClass = "font-bold uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)] mb-4";

    if (tests.length === 0) {
        return (
            <div className={cardClass} style={cardPadding}>
                <p className={titleClass}>📉 Mock Test Score Trend</p>
                <div className="flex items-center justify-center h-[220px]">
                    <p className="text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                        No tests logged yet
                    </p>
                </div>
            </div>
        );
    }

    const sorted = [...tests].sort((a, b) => (a.date < b.date ? -1 : 1));
    const passThreshold = sorted[0]?.passThreshold ?? 80;

    const data = sorted.map((t) => ({
        label: t.date,
        score: t.totalScore,
        passed: t.passed,
    }));

    return (
        <div className={cardClass} style={cardPadding}>
            <p className={titleClass}>📉 Mock Test Score Trend</p>
            <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data}>
                    <XAxis
                        dataKey="label"
                        tick={{ fill: "var(--color-muted)", fontSize: 10, fontFamily: "var(--font-rajdhani)" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        domain={[0, 180]}
                        tick={{ fill: "var(--color-muted)", fontSize: 11, fontFamily: "var(--font-rajdhani)" }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine
                        y={passThreshold}
                        stroke="var(--color-primary)"
                        strokeDasharray="4 4"
                        label={{
                            value: `Pass: ${passThreshold}`,
                            fill: "var(--color-primary)",
                            fontSize: 10,
                            fontFamily: "var(--font-orbitron)",
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        name="Score"
                        stroke="var(--color-secondary)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-secondary)", r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}