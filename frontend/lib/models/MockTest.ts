import mongoose, { Document, Model, Types } from "mongoose";

export interface IMockTest extends Document {
  user: Types.ObjectId;
  date: string;
  totalScore: number;
  vocabScore: number;
  grammarScore: number;
  readingScore: number;
  listeningScore: number;
  passed: boolean;
  passThreshold: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const mockTestSchema = new mongoose.Schema<IMockTest>(
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
    totalScore: {
      type: Number,
      required: [true, "totalScore is required"],
      min: [0, "totalScore cannot be negative"],
      max: [180, "totalScore cannot exceed 180"],
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

mockTestSchema.index({ user: 1, date: -1 });

mockTestSchema.pre("save", function () {
  this.passed = this.totalScore >= this.passThreshold;
});

const MockTest: Model<IMockTest> =
  mongoose.models.MockTest ??
  mongoose.model<IMockTest>("MockTest", mockTestSchema);

export default MockTest;