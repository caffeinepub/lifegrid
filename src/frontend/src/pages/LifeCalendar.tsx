import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Heart, Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext";
import { useGetUserProfile, useSaveUserProfile } from "../hooks/useQueries";
import { getWeeksLived } from "../utils/dateUtils";
import { exportLifeCalendar } from "../utils/exportPng";

const TOTAL_WEEKS = 4160; // 80 years × 52 weeks
const COLS = 52;

export default function LifeCalendar() {
  const { data: profile, isLoading } = useGetUserProfile();
  const saveProfile = useSaveUserProfile();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dobInput, setDobInput] = useState("");

  const dob = profile?.dateOfBirth ? profile.dateOfBirth : null;
  const weeksLived = dob ? getWeeksLived(new Date(`${dob}T00:00:00`)) : 0;
  const pct = dob ? ((weeksLived / TOTAL_WEEKS) * 100).toFixed(1) : null;

  // Draw the life grid on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dob) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sqSize = 6;
    const gap = 1;
    const step = sqSize + gap;
    const rows = Math.ceil(TOTAL_WEEKS / COLS);
    const W = COLS * step;
    const H = rows * step;
    canvas.width = W;
    canvas.height = H;

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < TOTAL_WEEKS; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = col * step;
      const y = row * step;
      ctx.fillStyle =
        i < weeksLived
          ? theme.exportColors.dotFill
          : theme.exportColors.dotEmpty;
      ctx.fillRect(x, y, sqSize, sqSize);
    }
  }, [dob, weeksLived, theme]);

  function handleSaveDob() {
    if (!dobInput) return;
    const existing = profile ?? { dateOfBirth: "", themePreference: "dark" };
    saveProfile.mutate(
      { ...existing, dateOfBirth: dobInput },
      {
        onSuccess: () => toast.success("Date of birth saved!"),
        onError: () => toast.error("Failed to save."),
      },
    );
  }

  function handleExport() {
    if (!dob) return;
    exportLifeCalendar(weeksLived, TOTAL_WEEKS, theme.exportColors);
    toast.success("Life calendar exported!");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center px-4 py-8 gap-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Heart className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground text-sm tracking-widest uppercase">
            Life Calendar
          </span>
        </div>
        {dob ? (
          <>
            <h1 className="font-display text-6xl font-bold text-primary text-glow">
              {pct}%
            </h1>
            <p className="text-muted-foreground mt-1">
              <span className="text-foreground font-semibold">
                {weeksLived}
              </span>{" "}
              of{" "}
              <span className="text-foreground font-semibold">
                {TOTAL_WEEKS}
              </span>{" "}
              weeks lived
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">
              Assuming 80-year lifespan
            </p>
          </>
        ) : (
          <p className="text-muted-foreground mt-2">
            Enter your date of birth to begin
          </p>
        )}
      </div>

      {!dob && (
        <div className="w-full max-w-xs card-glow bg-card border border-border rounded-lg p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={dobInput}
              onChange={(e) => setDobInput(e.target.value)}
              data-ocid="life.dob_input"
              className="bg-muted"
            />
          </div>
          <Button
            onClick={handleSaveDob}
            disabled={!dobInput || saveProfile.isPending}
            data-ocid="life.save_button"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveProfile.isPending ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      )}

      {dob && (
        <>
          {/* Life Grid Canvas */}
          <div className="w-full overflow-auto rounded-lg border border-border bg-card p-3">
            <canvas
              ref={canvasRef}
              className="w-full"
              style={{ imageRendering: "pixelated" }}
              aria-label="Life calendar grid showing weeks lived"
            />
          </div>

          {/* Year labels hint */}
          <div className="flex justify-between w-full max-w-full text-xs text-muted-foreground px-1">
            <span>Birth</span>
            <span>20 yrs</span>
            <span>40 yrs</span>
            <span>60 yrs</span>
            <span>80 yrs</span>
          </div>

          <div className="flex gap-3 w-full max-w-xs">
            <Button
              className="flex-1"
              onClick={handleExport}
              data-ocid="life.export_button"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PNG
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                saveProfile.mutate(
                  {
                    dateOfBirth: "",
                    themePreference: profile?.themePreference ?? "dark",
                  },
                  { onSuccess: () => toast.success("DOB cleared") },
                );
              }}
            >
              Change DOB
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
}
