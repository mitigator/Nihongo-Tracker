"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { EntryProvider } from "@/context/EntryContext";
import { GoalProvider } from "@/context/GoalContext";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: "var(--color-bg)" }}
            >
                <div
                    className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                    style={{
                        borderColor: "var(--color-primary)",
                        borderTopColor: "transparent",
                    }}
                />
            </div>
        );
    }

    if (!user) return null;

    const navLinks = [
        { href: "/dashboard", label: "DAILY", exact: true },
        { href: "/dashboard/goals", label: "GOALS", exact: false },
    ];

    return (
        <EntryProvider>
            <GoalProvider>
                <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
                    {/* Ambient glow */}
                    <div
                        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-[0.05] pointer-events-none"
                        style={{ background: "var(--color-primary)" }}
                    />

                    {/* Navbar */}
                    <nav
                        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b"
                        style={{
                            background: "var(--color-card)",
                            borderColor: "var(--color-border)",
                        }}
                    >
                        {/* Logo */}
                        <span
                            className="text-lg font-black tracking-widest"
                            style={{
                                color: "var(--color-primary)",
                                fontFamily: "var(--font-orbitron)",
                            }}
                        >
                            日本語 TRACKER
                        </span>

                        {/* Nav links */}
                        <div className="flex items-center gap-1">
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
                                            color: isActive
                                                ? "#000"
                                                : "var(--color-text-muted)",
                                            background: isActive
                                                ? "var(--color-primary)"
                                                : "transparent",
                                            fontFamily: "var(--font-orbitron)",
                                        }}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-4">
                            <span
                                className="text-sm font-semibold hidden sm:block"
                                style={{
                                    color: "var(--color-text-muted)",
                                    fontFamily: "var(--font-rajdhani)",
                                }}
                            >
                                {user.name}
                            </span>
                            <ThemeToggle />
                        </div>
                    </nav>

                    <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
                        {children}
                    </main>
                </div>
            </GoalProvider>
        </EntryProvider>
    );
}