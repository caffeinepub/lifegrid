/**
 * Returns the current day of year (1-indexed).
 */
export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Returns total days in the given year.
 */
export function getDaysInYear(year: number = new Date().getFullYear()): number {
  return isLeapYear(year) ? 366 : 365;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns weeks lived from DOB to today.
 */
export function getWeeksLived(dob: Date, today: Date = new Date()): number {
  const ms = today.getTime() - dob.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24 * 7));
}

/**
 * Returns days remaining from today to targetDate string (YYYY-MM-DD).
 */
export function getDaysRemaining(targetDate: string): number {
  const target = new Date(`${targetDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ms = target.getTime() - today.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

/**
 * Returns progress (0-1) for a goal.
 * createdTimestamp is nanoseconds since epoch (bigint).
 */
export function getGoalProgress(
  createdTimestamp: bigint,
  targetDate: string,
): number {
  const created = new Date(Number(createdTimestamp) / 1_000_000);
  const target = new Date(`${targetDate}T00:00:00`);
  const today = new Date();
  const total = target.getTime() - created.getTime();
  const elapsed = today.getTime() - created.getTime();
  if (total <= 0) return 1;
  return Math.min(1, Math.max(0, elapsed / total));
}

/**
 * Formats a Date to YYYY-MM-DD.
 */
export function formatDateStr(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Calculates current streak (consecutive days ending today or yesterday).
 * logs: array of YYYY-MM-DD strings.
 */
export function calculateStreak(logs: string[]): number {
  if (logs.length === 0) return 0;
  const logSet = new Set(logs);
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cursor = new Date(today);
  // Allow streak if yesterday was completed but not today
  if (!logSet.has(formatDateStr(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (logSet.has(formatDateStr(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * Returns array of last N days as YYYY-MM-DD strings (oldest first).
 */
export function getLastNDays(n: number): string[] {
  const days: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(formatDateStr(d));
  }
  return days;
}

/**
 * Format a timestamp (nanoseconds bigint) to a readable date.
 */
export function formatTimestamp(ns: bigint): string {
  const date = new Date(Number(ns) / 1_000_000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
