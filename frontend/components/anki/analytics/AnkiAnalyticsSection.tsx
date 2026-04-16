"use client";

import { useEffect, useState } from "react";
import useAnki from "@/hooks/useAnki";
import { AnkiAnalyticsResponse } from "@/types";
import AnkiWeeklyBar from "./AnkiWeeklyBar";
import AnkiRetentionLine from "./AnkiRetentionLine";
import AnkiDeckHealthDonut from "./AnkiDeckHealthDonut";
import StatCard from "@/components/ui/StatCard";

export default function AnkiAnalyticsSection() {
  const { fetchAnkiAnalytics } = useAnki();
  const [data, setData] = useState<AnkiAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnkiAnalytics().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [fetchAnkiAnalytics]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-6 h-6 rounded-full border-[3px] animate-spin border-[var(--color-border)] border-t-[var(--color-primary)]" />
      </div>
    );
  }

  if (!data) return null;

  const totalReviewed = data.last7Days.reduce((s, d) => s + d.reviewed, 0);
  const totalNew = data.last7Days.reduce((s, d) => s + d.newCards, 0);
  const avgRetention =
    data.last7Days.filter((d) => d.retentionRate != null).length > 0
      ? Math.round(
          data.last7Days
            .filter((d) => d.retentionRate != null)
            .reduce((s, d) => s + (d.retentionRate ?? 0), 0) /
            data.last7Days.filter((d) => d.retentionRate != null).length
        )
      : null;
  const totalOverdue = data.deckHealth.reduce((s, d) => s + d.overdue, 0);

  return (
    <div className="flex flex-col gap-6">

      {/* Section header */}
      <div>
        <h2 className="font-black tracking-wider text-xl text-[var(--color-text)] font-[var(--font-orbitron)]">
          🃏 Anki
        </h2>
        <p className="font-medium text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)] mt-1">
          Flashcard review stats and deck health
        </p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Reviews (7d)" value={totalReviewed} unit="cards" icon="🃏" />
        <StatCard label="New Cards (7d)" value={totalNew} unit="cards" icon="🆕" />
        <StatCard
          label="Avg Retention"
          value={avgRetention ?? 0}
          unit="%"
          icon="🧠"
        />
        <StatCard label="Overdue" value={totalOverdue} unit="cards" icon="⚠️" />
      </div>

      {/* Charts */}
      <AnkiWeeklyBar data={data.last7Days} />
      <AnkiRetentionLine data={data.last30Days} />
      <AnkiDeckHealthDonut data={data.deckHealth} />

      {/* Per-deck daily progress */}
      {data.perDeckProgress.length > 0 && (
        <div className="rounded-2xl border bg-[var(--color-card)] border-[var(--color-border)]" style={{ padding: "1.5rem" }}>
          <p className="font-bold uppercase tracking-widest text-[0.65rem] lg:text-xs text-[var(--color-muted)] font-[var(--font-orbitron)] mb-4">
            📅 Today's Progress Per Deck
          </p>
          <div className="flex flex-col gap-3">
            {data.perDeckProgress.map((deck) => {
              const pct = Math.min(deck.reviewedToday / Math.max(deck.dailyReviewTarget, 1), 1);
              return (
                <div key={deck.deckId}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[var(--color-text)] font-[var(--font-rajdhani)]">
                      {deck.deckName}
                    </span>
                    <span className="text-[0.65rem] font-bold text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                      {deck.reviewedToday} / {deck.dailyReviewTarget}
                    </span>
                  </div>
                  <div className="w-full rounded-full overflow-hidden" style={{ height: "6px", background: "var(--color-border)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct * 100}%`, background: deck.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
