export interface User {
  _id: string;
  name: string;
  email: string;
  googleId?: string;
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

// ── OTP ──────────────────────────────────────────────────────
export interface OtpRequest {
  name: string;
  email: string;
  password: string;
}

export interface OtpVerifyPayload {
  email: string;
  otp: string;
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

// ── Mock Tests ───────────────────────────────────────────────
export interface MockTest {
  _id: string;
  user: string;
  date: string;
  totalScore: number;
  vocabScore: number;
  grammarScore: number;
  readingScore: number;
  listeningScore: number;
  passThreshold: number;
  passed: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockTestFormData {
  date: string;
  totalScore: number;
  vocabScore: number;
  grammarScore: number;
  readingScore: number;
  listeningScore: number;
  passThreshold: number;
  notes: string;
}

export interface MockTestsResponse {
  count: number;
  passed: number;
  failed: number;
  avgScore: number;
  bestScore: number;
  tests: MockTest[];
}

// ── Study Plan ───────────────────────────────────────────────
export type PlanLevel = "N5" | "N4" | "N3" | "N2" | "N1" | "custom";

export interface WeekTarget {
  week: number;
  vocabTarget: number;
  kanjiTarget: number;
  grammarTarget: number;
  listeningTarget: number;
  notes: string;
}

export interface StudyPlan {
  _id: string;
  user: string;
  title: string;
  level: PlanLevel;
  startDate: string;
  endDate: string;
  currentWeek: number | null;
  weeklyTargets: WeekTarget[];
  createdAt: string;
  updatedAt: string;
}

export interface StudyPlanFormData {
  title: string;
  level: PlanLevel;
  startDate: string;
  endDate: string;
  weeklyTargets: WeekTarget[];
}

export interface PlansResponse {
  count: number;
  plans: StudyPlan[];
}