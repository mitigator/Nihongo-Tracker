"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface CategoryDonutChartProps {
    vocab: number;
    listening: number;
    grammar: number;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl text-xs font-[var(--font-rajdhani)]" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", padding: "0.625rem 0.875rem" }}>
            <p style={{ color: payload[0].payload.fill }}>
                {payload[0].name}: <strong>{payload[0].value}</strong>
            </p>
        </div>
    );
};

export default function CategoryDonutChart({ vocab, listening, grammar }: CategoryDonutChartProps) {
    const total = vocab + listening + grammar;

    const data = [
        { name: "Vocab", value: vocab, fill: "var(--color-primary)" },
        { name: "Listening", value: listening, fill: "var(--color-secondary)" },
        { name: "Grammar", value: grammar, fill: "var(--color-accent)" },
    ].filter((d) => d.value > 0);

    return (
        <div className="rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)]" style={{ padding: "1.5rem" }}>
            <p className="font-bold uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)] mb-4">
                🍩 Category Breakdown
            </p>

            {total === 0 ? (
                <div className="flex items-center justify-center h-[220px]">
                    <p className="text-sm lg:text-base text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                        No data yet
                    </p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontFamily: "var(--font-rajdhani)", fontSize: 12, color: "var(--color-muted)" }} />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}