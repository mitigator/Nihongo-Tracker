"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { Theme, themes, defaultTheme } from "@/lib/themes";

interface ThemeContextType {
    activeTheme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    const { colors } = theme;

    root.style.setProperty("--color-bg", colors.bg);
    root.style.setProperty("--color-card", colors.card);
    root.style.setProperty("--color-primary", colors.primary);
    root.style.setProperty("--color-primary-gradient", colors.primaryGradient || colors.primary);
    root.style.setProperty("--color-secondary", colors.secondary);
    root.style.setProperty("--color-accent", colors.accent);
    root.style.setProperty("--color-text", colors.text);
    root.style.setProperty("--color-text-muted", colors.textMuted);
    root.style.setProperty("--color-border", colors.border);
    root.style.setProperty("--color-xp-bar", colors.xpBar);
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [activeTheme, setActiveTheme] = useState<Theme>(defaultTheme);

    useEffect(() => {
        const savedThemeId = localStorage.getItem("nihongo-theme");
        if (savedThemeId) {
            const found = themes.find((t) => t.id === savedThemeId);
            if (found) {
                setActiveTheme(found);
                applyTheme(found);
                return;
            }
        }
        applyTheme(defaultTheme);
    }, []);

    const setTheme = (theme: Theme) => {
        setActiveTheme(theme);
        applyTheme(theme);
        localStorage.setItem("nihongo-theme", theme.id);
    };

    return (
        <ThemeContext.Provider value={{ activeTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};