"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { ChartDay } from "@/types";

interface MonthlyLineChartProps {
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

export default function MonthlyLineChart({ data }: MonthlyLineChartProps) {
    // Show every 5th date label to avoid crowding
    const formatted = data.map((d, i) => ({
        ...d,
        label: i % 5 === 0
            ? new Date(d.date + "T00:00:00Z").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                timeZone: "UTC",
            })
            : "",
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
                📈 Last 30 Days
            </p>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={formatted}>
                    <XAxis
                        dataKey="label"
                        tick={{ fill: "var(--color-text-muted)", fontSize: 10, fontFamily: "var(--font-rajdhani)" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: "var(--color-text-muted)", fontSize: 11, fontFamily: "var(--font-rajdhani)" }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ fontFamily: "var(--font-rajdhani)", fontSize: 12, color: "var(--color-text-muted)" }}
                    />
                    <Line
                        type="monotone"
                        dataKey="vocabCount"
                        name="Vocab"
                        stroke="var(--color-primary)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="listeningMinutes"
                        name="Listening"
                        stroke="var(--color-secondary)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="grammarCount"
                        name="Grammar"
                        stroke="var(--color-accent)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}