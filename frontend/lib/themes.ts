export interface Theme {
  id: string;
  name: string;
  emoji: string;
  colors: {
    bg: string;
    card: string;
    primary: string;
    primaryGradient?: string;
    secondary: string;
    accent: string;
    text: string;
    textMuted: string;
    border: string;
    xpBar: string;
  };
}

export const themes: Theme[] = [
  {
    id: "neon-cyber",
    name: "Neon Cyber",
    emoji: "🎮",
    colors: {
      bg: "#0B0F1A",
      card: "#111827",
      primary: "#22C55E",
      secondary: "#3B82F6",
      accent: "#A855F7",
      text: "#E5E7EB",
      textMuted: "#9CA3AF",
      border: "#1F2937",
      xpBar: "#22C55E",
    },
  },
  {
    id: "purple-grind",
    name: "Purple Grind",
    emoji: "⚡",
    colors: {
      bg: "#0F172A",
      card: "#1E293B",
      primary: "#7C3AED",
      secondary: "#22C55E",
      accent: "#F59E0B",
      text: "#F1F5F9",
      textMuted: "#94A3B8",
      border: "#334155",
      xpBar: "#7C3AED",
    },
  },
  {
    id: "classic-xp",
    name: "Classic XP",
    emoji: "🟢",
    colors: {
      bg: "#F8FAFC",
      card: "#FFFFFF",
      primary: "#22C55E",
      secondary: "#16A34A",
      accent: "#FACC15",
      text: "#1F2937",
      textMuted: "#6B7280",
      border: "#E5E7EB",
      xpBar: "#22C55E",
    },
  },
  {
    id: "blue-tech",
    name: "Blue Tech",
    emoji: "🔵",
    colors: {
      bg: "#0A192F",
      card: "#112240",
      primary: "#3B82F6",
      secondary: "#60A5FA",
      accent: "#22C55E",
      text: "#E6F1FF",
      textMuted: "#8892B0",
      border: "#1D3461",
      xpBar: "#3B82F6",
    },
  },
  {
    id: "fire-xp",
    name: "Fire XP",
    emoji: "🔥",
    colors: {
      bg: "#0B0B0B",
      card: "#1A1A1A",
      primary: "#EF4444",
      secondary: "#F97316",
      accent: "#FACC15",
      text: "#FAFAFA",
      textMuted: "#A1A1AA",
      border: "#27272A",
      xpBar: "#EF4444",
    },
  },
  {
    id: "gradient-xp",
    name: "Gradient XP",
    emoji: "🌈",
    colors: {
      bg: "#0F172A",
      card: "#1E293B",
      primary: "#22C55E",
      primaryGradient: "linear-gradient(90deg, #22C55E, #3B82F6)",
      secondary: "#A855F7",
      accent: "#F472B6",
      text: "#E2E8F0",
      textMuted: "#94A3B8",
      border: "#334155",
      xpBar: "#22C55E",
    },
  },
  {
    id: "ice-xp",
    name: "Ice XP",
    emoji: "🧊",
    colors: {
      bg: "#020617",
      card: "#0F172A",
      primary: "#06B6D4",
      secondary: "#3B82F6",
      accent: "#22C55E",
      text: "#E0F2FE",
      textMuted: "#7DD3FC",
      border: "#1E3A5F",
      xpBar: "#06B6D4",
    },
  },
];

export const defaultTheme = themes[0]; // Neon Cyber as default