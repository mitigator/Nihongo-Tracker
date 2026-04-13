export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
}

export interface ApiError {
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// ── Daily Entry ──────────────────────────────────────────────
export interface DailyEntry {
  _id: string;
  user: string;
  date: string;
  vocabCount: number;
  listeningMinutes: number;
  grammarCount: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntryFormData {
  date: string;
  vocabCount: number;
  listeningMinutes: number;
  grammarCount: number;
  notes: string;
}

export interface EntriesResponse {
  count: number;
  currentStreak: number;
  longestStreak: number;
  entries: DailyEntry[];
}

// ── Weekly Goals ─────────────────────────────────────────────
export interface GoalTargets {
  vocab: number;
  kanji: number;
  grammar: number;
  listening: number;
}

export interface GoalActuals {
  vocab: number;
  grammar: number;
  listening: number;
}

export interface GoalProgress {
  vocab: number;
  grammar: number;
  listening: number;
}

export interface WeeklyGoal {
  _id: string;
  weekStartDate: string;
  weekEndDate: string;
  targets: GoalTargets;
  actuals: GoalActuals;
  progress: GoalProgress;
  createdAt: string;
  updatedAt: string;
}

export interface GoalFormData {
  weekStartDate?: string;
  vocabTarget: number;
  kanjiTarget: number;
  grammarTarget: number;
  listeningTarget: number;
}

export interface GoalsResponse {
  count: number;
  goals: WeeklyGoal[];
}

// ── Progress Summary ─────────────────────────────────────────
export interface TodaySummary {
  logged: boolean;
  vocabCount: number;
  listeningMinutes: number;
  grammarCount: number;
  notes: string;
}

export interface WeekSummary {
  startDate: string;
  endDate: string;
  daysLogged: number;
  vocabTotal: number;
  listeningTotal: number;
  grammarTotal: number;
}

export interface StreakSummary {
  current: number;
  longest: number;
}

export interface GoalSummary {
  exists: boolean;
  targets: GoalTargets | null;
  progress: {
    vocab: number | null;
    grammar: number | null;
    listening: number | null;
  } | null;
}

export interface ProgressSummary {
  today: TodaySummary;
  week: WeekSummary;
  streak: StreakSummary;
  goal: GoalSummary;
}

// ── Chart Data ───────────────────────────────────────────────
export interface ChartDay {
  date: string;
  vocabCount: number;
  listeningMinutes: number;
  grammarCount: number;
  logged: boolean;
}

export interface ChartResponse {
  days: ChartDay[];
}