const mongoose = require("mongoose");

const weeklyGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // ISO week start date (Monday) as YYYY-MM-DD — the unique key per user per week
    weekStartDate: {
      type: String,
      required: [true, "weekStartDate is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "weekStartDate must be YYYY-MM-DD"],
    },
    // Weekly targets
    vocabTarget: {
      type: Number,
      default: 0,
      min: [0, "vocabTarget cannot be negative"],
    },
    kanjiTarget: {
      type: Number,
      default: 0,
      min: [0, "kanjiTarget cannot be negative"],
    },
    grammarTarget: {
      type: Number,
      default: 0,
      min: [0, "grammarTarget cannot be negative"],
    },
    listeningTarget: {
      type: Number,
      default: 0,
      min: [0, "listeningTarget cannot be negative"],
    },
  },
  { timestamps: true }
);

// One goal set per user per week
weeklyGoalSchema.index({ user: 1, weekStartDate: 1 }, { unique: true });

// Fast lookup for current week
weeklyGoalSchema.index({ user: 1, weekStartDate: -1 });

module.exports = mongoose.model("WeeklyGoal", weeklyGoalSchema);