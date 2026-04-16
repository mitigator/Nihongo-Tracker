"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { EntryProvider } from "@/context/EntryContext";
import { GoalProvider } from "@/context/GoalContext";
import { ProgressProvider } from "@/context/ProgressContext";
import { MockTestProvider } from "@/context/MockTestContext";
import { StudyPlanProvider } from "@/context/StudyPlanContext";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // Only redirect AFTER auth check is complete
        if (!loading && !user) router.replace("/login");
    }, [user, loading, router]);

    useEffect(() => { setMenuOpen(false); }, [pathname]);

    // Show spinner while auth is being checked OR while redirecting
    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
                <div className="w-8 h-8 rounded-full border-[3px] animate-spin border-[var(--color-border)] border-t-[var(--color-primary)]" />
            </div>
        );
    }

    const navLinks = [
        { href: "/dashboard", label: "Daily", exact: true },
        { href: "/dashboard/goals", label: "Goals", exact: false },
        { href: "/dashboard/tests", label: "Tests", exact: false },
        { href: "/dashboard/plans", label: "Plans", exact: false },
        { href: "/dashboard/analytics", label: "Analytics", exact: false },
    ];

    return (
        <EntryProvider>
            <GoalProvider>
                <ProgressProvider>
                    <MockTestProvider>
                        <StudyPlanProvider>
                            <div className="min-h-screen flex flex-col bg-[var(--color-bg)] overflow-hidden">

                                {/* ── Navbar ── */}
                                <nav className="sticky top-0 z-40 border-b bg-[var(--color-card)] border-[var(--color-border)]">
                                    <div className="app-container flex items-center justify-between h-16 gap-4">

                                        <Link href="/dashboard" className="no-underline flex items-center gap-1 shrink-0">
                                            <span className="font-black tracking-widest text-base lg:text-lg text-[var(--color-primary)] font-[var(--font-orbitron)]">
                                                日本語
                                            </span>
                                            <span className="font-black tracking-widest text-base lg:text-lg text-[var(--color-text)] font-[var(--font-orbitron)]">
                                                Tracker
                                            </span>
                                        </Link>

                                        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
                                            {navLinks.map(({ href, label, exact }) => {
                                                const isActive = exact ? pathname === href : pathname.startsWith(href);
                                                return (
                                                    <Link
                                                        key={href}
                                                        href={href}
                                                        className="font-bold uppercase tracking-wider rounded-lg transition-all text-[0.65rem] lg:text-xs px-4 py-2 font-[var(--font-orbitron)] no-underline whitespace-nowrap"
                                                        style={{
                                                            color: isActive ? "#000" : "var(--color-muted)",
                                                            background: isActive ? "var(--color-primary)" : "transparent",
                                                        }}
                                                    >
                                                        {label}
                                                    </Link>
                                                );
                                            })}
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="hidden lg:block font-semibold text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)] whitespace-nowrap">
                                                {user.name}
                                            </span>
                                            <ThemeToggle />

                                            {/* ── Logout button (desktop) ── */}
                                            <button
                                                onClick={logout}
                                                className="hidden md:block font-bold uppercase tracking-wider rounded-lg transition-all text-[0.65rem] lg:text-xs px-4 py-2 font-[var(--font-orbitron)] whitespace-nowrap border border-[var(--color-border)] text-[var(--color-muted)] hover:border-red-500 hover:text-red-500"
                                            >
                                                Logout
                                            </button>

                                            <button
                                                onClick={() => setMenuOpen((p) => !p)}
                                                className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-lg shrink-0"
                                                aria-label="Toggle menu"
                                            >
                                                <span className="block w-5 h-0.5 bg-[var(--color-muted)] transition-all duration-300"
                                                    style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
                                                <span className="block w-5 h-0.5 bg-[var(--color-muted)] transition-all duration-300"
                                                    style={{ opacity: menuOpen ? 0 : 1 }} />
                                                <span className="block w-5 h-0.5 bg-[var(--color-muted)] transition-all duration-300"
                                                    style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
                                            </button>
                                        </div>
                                    </div>

                                    {menuOpen && (
                                        <div className="md:hidden border-t border-[var(--color-border)]">
                                            <div className="app-container pt-3 pb-5 flex flex-col gap-1">
                                                {navLinks.map(({ href, label, exact }) => {
                                                    const isActive = exact ? pathname === href : pathname.startsWith(href);
                                                    return (
                                                        <Link
                                                            key={href}
                                                            href={href}
                                                            className="block font-bold uppercase tracking-wider rounded-xl transition-all text-xs px-5 py-3.5 font-[var(--font-orbitron)] no-underline"
                                                            style={{
                                                                color: isActive ? "#000" : "var(--color-muted)",
                                                                background: isActive ? "var(--color-primary)" : "transparent",
                                                            }}
                                                        >
                                                            {label}
                                                        </Link>
                                                    );
                                                })}

                                                {/* ── User + Logout (mobile) ── */}
                                                <div className="flex items-center justify-between px-5 pt-4 mt-1 border-t border-[var(--color-border)]">
                                                    <span className="font-semibold text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)]">
                                                        {user.name}
                                                    </span>
                                                    <button
                                                        onClick={logout}
                                                        className="font-bold uppercase tracking-wider rounded-lg text-[0.65rem] px-4 py-2 font-[var(--font-orbitron)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-red-500 hover:text-red-500 transition-all"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </nav>

                                {/* ── Page content ── */}
                                <main className="app-container pt-8 sm:pt-10 sm:pb-24 flex-1 pb-[26px]">
                                    {children}
                                </main>

                                {/* ── Footer ── */}
                                <footer className="border-t border-[var(--color-border)]" style={{ marginTop: "20px" }}>
                                    <div className="app-container py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-4">

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

                                        <div className="flex items-center gap-4 flex-wrap justify-center">
                                            {navLinks.map(({ href, label }) => (
                                                <Link
                                                    key={href}
                                                    href={href}
                                                    className="text-[0.65rem] font-bold uppercase tracking-widest font-[var(--font-orbitron)] no-underline text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                                                >
                                                    {label}
                                                </Link>
                                            ))}
                                        </div>

                                        <p className="text-xs text-[var(--color-muted)] font-[var(--font-rajdhani)] text-center sm:text-right">
                                            頑張ってください — Keep going
                                        </p>
                                    </div>
                                </footer>

                            </div>
                        </StudyPlanProvider>
                    </MockTestProvider>
                </ProgressProvider>
            </GoalProvider>
        </EntryProvider>
    );
}