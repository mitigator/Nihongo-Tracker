import mongoose, { Document, Model, Types } from "mongoose";
import { JLPTLevel, JLPT_LEVELS } from "./AnkiDeck";

export type CardType = "vocab" | "kanji" | "custom";

export const CARD_TYPES: CardType[] = ["vocab", "kanji", "custom"];

export type SRSRating = "again" | "hard" | "good" | "easy";

export interface IAnkiCard extends Document {
  user: Types.ObjectId;
  deck: Types.ObjectId;
  front: string;
  back: string;
  type: CardType;
  jlptLevel: JLPTLevel | null;
  // When true the user manually assigned this card to a deck —
  // the auto-assign logic will never move it again
  manuallyAssigned: boolean;
  // Optionally links back to the DailyEntry that generated this card
  sourceEntry: Types.ObjectId | null;
  // SM-2 spaced repetition fields
  interval: number;       // days until next review
  easeFactor: number;     // default 2.5, range 1.3–5.0
  dueDate: Date;
  repetitions: number;    // number of successful reviews in a row
  createdAt: Date;
  updatedAt: Date;
}

const ankiCardSchema = new mongoose.Schema<IAnkiCard>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AnkiDeck",
      required: [true, "Deck is required"],
    },
    front: {
      type: String,
      required: [true, "Front of card is required"],
      trim: true,
      maxlength: [500, "Front cannot exceed 500 characters"],
    },
    back: {
      type: String,
      required: [true, "Back of card is required"],
      trim: true,
      maxlength: [1000, "Back cannot exceed 1000 characters"],
    },
    type: {
      type: String,
      enum: {
        values: CARD_TYPES,
        message: "type must be one of vocab, kanji, custom",
      },
      required: [true, "Card type is required"],
    },
    jlptLevel: {
      type: String,
      enum: {
        values: [...JLPT_LEVELS, null],
        message: "jlptLevel must be one of N5, N4, N3, N2, N1 or null",
      },
      default: null,
    },
    manuallyAssigned: {
      type: Boolean,
      default: false,
    },
    sourceEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DailyEntry",
      default: null,
    },
    // SM-2 defaults — card starts as "new"
    interval: {
      type: Number,
      default: 0,
      min: [0, "interval cannot be negative"],
    },
    easeFactor: {
      type: Number,
      default: 2.5,
      min: [1.3, "easeFactor cannot drop below 1.3"],
    },
    dueDate: {
      type: Date,
      default: () => new Date(), // due immediately when created
    },
    repetitions: {
      type: Number,
      default: 0,
      min: [0, "repetitions cannot be negative"],
    },
  },
  { timestamps: true }
);

ankiCardSchema.index({ user: 1, deck: 1 });
ankiCardSchema.index({ user: 1, deck: 1, dueDate: 1 }); // for fetching due cards
ankiCardSchema.index({ user: 1, jlptLevel: 1 });
ankiCardSchema.index({ user: 1, type: 1 });

const AnkiCard: Model<IAnkiCard> =
  mongoose.models.AnkiCard ??
  mongoose.model<IAnkiCard>("AnkiCard", ankiCardSchema);

export default AnkiCard;