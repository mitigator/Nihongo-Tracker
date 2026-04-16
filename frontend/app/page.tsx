"use client";

import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function HomePage() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="w-8 h-8 rounded-full border-[3px] animate-spin border-[var(--color-border)] border-t-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" style={{ padding: "2rem 1.25rem" }}>

      {/* Top bar */}
      <div className="max-w-lg mx-auto flex justify-end mb-8">
        <ThemeToggle />
      </div>

      {/* Welcome card */}
      <div
        className="max-w-lg mx-auto rounded-2xl"
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          padding: "2rem",
        }}
      >
        {/* Brand */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-1">
            <span className="font-black tracking-widest text-base text-[var(--color-primary)] font-[var(--font-orbitron)]">
              日本語
            </span>
            <span className="font-black tracking-widest text-base text-[var(--color-text)] font-[var(--font-orbitron)]">
              Tracker
            </span>
          </div>
          <h1 className="font-black tracking-wide text-xl lg:text-2xl text-[var(--color-text)] font-[var(--font-orbitron)] mb-0.5">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)]">
            {user?.email}
          </p>
        </div>

        {/* XP bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs mb-1.5 font-[var(--font-rajdhani)] text-[var(--color-muted)]">
            <span>Level 1 Learner</span>
            <span>0 / 100 XP</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden bg-[var(--color-border)]">
            <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: "0%" }} />
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Link
            href="/dashboard"
            className="flex-1 rounded-xl font-black tracking-widest uppercase text-center transition-all active:scale-[0.98] text-xs lg:text-sm font-[var(--font-orbitron)] bg-[var(--color-primary)] text-black hover:opacity-90 no-underline"
            style={{ padding: "0.875rem" }}
          >
            Dashboard →
          </Link>
          <Link
            href="/anki"
            className="flex-1 rounded-xl font-black tracking-widest uppercase text-center transition-all active:scale-[0.98] text-xs lg:text-sm font-[var(--font-orbitron)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] no-underline"
            style={{ padding: "0.875rem" }}
          >
            🃏 Anki Deck
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-border)] mb-5" />

        {/* Logout */}
        <button
          onClick={logout}
          className="text-xs font-semibold font-[var(--font-rajdhani)] text-red-400 hover:text-red-500 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}