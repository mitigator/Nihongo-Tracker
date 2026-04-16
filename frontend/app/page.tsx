"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const features = [
  {
    icon: "🔥",
    title: "Streak Tracking",
    desc: "Log every study session and watch your streak climb. Miss a day and it resets — that one number becomes surprisingly motivating.",
  },
  {
    icon: "🎯",
    title: "Weekly Goals",
    desc: "Set targets for vocab, listening, and grammar. Progress bars fill in real time so you always know exactly where you stand.",
  },
  {
    icon: "📊",
    title: "Mock Test Scores",
    desc: "Log every practice test. Track your average, your best, and a trend line showing whether you're improving or plateauing.",
  },
  {
    icon: "🗂",
    title: "Custom Study Plans",
    desc: "Build a structured N5-to-N1 plan with different targets each week — ramp up, peak, then ease off for revision.",
  },
  {
    icon: "🃏",
    title: "Anki Decks",
    desc: "Built-in spaced repetition flashcards. Create N5/N4/N3 decks, review due cards daily, and track retention over time.",
  },
  {
    icon: "📈",
    title: "Analytics",
    desc: "Bar charts, line charts, donut charts. See how your time splits between vocab, listening, and grammar at a glance.",
  },
];

const stats = [
  { value: "5", label: "JLPT Levels" },
  { value: "SM-2", label: "SRS Algorithm" },
  { value: "∞", label: "Cards" },
  { value: "0", label: "Excuses" },
];

const steps = [
  { step: "01", title: "Log your session", desc: "Takes 30 seconds. Vocab count, listening minutes, grammar points — done." },
  { step: "02", title: "Set weekly goals", desc: "Define your targets at the start of each week. The app tracks progress automatically." },
  { step: "03", title: "Review your Anki deck", desc: "Open the floating widget, pick a deck, flip cards. SM-2 schedules the next review." },
  { step: "04", title: "Watch the trend", desc: "Analytics show your trajectory. Are you improving? Plateauing? The data never lies." },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-40 transition-all duration-300"
        style={{
          background: scrolled ? "var(--color-card)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="app-container flex items-center justify-between h-16 gap-4">
          <Link href="/" className="no-underline flex items-center gap-1 shrink-0">
            <span className="font-black tracking-widest text-base lg:text-lg text-[var(--color-primary)] font-[var(--font-orbitron)]">
              日本語
            </span>
            <span className="font-black tracking-widest text-base lg:text-lg text-[var(--color-text)] font-[var(--font-orbitron)]">
              Tracker
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="font-bold uppercase tracking-wider rounded-lg transition-all text-[0.65rem] lg:text-xs px-4 py-2 font-[var(--font-orbitron)] no-underline border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="font-bold uppercase tracking-wider rounded-lg transition-all text-[0.65rem] lg:text-xs px-4 py-2 font-[var(--font-orbitron)] no-underline"
              style={{ background: "var(--color-primary)", color: "#000" }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="app-container flex flex-col items-center text-center gap-8 pt-20 pb-24 lg:pt-32 lg:pb-36">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-widest font-[var(--font-orbitron)] transition-all duration-700"
          style={{
            background: "var(--color-primary)" + "18",
            border: "1px solid var(--color-primary)" + "44",
            color: "var(--color-primary)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          🎌 JLPT Study Companion
        </div>

        {/* Headline */}
        <div
          className="flex flex-col gap-3 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "100ms",
          }}
        >
          <h1
            className="font-black tracking-tight leading-none font-[var(--font-orbitron)]"
            style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
          >
            Stop guessing.
          </h1>
          <h1
            className="font-black tracking-tight leading-none font-[var(--font-orbitron)]"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              color: "var(--color-primary)",
            }}
          >
            Start knowing.
          </h1>
        </div>

        {/* Subheadline */}
        <p
          className="max-w-xl text-base lg:text-lg font-medium font-[var(--font-rajdhani)] transition-all duration-700"
          style={{
            color: "var(--color-muted)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "200ms",
          }}
        >
          Track every study session, set weekly goals, review Anki flashcards,
          and watch your JLPT score trend upward — all in one place.
        </p>

        {/* CTA buttons */}
        <div
          className="flex items-center gap-3 flex-wrap justify-center transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "300ms",
          }}
        >
          <Link
            href="/register"
            className="font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.97] text-sm px-8 py-4 font-[var(--font-orbitron)] no-underline"
            style={{
              background: "var(--color-primary)",
              color: "#000",
              boxShadow: "0 0 32px var(--color-primary)44",
            }}
          >
            Start for Free →
          </Link>
          <Link
            href="/login"
            className="font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.97] text-sm px-8 py-4 font-[var(--font-orbitron)] no-underline border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            I have an account
          </Link>
        </div>

        {/* Already have account → go to dashboard */}
        <Link
          href="/dashboard"
          className="text-xs font-medium font-[var(--font-rajdhani)] no-underline transition-all duration-700"
          style={{
            color: "var(--color-muted)",
            opacity: visible ? 1 : 0,
            transitionDelay: "400ms",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
        >
          Already logged in? Go to Dashboard →
        </Link>
      </section>

      {/* ── Stats strip ── */}
      <section
        className="border-y"
        style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
      >
        <div className="app-container py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <span
                className="font-black font-[var(--font-orbitron)]"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--color-primary)" }}
              >
                {value}
              </span>
              <span
                className="text-[0.65rem] font-bold uppercase tracking-widest font-[var(--font-orbitron)]"
                style={{ color: "var(--color-muted)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="app-container py-20 lg:py-28 flex flex-col gap-12">
        <div className="flex flex-col gap-3 text-center">
          <p
            className="text-[0.65rem] font-black uppercase tracking-widest font-[var(--font-orbitron)]"
            style={{ color: "var(--color-primary)" }}
          >
            Everything you need
          </p>
          <h2
            className="font-black tracking-tight font-[var(--font-orbitron)]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Built for serious learners
          </h2>
          <p
            className="max-w-lg mx-auto text-base font-medium font-[var(--font-rajdhani)]"
            style={{ color: "var(--color-muted)" }}
          >
            No fluff. Just the tools that actually move your JLPT score.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border flex flex-col gap-3 transition-all group"
              style={{
                background: "var(--color-card)",
                borderColor: "var(--color-border)",
                padding: "1.5rem",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-border)";
              }}
            >
              <span className="text-3xl">{icon}</span>
              <p
                className="font-black tracking-widest text-sm font-[var(--font-orbitron)]"
                style={{ color: "var(--color-text)" }}
              >
                {title}
              </p>
              <p
                className="text-sm font-medium font-[var(--font-rajdhani)] leading-relaxed"
                style={{ color: "var(--color-muted)" }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        className="border-t"
        style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
      >
        <div className="app-container py-20 lg:py-28 flex flex-col gap-12">
          <div className="flex flex-col gap-3 text-center">
            <p
              className="text-[0.65rem] font-black uppercase tracking-widest font-[var(--font-orbitron)]"
              style={{ color: "var(--color-primary)" }}
            >
              How it works
            </p>
            <h2
              className="font-black tracking-tight font-[var(--font-orbitron)]"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
            >
              Simple daily loop
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col gap-4" style={{ padding: "0.25rem" }}>
                <span
                  className="font-black font-[var(--font-orbitron)]"
                  style={{ fontSize: "2.5rem", color: "var(--color-primary)", opacity: 0.25, lineHeight: 1 }}
                >
                  {step}
                </span>
                <div className="flex flex-col gap-2">
                  <p
                    className="font-black tracking-widest text-sm font-[var(--font-orbitron)]"
                    style={{ color: "var(--color-text)" }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-sm font-medium font-[var(--font-rajdhani)] leading-relaxed"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Anki spotlight ── */}
      <section className="app-container py-20 lg:py-28">
        <div
          className="rounded-2xl border flex flex-col lg:flex-row items-center gap-10 lg:gap-16"
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-primary)" + "44",
            padding: "2.5rem",
            boxShadow: "0 0 60px var(--color-primary)11",
          }}
        >
          <div className="flex flex-col gap-5 flex-1">
            <span
              className="text-[0.65rem] font-black uppercase tracking-widest font-[var(--font-orbitron)]"
              style={{ color: "var(--color-primary)" }}
            >
              Built-in Flashcards
            </span>
            <h2
              className="font-black tracking-tight font-[var(--font-orbitron)]"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
            >
              Anki-style SRS,<br />without leaving the app
            </h2>
            <p
              className="text-base font-medium font-[var(--font-rajdhani)] leading-relaxed"
              style={{ color: "var(--color-muted)" }}
            >
              Create decks for each JLPT level. Cards are auto-assigned when you
              log vocab. The SM-2 algorithm schedules exactly when to review each
              card — so you never waste time on things you already know.
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "Auto-import vocab from daily entries",
                "Per-deck daily review targets",
                "Again / Hard / Good / Easy ratings",
                "Retention rate tracked in analytics",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-medium font-[var(--font-rajdhani)]">
                  <span style={{ color: "var(--color-primary)" }}>✓</span>
                  <span style={{ color: "var(--color-muted)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mini card mockup */}
          <div className="flex flex-col gap-3 w-full lg:w-72 shrink-0">
            <div
              className="rounded-2xl border flex flex-col items-center justify-center gap-3 text-center"
              style={{
                background: "var(--color-bg)",
                borderColor: "var(--color-border)",
                padding: "2rem 1.5rem",
                minHeight: "160px",
              }}
            >
              <span
                className="text-[0.6rem] font-black uppercase tracking-widest rounded-md px-2 py-0.5 font-[var(--font-orbitron)]"
                style={{ background: "var(--color-primary)" + "22", color: "var(--color-primary)" }}
              >
                vocab · N5
              </span>
              <p
                className="font-black font-[var(--font-orbitron)]"
                style={{ fontSize: "2.5rem", color: "var(--color-text)" }}
              >
                食べる
              </p>
              <p className="text-xs text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                Tap to reveal →
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Again", color: "#ef4444", sub: "10 min" },
                { label: "Hard", color: "#f59e0b", sub: "1 day" },
                { label: "Good", color: "var(--color-primary)", sub: "3 days" },
                { label: "Easy", color: "#10b981", sub: "7 days" },
              ].map(({ label, color, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-0.5 rounded-xl border py-2"
                  style={{ background: "var(--color-bg)", borderColor: "var(--color-border)" }}
                >
                  <span className="text-[0.6rem] font-black uppercase tracking-widest font-[var(--font-orbitron)]" style={{ color }}>
                    {label}
                  </span>
                  <span className="text-[0.55rem] font-medium font-[var(--font-rajdhani)] text-[var(--color-muted)]">
                    {sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section
        className="border-t"
        style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
      >
        <div className="app-container py-20 lg:py-28 flex flex-col items-center gap-8 text-center">
          <h2
            className="font-black tracking-tight font-[var(--font-orbitron)]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
          >
            頑張ってください
          </h2>
          <p
            className="text-base font-medium font-[var(--font-rajdhani)] max-w-md"
            style={{ color: "var(--color-muted)" }}
          >
            Keep going. Every session logged is a data point. Every data point
            is proof you showed up. Start tracking today.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link
              href="/register"
              className="font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.97] text-sm px-8 py-4 font-[var(--font-orbitron)] no-underline"
              style={{
                background: "var(--color-primary)",
                color: "#000",
                boxShadow: "0 0 32px var(--color-primary)44",
              }}
            >
              Get Started Free →
            </Link>
            <Link
              href="/dashboard"
              className="font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.97] text-sm px-8 py-4 font-[var(--font-orbitron)] no-underline border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="app-container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black tracking-widest text-sm text-[var(--color-primary)] font-[var(--font-orbitron)]">
              日本語
            </span>
            <span className="font-black tracking-widest text-sm text-[var(--color-text)] font-[var(--font-orbitron)]">
              Tracker
            </span>
            <span className="text-[var(--color-border)] mx-1 select-none">·</span>
            <span className="text-xs text-[var(--color-muted)] font-[var(--font-rajdhani)]">
              JLPT study companion
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[0.65rem] font-bold uppercase tracking-widest font-[var(--font-orbitron)] no-underline text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
              Login
            </Link>
            <Link href="/register" className="text-[0.65rem] font-bold uppercase tracking-widest font-[var(--font-orbitron)] no-underline text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
              Register
            </Link>
            <Link href="/dashboard" className="text-[0.65rem] font-bold uppercase tracking-widest font-[var(--font-orbitron)] no-underline text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
              Dashboard
            </Link>
          </div>
          <p className="text-xs text-[var(--color-muted)] font-[var(--font-rajdhani)]">
            Built for JLPT learners
          </p>
        </div>
      </footer>
    </div>
  );
}