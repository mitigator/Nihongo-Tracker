const StudyPlan = require("../models/StudyPlan");
const { getCurrentWeekStart, getWeekEnd } = require("../utils/weekUtils");

// ─────────────────────────────────────────────
// Helper — detect which week of the plan is current
// Returns week number (1-based) or null if outside plan range
// ─────────────────────────────────────────────
const detectCurrentWeek = (startDate, endDate) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  if (todayStr < startDate || todayStr > endDate) return null;

  const start = new Date(startDate + "T00:00:00Z");
  const today = new Date(todayStr + "T00:00:00Z");
  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7) + 1;
};

// ─────────────────────────────────────────────
// @desc    Get all study plans for the user
// @route   GET /api/plans
// @access  Private
// ─────────────────────────────────────────────
const getPlans = async (req, res) => {
  try {
    const plans = await StudyPlan.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    const plansWithMeta = plans.map((plan) => ({
      ...plan.toObject(),
      currentWeek: detectCurrentWeek(plan.startDate, plan.endDate),
    }));

    res.json({ count: plans.length, plans: plansWithMeta });
  } catch (error) {
    console.error("getPlans error:", error);
    res.status(500).json({ message: "Server error fetching plans" });
  }
};

// ─────────────────────────────────────────────
// @desc    Get a single plan by ID
// @route   GET /api/plans/:id
// @access  Private
// ─────────────────────────────────────────────
const getPlanById = async (req, res) => {
  try {
    const plan = await StudyPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({
      ...plan.toObject(),
      currentWeek: detectCurrentWeek(plan.startDate, plan.endDate),
    });
  } catch (error) {
    console.error("getPlanById error:", error);
    res.status(500).json({ message: "Server error fetching plan" });
  }
};

// ─────────────────────────────────────────────
// @desc    Create a new study plan
// @route   POST /api/plans
// @access  Private
// ─────────────────────────────────────────────
const createPlan = async (req, res) => {
  try {
    const { title, level, startDate, endDate, weeklyTargets } = req.body;

    if (!title || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "title, startDate and endDate are required" });
    }

    const plan = await StudyPlan.create({
      user: req.user._id,
      title,
      level: level ?? "custom",
      startDate,
      endDate,
      weeklyTargets: weeklyTargets ?? [],
    });

    res.status(201).json({
      ...plan.toObject(),
      currentWeek: detectCurrentWeek(plan.startDate, plan.endDate),
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.message.includes("endDate")) {
      const message =
        error.message.includes("endDate")
          ? error.message
          : Object.values(error.errors)
              .map((e) => e.message)
              .join(", ");
      return res.status(400).json({ message });
    }
    console.error("createPlan error:", error);
    res.status(500).json({ message: "Server error creating plan" });
  }
};

// ─────────────────────────────────────────────
// @desc    Update a plan (title, dates, weeklyTargets)
// @route   PUT /api/plans/:id
// @access  Private
// ─────────────────────────────────────────────
const updatePlan = async (req, res) => {
  try {
    const plan = await StudyPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, level, startDate, endDate, weeklyTargets } = req.body;

    if (title !== undefined) plan.title = title;
    if (level !== undefined) plan.level = level;
    if (startDate !== undefined) plan.startDate = startDate;
    if (endDate !== undefined) plan.endDate = endDate;
    if (weeklyTargets !== undefined) plan.weeklyTargets = weeklyTargets;

    const updated = await plan.save();

    res.json({
      ...updated.toObject(),
      currentWeek: detectCurrentWeek(updated.startDate, updated.endDate),
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.message.includes("endDate")) {
      const message = error.message.includes("endDate")
        ? error.message
        : Object.values(error.errors)
            .map((e) => e.message)
            .join(", ");
      return res.status(400).json({ message });
    }
    console.error("updatePlan error:", error);
    res.status(500).json({ message: "Server error updating plan" });
  }
};

// ─────────────────────────────────────────────
// @desc    Delete a plan
// @route   DELETE /api/plans/:id
// @access  Private
// ─────────────────────────────────────────────
const deletePlan = async (req, res) => {
  try {
    const plan = await StudyPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await plan.deleteOne();

    res.json({ message: "Plan deleted", id: req.params.id });
  } catch (error) {
    console.error("deletePlan error:", error);
    res.status(500).json({ message: "Server error deleting plan" });
  }
};

module.exports = { getPlans, getPlanById, createPlan, updatePlan, deletePlan };