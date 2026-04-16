import mongoose, { Document, Model, Types } from "mongoose";

export interface IWeeklyGoal extends Document {
  user: Types.ObjectId;
  weekStartDate: string;
  vocabTarget: number;
  kanjiTarget: number;
  grammarTarget: number;
  listeningTarget: number;
  createdAt: Date;
  updatedAt: Date;
}

const weeklyGoalSchema = new mongoose.Schema<IWeeklyGoal>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weekStartDate: {
      type: String,
      required: [true, "weekStartDate is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "weekStartDate must be YYYY-MM-DD"],
    },
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

weeklyGoalSchema.index({ user: 1, weekStartDate: 1 }, { unique: true });
weeklyGoalSchema.index({ user: 1, weekStartDate: -1 });

const WeeklyGoal: Model<IWeeklyGoal> =
  mongoose.models.WeeklyGoal ??
  mongoose.model<IWeeklyGoal>("WeeklyGoal", weeklyGoalSchema);

export default WeeklyGoal;