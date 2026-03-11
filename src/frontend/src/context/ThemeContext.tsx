import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type ThemeName =
  | "dark"
  | "minimal"
  | "neon"
  | "space"
  | "matrix"
  | "gradient"
  | "motivational";

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  description: string;
  previewBg: string;
  previewDot: string;
  previewEmpty: string;
  exportColors: {
    bg: string;
    cardBg: string;
    dotFill: string;
    dotEmpty: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
  };
}

export const THEMES: ThemeConfig[] = [
  {
    name: "dark",
    label: "Dark",
    description: "Deep space with electric cyan",
    previewBg: "#050c1a",
    previewDot: "#00e5ff",
    previewEmpty: "rgba(255,255,255,0.08)",
    exportColors: {
      bg: "#050c1a",
      cardBg: "#0a1628",
      dotFill: "#00e5ff",
      dotEmpty: "rgba(255,255,255,0.08)",
      textPrimary: "#e8f0ff",
      textSecondary: "#5a7a9f",
      accent: "#ffd060",
    },
  },
  {
    name: "minimal",
    label: "Minimal",
    description: "Clean monochrome darkness",
    previewBg: "#111111",
    previewDot: "#bbbbbb",
    previewEmpty: "rgba(255,255,255,0.07)",
    exportColors: {
      bg: "#111111",
      cardBg: "#1c1c1c",
      dotFill: "#bbbbbb",
      dotEmpty: "rgba(255,255,255,0.07)",
      textPrimary: "#e0e0e0",
      textSecondary: "#666666",
      accent: "#888888",
    },
  },
  {
    name: "neon",
    label: "Neon",
    description: "Acid lime on void black",
    previewBg: "#06050f",
    previewDot: "#39ff14",
    previewEmpty: "rgba(57,255,20,0.07)",
    exportColors: {
      bg: "#06050f",
      cardBg: "#0c0b1a",
      dotFill: "#39ff14",
      dotEmpty: "rgba(57,255,20,0.07)",
      textPrimary: "#e0ffe0",
      textSecondary: "#3a7a3a",
      accent: "#ff2d8f",
    },
  },
  {
    name: "space",
    label: "Space",
    description: "Violet nebula depths",
    previewBg: "#060510",
    previewDot: "#b06fff",
    previewEmpty: "rgba(176,111,255,0.08)",
    exportColors: {
      bg: "#060510",
      cardBg: "#0d0b1e",
      dotFill: "#b06fff",
      dotEmpty: "rgba(176,111,255,0.08)",
      textPrimary: "#e8e0ff",
      textSecondary: "#5a4a7a",
      accent: "#00e5ff",
    },
  },
  {
    name: "matrix",
    label: "Matrix",
    description: "Terminal green on black",
    previewBg: "#020b04",
    previewDot: "#00ff41",
    previewEmpty: "rgba(0,255,65,0.06)",
    exportColors: {
      bg: "#020b04",
      cardBg: "#041208",
      dotFill: "#00ff41",
      dotEmpty: "rgba(0,255,65,0.06)",
      textPrimary: "#aaffaa",
      textSecondary: "#1a6620",
      accent: "#00cc33",
    },
  },
  {
    name: "gradient",
    label: "Gradient",
    description: "Deep blue-violet cosmos",
    previewBg: "#080515",
    previewDot: "#7b68ee",
    previewEmpty: "rgba(123,104,238,0.08)",
    exportColors: {
      bg: "#080515",
      cardBg: "#100b22",
      dotFill: "#7b68ee",
      dotEmpty: "rgba(123,104,238,0.08)",
      textPrimary: "#e0d8ff",
      textSecondary: "#4a3a7a",
      accent: "#ff7eb3",
    },
  },
  {
    name: "motivational",
    label: "Motivational",
    description: "Warm amber fire energy",
    previewBg: "#0f0805",
    previewDot: "#ffb020",
    previewEmpty: "rgba(255,176,32,0.08)",
    exportColors: {
      bg: "#0f0805",
      cardBg: "#1a1005",
      dotFill: "#ffb020",
      dotEmpty: "rgba(255,176,32,0.08)",
      textPrimary: "#fff0d0",
      textSecondary: "#7a5a20",
      accent: "#ff6030",
    },
  },
];

interface ThemeContextValue {
  themeName: ThemeName;
  theme: ThemeConfig;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeName: "dark",
  theme: THEMES[0],
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("lg-theme") as ThemeName | null;
    if (saved && THEMES.find((t) => t.name === saved)) {
      setThemeName(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeName);
    localStorage.setItem("lg-theme", themeName);
  }, [themeName]);

  const theme = THEMES.find((t) => t.name === themeName) ?? THEMES[0];

  return (
    <ThemeContext.Provider value={{ themeName, theme, setTheme: setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
