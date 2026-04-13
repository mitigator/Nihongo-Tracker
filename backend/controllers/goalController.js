const WeeklyGoal = require("../models/WeeklyGoal");
const DailyEntry = require("../models/DailyEntry");
const { getCurrentWeekStart, getWeekStart, getWeekEnd } = require("../utils/weekUtils");

// ─────────────────────────────────────────────
// Helper — aggregate DailyEntry totals for a given week
// ─────────────────────────────────────────────
const getWeekActuals = async (userId, weekStartDate) => {
  const weekEndDate = getWeekEnd(weekStartDate);

  const [result] = await DailyEntry.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: weekStartDate, $lte: weekEndDate },
      },
    },
    {
      $group: {
        _id: null,
        vocabActual: { $sum: "$vocabCount" },
        listeningActual: { $sum: "$listeningMinutes" },
        grammarActual: { $sum: "$grammarCount" },
      },
    },
  ]);

  return {
    vocabActual: result?.vocabActual ?? 0,
    listeningActual: result?.listeningActual ?? 0,
    grammarActual: result?.grammarActual ?? 0,
  };
};

// ─────────────────────────────────────────────
// @desc    Get all weekly goals for the user
//          Returns goals with actuals + % progress for each
// @route   GET /api/goals
// @access  Private
// ─────────────────────────────────────────────
const getGoals = async (req, res) => {
  try {
    const goals = await WeeklyGoal.find({ user: req.user._id }).sort({
      weekStartDate: -1,
    });

    // Attach actuals to each goal
    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {
        const actuals = await getWeekActuals(req.user._id, goal.weekStartDate);
        return buildGoalResponse(goal, actuals);
      })
    );

    res.json({ count: goals.length, goals: goalsWithProgress });
  } catch (error) {
    console.error("getGoals error:", error);
    res.status(500).json({ message: "Server error fetching goals" });
  }
};

// ─────────────────────────────────────────────
// @desc    Get current week's goal + live progress
// @route   GET /api/goals/current
// @access  Private
// ─────────────────────────────────────────────
const getCurrentGoal = async (req, res) => {
  try {
    const weekStartDate = getCurrentWeekStart();

    const goal = await WeeklyGoal.findOne({
      user: req.user._id,
      weekStartDate,
    });

    if (!goal) {
      return res.status(404).json({
        message: "No goal set for the current week.",
        weekStartDate,
      });
    }

    const actuals = await getWeekActuals(req.user._id, weekStartDate);

    res.json(buildGoalResponse(goal, actuals));
  } catch (error) {
    console.error("getCurrentGoal error:", error);
    res.status(500).json({ message: "Server error fetching current goal" });
  }
};

// ─────────────────────────────────────────────
// @desc    Create or update a weekly goal (upsert by weekStartDate)
// @route   POST /api/goals
// @access  Private
// ─────────────────────────────────────────────
const upsertGoal = async (req, res) => {
  try {
    const {
      weekStartDate: rawDate,
      vocabTarget,
      kanjiTarget,
      grammarTarget,
      listeningTarget,
    } = req.body;

    // Default to current week if no date provided
    const weekStartDate = rawDate
      ? getWeekStart(rawDate) // normalise to Monday regardless of what day is sent
      : getCurrentWeekStart();

    const goal = await WeeklyGoal.findOneAndUpdate(
      { user: req.user._id, weekStartDate },
      {
        $set: {
          vocabTarget: vocabTarget ?? 0,
          kanjiTarget: kanjiTarget ?? 0,
          grammarTarget: grammarTarget ?? 0,
          listeningTarget: listeningTarget ?? 0,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    const actuals = await getWeekActuals(req.user._id, weekStartDate);

    res.status(201).json(buildGoalResponse(goal, actuals));
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("upsertGoal error:", error);
    res.status(500).json({ message: "Server error saving goal" });
  }
};

// ─────────────────────────────────────────────
// @desc    Delete a weekly goal by ID
// @route   DELETE /api/goals/:id
// @access  Private
// ─────────────────────────────────────────────
const deleteGoal = async (req, res) => {
  try {
    const goal = await WeeklyGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await goal.deleteOne();

    res.json({ message: "Goal deleted", id: req.params.id });
  } catch (error) {
    console.error("deleteGoal error:", error);
    res.status(500).json({ message: "Server error deleting goal" });
  }
};

// ─────────────────────────────────────────────
// Helper — build consistent response shape with % progress
// ─────────────────────────────────────────────
const buildGoalResponse = (goal, actuals) => {
  const pct = (actual, target) =>
    target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;

  return {
    _id: goal._id,
    weekStartDate: goal.weekStartDate,
    weekEndDate: getWeekEnd(goal.weekStartDate),
    targets: {
      vocab: goal.vocabTarget,
      kanji: goal.kanjiTarget,
      grammar: goal.grammarTarget,
      listening: goal.listeningTarget,
    },
    actuals: {
      vocab: actuals.vocabActual,
      grammar: actuals.grammarActual,
      listening: actuals.listeningActual,
    },
    progress: {
      vocab: pct(actuals.vocabActual, goal.vocabTarget),
      grammar: pct(actuals.grammarActual, goal.grammarTarget),
      listening: pct(actuals.listeningActual, goal.listeningTarget),
    },
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
  };
};

module.exports = { getGoals, getCurrentGoal, upsertGoal, deleteGoal };