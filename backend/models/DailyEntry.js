const mongoose = require("mongoose");

const dailyEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Compound date key — store as YYYY-MM-DD string for easy querying
    date: {
      type: String,
      required: [true, "Date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
    },
    vocabCount: {
      type: Number,
      default: 0,
      min: [0, "vocabCount cannot be negative"],
    },
    listeningMinutes: {
      type: Number,
      default: 0,
      min: [0, "listeningMinutes cannot be negative"],
    },
    grammarCount: {
      type: Number,
      default: 0,
      min: [0, "grammarCount cannot be negative"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
      default: "",
    },
  },
  { timestamps: true }
);

// One entry per user per day
dailyEntrySchema.index({ user: 1, date: 1 }, { unique: true });

// Fast range queries (dashboard, analytics)
dailyEntrySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("DailyEntry", dailyEntrySchema);