const DailyEntry = require("../models/DailyEntry");
const { calculateStreaks } = require("../utils/streakUtils");

// ─────────────────────────────────────────────
// @desc    Get entries for the authenticated user
//          Optional query params: startDate, endDate (YYYY-MM-DD)
// @route   GET /api/entries
// @access  Private
// ─────────────────────────────────────────────
const getEntries = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { user: req.user._id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    const entries = await DailyEntry.find(filter).sort({ date: -1 });

    // Calculate streaks from the full sorted date list
    const allDates = entries.map((e) => e.date); // already desc from sort
    const { currentStreak, longestStreak } = calculateStreaks(allDates);

    res.json({
      count: entries.length,
      currentStreak,
      longestStreak,
      entries,
    });
  } catch (error) {
    console.error("getEntries error:", error);
    res.status(500).json({ message: "Server error fetching entries" });
  }
};

// ─────────────────────────────────────────────
// @desc    Create a new daily entry (one per day per user)
// @route   POST /api/entries
// @access  Private
// ─────────────────────────────────────────────
const createEntry = async (req, res) => {
  try {
    const { date, vocabCount, listeningMinutes, grammarCount, notes } =
      req.body;

    if (!date) {
      return res.status(400).json({ message: "date is required (YYYY-MM-DD)" });
    }

    // Check for duplicate (user + date)
    const existing = await DailyEntry.findOne({ user: req.user._id, date });
    if (existing) {
      return res.status(409).json({
        message: "An entry for this date already exists. Use PUT to update it.",
        entryId: existing._id,
      });
    }

    const entry = await DailyEntry.create({
      user: req.user._id,
      date,
      vocabCount: vocabCount ?? 0,
      listeningMinutes: listeningMinutes ?? 0,
      grammarCount: grammarCount ?? 0,
      notes: notes ?? "",
    });

    res.status(201).json(entry);
  } catch (error) {
    if (error.code === 11000) {
      // Mongo duplicate key — race condition safety net
      return res.status(409).json({
        message: "An entry for this date already exists.",
      });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("createEntry error:", error);
    res.status(500).json({ message: "Server error creating entry" });
  }
};

// ─────────────────────────────────────────────
// @desc    Update an existing entry by ID
// @route   PUT /api/entries/:id
// @access  Private
// ─────────────────────────────────────────────
const updateEntry = async (req, res) => {
  try {
    const entry = await DailyEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Ensure the entry belongs to the requesting user
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { vocabCount, listeningMinutes, grammarCount, notes } = req.body;

    if (vocabCount !== undefined) entry.vocabCount = vocabCount;
    if (listeningMinutes !== undefined) entry.listeningMinutes = listeningMinutes;
    if (grammarCount !== undefined) entry.grammarCount = grammarCount;
    if (notes !== undefined) entry.notes = notes;

    // date is intentionally NOT updatable — it's the compound key
    const updated = await entry.save();

    res.json(updated);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("updateEntry error:", error);
    res.status(500).json({ message: "Server error updating entry" });
  }
};

// ─────────────────────────────────────────────
// @desc    Delete an entry by ID
// @route   DELETE /api/entries/:id
// @access  Private
// ─────────────────────────────────────────────
const deleteEntry = async (req, res) => {
  try {
    const entry = await DailyEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await entry.deleteOne();

    res.json({ message: "Entry deleted", id: req.params.id });
  } catch (error) {
    console.error("deleteEntry error:", error);
    res.status(500).json({ message: "Server error deleting entry" });
  }
};

module.exports = { getEntries, createEntry, updateEntry, deleteEntry };