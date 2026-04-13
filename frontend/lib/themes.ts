export interface Theme {
  id: string;
  name: string;
  emoji: string;
  label: string; // Japanese name for flavor
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
    // Deep ink on washi — classic Japanese calligraphy feel
    id: "sumi",
    name: "Sumi Ink",
    label: "墨",
    emoji: "🖌️",
    colors: {
      bg: "#0D0D0D",
      card: "#161616",
      primary: "#C0392B",       // torii vermillion
      secondary: "#E8D5B0",     // washi paper
      accent: "#8B7355",        // aged ink brown
      text: "#F0EDE8",          // warm off-white
      textMuted: "#8A8075",     // faded ink
      border: "#2A2520",        // dark border
      xpBar: "#C0392B",
    },
  },
  {
    // Cherry blossom — soft pink light mode
    id: "sakura",
    name: "Sakura",
    label: "桜",
    emoji: "🌸",
    colors: {
      bg: "#FDF6F0",
      card: "#FFFFFF",
      primary: "#C0687A",       // deep sakura pink
      secondary: "#8B6BA8",     // wisteria purple
      accent: "#E8A598",        // soft petal
      text: "#2D1F1F",          // dark ink
      textMuted: "#7A6570",     // muted rose-gray
      border: "#EDD8D0",        // blush border
      xpBar: "#C0687A",
    },
  },
  {
    // Matcha tea house — green earthy tones
    id: "matcha",
    name: "Matcha",
    label: "抹茶",
    emoji: "🍵",
    colors: {
      bg: "#0F1410",
      card: "#161D17",
      primary: "#7CB87A",       // matcha green
      secondary: "#C8A96E",     // gold tea rim
      accent: "#4A7C59",        // deep forest
      text: "#E8F0E8",          // pale green-white
      textMuted: "#7A9A7A",     // faded moss
      border: "#243024",        // dark forest border
      xpBar: "#7CB87A",
    },
  },
  {
    // Indigo dye — traditional Japanese textile
    id: "ai",
    name: "Ai Indigo",
    label: "藍",
    emoji: "🪬",
    colors: {
      bg: "#080E1A",
      card: "#0D1628",
      primary: "#4A90C4",       // indigo blue
      secondary: "#C4A45A",     // gold accent
      accent: "#7BB8D4",        // pale indigo
      text: "#E8EEF8",          // cool white
      textMuted: "#6A82A8",     // muted indigo
      border: "#1A2840",        // deep navy border
      xpBar: "#4A90C4",
    },
  },
  {
    // Autumn maple — warm reds and ambers
    id: "koyo",
    name: "Kōyō",
    label: "紅葉",
    emoji: "🍂",
    colors: {
      bg: "#0F0A06",
      card: "#1A1008",
      primary: "#D4622A",       // maple orange-red
      secondary: "#C4952A",     // golden ginkgo
      accent: "#8B3A1A",        // deep ember
      text: "#F8EEE0",          // warm cream
      textMuted: "#9A7A60",     // autumn dust
      border: "#2A1A0A",        // dark bark
      xpBar: "#D4622A",
    },
  },
  {
    // Snow and pine — minimal winter white
    id: "yuki",
    name: "Yuki",
    label: "雪",
    emoji: "❄️",
    colors: {
      bg: "#F8FAFB",
      card: "#FFFFFF",
      primary: "#2D6A8A",       // winter pine blue
      secondary: "#4A8B6A",     // pine green
      accent: "#8AAABB",        // frost
      text: "#1A2830",          // deep ink
      textMuted: "#6A8090",     // muted slate
      border: "#DDE8EE",        // ice border
      xpBar: "#2D6A8A",
    },
  },
  {
    // Night festival — lantern glow dark mode
    id: "matsuri",
    name: "Matsuri",
    label: "祭",
    emoji: "🏮",
    colors: {
      bg: "#0A0608",
      card: "#140C10",
      primary: "#E8762A",       // lantern orange
      secondary: "#C4304A",     // festival red
      accent: "#E8C44A",        // gold shimmer
      text: "#F8EEE8",          // warm glow
      textMuted: "#9A7868",     // ember smoke
      border: "#2A1A18",        // dark lacquer
      xpBar: "#E8762A",
    },
  },
];

export const defaultTheme = themes[0]; // Sumi Ink as default