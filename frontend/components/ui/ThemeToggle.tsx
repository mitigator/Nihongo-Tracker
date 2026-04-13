"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/lib/themes";

const ThemeToggle = () => {
    const { activeTheme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-opacity hover:opacity-80 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] font-[var(--font-orbitron)] text-[11px] font-bold"
                title="Change theme"
            >
                <span className="text-base leading-none">{activeTheme.emoji}</span>
                <span className="hidden sm:inline tracking-wider uppercase">{activeTheme.name}</span>
                <span className="hidden sm:inline text-[var(--color-primary)] font-[var(--font-orbitron)]">
                    {activeTheme.label}
                </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`opacity-60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                    <div className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden z-50 bg-[var(--color-card)] border border-[var(--color-border)] shadow-2xl">

                        <div className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-orbitron)] border-b border-[var(--color-border)]">
                            テーマ — Theme
                        </div>

                        <div className="py-1">
                            {themes.map((theme) => {
                                const isActive = theme.id === activeTheme.id;
                                return (
                                    <button
                                        key={theme.id}
                                        onClick={() => {
                                            setTheme(theme);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left text-sm font-semibold text-[var(--color-text)] font-[var(--font-rajdhani)] hover:bg-[var(--color-border)] ${isActive ? "bg-[var(--color-border)]" : ""}`}
                                    >
                                        <span
                                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                            style={{ background: theme.colors.primary }}
                                        />
                                        <span className="text-base leading-none">{theme.emoji}</span>
                                        <span className="flex-1">{theme.name}</span>
                                        <span className="text-xs text-[var(--color-primary)] font-[var(--font-orbitron)]">
                                            {theme.label}
                                        </span>

                                        {isActive && (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-[var(--color-primary)]"
                                            >
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ThemeToggle;