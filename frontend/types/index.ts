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
  date: string; // YYYY-MM-DD
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
  vocab: number;     // 0–100 %
  grammar: number;
  listening: number;
}

export interface WeeklyGoal {
  _id: string;
  weekStartDate: string; // YYYY-MM-DD (always Monday)
  weekEndDate: string;   // YYYY-MM-DD (always Sunday)
  targets: GoalTargets;
  actuals: GoalActuals;
  progress: GoalProgress;
  createdAt: string;
  updatedAt: string;
}

export interface GoalFormData {
  weekStartDate?: string; // omit to default to current week
  vocabTarget: number;
  kanjiTarget: number;
  grammarTarget: number;
  listeningTarget: number;
}

export interface GoalsResponse {
  count: number;
  goals: WeeklyGoal[];
}