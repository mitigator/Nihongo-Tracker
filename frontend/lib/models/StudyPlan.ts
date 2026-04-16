import mongoose, { Document, Model, Types } from "mongoose";

export interface IWeekTarget {
  week: number;
  vocabTarget: number;
  kanjiTarget: number;
  grammarTarget: number;
  listeningTarget: number;
  notes: string;
}

export interface IStudyPlan extends Document {
  user: Types.ObjectId;
  title: string;
  level: "N5" | "N4" | "N3" | "N2" | "N1" | "custom";
  startDate: string;
  endDate: string;
  weeklyTargets: IWeekTarget[];
  createdAt: Date;
  updatedAt: Date;
}

const weekTargetSchema = new mongoose.Schema<IWeekTarget>(
  {
    week: { type: Number, required: true, min: 1 },
    vocabTarget: { type: Number, default: 0, min: 0 },
    kanjiTarget: { type: Number, default: 0, min: 0 },
    grammarTarget: { type: Number, default: 0, min: 0 },
    listeningTarget: { type: Number, default: 0, min: 0 },
    notes: { type: String, trim: true, maxlength: 500, default: "" },
  },
  { _id: false }
);

const studyPlanSchema = new mongoose.Schema<IStudyPlan>(
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
    weeklyTargets: {
      type: [weekTargetSchema],
      default: [],
    },
  },
  { timestamps: true }
);

studyPlanSchema.index({ user: 1, createdAt: -1 });

studyPlanSchema.pre("save", function () {
  if (this.startDate >= this.endDate) {
    throw new Error("endDate must be after startDate");
  }
});

const StudyPlan: Model<IStudyPlan> =
  mongoose.models.StudyPlan ??
  mongoose.model<IStudyPlan>("StudyPlan", studyPlanSchema);

export default StudyPlan;