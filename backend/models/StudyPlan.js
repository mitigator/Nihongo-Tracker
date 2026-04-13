const mongoose = require("mongoose");

// Weekly targets embedded inside a plan
const weekTargetSchema = new mongoose.Schema(
  {
    week: {
      type: Number,
      required: true,
      min: 1,
    },
    vocabTarget: { type: Number, default: 0, min: 0 },
    kanjiTarget: { type: Number, default: 0, min: 0 },
    grammarTarget: { type: Number, default: 0, min: 0 },
    listeningTarget: { type: Number, default: 0, min: 0 },
    notes: { type: String, trim: true, maxlength: 500, default: "" },
  },
  { _id: false }
);

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
      maxlength: [100, "title cannot exceed 100 characters"],
    },
    // N5 | N4 | N3 | N2 | N1 | custom
    level: {
      type: String,
      enum: {
        values: ["N5", "N4", "N3", "N2", "N1", "custom"],
        message: "level must be one of N5, N4, N3, N2, N1, custom",
      },
      default: "custom",
    },
    startDate: {
      type: String,
      required: [true, "startDate is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "startDate must be YYYY-MM-DD"],
    },
    endDate: {
      type: String,
      required: [true, "endDate is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "endDate must be YYYY-MM-DD"],
    },
    // Array of per-week targets — 1 object per week of the plan
    weeklyTargets: {
      type: [weekTargetSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Fast lookup by user
studyPlanSchema.index({ user: 1, createdAt: -1 });

// Validate endDate > startDate
studyPlanSchema.pre("save", function () {
  if (this.startDate >= this.endDate) {
    throw new Error("endDate must be after startDate");
  }
});

module.exports = mongoose.model("StudyPlan", studyPlanSchema);