const mongoose = require("mongoose");

const mockTestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: [true, "date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"],
    },
    // Scores — all out of 100 unless noted
    totalScore: {
      type: Number,
      required: [true, "totalScore is required"],
      min: [0, "totalScore cannot be negative"],
      max: [180, "totalScore cannot exceed 180"], // JLPT total is 180
    },
    vocabScore: {
      type: Number,
      default: 0,
      min: [0, "vocabScore cannot be negative"],
      max: [60, "vocabScore cannot exceed 60"],
    },
    grammarScore: {
      type: Number,
      default: 0,
      min: [0, "grammarScore cannot be negative"],
      max: [60, "grammarScore cannot exceed 60"],
    },
    readingScore: {
      type: Number,
      default: 0,
      min: [0, "readingScore cannot be negative"],
      max: [60, "readingScore cannot exceed 60"],
    },
    listeningScore: {
      type: Number,
      default: 0,
      min: [0, "listeningScore cannot be negative"],
      max: [60, "listeningScore cannot exceed 60"],
    },
    // Pass threshold — default JLPT N5 pass is 80/180
    passed: {
      type: Boolean,
      default: false,
    },
    passThreshold: {
      type: Number,
      default: 80,
      min: [0, "passThreshold cannot be negative"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "notes cannot exceed 1000 characters"],
      default: "",
    },
  },
  { timestamps: true }
);

// Fast lookup by user + date desc
mockTestSchema.index({ user: 1, date: -1 });

// Auto-compute passed before save
mockTestSchema.pre("save", function () {
  this.passed = this.totalScore >= this.passThreshold;
});

module.exports = mongoose.model("MockTest", mockTestSchema);