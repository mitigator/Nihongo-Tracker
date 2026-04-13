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