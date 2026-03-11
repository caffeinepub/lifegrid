import { Button } from "@/components/ui/button";
import {
  Calendar,
  Crown,
  Heart,
  LogIn,
  Palette,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const FEATURES = [
  {
    icon: Calendar,
    label: "Year Progress",
    description: "Watch 2026 tick by, dot by dot",
  },
  {
    icon: Heart,
    label: "Life Calendar",
    description: "80 years visualized in one grid",
  },
  {
    icon: Target,
    label: "Goal Countdown",
    description: "Never lose sight of your deadlines",
  },
  {
    icon: Zap,
    label: "Habit Streaks",
    description: "Build consistency day by day",
  },
  {
    icon: Palette,
    label: "7 Themes",
    description: "From Neon to Matrix to Minimal",
  },
];

const DOT_INDICES = Array.from({ length: 365 }, (_, i) => i);

// Mini preview dot grid
function PreviewGrid() {
  const DAY = 70;
  const TOTAL = 365;
  const COLS = 25;
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: decorative preview graphic
    <svg
      viewBox={`0 0 ${COLS * 14} ${Math.ceil(TOTAL / COLS) * 14}`}
      className="w-full opacity-90"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <filter id="lg">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* biome-ignore lint/suspicious/noArrayIndexKey: static decorative grid, order never changes */}
      {DOT_INDICES.map((i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const filled = i < DAY;
        return (
          <circle
            key={i}
            cx={col * 14 + 7}
            cy={row * 14 + 7}
            r={4}
            fill={filled ? "#00e5ff" : "rgba(255,255,255,0.08)"}
            filter={filled ? "url(#lg)" : undefined}
          />
        );
      })}
    </svg>
  );
}

export default function LandingScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div
      className="min-h-screen flex flex-col overflow-auto"
      style={{
        background: "oklch(0.08 0.015 260)",
        color: "oklch(0.93 0.01 240)",
      }}
    >
      {/* Hero */}
      <div className="relative flex flex-col items-center px-6 pt-16 pb-10 text-center overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 40% at 50% 0%, oklch(0.78 0.22 195 / 0.12) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs mb-6 text-cyan-300">
            <Crown className="w-3 h-3" />
            <span>Track your time like never before</span>
          </div>

          <h1
            className="font-display text-5xl sm:text-6xl font-bold mb-3 leading-none"
            style={{
              color: "#00e5ff",
              textShadow: "0 0 40px rgba(0,229,255,0.4)",
            }}
          >
            LifeGrid
          </h1>
          <p className="text-lg text-white/60 mb-8 max-w-xs mx-auto leading-relaxed">
            Visualize your time. Build habits. Chase goals.
            <br />
            <span className="text-white/40 text-sm">
              Every day, every week, every year.
            </span>
          </p>
        </motion.div>

        {/* Preview Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10 w-full max-w-xs mb-8"
        >
          <div
            className="rounded-2xl border border-white/10 p-4"
            style={{ background: "oklch(0.12 0.018 260)" }}
          >
            <p className="text-xs text-white/40 mb-3 text-left">
              2026 — Day 70 of 365 &nbsp;·&nbsp; 19.2%
            </p>
            <PreviewGrid />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="relative z-10"
        >
          <Button
            size="lg"
            onClick={() => login()}
            disabled={isLoggingIn}
            className="font-semibold px-8 py-6 text-base"
            style={{ boxShadow: "0 0 30px oklch(0.78 0.22 195 / 0.35)" }}
          >
            <LogIn className="w-5 h-5 mr-2" />
            {isLoggingIn ? "Connecting..." : "Sign In to Start"}
          </Button>
          <p className="text-xs text-white/30 mt-3">
            Secure · Private · No email required
          </p>
        </motion.div>
      </div>

      {/* Features */}
      <div className="px-6 pb-10 flex flex-col gap-3 max-w-sm mx-auto w-full">
        <p className="text-xs text-white/30 uppercase tracking-widest text-center mb-2">
          Everything included
        </p>
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
            className="flex items-center gap-4 rounded-xl border border-white/8 px-4 py-3"
            style={{ background: "oklch(0.12 0.018 260)" }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "oklch(0.78 0.22 195 / 0.12)" }}
            >
              <f.icon className="w-4 h-4" style={{ color: "#00e5ff" }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/90">{f.label}</p>
              <p className="text-xs text-white/40">{f.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center pb-8 text-xs text-white/20">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white/40 transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
