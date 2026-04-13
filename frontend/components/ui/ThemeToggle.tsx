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
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-opacity hover:opacity-80"
                style={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                    fontFamily: "var(--font-orbitron)",
                    fontSize: "11px",
                    fontWeight: 700,
                }}
                title="Change theme"
            >
                <span style={{ fontSize: "16px" }}>{activeTheme.emoji}</span>
                <span className="hidden sm:inline tracking-wider">{activeTheme.name.toUpperCase()}</span>
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
                    style={{
                        opacity: 0.6,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                    }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden z-50"
                    style={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    }}
                >
                    {/* Header */}
                    <div
                        className="px-4 py-2.5 text-xs font-black uppercase tracking-widest"
                        style={{
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-orbitron)",
                            borderBottom: "1px solid var(--color-border)",
                        }}
                    >
                        Select Theme
                    </div>

                    {/* Theme options */}
                    {themes.map((theme) => {
                        const isActive = theme.id === activeTheme.id;
                        return (
                            <button
                                key={theme.id}
                                onClick={() => {
                                    setTheme(theme);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
                                style={{
                                    background: isActive ? "var(--color-border)" : "transparent",
                                    color: "var(--color-text)",
                                    fontFamily: "var(--font-rajdhani)",
                                    fontSize: "15px",
                                    fontWeight: 600,
                                }}
                                onMouseEnter={(e) =>
                                    !isActive && (e.currentTarget.style.background = "var(--color-border)")
                                }
                                onMouseLeave={(e) =>
                                    !isActive && (e.currentTarget.style.background = "transparent")
                                }
                            >
                                {/* Color preview */}
                                <span
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ background: theme.colors.primary }}
                                />
                                <span style={{ fontSize: "16px" }}>{theme.emoji}</span>
                                <span>{theme.name}</span>

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
                                        className="ml-auto"
                                        style={{ color: "var(--color-primary)" }}
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default ThemeToggle;