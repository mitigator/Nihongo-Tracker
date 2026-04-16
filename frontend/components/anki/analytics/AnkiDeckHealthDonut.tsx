"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AnkiDeckHealth } from "@/types";

interface AnkiDeckHealthDonutProps {
  data: AnkiDeckHealth[];
}

const STATE_COLORS: Record<string, string> = {
  new:      "var(--color-primary)",
  learning: "var(--color-secondary)",
  review:   "var(--color-accent)",
  overdue:  "#ef4444",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", padding: "0.75rem 1rem" }}>
      <p className="font-black uppercase tracking-widest font-[var(--font-orbitron)] text-[var(--color-primary)]" style={{ fontSize: "10px" }}>
        {payload[0]?.name}
      </p>
      <p className="text-xs font-[var(--font-rajdhani)]" style={{ color: payload[0]?.fill }}>
        <strong>{payload[0]?.value}</strong> cards
      </p>
    </div>
  );
};

export default function AnkiDeckHealthDonut({ data }: AnkiDeckHealthDonutProps) {
  // Aggregate across all decks into state totals
  const totals = data.reduce(
    (acc, deck) => {
      acc.new += deck.new;
      acc.learning += deck.learning;
      acc.review += deck.review;
      acc.overdue += deck.overdue;
      return acc;
    },
    { new: 0, learning: 0, review: 0, overdue: 0 }
  );

  const pieData = [
    { name: "New",      value: totals.new },
    { name: "Learning", value: totals.learning },
    { name: "Review",   value: totals.review },
    { name: "Overdue",  value: totals.overdue },
  ].filter((d) => d.value > 0);

  const total = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)]" style={{ padding: "1.5rem" }}>
      <p className="font-bold uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)] mb-4">
        🩺 Deck Health — {total} total cards
      </p>
      {total === 0 ? (
        <p className="text-center text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)] py-8">
          No cards yet — add some to your decks!
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              dataKey="value"
              strokeWidth={0}
            >
              {pieData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={STATE_COLORS[entry.name.toLowerCase()] ?? "var(--color-muted)"}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontFamily: "var(--font-rajdhani)", fontSize: 12, color: "var(--color-muted)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
