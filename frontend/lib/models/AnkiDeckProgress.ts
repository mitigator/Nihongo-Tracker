import mongoose, { Document, Model, Types } from "mongoose";

export interface IAnkiDeckProgress extends Document {
  user: Types.ObjectId;
  deck: Types.ObjectId;
  // Normalised to midnight UTC so one doc exists per deck per day
  date: Date;
  reviewedCount: number;
  newCardsStudied: number;
  // Rating breakdown for retention rate calculation
  againCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ankiDeckProgressSchema = new mongoose.Schema<IAnkiDeckProgress>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AnkiDeck",
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    reviewedCount: {
      type: Number,
      default: 0,
      min: [0, "reviewedCount cannot be negative"],
    },
    newCardsStudied: {
      type: Number,
      default: 0,
      min: [0, "newCardsStudied cannot be negative"],
    },
    againCount: {
      type: Number,
      default: 0,
      min: [0, "againCount cannot be negative"],
    },
    hardCount: {
      type: Number,
      default: 0,
      min: [0, "hardCount cannot be negative"],
    },
    goodCount: {
      type: Number,
      default: 0,
      min: [0, "goodCount cannot be negative"],
    },
    easyCount: {
      type: Number,
      default: 0,
      min: [0, "easyCount cannot be negative"],
    },
  },
  { timestamps: true }
);

// One progress doc per user per deck per day
ankiDeckProgressSchema.index(
  { user: 1, deck: 1, date: 1 },
  { unique: true }
);
ankiDeckProgressSchema.index({ user: 1, deck: 1, date: -1 });

// Helper to normalise any Date to midnight UTC for consistent daily bucketing
ankiDeckProgressSchema.statics.toMidnightUTC = (d: Date): Date => {
  const out = new Date(d);
  out.setUTCHours(0, 0, 0, 0);
  return out;
};

const AnkiDeckProgress: Model<IAnkiDeckProgress> =
  mongoose.models.AnkiDeckProgress ??
  mongoose.model<IAnkiDeckProgress>("AnkiDeckProgress", ankiDeckProgressSchema);

export default AnkiDeckProgress;