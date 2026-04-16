import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import DailyEntry from "@/lib/models/DailyEntry";
import WeeklyGoal from "@/lib/models/WeeklyGoal";
import { getCurrentWeekStart, getWeekEnd } from "@/lib/utils/weekUtils";
import { calculateStreaks } from "@/lib/utils/streakUtils";
import { IUser } from "@/lib/models/User";

// ─────────────────────────────────────────────
// @desc    Dashboard summary — today, this week, streak, goal progress
// @route   GET /api/progress/summary
// ─────────────────────────────────────────────
export async function getSummary(
  _req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const userId = user._id;
  const todayStr = new Date().toISOString().slice(0, 10);
  const weekStartDate = getCurrentWeekStart();
  const weekEndDate = getWeekEnd(weekStartDate);

  // ── 1. Today's entry ──────────────────────
  const todayEntry = await DailyEntry.findOne({ user: userId, date: todayStr });

  const today = {
    logged: !!todayEntry,
    vocabCount: todayEntry?.vocabCount ?? 0,
    listeningMinutes: todayEntry?.listeningMinutes ?? 0,
    grammarCount: todayEntry?.grammarCount ?? 0,
    notes: todayEntry?.notes ?? "",
  };

  // ── 2. This week's totals ─────────────────
  const [weekResult] = await DailyEntry.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: weekStartDate, $lte: weekEndDate },
      },
    },
    {
      $group: {
        _id: null,
        vocabTotal: { $sum: "$vocabCount" },
        listeningTotal: { $sum: "$listeningMinutes" },
        grammarTotal: { $sum: "$grammarCount" },
        daysLogged: { $sum: 1 },
      },
    },
  ]);

  const week = {
    startDate: weekStartDate,
    endDate: weekEndDate,
    daysLogged: weekResult?.daysLogged ?? 0,
    vocabTotal: weekResult?.vocabTotal ?? 0,
    listeningTotal: weekResult?.listeningTotal ?? 0,
    grammarTotal: weekResult?.grammarTotal ?? 0,
  };

  // ── 3. Streak ─────────────────────────────
  const allEntries = await DailyEntry.find({ user: userId })
    .sort({ date: -1 })
    .select("date");

  const { currentStreak, longestStreak } = calculateStreaks(
    allEntries.map((e) => e.date)
  );

  // ── 4. Weekly goal + % progress ───────────
  const goal = await WeeklyGoal.findOne({ user: userId, weekStartDate });

  const pct = (actual: number, target: number) =>
    target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : null;

  const goalSummary = goal
    ? {
        exists: true,
        targets: {
          vocab: goal.vocabTarget,
          kanji: goal.kanjiTarget,
          grammar: goal.grammarTarget,
          listening: goal.listeningTarget,
        },
        progress: {
          vocab: pct(week.vocabTotal, goal.vocabTarget),
          grammar: pct(week.grammarTotal, goal.grammarTarget),
          listening: pct(week.listeningTotal, goal.listeningTarget),
        },
      }
    : { exists: false, targets: null, progress: null };

  return NextResponse.json({
    today,
    week,
    streak: { current: currentStreak, longest: longestStreak },
    goal: goalSummary,
  });
}

// ─────────────────────────────────────────────
// @desc    Weekly bar chart — last 7 days
// @route   GET /api/progress/weekly
// ─────────────────────────────────────────────
export async function getWeeklyChart(
  _req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const entries = await DailyEntry.find({
    user: user._id,
    date: { $gte: days[0], $lte: days[6] },
  }).select("date vocabCount listeningMinutes grammarCount");

  const entryMap = new Map(entries.map((e) => [e.date, e]));

  const data = days.map((date) => {
    const entry = entryMap.get(date);
    return {
      date,
      vocabCount: entry?.vocabCount ?? 0,
      listeningMinutes: entry?.listeningMinutes ?? 0,
      grammarCount: entry?.grammarCount ?? 0,
      logged: !!entry,
    };
  });

  return NextResponse.json({ days: data });
}

// ─────────────────────────────────────────────
// @desc    Monthly trend — last 30 days
// @route   GET /api/progress/monthly
// ─────────────────────────────────────────────
export async function getMonthlyChart(
  _req: NextRequest,
  user: IUser
): Promise<NextResponse> {
  await connectDB();

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  const entries = await DailyEntry.find({
    user: user._id,
    date: { $gte: days[0], $lte: days[29] },
  }).select("date vocabCount listeningMinutes grammarCount");

  const entryMap = new Map(entries.map((e) => [e.date, e]));

  const data = days.map((date) => {
    const entry = entryMap.get(date);
    return {
      date,
      vocabCount: entry?.vocabCount ?? 0,
      listeningMinutes: entry?.listeningMinutes ?? 0,
      grammarCount: entry?.grammarCount ?? 0,
      logged: !!entry,
    };
  });

  return NextResponse.json({ days: data });
}