"use client";

import useAuth from "@/hooks/useAuth";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-bg)" }}
      >
        <p style={{ color: "var(--color-text-muted)" }} className="text-sm">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Top bar */}
      <div className="max-w-xl mx-auto flex justify-end mb-6">
        <ThemeToggle />
      </div>

      {/* Welcome card */}
      <div
        className="max-w-xl mx-auto rounded-2xl p-8"
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h1
          className="text-2xl font-semibold mb-1"
          style={{ color: "var(--color-text)" }}
        >
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
          {user?.email}
        </p>

        {/* XP bar preview */}
        <div className="mb-6">
          <div
            className="flex justify-between text-xs mb-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span>Level 1 Learner</span>
            <span>0 / 100 XP</span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: "var(--color-border)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: "0%",
                background: "var(--color-primary)",
              }}
            />
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: "#EF444420",
            color: "#EF4444",
            border: "1px solid #EF444440",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}