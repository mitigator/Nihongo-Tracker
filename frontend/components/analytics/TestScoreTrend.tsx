"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { MockTest } from "@/types";

interface TestScoreTrendProps {
    tests: MockTest[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const passed = payload[0].payload.passed;
    return (
        <div
            className="rounded-xl px-4 py-3 text-xs space-y-1"
            style={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                fontFamily: "var(--font-rajdhani)",
            }}
        >
            <p
                className="font-black uppercase tracking-widest mb-1"
                style={{ color: "var(--color-primary)", fontFamily: "var(--font-orbitron)", fontSize: "10px" }}
            >
                {label}
            </p>
            <p style={{ color: passed ? "var(--color-primary)" : "#ef4444" }}>
                Score: <strong>{payload[0].value}</strong> {passed ? "✅" : "❌"}
            </p>
        </div>
    );
};

export default function TestScoreTrend({ tests }: TestScoreTrendProps) {
    if (tests.length === 0) {
        return (
            <div
                className="rounded-2xl border px-5 py-5"
                style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
            >
                <p
                    className="text-xs font-bold uppercase tracking-widest mb-4"
                    style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
                >
                    📉 Mock Test Score Trend
                </p>
                <div className="flex items-center justify-center h-[220px]">
                    <p
                        className="text-sm"
                        style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-rajdhani)" }}
                    >
                        No tests logged yet
                    </p>
                </div>
            </div>
        );
    }

    // Sort asc for trend line
    const sorted = [...tests].sort((a, b) => (a.date < b.date ? -1 : 1));
    const passThreshold = sorted[0]?.passThreshold ?? 80;

    const data = sorted.map((t) => ({
        label: t.date,
        score: t.totalScore,
        passed: t.passed,
    }));

    return (
        <div
            className="rounded-2xl border px-5 py-5"
            style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
        >
            <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-orbitron)" }}
            >
                📉 Mock Test Score Trend
            </p>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data}>
                    <XAxis
                        dataKey="label"
                        tick={{ fill: "var(--color-text-muted)", fontSize: 10, fontFamily: "var(--font-rajdhani)" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        domain={[0, 180]}
                        tick={{ fill: "var(--color-text-muted)", fontSize: 11, fontFamily: "var(--font-rajdhani)" }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {/* Pass threshold reference line */}
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