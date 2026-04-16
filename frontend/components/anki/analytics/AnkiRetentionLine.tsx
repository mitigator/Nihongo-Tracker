"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { AnkiRetentionDay } from "@/types";

interface AnkiRetentionLineProps {
  data: AnkiRetentionDay[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl flex flex-col gap-1" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", padding: "0.75rem 1rem" }}>
      <p className="font-black uppercase tracking-widest mb-1 font-[var(--font-orbitron)] text-[var(--color-primary)]" style={{ fontSize: "10px" }}>
        {label}
      </p>
      <p className="text-xs font-[var(--font-rajdhani)]" style={{ color: "var(--color-primary)" }}>
        Retention: <strong>{payload[0]?.value != null ? `${payload[0].value}%` : "—"}</strong>
      </p>
    </div>
  );
};

export default function AnkiRetentionLine({ data }: AnkiRetentionLineProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date + "T00:00:00Z").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }),
  }));

  return (
    <div className="rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)]" style={{ padding: "1.5rem" }}>
      <p className="font-bold uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)] mb-4">
        📈 Retention Rate — Last 30 Days
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formatted}>
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--color-muted)", fontSize: 10, fontFamily: "var(--font-rajdhani)" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "var(--color-muted)", fontSize: 10, fontFamily: "var(--font-rajdhani)" }}
            axisLine={false}
            tickLine={false}
            width={30}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* 80% good retention reference */}
          <ReferenceLine
            y={80}
            stroke="var(--color-primary)"
            strokeDasharray="4 4"
            label={{ value: "80%", fill: "var(--color-primary)", fontSize: 10, fontFamily: "var(--font-orbitron)" }}
          />
          <Line
            type="monotone"
            dataKey="retentionRate"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "var(--color-primary)" }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
