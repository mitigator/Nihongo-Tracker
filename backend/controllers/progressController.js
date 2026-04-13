const DailyEntry = require("../models/DailyEntry");
const WeeklyGoal = require("../models/WeeklyGoal");
const { getCurrentWeekStart, getWeekEnd } = require("../utils/weekUtils");
const { calculateStreaks } = require("../utils/streakUtils");

// ─────────────────────────────────────────────
// @desc    Single endpoint powering the dashboard home screen
//          Returns today, this week, streak, and % vs goal per category
// @route   GET /api/progress/summary
// @access  Private
// ─────────────────────────────────────────────
const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;
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

    // ── 2. This week's totals (aggregation) ───
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

    const pct = (actual, target) =>
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

    // ── 5. Assemble response ──────────────────
    res.json({
      today,
      week,
      streak: { current: currentStreak, longest: longestStreak },
      goal: goalSummary,
    });
  } catch (error) {
    console.error("getSummary error:", error);
    res.status(500).json({ message: "Server error fetching progress summary" });
  }
};

// ─────────────────────────────────────────────
// @desc    Weekly bar chart data — last 7 days grouped by date
// @route   GET /api/progress/weekly
// @access  Private
// ─────────────────────────────────────────────
const getWeeklyChart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Build last 7 days date strings
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });

    const entries = await DailyEntry.find({
      user: userId,
      date: { $gte: days[0], $lte: days[6] },
    }).select("date vocabCount listeningMinutes grammarCount");

    // Map entries by date for O(1) lookup
    const entryMap = new Map(entries.map((e) => [e.date, e]));

    // Fill all 7 days — zero if no entry
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

    res.json({ days: data });
  } catch (error) {
    console.error("getWeeklyChart error:", error);
    res.status(500).json({ message: "Server error fetching weekly chart data" });
  }
};

// ─────────────────────────────────────────────
// @desc    Monthly trend data — 30 days grouped by date
// @route   GET /api/progress/monthly
// @access  Private
// ─────────────────────────────────────────────
const getMonthlyChart = async (req, res) => {
  try {
    const userId = req.user._id;

    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - (29 - i));
      return d.toISOString().slice(0, 10);
    });

    const entries = await DailyEntry.find({
      user: userId,
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

    res.json({ days: data });
  } catch (error) {
    console.error("getMonthlyChart error:", error);
    res.status(500).json({ message: "Server error fetching monthly chart data" });
  }
};

module.exports = { getSummary, getWeeklyChart, getMonthlyChart };