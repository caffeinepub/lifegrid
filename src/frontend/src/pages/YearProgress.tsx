import { Button } from "@/components/ui/button";
import { Calendar, Download, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext";
import { getDayOfYear, getDaysInYear } from "../utils/dateUtils";
import { exportYearProgress } from "../utils/exportPng";

export default function YearProgress() {
  const { theme } = useTheme();
  const today = new Date();
  const year = today.getFullYear();
  const dayOfYear = getDayOfYear(today);
  const totalDays = getDaysInYear(year);
  const pct = ((dayOfYear / totalDays) * 100).toFixed(1);

  const COLS = 25;
  const dotIndices = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => i),
    [totalDays],
  );

  function handleExport() {
    exportYearProgress(dayOfYear, totalDays, year, theme.exportColors);
    toast.success("Wallpaper saved!");
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title: "LifeGrid – Year Progress",
        text: `Day ${dayOfYear} of ${totalDays} — ${pct}% of ${year} complete. Track your time with LifeGrid.`,
      });
    } else {
      await navigator.clipboard.writeText(
        `Day ${dayOfYear} of ${totalDays} — ${pct}% of ${year} complete. Track your time with LifeGrid.`,
      );
      toast.success("Copied to clipboard!");
    }
  }

  return (
    <motion.div
      className="flex flex-col items-center px-4 py-8 gap-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground text-sm tracking-widest uppercase">
            Year Progress
          </span>
        </div>
        <h1 className="font-display text-6xl font-bold text-primary text-glow">
          {pct}%
        </h1>
        <p className="text-muted-foreground mt-1">
          Day <span className="text-foreground font-semibold">{dayOfYear}</span>{" "}
          of <span className="text-foreground font-semibold">{totalDays}</span>{" "}
          — {year}
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative w-full max-w-xs">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            style={{ boxShadow: "0 0 12px oklch(var(--primary) / 0.6)" }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Dot Grid */}
      <div className="w-full max-w-sm">
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: labeled via aria-label */}
        <svg
          viewBox={`0 0 ${COLS * 16} ${Math.ceil(totalDays / COLS) * 16}`}
          className="w-full dot-glow"
          role="img"
          aria-label={`${dayOfYear} of ${totalDays} days filled for ${year}`}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* biome-ignore lint/suspicious/noArrayIndexKey: static positional grid, order never changes */}
          {dotIndices.map((i) => {
            const filled = i < dayOfYear;
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            return (
              <circle
                key={i}
                cx={col * 16 + 8}
                cy={row * 16 + 8}
                r={5}
                fill={
                  filled
                    ? theme.exportColors.dotFill
                    : theme.exportColors.dotEmpty
                }
                filter={filled ? "url(#glow)" : undefined}
              />
            );
          })}
        </svg>
      </div>

      {/* Motivation Quote */}
      <p className="text-center text-muted-foreground text-sm max-w-xs italic">
        &ldquo;The future is created by what you do today, not tomorrow.&rdquo;
      </p>

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-xs">
        <Button
          className="flex-1"
          onClick={handleExport}
          data-ocid="year.export_button"
        >
          <Download className="w-4 h-4 mr-2" />
          Export PNG
        </Button>
        <Button variant="outline" className="flex-1" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </motion.div>
  );
}
