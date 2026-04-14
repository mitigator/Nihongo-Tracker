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
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.replace("/login");
    }, [user, loading, router]);

    useEffect(() => { setMenuOpen(false); }, [pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
                <div className="w-8 h-8 rounded-full border-[3px] animate-spin border-[var(--color-border)] border-t-[var(--color-primary)]" />
            </div>
        );
    }

    if (!user) return null;

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
                            <div className="min-h-screen bg-[var(--color-bg)]">

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
                                                <div className="font-semibold text-sm text-[var(--color-muted)] font-[var(--font-rajdhani)] px-5 pt-4 mt-1 border-t border-[var(--color-border)]">
                                                    {user.name}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </nav>

                                <main className="app-container py-8 sm:py-10">
                                    {children}
                                </main>

                            </div>
                        </StudyPlanProvider>
                    </MockTestProvider>
                </ProgressProvider>
            </GoalProvider>
        </EntryProvider>
    );
}