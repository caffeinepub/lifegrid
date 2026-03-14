import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Calendar, LayoutGrid, Palette, Target, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import LandingScreen from "./components/LandingScreen";
import LiveWallpaper from "./components/LiveWallpaper";
import { ThemeProvider } from "./context/ThemeContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import Goals from "./pages/Goals";
import Habits from "./pages/Habits";
import LifeCalendar from "./pages/LifeCalendar";
import Themes from "./pages/Themes";
import YearProgress from "./pages/YearProgress";

type Tab = "year" | "life" | "goals" | "habits" | "themes";

const TABS: {
  id: Tab;
  label: string;
  Icon: React.ElementType;
  ocid: string;
}[] = [
  { id: "year", label: "Year", Icon: Calendar, ocid: "nav.year_tab" },
  { id: "life", label: "Life", Icon: LayoutGrid, ocid: "nav.life_tab" },
  { id: "goals", label: "Goals", Icon: Target, ocid: "nav.goals_tab" },
  { id: "habits", label: "Habits", Icon: Zap, ocid: "nav.habits_tab" },
  { id: "themes", label: "Themes", Icon: Palette, ocid: "nav.themes_tab" },
];

function MainApp() {
  const [activeTab, setActiveTab] = useState<Tab>("year");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LiveWallpaper />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
          <span
            className="font-display text-xl font-bold"
            style={{
              color: "oklch(var(--primary))",
              textShadow: "0 0 20px oklch(var(--primary) / 0.4)",
            }}
          >
            LifeGrid
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 max-w-lg mx-auto w-full overflow-x-hidden relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "year" && <YearProgress key="year" />}
          {activeTab === "life" && <LifeCalendar key="life" />}
          {activeTab === "goals" && <Goals key="goals" />}
          {activeTab === "habits" && <Habits key="habits" />}
          {activeTab === "themes" && <Themes key="themes" />}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/90 backdrop-blur-md">
        <div className="flex max-w-lg mx-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                data-ocid={tab.ocid}
                className={cn(
                  "flex-1 flex flex-col items-center py-2 gap-0.5 text-[10px] font-medium transition-colors relative",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/70",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                    style={{ boxShadow: "0 0 8px oklch(var(--primary) / 0.8)" }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <tab.Icon
                  className={cn(
                    "w-5 h-5 transition-all",
                    isActive && "scale-110",
                  )}
                  style={isActive ? { color: "oklch(var(--primary))" } : {}}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <Toaster />
    </div>
  );
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <ThemeProvider>
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "oklch(0.08 0.015 260)" }}
        >
          <div className="text-center">
            <div
              className="font-display text-2xl font-bold mb-2 animate-pulse"
              style={{ color: "#00e5ff" }}
            >
              LifeGrid
            </div>
            <p className="text-sm" style={{ color: "oklch(0.52 0.05 260)" }}>
              Loading...
            </p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!identity) {
    return (
      <ThemeProvider>
        <LandingScreen />
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
