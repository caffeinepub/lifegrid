import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Palette } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { THEMES, type ThemeName, useTheme } from "../context/ThemeContext";
import { useGetUserProfile, useSaveUserProfile } from "../hooks/useQueries";

const PREVIEW_INDICES = Array.from({ length: 20 }, (_, i) => i);

export default function Themes() {
  const { themeName, setTheme } = useTheme();
  const { data: profile } = useGetUserProfile();
  const saveProfile = useSaveUserProfile();

  function handleSelectTheme(name: ThemeName, index: number) {
    setTheme(name);
    const existing = profile ?? { dateOfBirth: "", themePreference: name };
    saveProfile.mutate(
      { ...existing, themePreference: name },
      {
        onSuccess: () =>
          toast.success(`Theme "${THEMES[index - 1].label}" applied!`),
      },
    );
  }

  return (
    <motion.div
      className="flex flex-col px-4 py-8 gap-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Palette className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground text-sm tracking-widest uppercase">
            Themes
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          Choose your aesthetic. Make it yours.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {THEMES.map((t, i) => {
          const isActive = themeName === t.name;
          return (
            <motion.button
              key={t.name}
              type="button"
              data-ocid={`themes.item.${i + 1}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectTheme(t.name, i + 1)}
              className={cn(
                "relative flex flex-col rounded-xl border-2 overflow-hidden transition-all text-left",
                isActive
                  ? "border-primary shadow-glow"
                  : "border-border hover:border-muted-foreground/50",
              )}
            >
              {/* Preview */}
              <div
                className="h-24 p-3 flex flex-col justify-between"
                style={{ backgroundColor: t.previewBg }}
              >
                {/* Mini dot grid */}
                <div className="flex gap-1 flex-wrap">
                  {/* biome-ignore lint/suspicious/noArrayIndexKey: static decorative preview grid */}
                  {PREVIEW_INDICES.map((idx) => (
                    <div
                      key={idx}
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          idx < 8 ? t.previewDot : t.previewEmpty,
                        boxShadow:
                          idx < 8 ? `0 0 4px ${t.previewDot}80` : "none",
                      }}
                    />
                  ))}
                </div>

                {/* Mini bar */}
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: t.previewEmpty }}
                >
                  <div
                    className="h-full w-2/5 rounded-full"
                    style={{ backgroundColor: t.previewDot }}
                  />
                </div>
              </div>

              {/* Label */}
              <div className="bg-card px-3 py-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {t.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {t.description}
                  </p>
                </div>
                {isActive && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="text-center">
        <Button variant="outline" className="text-xs" disabled>
          Custom colors — Premium only
        </Button>
      </div>
    </motion.div>
  );
}
