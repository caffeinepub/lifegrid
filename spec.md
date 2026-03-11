# LifeGrid – Time Progress Web App

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Year Progress view: 365-dot grid, filled dots for completed days, percentage + "Day X / 365" label
- Life Calendar view: ~4160-week grid, user enters date of birth, weeks lived filled, life progress %
- Goal Countdown view: user creates goals with name + target date, displays days remaining + progress bar
- Habit Tracker view: user creates habits, marks daily completion, tracks streaks
- Theme system: Minimal, Dark, Neon, Space, Matrix, Gradient, Motivational
- Wallpaper export: render current view to PNG and download
- Share flow: copy image / open share sheet
- Premium upgrade screen (UI only, no real billing)
- Persistent storage: goals, habits, DOB, theme preference stored in backend

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: store user profile (DOB), goals (name + target date), habits (name + daily logs), theme preference
2. Backend: expose CRUD for goals and habits, get/set profile, get/set theme
3. Frontend: 5-tab navigation (Year, Life, Goals, Habits, Themes)
4. Frontend: YearProgress page – compute day of year, render SVG/canvas dot grid, export PNG
5. Frontend: LifeCalendar page – DOB input, compute weeks lived, render grid, export PNG
6. Frontend: GoalCountdown page – create/list goals, render countdown card, export PNG
7. Frontend: HabitTracker page – create habits, mark today done, show streak, export PNG
8. Frontend: Themes page – grid of theme cards, apply theme globally
9. Frontend: wallpaper export utility (html2canvas or SVG serialization)
10. Frontend: Premium screen with feature list and upgrade CTA
