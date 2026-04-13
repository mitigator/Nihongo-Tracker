const MockTest = require("../models/MockTest");

// ─────────────────────────────────────────────
// @desc    Get all mock tests for the user
//          Sorted by date desc — most recent first
// @route   GET /api/tests
// @access  Private
// ─────────────────────────────────────────────
const getTests = async (req, res) => {
  try {
    const tests = await MockTest.find({ user: req.user._id }).sort({
      date: -1,
    });

    // Summary stats across all tests
    const total = tests.length;
    const passed = tests.filter((t) => t.passed).length;
    const avgTotal =
      total > 0
        ? Math.round(tests.reduce((s, t) => s + t.totalScore, 0) / total)
        : 0;
    const best =
      total > 0 ? Math.max(...tests.map((t) => t.totalScore)) : 0;

    res.json({
      count: total,
      passed,
      failed: total - passed,
      avgScore: avgTotal,
      bestScore: best,
      tests,
    });
  } catch (error) {
    console.error("getTests error:", error);
    res.status(500).json({ message: "Server error fetching tests" });
  }
};

// ─────────────────────────────────────────────
// @desc    Create a new mock test result
// @route   POST /api/tests
// @access  Private
// ─────────────────────────────────────────────
const createTest = async (req, res) => {
  try {
    const {
      date,
      totalScore,
      vocabScore,
      grammarScore,
      readingScore,
      listeningScore,
      passThreshold,
      notes,
    } = req.body;

    if (!date) {
      return res.status(400).json({ message: "date is required (YYYY-MM-DD)" });
    }
    if (totalScore === undefined || totalScore === null) {
      return res.status(400).json({ message: "totalScore is required" });
    }

    const test = await MockTest.create({
      user: req.user._id,
      date,
      totalScore,
      vocabScore: vocabScore ?? 0,
      grammarScore: grammarScore ?? 0,
      readingScore: readingScore ?? 0,
      listeningScore: listeningScore ?? 0,
      passThreshold: passThreshold ?? 80,
      notes: notes ?? "",
    });

    res.status(201).json(test);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("createTest error:", error);
    res.status(500).json({ message: "Server error creating test" });
  }
};

// ─────────────────────────────────────────────
// @desc    Delete a mock test by ID
// @route   DELETE /api/tests/:id
// @access  Private
// ─────────────────────────────────────────────
const deleteTest = async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    if (test.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await test.deleteOne();

    res.json({ message: "Test deleted", id: req.params.id });
  } catch (error) {
    console.error("deleteTest error:", error);
    res.status(500).json({ message: "Server error deleting test" });
  }
};

module.exports = { getTests, createTest, deleteTest };