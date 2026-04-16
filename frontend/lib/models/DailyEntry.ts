import mongoose, { Document, Model, Types } from "mongoose";

export interface IDailyEntry extends Document {
  user: Types.ObjectId;
  date: string;
  vocabCount: number;
  listeningMinutes: number;
  grammarCount: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const dailyEntrySchema = new mongoose.Schema<IDailyEntry>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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

dailyEntrySchema.index({ user: 1, date: 1 }, { unique: true });
dailyEntrySchema.index({ user: 1, date: -1 });

const DailyEntry: Model<IDailyEntry> =
  mongoose.models.DailyEntry ??
  mongoose.model<IDailyEntry>("DailyEntry", dailyEntrySchema);

export default DailyEntry;