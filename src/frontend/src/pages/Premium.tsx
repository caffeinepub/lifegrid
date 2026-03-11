import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  Crown,
  Download,
  Palette,
  Shield,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

const FEATURES = [
  {
    icon: Shield,
    title: "Remove Ads",
    description: "Enjoy a clean, distraction-free experience",
  },
  {
    icon: Palette,
    title: "All Themes Unlocked",
    description: "Access exclusive premium wallpaper styles",
  },
  {
    icon: Download,
    title: "Unlimited Exports",
    description: "Export as many wallpapers as you want",
  },
  {
    icon: Sparkles,
    title: "Advanced Customization",
    description: "Custom colors, fonts, and grid styles",
  },
  {
    icon: Zap,
    title: "Priority Sync",
    description: "Instant cloud sync across all devices",
  },
];

interface PremiumDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function PremiumDialog({ open, onClose }: PremiumDialogProps) {
  function handleUpgrade() {
    toast.info("Premium coming soon! Stay tuned. 🚀", { duration: 4000 });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-sm p-0 overflow-hidden border-border"
        data-ocid="premium.dialog"
      >
        {/* Hero */}
        <div
          className="relative px-6 pt-10 pb-6 text-center"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 50% 0%, oklch(var(--primary) / 0.15) 0%, transparent 70%)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            data-ocid="premium.close_button"
            className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{
              background: "oklch(var(--primary) / 0.15)",
              boxShadow: "0 0 30px oklch(var(--primary) / 0.3)",
            }}
          >
            <Crown className="w-8 h-8 text-primary" />
          </div>

          <DialogHeader className="space-y-1">
            <DialogTitle className="font-display text-2xl font-bold text-foreground">
              LifeGrid Premium
            </DialogTitle>
            <p className="text-muted-foreground text-sm">
              Unlock the full power of your time
            </p>
          </DialogHeader>
        </div>

        {/* Features */}
        <div className="px-6 py-4 flex flex-col gap-3">
          <AnimatePresence>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "oklch(var(--primary) / 0.1)" }}
                >
                  <f.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                    {f.title}
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 flex flex-col gap-2">
          <Button
            className="w-full font-semibold"
            size="lg"
            onClick={handleUpgrade}
            style={{ boxShadow: "0 0 20px oklch(var(--primary) / 0.3)" }}
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Premium
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground"
          >
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
