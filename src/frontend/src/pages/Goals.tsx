import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Download, Loader2, Plus, Target, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Goal } from "../backend.d";
import { useTheme } from "../context/ThemeContext";
import { useCreateGoal, useDeleteGoal, useGetGoals } from "../hooks/useQueries";
import {
  formatTimestamp,
  getDaysRemaining,
  getGoalProgress,
} from "../utils/dateUtils";
import { exportGoalCard } from "../utils/exportPng";

function GoalCard({
  goal,
  index,
  onDelete,
}: {
  goal: Goal;
  index: number;
  onDelete: () => void;
}) {
  const { theme } = useTheme();
  const daysLeft = getDaysRemaining(goal.targetDate);
  const progress = getGoalProgress(goal.createdTimestamp, goal.targetDate);
  const pct = Math.round(progress * 100);
  const isOverdue = daysLeft === 0 && progress < 1;

  function handleExport() {
    exportGoalCard(goal.name, daysLeft, progress, theme.exportColors);
    toast.success("Goal card exported!");
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      data-ocid={`goals.item.${index}`}
      className="card-glow bg-card border border-border rounded-lg p-4 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {goal.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Created {formatTimestamp(goal.createdTimestamp)} · Target:{" "}
            {goal.targetDate}
          </p>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleExport}
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={onDelete}
            data-ocid={`goals.delete_button.${index}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className="font-display text-3xl font-bold"
          style={{
            color: isOverdue
              ? "oklch(var(--destructive))"
              : "oklch(var(--primary))",
          }}
        >
          {daysLeft}
        </span>
        <span className="text-muted-foreground text-sm">
          {isOverdue ? "days overdue" : "days remaining"}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <Progress value={pct} className="h-1.5" />
        <p className="text-xs text-muted-foreground">{pct}% elapsed</p>
      </div>
    </motion.div>
  );
}

export default function Goals() {
  const { data: goals = [], isLoading } = useGetGoals();
  const createGoal = useCreateGoal();
  const deleteGoal = useDeleteGoal();
  const [name, setName] = useState("");
  const [targetDate, setTargetDate] = useState("");

  function handleAdd() {
    if (!name.trim() || !targetDate) return;
    createGoal.mutate(
      { name: name.trim(), targetDate },
      {
        onSuccess: () => {
          toast.success("Goal created!");
          setName("");
          setTargetDate("");
        },
        onError: () => toast.error("Failed to create goal."),
      },
    );
  }

  function handleDelete(goalId: bigint) {
    deleteGoal.mutate(goalId, {
      onSuccess: () => toast.success("Goal deleted."),
      onError: () => toast.error("Failed to delete."),
    });
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
          <Target className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground text-sm tracking-widest uppercase">
            Goal Countdown
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          Track what matters. Count down to your goals.
        </p>
      </div>

      {/* Add Goal Form */}
      <div className="card-glow bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Add New Goal</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="goal-name" className="text-xs text-muted-foreground">
            Goal Name
          </Label>
          <Input
            id="goal-name"
            placeholder="e.g. Launch my startup"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            data-ocid="goals.name_input"
            className="bg-muted"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="goal-date" className="text-xs text-muted-foreground">
            Target Date
          </Label>
          <Input
            id="goal-date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            data-ocid="goals.date_input"
            className="bg-muted"
          />
        </div>
        <Button
          onClick={handleAdd}
          disabled={!name.trim() || !targetDate || createGoal.isPending}
          data-ocid="goals.add_button"
        >
          {createGoal.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Add Goal
        </Button>
      </div>

      {/* Goals List */}
      {isLoading ? (
        <div className="text-center text-muted-foreground py-8 animate-pulse">
          Loading goals...
        </div>
      ) : goals.length === 0 ? (
        <div
          data-ocid="goals.empty_state"
          className="text-center py-16 flex flex-col items-center gap-3"
        >
          <Target className="w-12 h-12 text-muted-foreground/30" />
          <p className="text-muted-foreground">No goals yet.</p>
          <p className="text-muted-foreground text-sm">
            Add your first goal above to start counting down.
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {goals.map((goal, i) => (
            <GoalCard
              key={String(goal.id)}
              goal={goal}
              index={i + 1}
              onDelete={() => handleDelete(goal.id)}
            />
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
