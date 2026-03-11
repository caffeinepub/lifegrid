import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Goal, HabitView, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export function useGetUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useGetGoals() {
  const { actor, isFetching } = useActor();
  return useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGoals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateGoal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      targetDate,
    }: { name: string; targetDate: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createGoal(name, targetDate);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useDeleteGoal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (goalId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteGoal(goalId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useUpdateGoal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      goalId,
      name,
      targetDate,
    }: {
      goalId: bigint;
      name: string;
      targetDate: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateGoal(goalId, name, targetDate);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useGetHabits() {
  const { actor, isFetching } = useActor();
  return useQuery<HabitView[]>({
    queryKey: ["habits"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHabits();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateHabit() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.createHabit(name);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useDeleteHabit() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (habitId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteHabit(habitId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useMarkHabitComplete() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      habitId,
      date,
    }: { habitId: bigint; date: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.markHabitComplete(habitId, date);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}
