"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartDay } from "@/types";

interface MonthlyLineChartProps {
    data: ChartDay[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl flex flex-col gap-1" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", padding: "0.75rem 1rem" }}>
            <p className="font-black uppercase tracking-widest mb-1 font-[var(--font-orbitron)] text-[var(--color-primary)]" style={{ fontSize: "10px" }}>
                {label}
            </p>
            {payload.map((p: any) => (
                <p key={p.name} className="text-xs font-[var(--font-rajdhani)]" style={{ color: p.color }}>
                    {p.name}: <strong>{p.value}</strong>
                </p>
            ))}
        </div>
    );
};

export default function MonthlyLineChart({ data }: MonthlyLineChartProps) {
    const formatted = data.map((d, i) => ({
        ...d,
        label: i % 5 === 0
            ? new Date(d.date + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
            : "",
    }));

    return (
        <div className="rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)]" style={{ padding: "1.5rem" }}>
            <p className="font-bold uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)] mb-4">
                📈 Last 30 Days
            </p>
            <ResponsiveContainer width="100%" height={240}>
                <LineChart data={formatted}>
                    <XAxis
                        dataKey="label"
                        tick={{ fill: "var(--color-muted)", fontSize: 10, fontFamily: "var(--font-rajdhani)" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: "var(--color-muted)", fontSize: 11, fontFamily: "var(--font-rajdhani)" }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontFamily: "var(--font-rajdhani)", fontSize: 12, color: "var(--color-muted)" }} />
                    <Line type="monotone" dataKey="vocabCount" name="Vocab" stroke="var(--color-primary)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey="listeningMinutes" name="Listening" stroke="var(--color-secondary)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey="grammarCount" name="Grammar" stroke="var(--color-accent)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}