"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartDay } from "@/types";

interface WeeklyBarChartProps {
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

export default function WeeklyBarChart({ data }: WeeklyBarChartProps) {
    const formatted = data.map((d) => ({
        ...d,
        label: new Date(d.date + "T00:00:00Z").toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
    }));

    return (
        <div className="rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)]" style={{ padding: "1.5rem" }}>
            <p className="font-bold uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)] mb-4">
                📊 Last 7 Days
            </p>
            <ResponsiveContainer width="100%" height={240}>
                <BarChart data={formatted} barCategoryGap="30%">
                    <XAxis
                        dataKey="label"
                        tick={{ fill: "var(--color-muted)", fontSize: 11, fontFamily: "var(--font-rajdhani)" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: "var(--color-muted)", fontSize: 11, fontFamily: "var(--font-rajdhani)" }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-border)", opacity: 0.3 }} />
                    <Legend wrapperStyle={{ fontFamily: "var(--font-rajdhani)", fontSize: 12, color: "var(--color-muted)" }} />
                    <Bar dataKey="vocabCount" name="Vocab" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="listeningMinutes" name="Listening" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="grammarCount" name="Grammar" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}