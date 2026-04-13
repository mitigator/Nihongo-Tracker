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

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    // Close mobile menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: "var(--color-bg)" }}
            >
                <div
                    className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                    style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }}
                />
            </div>
        );
    }

    if (!user) return null;

    const navLinks = [
        { href: "/dashboard", label: "DAILY", exact: true },
        { href: "/dashboard/goals", label: "GOALS", exact: false },
        { href: "/dashboard/tests", label: "TESTS", exact: false },
        { href: "/dashboard/plans", label: "PLANS", exact: false },
        { href: "/dashboard/analytics", label: "ANALYTICS", exact: false },
    ];

    return (
        <EntryProvider>
            <GoalProvider>
                <ProgressProvider>
                    <MockTestProvider>
                        <StudyPlanProvider>
                            <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
                                {/* Ambient glow */}
                                <div
                                    className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-[0.05] pointer-events-none"
                                    style={{ background: "var(--color-primary)" }}
                                />

                                {/* Navbar */}
                                <nav
                                    className="sticky top-0 z-40 border-b"
                                    style={{
                                        background: "var(--color-card)",
                                        borderColor: "var(--color-border)",
                                    }}
                                >
                                    <div className="flex items-center justify-between px-6 py-4">
                                        {/* Logo */}
                                        <span
                                            className="text-lg font-black tracking-widest"
                                            style={{ color: "var(--color-primary)", fontFamily: "var(--font-orbitron)" }}
                                        >
                                            日本語 TRACKER
                                        </span>

                                        {/* Desktop nav links */}
                                        <div className="hidden md:flex items-center gap-1">
                                            {navLinks.map(({ href, label, exact }) => {
                                                const isActive = exact
                                                    ? pathname === href
                                                    : pathname.startsWith(href);
                                                return (
                                                    <Link
                                                        key={href}
                                                        href={href}
                                                        className="text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all"
                                                        style={{
                                                            color: isActive ? "#000" : "var(--color-text-muted)",
                                                            background: isActive ? "var(--color-primary)" : "transparent",
                                                            fontFamily: "var(--font-orbitron)",
                                                        }}
                                                    >
                                                        {label}
                                                    </Link>
                                                );
                                            })}
                                        </div>

                                        {/* Right side */}
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="text-sm font-semibold hidden sm:block"
                                                style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-rajdhani)" }}
                                            >
                                                {user.name}
                                            </span>
                                            <ThemeToggle />

                                            {/* Hamburger — mobile only */}
                                            <button
                                                onClick={() => setMenuOpen((prev) => !prev)}
                                                className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
                                                aria-label="Toggle menu"
                                            >
                                                <span
                                                    className="block w-5 h-0.5 transition-all duration-300"
                                                    style={{
                                                        background: "var(--color-text-muted)",
                                                        transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
                                                    }}
                                                />
                                                <span
                                                    className="block w-5 h-0.5 transition-all duration-300"
                                                    style={{
                                                        background: "var(--color-text-muted)",
                                                        opacity: menuOpen ? 0 : 1,
                                                    }}
                                                />
                                                <span
                                                    className="block w-5 h-0.5 transition-all duration-300"
                                                    style={{
                                                        background: "var(--color-text-muted)",
                                                        transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none",
                                                    }}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mobile menu dropdown */}
                                    {menuOpen && (
                                        <div
                                            className="md:hidden border-t px-4 py-3 flex flex-col gap-1"
                                            style={{ borderColor: "var(--color-border)" }}
                                        >
                                            {navLinks.map(({ href, label, exact }) => {
                                                const isActive = exact
                                                    ? pathname === href
                                                    : pathname.startsWith(href);
                                                return (
                                                    <Link
                                                        key={href}
                                                        href={href}
                                                        className="text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl transition-all"
                                                        style={{
                                                            color: isActive ? "#000" : "var(--color-text-muted)",
                                                            background: isActive ? "var(--color-primary)" : "transparent",
                                                            fontFamily: "var(--font-orbitron)",
                                                        }}
                                                    >
                                                        {label}
                                                    </Link>
                                                );
                                            })}
                                            <div
                                                className="pt-2 mt-1 border-t text-xs font-semibold px-4"
                                                style={{
                                                    borderColor: "var(--color-border)",
                                                    color: "var(--color-text-muted)",
                                                    fontFamily: "var(--font-rajdhani)",
                                                }}
                                            >
                                                {user.name}
                                            </div>
                                        </div>
                                    )}
                                </nav>

                                <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
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