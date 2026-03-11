import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Download, Loader2, Plus, Trash2, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { HabitView } from "../backend.d";
import { useTheme } from "../context/ThemeContext";
import {
  useCreateHabit,
  useDeleteHabit,
  useGetHabits,
  useMarkHabitComplete,
} from "../hooks/useQueries";
import {
  calculateStreak,
  formatDateStr,
  getLastNDays,
} from "../utils/dateUtils";
import { exportHabitCard } from "../utils/exportPng";

function HabitCard({
  habit,
  index,
  onDelete,
}: {
  habit: HabitView;
  index: number;
  onDelete: () => void;
}) {
  const { theme } = useTheme();
  const markComplete = useMarkHabitComplete();
  const todayStr = formatDateStr(new Date());
  const logs = habit.completionLogs;
  const streak = calculateStreak(logs);
  const last30 = getLastNDays(30);
  const logSet = new Set(logs);
  const isCompletedToday = logSet.has(todayStr);

  function handleMarkComplete() {
    markComplete.mutate(
      { habitId: habit.id, date: todayStr },
      {
        onSuccess: () => toast.success(`${habit.name} — logged for today!`),
        onError: () => toast.error("Already logged or error."),
      },
    );
  }

  function handleExport() {
    const last30Bool = last30.map((d) => logSet.has(d));
    exportHabitCard(habit.name, streak, last30Bool, theme.exportColors);
    toast.success("Habit card exported!");
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      data-ocid={`habits.item.${index}`}
      className="card-glow bg-card border border-border rounded-lg p-4 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {habit.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{todayStr}</p>
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
            data-ocid={`habits.delete_button.${index}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl font-bold text-primary">
          {streak}
        </span>
        <span className="text-muted-foreground text-sm">day streak</span>
        {streak > 0 && <span className="text-lg">🔥</span>}
      </div>

      {/* Last 30 days heatmap */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground">Last 30 days</p>
        <div className="flex gap-0.5 flex-wrap">
          {last30.map((day) => (
            <div
              key={day}
              className="w-3 h-3 rounded-sm transition-all"
              style={{
                backgroundColor: logSet.has(day)
                  ? theme.exportColors.dotFill
                  : theme.exportColors.dotEmpty,
                boxShadow: logSet.has(day)
                  ? `0 0 4px ${theme.exportColors.dotFill}80`
                  : "none",
              }}
              title={day}
            />
          ))}
        </div>
      </div>

      {/* Mark complete */}
      <Button
        size="sm"
        variant={isCompletedToday ? "secondary" : "default"}
        disabled={isCompletedToday || markComplete.isPending}
        onClick={handleMarkComplete}
        data-ocid={`habits.complete_button.${index}`}
        className="w-full"
      >
        {markComplete.isPending ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : isCompletedToday ? (
          <Check className="w-4 h-4 mr-2" />
        ) : (
          <Zap className="w-4 h-4 mr-2" />
        )}
        {isCompletedToday ? "Done for today!" : "Mark Complete Today"}
      </Button>
    </motion.div>
  );
}

export default function Habits() {
  const { data: habits = [], isLoading } = useGetHabits();
  const createHabit = useCreateHabit();
  const deleteHabit = useDeleteHabit();
  const [name, setName] = useState("");

  function handleAdd() {
    if (!name.trim()) return;
    createHabit.mutate(name.trim(), {
      onSuccess: () => {
        toast.success("Habit created!");
        setName("");
      },
      onError: () => toast.error("Failed to create habit."),
    });
  }

  function handleDelete(habitId: bigint) {
    deleteHabit.mutate(habitId, {
      onSuccess: () => toast.success("Habit deleted."),
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
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground text-sm tracking-widest uppercase">
            Habit Tracker
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          Build streaks. Visualize consistency.
        </p>
      </div>

      {/* Add Habit Form */}
      <div className="card-glow bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Add New Habit</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="habit-name" className="text-xs text-muted-foreground">
            Habit Name
          </Label>
          <Input
            id="habit-name"
            placeholder="e.g. Morning meditation"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            data-ocid="habits.name_input"
            className="bg-muted"
          />
        </div>
        <Button
          onClick={handleAdd}
          disabled={!name.trim() || createHabit.isPending}
          data-ocid="habits.add_button"
        >
          {createHabit.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Add Habit
        </Button>
      </div>

      {/* Habits List */}
      {isLoading ? (
        <div className="text-center text-muted-foreground py-8 animate-pulse">
          Loading habits...
        </div>
      ) : habits.length === 0 ? (
        <div
          data-ocid="habits.empty_state"
          className="text-center py-16 flex flex-col items-center gap-3"
        >
          <Zap className="w-12 h-12 text-muted-foreground/30" />
          <p className="text-muted-foreground">No habits yet.</p>
          <p className="text-muted-foreground text-sm">
            Start tracking a daily habit above.
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {habits.map((habit, i) => (
            <HabitCard
              key={String(habit.id)}
              habit={habit}
              index={i + 1}
              onDelete={() => handleDelete(habit.id)}
            />
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
