import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface HabitView {
    id: bigint;
    completionLogs: Array<string>;
    name: string;
    createdTimestamp: Time;
}
export type Time = bigint;
export interface UserProfile {
    dateOfBirth: string;
    themePreference: string;
}
export interface Goal {
    id: bigint;
    name: string;
    targetDate: string;
    createdTimestamp: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createGoal(name: string, targetDate: string): Promise<Goal>;
    createHabit(name: string): Promise<HabitView>;
    deleteGoal(goalId: bigint): Promise<void>;
    deleteHabit(habitId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGoals(): Promise<Array<Goal>>;
    getHabitCompletionLog(habitId: bigint): Promise<Array<string>>;
    getHabits(): Promise<Array<HabitView>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markHabitComplete(habitId: bigint, date: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateGoal(goalId: bigint, name: string, targetDate: string): Promise<void>;
    updateHabit(habitId: bigint, name: string): Promise<void>;
}
