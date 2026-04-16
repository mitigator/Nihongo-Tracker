import mongoose, { Document, Model, Types } from "mongoose";

export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export const JLPT_LEVELS: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];

export const DECK_COLORS = [
  "#6366f1", // indigo
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#ef4444", // red
] as const;

export type DeckColor = (typeof DECK_COLORS)[number];

export interface IAnkiDeck extends Document {
  user: Types.ObjectId;
  name: string;
  description: string;
  jlptLevel: JLPTLevel | null;
  color: DeckColor;
  dailyReviewTarget: number;
  newCardsPerDay: number;
  cardCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ankiDeckSchema = new mongoose.Schema<IAnkiDeck>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Deck name is required"],
      trim: true,
      maxlength: [100, "Deck name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    jlptLevel: {
      type: String,
      enum: {
        values: [...JLPT_LEVELS, null],
        message: "jlptLevel must be one of N5, N4, N3, N2, N1 or null",
      },
      default: null,
    },
    color: {
      type: String,
      enum: {
        values: DECK_COLORS,
        message: "Invalid deck color",
      },
      default: "#6366f1",
    },
    dailyReviewTarget: {
      type: Number,
      default: 10,
      min: [1, "Daily review target must be at least 1"],
      max: [500, "Daily review target cannot exceed 500"],
    },
    newCardsPerDay: {
      type: Number,
      default: 5,
      min: [1, "New cards per day must be at least 1"],
      max: [100, "New cards per day cannot exceed 100"],
    },
    cardCount: {
      type: Number,
      default: 0,
      min: [0, "Card count cannot be negative"],
    },
  },
  { timestamps: true }
);

// One user cannot have two decks with the same name
ankiDeckSchema.index({ user: 1, name: 1 }, { unique: true });
ankiDeckSchema.index({ user: 1, jlptLevel: 1 });

const AnkiDeck: Model<IAnkiDeck> =
  mongoose.models.AnkiDeck ??
  mongoose.model<IAnkiDeck>("AnkiDeck", ankiDeckSchema);

export default AnkiDeck;