"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { ChartDay } from "@/types";

interface WeeklyBarChartProps {
    data: ChartDay[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
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
                className="font-black uppercase tracking-widest mb-2"
                style={{ color: "var(--color-primary)", fontFamily: "var(--font-orbitron)", fontSize: "10px" }}
            >
                {label}
            </p>
            {payload.map((p: any) => (
                <p key={p.name} style={{ color: p.color }}>
                    {p.name}: <strong>{p.value}</strong>
                </p>
            ))}
        </div>
    );
};

export default function WeeklyBarChart({ data }: WeeklyBarChartProps) {
    // Shorten date labels to Mon/Tue etc
    const formatted = data.map((d) => ({
        ...d,
        label: new Date(d.date + "T00:00:00Z").toLocaleDateString("en-US", {
            weekday: "short",
            timeZone: "UTC",
        }),
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
                📊 Last 7 Days
            </p>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={formatted} barCategoryGap="30%">
                    <XAxis
                        dataKey="label"
                        tick={{ fill: "var(--color-text-muted)", fontSize: 11, fontFamily: "var(--font-rajdhani)" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: "var(--color-text-muted)", fontSize: 11, fontFamily: "var(--font-rajdhani)" }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-border)", opacity: 0.3 }} />
                    <Legend
                        wrapperStyle={{ fontFamily: "var(--font-rajdhani)", fontSize: 12, color: "var(--color-text-muted)" }}
                    />
                    <Bar dataKey="vocabCount" name="Vocab" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="listeningMinutes" name="Listening" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="grammarCount" name="Grammar" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}